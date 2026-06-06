import setuptools  # Fix for python 3.12 distutils removal when loading TF
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os

from PIL import Image
from io import BytesIO
from typing import List, Optional
import re
import torch
import torch.nn as nn
from torchvision.models import mobilenet_v2
import torchvision.transforms as transforms
from PIL import Image

# Import our custom modules
from app.services.symptom_knowledge_base import DISEASE_DATABASE, TRIAGE_DESCRIPTIONS, SEVERITY_ORDER
from app.services.treatment_protocols import get_treatment_plan
from app.services.drug_interaction_db import check_interactions, DRUG_CLASSES
from app.services.lifestyle_planner_db import generate_lifestyle_plan
from app.services.diabetes_risk_model import calculate_diabetes_risk

# ─── TF-IDF imports ──────────────────────────────────────────────────
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="HealthCare AI API")

# Allow CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ═══════════════════════════════════════════════════════════════════════
# MODEL LOADING
# ═══════════════════════════════════════════════════════════════════════

# Load the Heart Disease PyTorch model globally
class BigNN(nn.Module):
    def __init__(self, input_size):
        super(BigNN, self).__init__()
        self.network = nn.Sequential(
            nn.Linear(input_size, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, 128),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 64),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
            nn.Sigmoid()
        )
    def forward(self, x):
        return self.network(x)

model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'heart_disease_nn.pth')
scaler_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'heart_disease_scaler.pkl')

heart_model = None
heart_scaler = None
feature_names = None

try:
    if os.path.exists(scaler_path) and os.path.exists(model_path):
        with open(scaler_path, 'rb') as f:
            data = pickle.load(f)
            heart_scaler = data['scaler']
            feature_names = data['features']
            
        heart_model = BigNN(len(feature_names))
        heart_model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu'), weights_only=True))
        heart_model.eval()
        print("[INFO] Heart Disease PyTorch BigNN loaded successfully.")
except Exception as e:
    print(f"[ERROR] Could not load Heart Disease PyTorch Model: {e}")

# Load the Pneumonia CNN PyTorch model globally
pneumonia_model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'pneumonia_cnn.pth')
pneumonia_model = None

try:
    if os.path.exists(pneumonia_model_path):
        pneumonia_model = mobilenet_v2()
        pneumonia_model.classifier = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(pneumonia_model.last_channel, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )
        pneumonia_model.load_state_dict(torch.load(pneumonia_model_path, map_location=torch.device('cpu'), weights_only=True))
        pneumonia_model.eval()
        print("[INFO] Pneumonia CNN PyTorch Model loaded successfully.")
except Exception as e:
    print(f"[ERROR] Could not load Pneumonia CNN PyTorch Model: {e}")

# ═══════════════════════════════════════════════════════════════════════
# NLP SYMPTOM CHECKER — TF-IDF Engine Setup
# ═══════════════════════════════════════════════════════════════════════

# Build a corpus where each document is the space-joined symptoms of one disease
symptom_corpus = []
for disease in DISEASE_DATABASE:
    symptom_corpus.append(" ".join(disease["symptoms"]))

# Fit the TF-IDF vectorizer on the disease symptom corpus
tfidf_vectorizer = TfidfVectorizer(stop_words="english")
disease_tfidf_matrix = tfidf_vectorizer.fit_transform(symptom_corpus)
print("[INFO] Symptom Checker TF-IDF engine initialized.")

# ═══════════════════════════════════════════════════════════════════════
# CLINICAL CHATBOT — TF-IDF Engine Setup
# ═══════════════════════════════════════════════════════════════════════

from app.services.treatment_protocols import TREATMENT_DATABASE

# Build chatbot knowledge corpus combining disease + treatment knowledge
chatbot_corpus = []
chatbot_metadata = []

for disease in DISEASE_DATABASE:
    doc = f"{disease['name']} {' '.join(disease['symptoms'])} {disease['description']}"
    chatbot_corpus.append(doc)
    chatbot_metadata.append({
        "type": "disease",
        "name": disease["name"],
        "data": disease,
    })

for condition_name, protocol in TREATMENT_DATABASE.items():
    lifestyle_text = " ".join([li["recommendation"] for li in protocol["lifestyle"]])
    med_text = " ".join([m["class"] for m in protocol["medications"]])
    doc = f"{condition_name} treatment {lifestyle_text} {med_text}"
    chatbot_corpus.append(doc)
    chatbot_metadata.append({
        "type": "treatment",
        "name": condition_name,
        "data": protocol,
    })

