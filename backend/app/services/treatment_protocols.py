"""
Evidence-Based Treatment Protocol Database.

Provides rule-based treatment recommendations for common conditions.
Each protocol includes lifestyle modifications, medication classes (NOT specific drugs),
specialist referrals, and monitoring plans.

DISCLAIMER: This is for educational/informational purposes only.
Actual treatment must be determined by a licensed healthcare provider.
"""

TREATMENT_DATABASE = {
    # ── Cardiovascular ────────────────────────────────────────────────
    "Coronary Artery Disease": {
        "lifestyle": [
            {"recommendation": "Heart-healthy diet (Mediterranean or DASH diet)", "reasoning": "Reduces LDL cholesterol and inflammation, lowers cardiovascular risk"},
            {"recommendation": "Regular aerobic exercise (150 min/week moderate intensity)", "reasoning": "Improves cardiac output, reduces blood pressure, and aids weight management"},
            {"recommendation": "Smoking cessation", "reasoning": "Smoking is a major modifiable risk factor for coronary artery disease"},
            {"recommendation": "Stress management techniques (meditation, yoga)", "reasoning": "Chronic stress elevates cortisol and blood pressure, worsening cardiac health"},
            {"recommendation": "Maintain healthy weight (BMI 18.5-24.9)", "reasoning": "Obesity significantly increases cardiovascular strain and risk"},
        ],
        "medications": [
            {"class": "Antiplatelet agents", "reasoning": "Prevent blood clot formation in narrowed arteries"},
            {"class": "Statins (cholesterol-lowering)", "reasoning": "Reduce LDL cholesterol and stabilize arterial plaques"},
            {"class": "Beta-blockers", "reasoning": "Reduce heart rate and blood pressure, decreasing cardiac workload"},
            {"class": "ACE inhibitors", "reasoning": "Lower blood pressure and reduce cardiac remodeling"},
        ],
        "referrals": ["Cardiologist", "Cardiac Rehabilitation Program", "Dietitian"],
        "monitoring": [
            "Regular lipid panel every 3-6 months",
            "Blood pressure monitoring (home + clinic)",
            "Annual cardiac stress test",
            "ECG monitoring as recommended by cardiologist",
        ],
        "severity_adjustments": {
            "mild": "Focus on lifestyle modifications; medications as clinically indicated",
            "moderate": "Combination therapy with lifestyle changes and medications recommended",
            "severe": "Aggressive medical management; evaluate for interventional procedures (angioplasty/stenting)"
        }
    },

    "Hypertension": {
        "lifestyle": [
            {"recommendation": "DASH diet (low sodium, high potassium)", "reasoning": "Clinically proven to lower blood pressure by 8-14 mmHg"},
            {"recommendation": "Reduce sodium intake to <2,300 mg/day", "reasoning": "Excess sodium promotes fluid retention and elevated blood pressure"},
            {"recommendation": "Regular aerobic exercise (30 min/day, 5 days/week)", "reasoning": "Exercise can lower systolic BP by 5-8 mmHg"},
            {"recommendation": "Limit alcohol consumption", "reasoning": "Excessive alcohol raises blood pressure and reduces medication effectiveness"},
            {"recommendation": "Maintain healthy weight", "reasoning": "Each kg of weight loss can reduce BP by approximately 1 mmHg"},
        ],
        "medications": [
            {"class": "ACE inhibitors / ARBs", "reasoning": "First-line therapy for blood pressure reduction and organ protection"},
            {"class": "Calcium channel blockers", "reasoning": "Relax blood vessel walls to lower blood pressure"},
            {"class": "Thiazide diuretics", "reasoning": "Reduce blood volume by promoting sodium and water excretion"},
        ],
        "referrals": ["Cardiologist (if resistant hypertension)", "Dietitian", "Exercise Physiologist"],
        "monitoring": [
            "Home blood pressure monitoring twice daily",
            "Clinic visit every 1-3 months until controlled",
            "Annual kidney function test (creatinine, eGFR)",
            "Annual electrolyte panel",
        ],
        "severity_adjustments": {
            "mild": "Lifestyle modifications for 3-6 months before considering medication",
            "moderate": "Initiate single-agent pharmacotherapy alongside lifestyle changes",
            "severe": "Combination pharmacotherapy; evaluate for secondary causes of hypertension"
        }
    },

    # ── Respiratory ───────────────────────────────────────────────────
    "Pneumonia": {
        "lifestyle": [
            {"recommendation": "Adequate rest and sleep", "reasoning": "The body requires energy to fight infection and repair lung tissue"},
            {"recommendation": "Increase fluid intake", "reasoning": "Prevents dehydration and helps thin mucus secretions in the lungs"},
            {"recommendation": "Use humidifier", "reasoning": "Moist air helps ease breathing and loosen chest congestion"},
            {"recommendation": "Avoid smoking and secondhand smoke", "reasoning": "Smoke irritates damaged lung tissue and impairs immune response"},
        ],
        "medications": [
            {"class": "Antibiotics (for bacterial pneumonia)", "reasoning": "Target and eliminate bacterial infection in the lungs"},
            {"class": "Antipyretics (fever reducers)", "reasoning": "Manage fever and associated discomfort"},
            {"class": "Cough suppressants (if needed)", "reasoning": "May help with rest, but productive cough should generally not be suppressed"},
        ],
        "referrals": ["Pulmonologist (if severe or recurrent)", "Infectious Disease Specialist (if atypical)"],
        "monitoring": [
            "Follow-up chest X-ray in 4-6 weeks",
            "Monitor oxygen saturation",
            "Track fever resolution (should improve within 48-72 hrs of treatment)",
            "Complete full course of prescribed antibiotics",
        ],
        "severity_adjustments": {
            "mild": "Outpatient management with oral antibiotics and supportive care",
            "moderate": "Consider short hospital observation; IV antibiotics if oral not tolerated",
            "severe": "Inpatient hospitalization; IV antibiotics; oxygen therapy; ICU if respiratory failure"
        }
    },

    "Asthma": {
        "lifestyle": [
            {"recommendation": "Identify and avoid triggers (allergens, smoke, cold air)", "reasoning": "Trigger avoidance is the foundation of asthma management"},
            {"recommendation": "Create an asthma action plan", "reasoning": "Written plan helps manage symptoms and recognize worsening"},
            {"recommendation": "Regular moderate exercise", "reasoning": "Improves lung capacity; warm up gradually to prevent exercise-induced symptoms"},
            {"recommendation": "Maintain clean indoor air (air purifier, no pets in bedroom)", "reasoning": "Reduces exposure to indoor allergens and irritants"},
        ],
        "medications": [
            {"class": "Inhaled corticosteroids (controller)", "reasoning": "Reduce airway inflammation and prevent exacerbations"},
            {"class": "Short-acting bronchodilators (rescue inhaler)", "reasoning": "Rapid relief of acute bronchospasm during attacks"},
            {"class": "Long-acting beta-agonists (if needed)", "reasoning": "Added to inhaled corticosteroids for better long-term control"},
        ],
        "referrals": ["Pulmonologist", "Allergist"],
        "monitoring": [
            "Peak flow meter monitoring at home",
            "Regular clinic visits every 3-6 months",
            "Annual pulmonary function testing",
            "Review inhaler technique at each visit",
        ],
        "severity_adjustments": {
            "mild": "Rescue inhaler as needed; consider low-dose inhaled corticosteroid",
            "moderate": "Daily inhaled corticosteroid + rescue inhaler",
            "severe": "High-dose inhaled corticosteroid + long-acting bronchodilator; consider biologic therapy"
        }
    },

    # ── Metabolic ────────────────────────────────────────────────────
    "Type 2 Diabetes": {
        "lifestyle": [
            {"recommendation": "Balanced diet with carbohydrate counting", "reasoning": "Carb management directly controls blood sugar spikes"},
            {"recommendation": "Regular exercise (150 min/week aerobic + resistance training)", "reasoning": "Exercise improves insulin sensitivity and glucose uptake"},
            {"recommendation": "Weight management (5-10% weight loss if overweight)", "reasoning": "Modest weight loss significantly improves glycemic control"},
            {"recommendation": "Blood glucose self-monitoring", "reasoning": "Empowers patients to understand how food, activity, and medication affect glucose"},
            {"recommendation": "Foot care and daily inspection", "reasoning": "Diabetes-related neuropathy increases risk of unnoticed foot injuries"},
        ],
        "medications": [
            {"class": "Metformin (first-line oral)", "reasoning": "Reduces hepatic glucose production; well-tolerated with cardiovascular benefits"},
            {"class": "SGLT2 inhibitors", "reasoning": "Lower blood sugar via renal glucose excretion; provide cardiac and kidney protection"},
            {"class": "GLP-1 receptor agonists", "reasoning": "Improve insulin secretion, slow gastric emptying, promote weight loss"},
            {"class": "Insulin therapy (if needed)", "reasoning": "Required when oral agents cannot maintain glycemic targets"},
        ],
        "referrals": ["Endocrinologist", "Certified Diabetes Educator", "Dietitian", "Ophthalmologist (annual eye exam)", "Podiatrist"],
        "monitoring": [
            "HbA1c every 3 months (target < 7% for most adults)",
            "Fasting glucose and post-meal glucose tracking",
            "Annual comprehensive metabolic panel",
            "Annual dilated eye exam",
            "Annual foot exam",
            "Regular kidney function monitoring (eGFR, urine albumin)",
        ],
        "severity_adjustments": {
            "mild": "Lifestyle modifications + metformin; target HbA1c < 7%",
            "moderate": "Dual oral therapy or add GLP-1 agonist; intensify lifestyle changes",
            "severe": "Multi-drug therapy including insulin; specialist-led management"
        }
    },

    # ── Mental Health ────────────────────────────────────────────────
    "Major Depressive Disorder": {
        "lifestyle": [
            {"recommendation": "Regular physical activity (30 min/day)", "reasoning": "Exercise releases endorphins and has proven antidepressant effects"},
            {"recommendation": "Maintain regular sleep schedule", "reasoning": "Sleep disruption worsens depressive symptoms; consistent sleep hygiene is critical"},
            {"recommendation": "Social engagement and support network", "reasoning": "Social isolation exacerbates depression; connection promotes recovery"},
            {"recommendation": "Structured daily routine", "reasoning": "Routine provides stability and a sense of purpose during depressive episodes"},
            {"recommendation": "Limit alcohol and substance use", "reasoning": "Alcohol is a depressant and can worsen symptoms and interfere with medications"},
        ],
        "medications": [
            {"class": "SSRIs (Selective Serotonin Reuptake Inhibitors)", "reasoning": "First-line pharmacotherapy; well-tolerated with favorable safety profile"},
            {"class": "SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)", "reasoning": "Alternative first-line option, especially for comorbid pain or anxiety"},
            {"class": "Psychotherapy (CBT, IPT)", "reasoning": "Evidence-based talk therapy is as effective as medication for mild-moderate depression"},
        ],
        "referrals": ["Psychiatrist", "Licensed Psychotherapist / Psychologist", "Social Worker (if social factors involved)"],
        "monitoring": [
            "PHQ-9 assessment every 2-4 weeks during treatment initiation",
            "Monitor for suicidal ideation at every visit",
            "Medication side effect assessment within first 2 weeks",
            "Follow-up within 1-2 weeks of starting medication",
            "Continue treatment for at least 6-12 months after remission",
        ],
        "severity_adjustments": {
            "mild": "Psychotherapy alone or with lifestyle modifications may be sufficient",
            "moderate": "Combination of psychotherapy and pharmacotherapy recommended",
            "severe": "Urgent psychiatric evaluation; pharmacotherapy + psychotherapy; assess for hospitalization if suicidal"
        }
    },

    "Generalized Anxiety Disorder": {
        "lifestyle": [
            {"recommendation": "Deep breathing exercises and progressive muscle relaxation", "reasoning": "Activates parasympathetic nervous system, reducing acute anxiety"},
            {"recommendation": "Regular aerobic exercise", "reasoning": "Exercise reduces anxiety sensitivity and improves stress resilience"},
            {"recommendation": "Limit caffeine and stimulant intake", "reasoning": "Caffeine can trigger and exacerbate anxiety symptoms"},
            {"recommendation": "Mindfulness meditation practice", "reasoning": "Mindfulness reduces rumination and worry, core features of GAD"},
            {"recommendation": "Maintain consistent sleep hygiene", "reasoning": "Poor sleep amplifies anxiety and impairs emotional regulation"},
        ],
        "medications": [
            {"class": "SSRIs / SNRIs (first-line)", "reasoning": "Effective for long-term anxiety reduction with manageable side effects"},
            {"class": "Buspirone", "reasoning": "Non-addictive anxiolytic specifically approved for GAD"},
            {"class": "Cognitive Behavioral Therapy (CBT)", "reasoning": "Gold-standard psychotherapy teaching coping techniques for worry and anxiety"},
        ],
        "referrals": ["Psychiatrist", "Psychologist (CBT-trained)", "Licensed Counselor"],
        "monitoring": [
            "GAD-7 assessment every 2-4 weeks during treatment",
            "Monitor for medication side effects",
            "Assess functional impairment and quality of life",
            "Regular follow-up to adjust treatment plan",
        ],
        "severity_adjustments": {
            "mild": "Psychotherapy (CBT) and lifestyle modifications as initial approach",
            "moderate": "Pharmacotherapy + psychotherapy combination recommended",
            "severe": "Psychiatric evaluation; aggressive pharmacotherapy; consider short-term benzodiazepine for acute management"
        }
    },

    # ── Default / Generic ────────────────────────────────────────────
    "General": {
        "lifestyle": [
            {"recommendation": "Balanced nutrition with adequate fruits and vegetables", "reasoning": "Proper nutrition supports immune function and overall health"},
            {"recommendation": "Regular physical activity", "reasoning": "Exercise improves cardiovascular health, mood, and longevity"},
            {"recommendation": "Adequate sleep (7-9 hours/night)", "reasoning": "Sleep is essential for immune function, cognitive health, and tissue repair"},
            {"recommendation": "Stay hydrated", "reasoning": "Proper hydration supports all bodily functions"},
            {"recommendation": "Regular preventive health checkups", "reasoning": "Early detection of conditions improves treatment outcomes"},
        ],
        "medications": [
            {"class": "Consult your healthcare provider", "reasoning": "Specific medications should be determined based on your diagnosis and medical history"},
        ],
        "referrals": ["General Practitioner / Primary Care Physician"],
        "monitoring": [
            "Annual physical examination",
            "Age-appropriate health screenings",
            "Regular vital sign monitoring",
        ],
        "severity_adjustments": {
            "mild": "Focus on lifestyle modifications and self-care measures",
            "moderate": "Schedule appointment with healthcare provider for evaluation",
            "severe": "Seek prompt medical evaluation; do not delay care"
        }
    }
}


