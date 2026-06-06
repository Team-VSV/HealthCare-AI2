"""
Symptom-Disease Knowledge Base for the NLP Symptom Checker.

Each condition entry contains:
  - symptoms: list of associated symptom keywords (used for TF-IDF matching)
  - description: brief clinical description
  - severity: low / moderate / high / critical
  - triage: self-care / schedule-appointment / urgent-care / emergency
  - specialist: recommended specialist referral
  - common_age_group: typical age range affected
"""

DISEASE_DATABASE = [
    # ── Cardiovascular ────────────────────────────────────────────────
    {
        "name": "Coronary Artery Disease",
        "symptoms": [
            "chest pain", "chest tightness", "shortness of breath", "fatigue",
            "dizziness", "nausea", "sweating", "arm pain", "jaw pain",
            "palpitations", "exercise intolerance"
        ],
        "description": "Narrowing of the coronary arteries reducing blood flow to the heart muscle.",
        "severity": "high",
        "triage": "urgent-care",
        "specialist": "Cardiologist",
        "common_age_group": "40+"
    },
    {
        "name": "Hypertension",
        "symptoms": [
            "headache", "dizziness", "blurred vision", "chest pain",
            "shortness of breath", "nosebleed", "fatigue", "nausea"
        ],
        "description": "Persistently elevated blood pressure that can damage blood vessels and organs.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Cardiologist",
        "common_age_group": "30+"
    },
    {
        "name": "Heart Failure",
        "symptoms": [
            "shortness of breath", "fatigue", "swelling legs", "swelling ankles",
            "rapid heartbeat", "persistent cough", "wheezing", "weight gain",
            "nausea", "reduced appetite", "difficulty concentrating"
        ],
        "description": "The heart cannot pump blood efficiently enough to meet the body's needs.",
        "severity": "critical",
        "triage": "emergency",
        "specialist": "Cardiologist",
        "common_age_group": "50+"
    },

    # ── Respiratory ───────────────────────────────────────────────────
    {
        "name": "Pneumonia",
        "symptoms": [
            "cough", "fever", "chills", "shortness of breath", "chest pain",
            "fatigue", "sweating", "nausea", "vomiting", "diarrhea",
            "phlegm", "rapid breathing", "body aches"
        ],
        "description": "Infection that inflames air sacs in one or both lungs, possibly filling with fluid.",
        "severity": "high",
        "triage": "urgent-care",
        "specialist": "Pulmonologist",
        "common_age_group": "all"
    },
    {
        "name": "Asthma",
        "symptoms": [
            "wheezing", "shortness of breath", "chest tightness", "cough",
            "difficulty breathing", "rapid breathing", "anxiety",
            "trouble sleeping", "fatigue"
        ],
        "description": "Chronic condition where airways narrow and swell, producing extra mucus.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Pulmonologist",
        "common_age_group": "all"
    },
    {
        "name": "Bronchitis",
        "symptoms": [
            "cough", "phlegm", "fatigue", "shortness of breath",
            "chest discomfort", "mild fever", "chills", "sore throat",
            "body aches", "headache"
        ],
        "description": "Inflammation of the lining of bronchial tubes carrying air to and from the lungs.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Pulmonologist",
        "common_age_group": "all"
    },
    {
        "name": "Common Cold",
        "symptoms": [
            "runny nose", "sore throat", "cough", "congestion", "sneezing",
            "mild headache", "mild body aches", "low grade fever", "fatigue",
            "watery eyes"
        ],
        "description": "Viral infection of the upper respiratory tract, usually harmless.",
        "severity": "low",
        "triage": "self-care",
        "specialist": "General Practitioner",
        "common_age_group": "all"
    },
    {
        "name": "Influenza (Flu)",
        "symptoms": [
            "fever", "cough", "sore throat", "body aches", "headache",
            "fatigue", "chills", "sweating", "nasal congestion",
            "vomiting", "diarrhea", "muscle pain"
        ],
        "description": "Viral infection attacking the respiratory system — nose, throat, and lungs.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "General Practitioner",
        "common_age_group": "all"
    },

    # ── Gastrointestinal ─────────────────────────────────────────────
    {
        "name": "Gastroesophageal Reflux Disease (GERD)",
        "symptoms": [
            "heartburn", "acid reflux", "chest pain", "difficulty swallowing",
            "regurgitation", "sore throat", "cough", "laryngitis",
            "nausea", "sensation of lump in throat"
        ],
        "description": "Chronic digestive disease where stomach acid flows back into the esophagus.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Gastroenterologist",
        "common_age_group": "all"
    },
    {
        "name": "Gastritis",
        "symptoms": [
            "upper abdominal pain", "nausea", "vomiting", "bloating",
            "indigestion", "loss of appetite", "hiccups", "dark stool",
            "burning stomach"
        ],
        "description": "Inflammation of the stomach lining causing pain and digestive issues.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Gastroenterologist",
        "common_age_group": "all"
    },
    {
        "name": "Irritable Bowel Syndrome (IBS)",
        "symptoms": [
            "abdominal pain", "cramping", "bloating", "gas", "diarrhea",
            "constipation", "mucus in stool", "fatigue", "nausea",
            "back pain"
        ],
        "description": "Chronic condition affecting the large intestine with altered bowel habits.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Gastroenterologist",
        "common_age_group": "20-50"
    },
    {
        "name": "Appendicitis",
        "symptoms": [
            "severe abdominal pain", "right lower abdominal pain", "nausea",
            "vomiting", "fever", "loss of appetite", "abdominal swelling",
            "constipation", "diarrhea", "inability to pass gas"
        ],
        "description": "Inflammation of the appendix causing severe abdominal pain, requires urgent care.",
        "severity": "critical",
        "triage": "emergency",
        "specialist": "General Surgeon",
        "common_age_group": "10-30"
    },

    # ── Neurological ─────────────────────────────────────────────────
    {
        "name": "Migraine",
        "symptoms": [
            "severe headache", "throbbing pain", "nausea", "vomiting",
            "light sensitivity", "sound sensitivity", "aura", "visual disturbances",
            "dizziness", "tingling", "fatigue"
        ],
        "description": "Recurring severe headaches often with sensory disturbances.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Neurologist",
        "common_age_group": "15-55"
    },
    {
        "name": "Tension Headache",
        "symptoms": [
            "dull headache", "pressure around forehead", "scalp tenderness",
            "neck pain", "shoulder pain", "fatigue", "difficulty concentrating",
            "irritability", "mild light sensitivity"
        ],
        "description": "Most common type of headache causing mild to moderate diffuse pain.",
        "severity": "low",
        "triage": "self-care",
        "specialist": "General Practitioner",
        "common_age_group": "all"
    },
    {
        "name": "Stroke",
        "symptoms": [
            "sudden numbness", "confusion", "trouble speaking",
            "vision problems", "severe headache", "difficulty walking",
            "dizziness", "loss of balance", "facial drooping", "arm weakness"
        ],
        "description": "Medical emergency where blood supply to part of the brain is interrupted.",
        "severity": "critical",
        "triage": "emergency",
        "specialist": "Neurologist",
        "common_age_group": "55+"
    },

    # ── Endocrine / Metabolic ────────────────────────────────────────
    {
        "name": "Type 2 Diabetes",
        "symptoms": [
            "increased thirst", "frequent urination", "increased hunger",
            "fatigue", "blurred vision", "slow healing wounds", "tingling hands",
            "tingling feet", "weight loss", "dark skin patches", "dry skin"
        ],
        "description": "Chronic condition affecting how the body processes blood sugar (glucose).",
        "severity": "high",
        "triage": "schedule-appointment",
        "specialist": "Endocrinologist",
        "common_age_group": "40+"
    },
    {
        "name": "Hypothyroidism",
        "symptoms": [
            "fatigue", "weight gain", "cold sensitivity", "constipation",
            "dry skin", "puffy face", "hoarse voice", "muscle weakness",
            "muscle aches", "elevated cholesterol", "depression",
            "hair thinning", "slow heart rate", "impaired memory"
        ],
        "description": "Underactive thyroid gland not producing enough thyroid hormones.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Endocrinologist",
        "common_age_group": "30+"
    },
    {
        "name": "Hyperthyroidism",
        "symptoms": [
            "weight loss", "rapid heartbeat", "increased appetite", "anxiety",
            "tremor", "sweating", "heat sensitivity", "frequent bowel movements",
            "fatigue", "muscle weakness", "difficulty sleeping",
            "skin thinning", "brittle hair"
        ],
        "description": "Overactive thyroid gland producing excess thyroid hormones.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Endocrinologist",
        "common_age_group": "20-50"
    },

    # ── Musculoskeletal ──────────────────────────────────────────────
    {
        "name": "Osteoarthritis",
        "symptoms": [
            "joint pain", "stiffness", "tenderness", "loss of flexibility",
            "grating sensation", "bone spurs", "swelling", "reduced range of motion",
            "joint clicking"
        ],
        "description": "Degenerative joint disease where cartilage wears down over time.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Rheumatologist",
        "common_age_group": "50+"
    },
    {
        "name": "Rheumatoid Arthritis",
        "symptoms": [
            "joint pain", "joint swelling", "joint stiffness", "fatigue",
            "fever", "loss of appetite", "warm joints", "symmetric joint involvement",
            "morning stiffness", "nodules"
        ],
        "description": "Autoimmune disorder where the immune system attacks joint lining.",
        "severity": "high",
        "triage": "schedule-appointment",
        "specialist": "Rheumatologist",
        "common_age_group": "30-60"
    },

    # ── Mental Health ────────────────────────────────────────────────
    {
        "name": "Major Depressive Disorder",
        "symptoms": [
            "persistent sadness", "loss of interest", "fatigue", "sleep changes",
            "appetite changes", "difficulty concentrating", "feelings of worthlessness",
            "guilt", "hopelessness", "irritability", "social withdrawal",
            "body aches", "suicidal thoughts"
        ],
        "description": "Mood disorder causing persistent feelings of sadness and loss of interest.",
        "severity": "high",
        "triage": "schedule-appointment",
        "specialist": "Psychiatrist",
        "common_age_group": "all"
    },
    {
        "name": "Generalized Anxiety Disorder",
        "symptoms": [
            "excessive worry", "restlessness", "fatigue", "difficulty concentrating",
            "irritability", "muscle tension", "sleep disturbance", "nervousness",
            "rapid heartbeat", "sweating", "trembling", "nausea"
        ],
        "description": "Persistent and excessive worry about various aspects of daily life.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Psychiatrist",
        "common_age_group": "all"
    },
    {
        "name": "Panic Disorder",
        "symptoms": [
            "sudden intense fear", "racing heart", "chest pain", "shortness of breath",
            "dizziness", "numbness", "tingling", "sweating", "trembling",
            "feeling of impending doom", "nausea", "hot flashes", "chills"
        ],
        "description": "Recurring unexpected panic attacks with intense physical symptoms.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Psychiatrist",
        "common_age_group": "20-40"
    },

    # ── Infectious Disease ───────────────────────────────────────────
    {
        "name": "Urinary Tract Infection (UTI)",
        "symptoms": [
            "frequent urination", "burning urination", "cloudy urine",
            "strong smelling urine", "pelvic pain", "blood in urine",
            "urgency to urinate", "lower back pain", "fever", "chills"
        ],
        "description": "Infection in any part of the urinary system — kidneys, bladder, or urethra.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Urologist",
        "common_age_group": "all"
    },
    {
        "name": "COVID-19",
        "symptoms": [
            "fever", "cough", "fatigue", "loss of taste", "loss of smell",
            "sore throat", "headache", "body aches", "shortness of breath",
            "congestion", "nausea", "diarrhea", "chills"
        ],
        "description": "Respiratory illness caused by the SARS-CoV-2 virus.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Infectious Disease Specialist",
        "common_age_group": "all"
    },

    # ── Dermatological ───────────────────────────────────────────────
    {
        "name": "Eczema (Atopic Dermatitis)",
        "symptoms": [
            "dry skin", "itching", "red patches", "skin rash", "cracked skin",
            "scaly skin", "swollen skin", "bumps", "oozing", "skin thickening"
        ],
        "description": "Chronic condition causing inflamed, itchy, and cracked skin.",
        "severity": "low",
        "triage": "schedule-appointment",
        "specialist": "Dermatologist",
        "common_age_group": "all"
    },
    {
        "name": "Psoriasis",
        "symptoms": [
            "red patches", "silvery scales", "dry cracked skin", "itching",
            "burning", "soreness", "thick nails", "pitted nails",
            "stiff joints", "swollen joints"
        ],
        "description": "Autoimmune condition causing rapid skin cell buildup forming scales and dry patches.",
        "severity": "moderate",
        "triage": "schedule-appointment",
        "specialist": "Dermatologist",
        "common_age_group": "15-35"
    },

    # ── Kidney / Urological ──────────────────────────────────────────
    {
        "name": "Kidney Stones",
        "symptoms": [
            "severe flank pain", "radiating pain to groin", "painful urination",
            "blood in urine", "nausea", "vomiting", "frequent urination",
            "fever", "chills", "cloudy urine", "foul smelling urine"
        ],
        "description": "Hard mineral deposits that form inside the kidneys causing severe pain.",
        "severity": "high",
        "triage": "urgent-care",
        "specialist": "Urologist",
        "common_age_group": "30-60"
    },

    # ── Allergic ─────────────────────────────────────────────────────
    {
        "name": "Allergic Rhinitis",
        "symptoms": [
            "sneezing", "runny nose", "stuffy nose", "itchy nose",
            "itchy eyes", "watery eyes", "postnasal drip", "cough",
            "fatigue", "headache", "reduced smell"
        ],
        "description": "Allergic response causing cold-like symptoms from environmental triggers.",
        "severity": "low",
        "triage": "self-care",
        "specialist": "Allergist",
        "common_age_group": "all"
    },
    {
        "name": "Anaphylaxis",
        "symptoms": [
            "skin rash", "swelling throat", "difficulty breathing",
            "rapid pulse", "dizziness", "drop in blood pressure",
            "nausea", "vomiting", "fainting", "hives",
            "tingling", "wheezing"
        ],
        "description": "Severe, life-threatening allergic reaction requiring immediate emergency treatment.",
        "severity": "critical",
        "triage": "emergency",
        "specialist": "Emergency Medicine",
        "common_age_group": "all"
    },
]

# Precomputed: collect all unique symptoms for the TF-IDF vectorizer
ALL_SYMPTOMS = set()
for disease in DISEASE_DATABASE:
    for symptom in disease["symptoms"]:
        ALL_SYMPTOMS.add(symptom.lower())

TRIAGE_DESCRIPTIONS = {
    "self-care": "Your symptoms suggest a mild condition. Rest, hydration, and over-the-counter remedies may help. Monitor your symptoms and consult a doctor if they persist beyond a few days.",
    "schedule-appointment": "We recommend scheduling an appointment with your healthcare provider within the next few days for proper evaluation and management.",
    "urgent-care": "Your symptoms may indicate a condition requiring prompt medical attention. Please visit an urgent care center or your doctor today.",
    "emergency": "Your symptoms may indicate a serious or life-threatening condition. Please seek emergency medical care immediately or call emergency services."
}

SEVERITY_ORDER = {"low": 1, "moderate": 2, "high": 3, "critical": 4}