chatbot_vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
chatbot_matrix = chatbot_vectorizer.fit_transform(chatbot_corpus)
print("[INFO] Clinical Chatbot TF-IDF engine initialized.")

# In-memory vitals store (session-based)
vitals_store = {}

from app.schemas import *

# ═══════════════════════════════════════════════════════════════════════
# API ROUTES
# ═══════════════════════════════════════════════════════════════════════

@app.get("/")
def read_root():
    return {
        "status": "API is running", 
        "models_loaded": {
            "heart_disease": heart_model is not None,
            "pneumonia_cnn": pneumonia_model is not None,
            "symptom_checker": True,
            "mental_health": True,
            "treatment_recommender": True,
        }
    }

# ── 1. Heart Disease Risk Prediction ─────────────────────────────────
@app.post("/api/predict/heart-disease")
def predict_heart_disease(data: HeartDiseaseInput):
    """
    Predicts the risk of coronary heart disease using a trained PyTorch neural network.
    
    Args:
        data (HeartDiseaseInput): Clinical factors including age, cholesterol, BP, etc.
        
    Returns:
        dict: The predicted risk level and probability score.
    """
    if heart_model is None or heart_scaler is None:
        return {"error": "Heart disease model is not loaded or missing."}
    
    try:
        # Convert incoming JSON into a dictionary
        payload = data.dict()
        
        # --- Dynamic Feature Engineering ---
        payload['bmi'] = payload['weight'] / ((payload['height'] / 100) ** 2)
        payload['pulse_pressure'] = payload['ap_hi'] - payload['ap_lo']
        payload['map'] = payload['ap_lo'] + (payload['pulse_pressure'] / 3)
        # -----------------------------------
        
        # Extract features dynamically using the saved 14-dimension ordering
        input_data = []
        for f in feature_names:
            if f not in payload:
                raise ValueError(f"Missing required internal feature match: {f}")
            input_data.append(payload[f])
            
        # Scale Data
        input_array = np.array([input_data])
        scaled_array = heart_scaler.transform(input_array)
        
        # Inference via PyTorch BigNN
        with torch.no_grad():
            tensor_in = torch.FloatTensor(scaled_array)
            prediction_prob = heart_model(tensor_in).item()
            
        prediction_class = 1 if prediction_prob >= 0.5 else 0
        risk_level = "High Risk" if prediction_class == 1 else "Low Risk"
        # Provide confidence explicitly for the winning class
        confidence = prediction_prob if prediction_class == 1 else (1.0 - prediction_prob)
        
        return {
            "prediction": prediction_class,
            "risk_level": risk_level,
            "confidence": confidence
        }
    except Exception as e:
        return {"error": f"Failed prediction: {str(e)}"}

# ── 2. Pneumonia X-Ray Detection ─────────────────────────────────────
@app.post("/api/predict/pneumonia")
async def predict_pneumonia(file: UploadFile = File(...)):
    """
    Analyzes a chest X-Ray image for signs of pneumonia using a MobileNetV2 CNN.
    
    Args:
        file (UploadFile): The uploaded X-Ray image file.
        
    Returns:
        dict: The prediction probability and risk level.
    """
    if pneumonia_model is None:
        return {"error": "Pneumonia model is not loaded or missing."}
    
    try:
        contents = await file.read()
        
        # Decode image using PIL
        img = Image.open(BytesIO(contents)).convert('RGB')
        
        # Standard PyTorch ImageNet transforms
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        img_tensor = transform(img).unsqueeze(0) # Create batch axis
        
        # Inference via PyTorch
        with torch.no_grad():
            prediction_prob = pneumonia_model(img_tensor).item()
        
        # Logic: Output is sigmoid (0.0 to 1.0). Closer to 1.0 means higher risk of pneumonia
        risk_level = "High Risk of Pneumonia" if prediction_prob > 0.5 else "Normal (Low Risk)"
        confidence = prediction_prob if prediction_prob > 0.5 else (1.0 - prediction_prob)
        
        return {
            "prediction": prediction_prob,
            "risk_level": risk_level,
            "confidence": confidence * 100
        }
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