def get_treatment_plan(condition: str, severity: str = "moderate", age: int = None, sex: str = None, comorbidities: list = None):
    """
    Generate a personalized treatment plan for a given condition.
    
    Args:
        condition: Name of the condition (must match TREATMENT_DATABASE keys or 'General')
        severity: 'mild', 'moderate', or 'severe'
        age: Patient age for age-specific adjustments
        sex: Patient sex for sex-specific adjustments
        comorbidities: List of comorbid conditions for interaction checking
    
    Returns:
        Dictionary with the full treatment recommendation
    """
    # Look up condition in database; fall back to 'General' if not found
    protocol = TREATMENT_DATABASE.get(condition, TREATMENT_DATABASE["General"])
    
    # Build base plan
    plan = {
        "condition": condition,
        "severity": severity,
        "lifestyle_modifications": protocol["lifestyle"],
        "medication_classes": protocol["medications"],
        "specialist_referrals": protocol["referrals"],
        "monitoring_plan": protocol["monitoring"],
        "severity_note": protocol["severity_adjustments"].get(severity, protocol["severity_adjustments"]["moderate"]),
    }
    
    # Age-specific adjustments
    age_notes = []
    if age is not None:
        if age >= 65:
            age_notes.append("For patients 65+: Start medications at lower doses and titrate slowly. Monitor for fall risk with blood pressure medications.")
            age_notes.append("Ensure bone density screening and fall prevention measures are in place.")
        elif age < 18:
            age_notes.append("Pediatric patient: Treatment dosing and approach may differ. Consult a pediatric specialist.")
        if age >= 45:
            age_notes.append("Consider cardiovascular risk screening (lipid panel, glucose) if not recently performed.")
    
    # Sex-specific notes
    sex_notes = []
    if sex:
        sex_lower = sex.lower()
        if sex_lower in ["female", "f"]:
            sex_notes.append("Discuss pregnancy considerations if applicable, as some medications are contraindicated during pregnancy.")
            if age and 40 <= age <= 55:
                sex_notes.append("Consider perimenopause/menopause status which may affect symptoms and treatment response.")
        elif sex_lower in ["male", "m"]:
            if age and age >= 50:
                sex_notes.append("Consider prostate health screening in conjunction with overall care plan.")
    
    # Comorbidity interactions
    comorbidity_notes = []
    if comorbidities:
        comorb_lower = [c.lower() for c in comorbidities]
        if "diabetes" in comorb_lower or "type 2 diabetes" in comorb_lower:
            comorbidity_notes.append("Diabetes comorbidity: Monitor blood glucose closely; some medications may affect glycemic control.")
        if "hypertension" in comorb_lower:
            comorbidity_notes.append("Hypertension comorbidity: Ensure blood pressure is monitored regularly; avoid medications that may raise BP.")
        if "kidney disease" in comorb_lower or "chronic kidney disease" in comorb_lower:
            comorbidity_notes.append("Kidney disease: Medication dosing adjustments may be required based on renal function (eGFR).")
        if "heart disease" in comorb_lower or "coronary artery disease" in comorb_lower:
            comorbidity_notes.append("Cardiac comorbidity: Consider cardiovascular risk with all treatment decisions.")
        if "depression" in comorb_lower or "anxiety" in comorb_lower:
            comorbidity_notes.append("Mental health comorbidity: Integrated care addressing both physical and mental health is recommended.")
    
    plan["age_specific_notes"] = age_notes
    plan["sex_specific_notes"] = sex_notes
    plan["comorbidity_notes"] = comorbidity_notes
    
    plan["disclaimer"] = (
        "IMPORTANT: This treatment plan is generated by an AI system for educational and informational purposes only. "
        "It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your "
        "physician or other qualified health provider with any questions you may have regarding a medical condition."
    )
    
    return plan
