import spacy
from spacy.pipeline import EntityRuler
import re

from app.services.symptom_knowledge_base import DISEASE_DATABASE
from app.services.drug_interaction_db import DRUG_CLASSES

# Global cached model
_nlp_model = None

def get_clinical_nlp():
    """Lazy load and configure the spaCy model with clinical entity rules."""
    global _nlp_model
    if _nlp_model is not None:
        return _nlp_model
        
    try:
        # Load the base lightweight English model
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        # Fallback if model isn't downloaded yet
        from spacy.cli import download
        download("en_core_web_sm")
        nlp = spacy.load("en_core_web_sm")

    # Add Entity Ruler before the NER component
    ruler = nlp.add_pipe("entity_ruler", before="ner")
    
    # Build custom patterns from our databases
    patterns = []
    
    # 1. Add Diseases & Symptoms
    for disease in DISEASE_DATABASE:
        patterns.append({"label": "DISEASE", "pattern": disease["name"]})
        for symptom in disease["symptoms"]:
            patterns.append({"label": "SYMPTOM", "pattern": symptom.lower()})
            
    # 2. Add Medications
    for drug in DRUG_CLASSES.keys():
        patterns.append({"label": "MEDICATION", "pattern": drug.lower()})
        patterns.append({"label": "MEDICATION", "pattern": drug.title()})

    # 3. Add Custom Vitals Rules
    # We can use regex patterns for things like Blood Pressure (e.g., "120/80")
    patterns.append({
        "label": "VITALS",
        "pattern": [{"TEXT": {"REGEX": r"^\d{2,3}\/\d{2,3}$"}}]
    })
    
    ruler.add_patterns(patterns)
    _nlp_model = nlp
    return _nlp_model

def extract_soap_entities(transcript: str, patient_age: int = None, chief_complaint: str = None):
    """
    Processes a clinical transcript using NLP and structures it into a SOAP Note.
    """
    nlp = get_clinical_nlp()
    doc = nlp(transcript)
    
    subjective_findings = set()
    objective_findings = set()
    assessment_findings = set()
    plan_findings = set()
    
    # Add initial context
    if chief_complaint:
        subjective_findings.add(f"Chief Complaint: {chief_complaint}")
    
    # Map extracted entities to SOAP buckets
    for ent in doc.ents:
        if ent.label_ == "SYMPTOM":
            subjective_findings.add(ent.text.capitalize())
        elif ent.label_ == "VITALS":
            objective_findings.add(f"Vitals extracted: {ent.text}")
        elif ent.label_ == "DISEASE":
            assessment_findings.add(f"Suspected {ent.text}")
        elif ent.label_ == "MEDICATION":
            plan_findings.add(f"Prescribe/Discuss: {ent.text.capitalize()}")
    
    # Fallbacks if empty
    if not subjective_findings:
        subjective_findings.add("Patient reported symptoms as per transcript.")
    if not objective_findings:
        objective_findings.add("Physical exam and vitals unremarkable or not stated.")
    if not assessment_findings:
        assessment_findings.add("Condition requires further evaluation.")
    if not plan_findings:
        plan_findings.add("Continue current management. Follow up as needed.")
        
    return {
        "subjective": {
            "title": "Subjective \u2014 Patient History",
            "content": list(subjective_findings)
        },
        "objective": {
            "title": "Objective \u2014 Examination",
            "content": list(objective_findings)
        },
        "assessment": {
            "title": "Assessment \u2014 Clinical Impression",
            "content": list(assessment_findings)
        },
        "plan": {
            "title": "Plan \u2014 Recommendations",
            "content": list(plan_findings)
        }
    }
