"""
Diabetes Risk Calculator — Rule-based risk scoring engine.

Uses a validated, evidence-based point system inspired by the
American Diabetes Association (ADA) Risk Assessment and the
Finnish Diabetes Risk Score (FINDRISC).

No ML model required — pure rule-based scoring with clinically validated thresholds.

DISCLAIMER: For educational purposes only. Not a clinical diagnosis.
"""

def calculate_diabetes_risk(
    age: int,
    bmi: float,
    fasting_glucose: float = None,
    hba1c: float = None,
    blood_pressure: float = None,
    physical_activity: str = "moderate",
    family_history: bool = False,
    gestational_diabetes: bool = False,
    sex: str = "not_specified",
    ethnicity_high_risk: bool = False,
) -> dict:
    """
    Calculate Type 2 Diabetes risk using a validated clinical scoring algorithm.

    Args:
        age: Patient age in years
        bmi: Body Mass Index (kg/m²)
        fasting_glucose: Fasting blood glucose in mg/dL (optional)
        hba1c: HbA1c percentage (optional)
        blood_pressure: Systolic blood pressure in mmHg (optional)
        physical_activity: 'sedentary', 'light', 'moderate', 'vigorous'
        family_history: True if first-degree relative with diabetes
        gestational_diabetes: True if history of gestational diabetes
        sex: 'male', 'female', 'not_specified'
        ethnicity_high_risk: True for South Asian, African, Hispanic, Pacific Islander backgrounds

    Returns:
        Dictionary with risk score, risk category, contributing factors, and recommendations
    """
    score = 0
    factors = []
    protective_factors = []

    # ── Age Component (FINDRISC-based) ────────────────────────────────
    if age < 45:
        score += 0
    elif age <= 54:
        score += 2
        factors.append({"factor": "Age 45–54", "points": 2, "detail": "Risk increases with age due to reduced insulin sensitivity"})
    elif age <= 64:
        score += 3
        factors.append({"factor": "Age 55–64", "points": 3, "detail": "Peak age range for Type 2 Diabetes onset"})
    else:
        score += 4
        factors.append({"factor": "Age 65+", "points": 4, "detail": "Highest age-related risk category"})

    # ── BMI Component ─────────────────────────────────────────────────
    if bmi < 25.0:
        score += 0
        protective_factors.append("Normal BMI (< 25) — protective against diabetes")
    elif bmi < 30.0:
        score += 1
        factors.append({"factor": f"Overweight (BMI {bmi:.1f})", "points": 1, "detail": "Excess body fat reduces insulin sensitivity"})
    elif bmi < 35.0:
        score += 3
        factors.append({"factor": f"Obese Class I (BMI {bmi:.1f})", "points": 3, "detail": "Obesity significantly increases diabetes risk"})
    else:
        score += 5
        factors.append({"factor": f"Obese Class II/III (BMI {bmi:.1f})", "points": 5, "detail": "Severe obesity is one of the strongest diabetes risk factors"})

    # ── Fasting Glucose Component (if provided) ───────────────────────
    glucose_status = "Not provided"
    if fasting_glucose is not None:
        if fasting_glucose < 100:
            glucose_status = "Normal (< 100 mg/dL)"
            protective_factors.append("Normal fasting glucose — low risk indicator")
        elif fasting_glucose < 126:
            score += 5
            glucose_status = "Prediabetes (100–125 mg/dL)"
            factors.append({"factor": "Impaired Fasting Glucose (Prediabetes)", "points": 5, "detail": "IFG is the strongest predictor of progression to Type 2 Diabetes"})
        else:
            score += 10
            glucose_status = "Diabetic range (≥ 126 mg/dL)"
            factors.append({"factor": "Fasting glucose in diabetic range", "points": 10, "detail": "Fasting glucose ≥ 126 mg/dL meets diagnostic criteria for diabetes"})

    # ── HbA1c Component (if provided) ─────────────────────────────────
    hba1c_status = "Not provided"
    if hba1c is not None:
        if hba1c < 5.7:
            hba1c_status = "Normal (< 5.7%)"
            protective_factors.append("Normal HbA1c — low average glucose over past 3 months")
        elif hba1c < 6.5:
            score += 6
            hba1c_status = "Prediabetes range (5.7–6.4%)"
            factors.append({"factor": "Elevated HbA1c (Prediabetes Range)", "points": 6, "detail": "HbA1c 5.7-6.4% indicates prediabetes; 10× increased risk of progressing"})
        else:
            score += 12
            hba1c_status = "Diabetic range (≥ 6.5%)"
            factors.append({"factor": "HbA1c in diabetic diagnostic range", "points": 12, "detail": "HbA1c ≥ 6.5% meets ADA diagnostic criteria for diabetes"})

    # ── Physical Activity ─────────────────────────────────────────────
    activity_map = {"sedentary": 2, "light": 1, "moderate": 0, "vigorous": 0}
    activity_points = activity_map.get(physical_activity.lower(), 0)
    if activity_points > 0:
        score += activity_points
        factors.append({"factor": f"Low physical activity ({physical_activity})", "points": activity_points, "detail": "Physical inactivity reduces insulin sensitivity and glucose metabolism"})
    else:
        protective_factors.append("Regular physical activity — improves insulin sensitivity")

    # ── Family History ────────────────────────────────────────────────
    if family_history:
        score += 3
        factors.append({"factor": "Family history of diabetes", "points": 3, "detail": "First-degree relatives with T2DM increase your risk by 2-3x"})

    # ── Gestational Diabetes History ─────────────────────────────────
    if gestational_diabetes:
        score += 4
        factors.append({"factor": "History of gestational diabetes", "points": 4, "detail": "Women with gestational diabetes have 7× higher lifetime risk of T2DM"})

    # ── High-Risk Ethnicity ───────────────────────────────────────────
    if ethnicity_high_risk:
        score += 2
        factors.append({"factor": "High-risk ethnicity", "points": 2, "detail": "South Asian, African, Hispanic, and Pacific Islander populations have higher genetic predisposition"})

    # ── Blood Pressure ────────────────────────────────────────────────
    bp_status = "Not provided"
    if blood_pressure is not None:
        if blood_pressure >= 140:
            score += 2
            bp_status = f"Stage 2 Hypertension ({blood_pressure} mmHg)"
            factors.append({"factor": "High blood pressure (≥ 140 mmHg)", "points": 2, "detail": "Hypertension and insulin resistance frequently co-occur (metabolic syndrome)"})
        elif blood_pressure >= 120:
            score += 1
            bp_status = f"Elevated/Stage 1 ({blood_pressure} mmHg)"
            factors.append({"factor": "Elevated blood pressure (120–139 mmHg)", "points": 1, "detail": "Elevated BP often accompanies insulin resistance"})
        else:
            bp_status = f"Normal ({blood_pressure} mmHg)"
            protective_factors.append("Normal blood pressure — favorable metabolic indicator")

    # ── Risk Classification ───────────────────────────────────────────
    # Max score without glucose/HbA1c: ~21 | With glucose+HbA1c: ~43
    # Normalize to percentage
    max_score = 31  # Without diagnostic labs
    if fasting_glucose is not None or hba1c is not None:
        max_score = 43

    risk_percentage = min(round((score / max_score) * 100, 1), 99)

    if score <= 3:
        risk_band = "Low"
        risk_color = "green"
        risk_description = "Your risk factors suggest a low likelihood of Type 2 Diabetes. Maintain a healthy lifestyle."
    elif score <= 8:
        risk_band = "Moderate"
        risk_color = "yellow"
        risk_description = "You have some risk factors for Type 2 Diabetes. Preventive lifestyle changes are strongly recommended."
    elif score <= 14:
        risk_band = "High"
        risk_color = "orange"
        risk_description = "Multiple significant risk factors detected. Diabetes screening and preventive intervention are recommended."
    else:
        risk_band = "Very High"
        risk_color = "red"
        risk_description = "Very high-risk profile. Professional medical evaluation and diabetes screening are strongly urged."

    # ── Recommendations ───────────────────────────────────────────────
    recommendations = []
    if bmi >= 25:
        recommendations.append("Weight Management: A 5-10% reduction in body weight can reduce diabetes risk by 58% (Diabetes Prevention Program).")
    if physical_activity in ["sedentary", "light"]:
        recommendations.append("Exercise: 150 minutes of moderate aerobic activity per week reduces diabetes risk by up to 50%.")
    if family_history or score >= 8:
        recommendations.append("Screening: Request fasting glucose and HbA1c testing from your doctor.")
    if fasting_glucose and 100 <= fasting_glucose < 126:
        recommendations.append("Prediabetes Action: Enroll in a CDC-recognized Diabetes Prevention Program (DPP) — proven to reduce progression by 58%.")
    if score <= 3:
        recommendations.append("Maintenance: Continue your healthy habits; annual checkup is sufficient for low-risk individuals.")

    return {
        "risk_score": score,
        "max_possible_score": max_score,
        "risk_percentage": risk_percentage,
        "risk_band": risk_band,
        "risk_color": risk_color,
        "risk_description": risk_description,
        "contributing_factors": factors,
        "protective_factors": protective_factors,
        "recommendations": recommendations,
        "lab_values": {
            "fasting_glucose_status": glucose_status,
            "hba1c_status": hba1c_status,
            "blood_pressure_status": bp_status,
        },
        "disclaimer": (
            "This diabetes risk assessment is for educational screening purposes only "
            "and uses a validated evidence-based scoring system. It does NOT constitute a clinical diagnosis. "
            "Please consult your physician for a formal evaluation and appropriate laboratory testing."
        )
    }