# ── 3. NLP Symptom Checker ───────────────────────────────────────────
@app.post("/api/analyze/symptoms")
def analyze_symptoms(data: SymptomInput):
    """
    Analyzes free-text symptom descriptions using TF-IDF cosine similarity
    against the disease knowledge base. Returns top matching conditions
    with explainability.
    """
    if not data.symptoms or len(data.symptoms.strip()) < 3:
        return {"error": "Please provide a description of your symptoms."}
    
    user_text = data.symptoms.lower().strip()
    
    # Transform user input using the same TF-IDF vectorizer
    user_tfidf = tfidf_vectorizer.transform([user_text])
    
    # Compute cosine similarity between user input and each disease profile
    similarities = cosine_similarity(user_tfidf, disease_tfidf_matrix)[0]
    
    # Get the top matches (require > 0 similarity)
    ranked_indices = np.argsort(similarities)[::-1]
    
    results = []
    for idx in ranked_indices:
        score = float(similarities[idx])
        if score <= 0:
            break
        if len(results) >= 5:
            break
        
        disease = DISEASE_DATABASE[idx]
        
        # Find which of the user's keywords matched this disease's symptom list
        user_words = set(re.findall(r'\b[a-z]+(?:\s+[a-z]+)?\b', user_text))
        matched_symptoms = []
        for symptom in disease["symptoms"]:
            symptom_lower = symptom.lower()
            # Check if any user word or phrase appears in this symptom
            if any(word in symptom_lower for word in user_words):
                matched_symptoms.append(symptom)
            elif symptom_lower in user_text:
                matched_symptoms.append(symptom)
        
        results.append({
            "condition": disease["name"],
            "confidence": round(score * 100, 1),
            "severity": disease["severity"],
            "triage": disease["triage"],
            "specialist": disease["specialist"],
            "description": disease["description"],
            "matched_symptoms": matched_symptoms,
            "all_symptoms": disease["symptoms"],
        })
    
    if not results:
        return {
            "matches": [],
            "triage_recommendation": "Your symptoms did not strongly match any conditions in our database. Please consult a healthcare provider for proper evaluation.",
            "disclaimer": "This AI symptom checker is for informational purposes only. It is not a substitute for professional medical advice."
        }
    
    # Overall triage = highest severity found among top results
    highest_triage = results[0]["triage"]
    for r in results[:3]:
        if SEVERITY_ORDER.get(r["severity"], 0) > SEVERITY_ORDER.get(results[0]["severity"], 0):
            highest_triage = r["triage"]
    
    return {
        "matches": results,
        "triage_recommendation": TRIAGE_DESCRIPTIONS.get(highest_triage, "Please consult a healthcare provider."),
        "highest_triage_level": highest_triage,
        "disclaimer": "This AI symptom checker is for informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment."
    }

# ── 4. Mental Health Risk Assessment ─────────────────────────────────

# PHQ-9 scoring: https://med.stanford.edu/fastlab/research/imapp/msrs/_jcr_content/main/accordion/accordion_content3/download_256324296/file.res/PHQ9%20id%20date%2008.03.pdf
PHQ9_QUESTIONS = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed — or being so fidgety or restless",
    "Thoughts that you would be better off dead, or of hurting yourself",
]

# GAD-7 scoring: https://www.mdcalc.com/calc/1727/gad-7-general-anxiety-disorder-7
GAD7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge",
    "Not being able to stop or control worrying",
    "Worrying too much about different things",
    "Trouble relaxing",
    "Being so restless that it's hard to sit still",
    "Becoming easily annoyed or irritable",
    "Feeling afraid, as if something awful might happen",
]

def classify_phq9(score: int) -> dict:
    """Classify PHQ-9 score into severity bands."""
    if score <= 4:
        return {"severity": "Minimal", "level": "low", "color": "green"}
    elif score <= 9:
        return {"severity": "Mild", "level": "low", "color": "yellow"}
    elif score <= 14:
        return {"severity": "Moderate", "level": "moderate", "color": "orange"}
    elif score <= 19:
        return {"severity": "Moderately Severe", "level": "high", "color": "red"}
    else:
        return {"severity": "Severe", "level": "critical", "color": "darkred"}

def classify_gad7(score: int) -> dict:
    """Classify GAD-7 score into severity bands."""
    if score <= 4:
        return {"severity": "Minimal", "level": "low", "color": "green"}
    elif score <= 9:
        return {"severity": "Mild", "level": "low", "color": "yellow"}
    elif score <= 14:
        return {"severity": "Moderate", "level": "moderate", "color": "orange"}
    else:
        return {"severity": "Severe", "level": "high", "color": "red"}

@app.post("/api/assess/mental-health")
def assess_mental_health(data: MentalHealthInput):
    """
    Scores PHQ-9 (depression) and GAD-7 (anxiety) validated clinical instruments.
    Returns severity classification with per-question breakdown.
    """
    # Validate input lengths
    if len(data.phq9) != 9:
        return {"error": f"PHQ-9 requires exactly 9 answers, received {len(data.phq9)}"}
    if len(data.gad7) != 7:
        return {"error": f"GAD-7 requires exactly 7 answers, received {len(data.gad7)}"}
    
    # Validate score range (0-3 for each)
    for i, score in enumerate(data.phq9):
        if score < 0 or score > 3:
            return {"error": f"PHQ-9 question {i+1} score must be 0-3, received {score}"}
    for i, score in enumerate(data.gad7):
        if score < 0 or score > 3:
            return {"error": f"GAD-7 question {i+1} score must be 0-3, received {score}"}
    
    # Calculate totals
    phq9_total = sum(data.phq9)
    gad7_total = sum(data.gad7)
    
    phq9_classification = classify_phq9(phq9_total)
    gad7_classification = classify_gad7(gad7_total)
    
    # Per-question breakdown for explainability
    phq9_breakdown = []
    for i, (question, response) in enumerate(zip(PHQ9_QUESTIONS, data.phq9)):
        phq9_breakdown.append({
            "question_number": i + 1,
            "question": question,
            "response": response,
            "response_label": ["Not at all", "Several days", "More than half the days", "Nearly every day"][response],
            "is_elevated": response >= 2,
        })
    
    gad7_breakdown = []
    for i, (question, response) in enumerate(zip(GAD7_QUESTIONS, data.gad7)):
        gad7_breakdown.append({
            "question_number": i + 1,
            "question": question,
            "response": response,
            "response_label": ["Not at all", "Several days", "More than half the days", "Nearly every day"][response],
            "is_elevated": response >= 2,
        })
    
    # Determine overall risk level
    max_level = max(
        SEVERITY_ORDER.get(phq9_classification["level"], 0),
        SEVERITY_ORDER.get(gad7_classification["level"], 0)
    )
    overall_risk_map = {1: "Low", 2: "Moderate", 3: "High", 4: "Critical"}
    overall_risk = overall_risk_map.get(max_level, "Low")
    
    # Check for suicidal ideation (PHQ-9 question 9)
    suicidal_flag = data.phq9[8] > 0
    
    # Clinical recommendations
    recommendations = []
    if phq9_total >= 10:
        recommendations.append("Your depression screening score suggests moderate or higher severity. Professional evaluation by a mental health provider is recommended.")
    if gad7_total >= 10:
        recommendations.append("Your anxiety screening score suggests moderate or higher severity. Consider consulting a mental health professional for evaluation.")
    if suicidal_flag:
        recommendations.append("IMPORTANT: You indicated thoughts of self-harm. Please reach out to a crisis helpline immediately. National Suicide Prevention Lifeline: 988 (US) | Crisis Text Line: Text HOME to 741741")
    if phq9_total <= 4 and gad7_total <= 4:
        recommendations.append("Your scores suggest minimal symptoms. Continue maintaining healthy habits and reach out to a provider if symptoms develop.")
    if phq9_total >= 5 and phq9_total < 10:
        recommendations.append("Your depression score is in the mild range. Watchful waiting with lifestyle modifications (exercise, sleep hygiene, social support) is recommended.")
    if gad7_total >= 5 and gad7_total < 10:
        recommendations.append("Your anxiety score is in the mild range. Relaxation techniques, mindfulness, and regular exercise may help manage symptoms.")
    
    return {
        "depression": {
            "score": phq9_total,
            "max_score": 27,
            "percentage": round(phq9_total / 27 * 100, 1),
            "severity": phq9_classification["severity"],
            "level": phq9_classification["level"],
            "breakdown": phq9_breakdown,
        },
        "anxiety": {
            "score": gad7_total,
            "max_score": 21,
            "percentage": round(gad7_total / 21 * 100, 1),
            "severity": gad7_classification["severity"],
            "level": gad7_classification["level"],
            "breakdown": gad7_breakdown,
        },
        "overall_risk": overall_risk,
        "suicidal_ideation_flag": suicidal_flag,
        "recommendations": recommendations,
        "disclaimer": "This assessment uses clinically validated instruments (PHQ-9 and GAD-7) but is NOT a clinical diagnosis. Please consult a licensed mental health professional for proper evaluation and treatment."
    }

# ── 5. Treatment Recommendation Engine ───────────────────────────────
@app.post("/api/recommend/treatment")
def recommend_treatment(data: TreatmentInput):
    """
    Generates personalized treatment recommendations using a rule-based
    clinical knowledge engine. Returns lifestyle modifications, medication
    classes, specialist referrals, and monitoring plans.
    """
    if not data.condition or len(data.condition.strip()) < 2:
        return {"error": "Please provide a condition name."}
    
    severity = data.severity if data.severity in ["mild", "moderate", "severe"] else "moderate"
    
    plan = get_treatment_plan(
        condition=data.condition.strip(),
        severity=severity,
        age=data.age,
        sex=data.sex,
        comorbidities=data.comorbidities or [],
    )
    
    return plan


# ── 6. AI Scribe (SOAP Note Generator) ───────────────────────────────
@app.post("/api/scribe/soap-note")
def generate_soap_note(data: SoapNoteInput):
    """
    Generates a structured clinical SOAP note from unstructured transcript text.
    
    Args:
        data (SoapNoteInput): The raw transcript and patient metadata.
        
    Returns:
        dict: Structured Subjective, Objective, Assessment, and Plan sections.
    """
    # Mock generation
    return {
        "visit_type": data.visit_type,
        "chief_complaint": data.chief_complaint or "Unspecified",
        "patient_age": data.patient_age,
        "subjective": {"title": "Subjective — Patient History", "content": ["Patient reported symptoms.", "Denies pain."]},
        "objective": {"title": "Objective — Examination", "content": ["Vitals stable.", "Physical exam unremarkable."]},
        "assessment": {"title": "Assessment — Clinical Impression", "content": ["Condition stable."]},
        "plan": {"title": "Plan — Recommendations", "content": ["Continue current management.", "Follow up in 4 weeks."]},
        "disclaimer": "AI-generated SOAP note. Review before saving."
    }

# ── 7. EHR Analyzer (Document Analyzer) ──────────────────────────────
@app.post("/api/analyze/document")
def analyze_document(data: DocumentAnalyzerInput):
    # Mock analysis
    return {
        "total_labs_extracted": 15,
        "total_abnormal": 2,
        "critical_flags": ["Elevated Fasting Glucose"],
        "extracted_lab_values": [
            {"name": "Fasting Glucose", "value": 118, "unit": "mg/dL", "normal_range": "70-99", "status": "high", "flag": "H"},
            {"name": "HbA1c", "value": 6.2, "unit": "%", "normal_range": "< 5.7", "status": "high", "flag": "H"}
        ],
        "medications_detected": ["Metformin", "Aspirin", "Atorvastatin"],
        "disclaimer": "AI extraction is not a substitute for clinical review."
    }

# ── 8. Clinical Chatbot ──────────────────────────────────────────────
@app.post("/api/chat/clinical")
def clinical_chat(data: ChatInput):
    user_vec = chatbot_vectorizer.transform([data.message])
    sims = cosine_similarity(user_vec, chatbot_matrix).flatten()
    best_idx = int(np.argmax(sims))
    best_score = float(sims[best_idx])
    
    if best_score < 0.1:
        return {
            "type": "general",
            "confidence": int(best_score * 100),
            "response": "I'm sorry, I don't have enough specific medical information to answer that question confidently. Could you rephrase or ask about a specific condition or treatment?",
            "sources": []
        }
    
    meta = chatbot_metadata[best_idx]
    if meta["type"] == "disease":
        d = meta["data"]
        response = f"**{d['name']}**\n\n{d['description']}\n\n**Common Symptoms:** {', '.join(d['symptoms'])}."
    else:
        d = meta["data"]
        response = f"**Treatment Guidelines for {meta['name']}**\n\n**Medications:** {', '.join([m['class'] for m in d['medications']])}\n\n**Lifestyle:** {', '.join([m['recommendation'] for m in d['lifestyle']])}"
    
    return {
        "type": meta["type"],
        "confidence": int(best_score * 100),
        "response": response,
        "sources": [meta["name"]]
    }

# ── 9. Image Diagnostics (Skin/Fracture/Retinopathy) ─────────────────
@app.post("/api/predict/skin-lesion")
def predict_skin(file: UploadFile = File(...)):
    # Mock
    return {
        "top_prediction": {"name": "Melanocytic Nevus", "abbreviation": "NV", "probability": 85.2, "urgency": "routine", "description": "Benign mole.", "recommendation": "Routine monitoring."},
        "all_predictions": [{"name": "Melanocytic Nevus", "probability": 85.2, "urgency": "routine"}, {"name": "Melanoma", "probability": 10.1, "urgency": "urgent"}],
        "image_features": {"asymmetry": "low", "border_irregularity": "mild", "color_variation": "low", "diameter_estimate": "< 6mm"},
        "disclaimer": "AI is for educational purposes only."
    }

@app.post("/api/predict/fracture")
def predict_fracture(file: UploadFile = File(...)):
    # Mock
    return {
        "prediction": "Normal (No Fracture)",
        "fracture_probability": 12.5,
        "normal_probability": 87.5,
        "recommendation": "No obvious fracture detected. Correlate clinically.",
        "disclaimer": "AI is for educational purposes only."
    }

@app.post("/api/predict/retinopathy")
def predict_retinopathy(file: UploadFile = File(...)):
    # Mock
    return {
        "predicted_grade": 0,
        "grade_name": "No DR",
        "probability": 92.1,
        "description": "No apparent diabetic retinopathy.",
        "recommendation": "Annual screening recommended.",
        "all_grades": [{"grade": 0, "name": "No DR", "probability": 92.1}, {"grade": 1, "name": "Mild NPDR", "probability": 5.2}],
        "disclaimer": "AI is for educational purposes only."
    }

# ── 10. Diabetes Risk Calculator ─────────────────────────────────────
@app.post("/api/predict/diabetes-risk")
def api_diabetes_risk(data: DiabetesRiskInput):
    return calculate_diabetes_risk(**data.dict())

# ── 11. Drug Interactions ────────────────────────────────────────────
@app.post("/api/check/drug-interactions")
def api_check_drugs(data: DrugInteractionInput):
    return check_interactions(data.drugs)

@app.get("/api/drugs/list")
def api_list_drugs():
    return {"drugs": list(DRUG_CLASSES.keys())}

# ── 12. Vitals Tracker ───────────────────────────────────────────────
import datetime

@app.post("/api/vitals/log")
def log_vitals(data: VitalsLogInput):
    if data.session_id not in vitals_store:
        vitals_store[data.session_id] = []
    
    entry = data.dict()
    entry["timestamp"] = datetime.datetime.now().isoformat()
    
    # Calculate simple statuses
    if entry.get("systolic_bp") is not None:
        if entry["systolic_bp"] > 140: entry["systolic_bp_status"] = "high"
        elif entry["systolic_bp"] < 90: entry["systolic_bp_status"] = "low"
        else: entry["systolic_bp_status"] = "normal"
        
    vitals_store[data.session_id].append(entry)
    
    flags = []
    if entry.get("systolic_bp_status") == "high": flags.append("High Blood Pressure detected")
    
    return {"status": "success", "flags": flags}

@app.post("/api/vitals/history")
def vitals_history(data: VitalsHistoryInput):
    entries = vitals_store.get(data.session_id, [])
    stats = {}
    if entries:
        sys_bps = [e["systolic_bp"] for e in entries if e.get("systolic_bp") is not None]
        if sys_bps:
            stats["systolic_bp"] = {
                "latest": sys_bps[-1],
                "min": min(sys_bps),
                "max": max(sys_bps),
                "avg": round(sum(sys_bps)/len(sys_bps), 1),
                "trend": "rising" if len(sys_bps)>1 and sys_bps[-1] > sys_bps[-2] else "falling",
                "normal_min": 90, "normal_max": 120
            }
    return {"entries": entries, "stats": stats}

# ── 13. Lifestyle Planner ────────────────────────────────────────────
@app.post("/api/plan/lifestyle")
def api_lifestyle_plan(data: LifestylePlanInput):
    bmi = None
    if data.height_cm and data.weight_kg:
        bmi = data.weight_kg / ((data.height_cm / 100) ** 2)
    return generate_lifestyle_plan(
        condition=data.condition,
        age=data.age,
        sex=data.sex,
        bmi=bmi
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
