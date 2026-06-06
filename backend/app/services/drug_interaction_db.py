"""
Drug-Drug and Food-Drug Interaction Knowledge Base.

Covers 50+ clinically significant interactions across major drug classes.
Severity levels: mild / moderate / severe / contraindicated

DISCLAIMER: For educational/informational purposes only.
Always consult a licensed pharmacist or physician for actual drug safety.
"""

# ── Drug Class Definitions ─────────────────────────────────────────────
DRUG_CLASSES = {
    # Cardiovascular
    "warfarin": "Anticoagulant",
    "aspirin": "Antiplatelet / NSAID",
    "ibuprofen": "NSAID",
    "naproxen": "NSAID",
    "diclofenac": "NSAID",
    "lisinopril": "ACE Inhibitor",
    "ramipril": "ACE Inhibitor",
    "losartan": "ARB",
    "valsartan": "ARB",
    "atorvastatin": "Statin",
    "simvastatin": "Statin",
    "rosuvastatin": "Statin",
    "metoprolol": "Beta-Blocker",
    "atenolol": "Beta-Blocker",
    "carvedilol": "Beta-Blocker",
    "amlodipine": "Calcium Channel Blocker",
    "diltiazem": "Calcium Channel Blocker",
    "verapamil": "Calcium Channel Blocker",
    "furosemide": "Loop Diuretic",
    "hydrochlorothiazide": "Thiazide Diuretic",
    "spironolactone": "Potassium-Sparing Diuretic",
    "digoxin": "Cardiac Glycoside",
    "amiodarone": "Antiarrhythmic",
    "clopidogrel": "Antiplatelet",

    # Diabetes
    "metformin": "Biguanide (Diabetes)",
    "glipizide": "Sulfonylurea",
    "glibenclamide": "Sulfonylurea",
    "insulin": "Insulin",
    "sitagliptin": "DPP-4 Inhibitor",
    "empagliflozin": "SGLT2 Inhibitor",

    # Antibiotics
    "amoxicillin": "Penicillin Antibiotic",
    "ciprofloxacin": "Fluoroquinolone Antibiotic",
    "clarithromycin": "Macrolide Antibiotic",
    "azithromycin": "Macrolide Antibiotic",
    "doxycycline": "Tetracycline Antibiotic",
    "metronidazole": "Nitroimidazole Antibiotic",
    "rifampin": "Rifamycin Antibiotic",
    "trimethoprim": "Antifolate Antibiotic",

    # Mental Health
    "sertraline": "SSRI Antidepressant",
    "fluoxetine": "SSRI Antidepressant",
    "paroxetine": "SSRI Antidepressant",
    "escitalopram": "SSRI Antidepressant",
    "venlafaxine": "SNRI Antidepressant",
    "duloxetine": "SNRI Antidepressant",
    "lithium": "Mood Stabilizer",
    "haloperidol": "Antipsychotic",
    "quetiapine": "Antipsychotic",
    "alprazolam": "Benzodiazepine",
    "lorazepam": "Benzodiazepine",
    "diazepam": "Benzodiazepine",
    "phenelzine": "MAOI Antidepressant",
    "tranylcypromine": "MAOI Antidepressant",
    "tramadol": "Opioid Analgesic",
    "codeine": "Opioid Analgesic",
    "morphine": "Opioid Analgesic",

    # Other
    "omeprazole": "Proton Pump Inhibitor",
    "pantoprazole": "Proton Pump Inhibitor",
    "ranitidine": "H2 Blocker",
    "prednisone": "Corticosteroid",
    "prednisolone": "Corticosteroid",
    "levothyroxine": "Thyroid Hormone",
    "allopurinol": "Xanthine Oxidase Inhibitor",
    "colchicine": "Gout Treatment",
    "sildenafil": "PDE5 Inhibitor",
    "tadalafil": "PDE5 Inhibitor",
    "theophylline": "Bronchodilator",
    "phenytoin": "Anticonvulsant",
    "carbamazepine": "Anticonvulsant",
    "valproate": "Anticonvulsant / Mood Stabilizer",
}

# ── Drug-Drug Interactions ─────────────────────────────────────────────
DRUG_DRUG_INTERACTIONS = [
    {
        "drug_a": "warfarin",
        "drug_b": "aspirin",
        "severity": "severe",
        "effect": "Significantly increased bleeding risk",
        "mechanism": "Both inhibit clotting pathways; aspirin also irritates gastric mucosa",
        "recommendation": "Avoid combination unless directed by cardiologist; monitor INR closely if used together",
        "references": "ACC/AHA Guidelines on Anticoagulation"
    },
    {
        "drug_a": "warfarin",
        "drug_b": "ibuprofen",
        "severity": "severe",
        "effect": "Markedly elevated bleeding risk, especially GI bleeding",
        "mechanism": "NSAIDs inhibit platelet function and displace warfarin from protein binding",
        "recommendation": "Avoid NSAIDs with warfarin; use acetaminophen for pain if needed",
        "references": "FDA Drug Safety Communication"
    },
    {
        "drug_a": "warfarin",
        "drug_b": "amiodarone",
        "severity": "severe",
        "effect": "Greatly increased anticoagulant effect and bleeding risk",
        "mechanism": "Amiodarone inhibits CYP2C9, the primary enzyme metabolizing warfarin",
        "recommendation": "Reduce warfarin dose by 30-50% when starting amiodarone; monitor INR weekly",
        "references": "Clinical Pharmacokinetics Guidelines"
    },
    {
        "drug_a": "warfarin",
        "drug_b": "clarithromycin",
        "severity": "moderate",
        "effect": "Increased warfarin effect and bleeding risk",
        "mechanism": "Clarithromycin inhibits CYP3A4 and alters gut flora that produces Vitamin K",
        "recommendation": "Monitor INR closely during antibiotic course and for 1 week after",
        "references": "British National Formulary"
    },
    {
        "drug_a": "warfarin",
        "drug_b": "rifampin",
        "severity": "severe",
        "effect": "Dramatically reduced warfarin efficacy (increased clot risk)",
        "mechanism": "Rifampin is a potent CYP inducer that accelerates warfarin metabolism",
        "recommendation": "Avoid combination; if necessary, increase warfarin dose 2-5x with close INR monitoring",
        "references": "Clinical Pharmacokinetics"
    },
    {
        "drug_a": "simvastatin",
        "drug_b": "amiodarone",
        "severity": "severe",
        "effect": "Increased risk of myopathy and rhabdomyolysis (muscle breakdown)",
        "mechanism": "Amiodarone inhibits CYP3A4, markedly increasing simvastatin plasma levels",
        "recommendation": "Limit simvastatin to 20 mg/day with amiodarone; consider switching to rosuvastatin",
        "references": "FDA Safety Communication 2011"
    },
    {
        "drug_a": "simvastatin",
        "drug_b": "clarithromycin",
        "severity": "severe",
        "effect": "High risk of rhabdomyolysis",
        "mechanism": "Clarithromycin inhibits CYP3A4, causing toxic simvastatin accumulation",
        "recommendation": "Hold simvastatin during clarithromycin course; restart after antibiotic is complete",
        "references": "FDA Drug Interactions Table"
    },
    {
        "drug_a": "atorvastatin",
        "drug_b": "clarithromycin",
        "severity": "moderate",
        "effect": "Increased atorvastatin levels, elevated myopathy risk",
        "mechanism": "CYP3A4 inhibition by clarithromycin",
        "recommendation": "Use lowest effective atorvastatin dose; monitor for muscle pain/weakness",
        "references": "Clinical Pharmacokinetics"
    },
    {
        "drug_a": "lisinopril",
        "drug_b": "spironolactone",
        "severity": "moderate",
        "effect": "Dangerous hyperkalemia (elevated blood potassium)",
        "mechanism": "Both ACE inhibitors and potassium-sparing diuretics increase potassium retention",
        "recommendation": "Monitor potassium levels regularly; avoid in patients with CKD or baseline hyperkalemia",
        "references": "NEJM Clinical Review"
    },
    {
        "drug_a": "lisinopril",
        "drug_b": "ibuprofen",
        "severity": "moderate",
        "effect": "Reduced antihypertensive efficacy and risk of acute kidney injury",
        "mechanism": "NSAIDs reduce renal prostaglandins, counteracting ACE inhibitor vasodilation",
        "recommendation": "Avoid NSAIDs in patients on ACE inhibitors; use acetaminophen for pain",
        "references": "AHA Hypertension Guidelines"
    },
    {
        "drug_a": "metformin",
        "drug_b": "furosemide",
        "severity": "moderate",
        "effect": "Increased risk of lactic acidosis with dehydration",
        "mechanism": "Furosemide-induced dehydration impairs renal excretion of metformin",
        "recommendation": "Ensure adequate hydration; monitor renal function; hold metformin if contrast dye given",
        "references": "ADA Standards of Medical Care"
    },
    {
        "drug_a": "metformin",
        "drug_b": "alcohol",
        "severity": "severe",
        "effect": "Increased risk of lactic acidosis",
        "mechanism": "Alcohol impairs hepatic lactate metabolism; combined with metformin raises lactate to dangerous levels",
        "recommendation": "Advise patients to limit alcohol to ≤2 drinks/day; avoid binge drinking entirely",
        "references": "FDA Metformin Label"
    },
    {
        "drug_a": "glipizide",
        "drug_b": "fluconazole",
        "severity": "severe",
        "effect": "Severe hypoglycemia",
        "mechanism": "Fluconazole inhibits CYP2C9, drastically increasing sulfonylurea blood levels",
        "recommendation": "Use alternative antifungal or reduce sulfonylurea dose; monitor glucose closely",
        "references": "Clinical Pharmacokinetics"
    },
    {
        "drug_a": "sertraline",
        "drug_b": "tramadol",
        "severity": "severe",
        "effect": "Serotonin syndrome risk",
        "mechanism": "SSRIs + tramadol both increase serotonin; combined effect can cause life-threatening hyperthermia",
        "recommendation": "Avoid combination; use non-opioid analgesics or monitor very closely",
        "references": "FDA Drug Safety Communication 2010"
    },
    {
        "drug_a": "fluoxetine",
        "drug_b": "phenelzine",
        "severity": "contraindicated",
        "effect": "Life-threatening serotonin syndrome or hypertensive crisis",
        "mechanism": "SSRI + MAOI combination causes massive serotonin accumulation",
        "recommendation": "ABSOLUTE CONTRAINDICATION — do not use together; require 14-day washout between classes",
        "references": "FDA Black Box Warning"
    },
    {
        "drug_a": "sertraline",
        "drug_b": "phenelzine",
        "severity": "contraindicated",
        "effect": "Life-threatening serotonin syndrome",
        "mechanism": "SSRI + MAOI combination",
        "recommendation": "ABSOLUTE CONTRAINDICATION — requires 14-day washout period",
        "references": "FDA Black Box Warning"
    },
    {
        "drug_a": "alprazolam",
        "drug_b": "codeine",
        "severity": "severe",
        "effect": "Profound CNS depression, respiratory arrest risk",
        "mechanism": "Additive CNS depressant effects between benzodiazepines and opioids",
        "recommendation": "Avoid combination; FDA Black Box Warning for combined use; if necessary, use lowest doses with respiratory monitoring",
        "references": "FDA Black Box Warning 2016"
    },
    {
        "drug_a": "diazepam",
        "drug_b": "morphine",
        "severity": "severe",
        "effect": "Severe respiratory depression, risk of death",
        "mechanism": "Benzodiazepine + opioid CNS/respiratory depression synergy",
        "recommendation": "Avoid combination; FDA Black Box Warning; if absolutely necessary, limit doses and duration",
        "references": "FDA Black Box Warning 2016"
    },
    {
        "drug_a": "lithium",
        "drug_b": "ibuprofen",
        "severity": "severe",
        "effect": "Lithium toxicity (tremor, confusion, kidney damage)",
        "mechanism": "NSAIDs reduce renal lithium clearance, causing toxic accumulation",
        "recommendation": "Avoid NSAIDs with lithium; if pain required, use acetaminophen; monitor lithium levels",
        "references": "British National Formulary"
    },
    {
        "drug_a": "lithium",
        "drug_b": "hydrochlorothiazide",
        "severity": "severe",
        "effect": "Lithium toxicity from sodium depletion",
        "mechanism": "Thiazides cause sodium loss, causing compensatory lithium reabsorption",
        "recommendation": "Monitor lithium levels closely; may need dose reduction; ensure adequate sodium intake",
        "references": "Clinical Pharmacology Review"
    },
    {
        "drug_a": "digoxin",
        "drug_b": "amiodarone",
        "severity": "severe",
        "effect": "Digoxin toxicity (nausea, arrhythmias, vision changes)",
        "mechanism": "Amiodarone inhibits P-glycoprotein and renal excretion of digoxin",
        "recommendation": "Reduce digoxin dose by 50% when starting amiodarone; monitor digoxin levels",
        "references": "ACC/AHA Heart Failure Guidelines"
    },
    {
        "drug_a": "clopidogrel",
        "drug_b": "omeprazole",
        "severity": "moderate",
        "effect": "Reduced antiplatelet effect of clopidogrel",
        "mechanism": "Omeprazole inhibits CYP2C19, reducing conversion of clopidogrel to active form",
        "recommendation": "Consider pantoprazole instead of omeprazole; pantoprazole has less CYP2C19 inhibition",
        "references": "FDA Drug Safety Communication 2009"
    },
    {
        "drug_a": "sildenafil",
        "drug_b": "nitrates",
        "severity": "contraindicated",
        "effect": "Severe, potentially fatal hypotension",
        "mechanism": "Both cause vasodilation via different pathways; combined effect is synergistically dangerous",
        "recommendation": "ABSOLUTE CONTRAINDICATION — do not use together under any circumstances",
        "references": "FDA Black Box Warning"
    },
    {
        "drug_a": "levothyroxine",
        "drug_b": "calcium",
        "severity": "moderate",
        "effect": "Reduced levothyroxine absorption",
        "mechanism": "Calcium binds to levothyroxine in the GI tract, reducing its absorption",
        "recommendation": "Take levothyroxine 4 hours apart from calcium supplements",
        "references": "ATA Hypothyroidism Guidelines"
    },
    {
        "drug_a": "carbamazepine",
        "drug_b": "oral contraceptives",
        "severity": "moderate",
        "effect": "Reduced contraceptive effectiveness (pregnancy risk)",
        "mechanism": "Carbamazepine induces CYP3A4, accelerating metabolism of estrogens/progestins",
        "recommendation": "Use additional barrier contraception; consider alternative contraceptive methods",
        "references": "WHO Medical Eligibility Criteria"
    },
    {
        "drug_a": "valproate",
        "drug_b": "carbamazepine",
        "severity": "moderate",
        "effect": "Altered levels of both drugs; potential neurotoxicity",
        "mechanism": "Complex pharmacokinetic interaction with mutual enzyme induction/inhibition",
        "recommendation": "Monitor drug levels closely; neurologist-supervised dosing adjustment required",
        "references": "Epilepsy Foundation Guidelines"
    },
    {
        "drug_a": "theophylline",
        "drug_b": "ciprofloxacin",
        "severity": "severe",
        "effect": "Theophylline toxicity (nausea, seizures, arrhythmias)",
        "mechanism": "Ciprofloxacin inhibits CYP1A2, drastically increasing theophylline levels",
        "recommendation": "Reduce theophylline dose by 30-50% or use alternative antibiotic; monitor theophylline levels",
        "references": "Clinical Pharmacokinetics"
    },
    {
        "drug_a": "allopurinol",
        "drug_b": "azathioprine",
        "severity": "severe",
        "effect": "Severe bone marrow suppression",
        "mechanism": "Allopurinol inhibits xanthine oxidase, causing toxic azathioprine accumulation",
        "recommendation": "Avoid combination or reduce azathioprine dose by 75%; monitor CBC closely",
        "references": "Rheumatology Guidelines"
    },
    {
        "drug_a": "prednisone",
        "drug_b": "ibuprofen",
        "severity": "moderate",
        "effect": "Significantly increased GI ulcer and bleeding risk",
        "mechanism": "Both independently damage gastric mucosa; combined risk is multiplicative",
        "recommendation": "Avoid NSAIDs with corticosteroids; add PPI (omeprazole) if both must be used",
        "references": "ACR Clinical Guidelines"
    },
    {
        "drug_a": "metronidazole",
        "drug_b": "alcohol",
        "severity": "severe",
        "effect": "Disulfiram-like reaction (flushing, vomiting, severe nausea, palpitations)",
        "mechanism": "Metronidazole inhibits aldehyde dehydrogenase, causing toxic acetaldehyde accumulation",
        "recommendation": "AVOID all alcohol during metronidazole course and for 48 hours after completion",
        "references": "FDA Metronidazole Label"
    },
    {
        "drug_a": "phenytoin",
        "drug_b": "warfarin",
        "severity": "severe",
        "effect": "Variable: initially increased warfarin effect, then reduced efficacy",
        "mechanism": "Complex biphasic CYP interaction — initial inhibition then induction",
        "recommendation": "Monitor INR very closely; frequent dose adjustments needed; consult specialist",
        "references": "Clinical Pharmacokinetics"
    },
]

# ── Food-Drug Interactions ─────────────────────────────────────────────
FOOD_DRUG_INTERACTIONS = [
    {
        "food": "Grapefruit / Grapefruit Juice",
        "drugs_affected": ["simvastatin", "atorvastatin", "amlodipine", "alprazolam", "sildenafil"],
        "severity": "moderate",
        "effect": "Markedly increased drug blood levels and side effects",
        "mechanism": "Grapefruit contains furanocoumarins that irreversibly inhibit CYP3A4 in the gut",
        "recommendation": "Avoid grapefruit and grapefruit juice while on these medications",
    },
    {
        "food": "Tyramine-rich foods (aged cheese, cured meats, red wine, soy sauce)",
        "drugs_affected": ["phenelzine", "tranylcypromine"],
        "severity": "severe",
        "effect": "Hypertensive crisis (severe, dangerous blood pressure spike)",
        "mechanism": "MAOIs prevent tyramine breakdown; excess tyramine triggers massive norepinephrine release",
        "recommendation": "Strict dietary restriction of tyramine-containing foods with MAOI therapy",
    },
    {
        "food": "High-fat meals",
        "drugs_affected": ["atorvastatin", "rosuvastatin"],
        "severity": "mild",
        "effect": "Reduced statin absorption",
        "mechanism": "High dietary fat alters gastric emptying and drug absorption",
        "recommendation": "Take statins at a consistent time regardless of meals; evening dosing preferred",
    },
    {
        "food": "Dairy products (milk, calcium-rich foods)",
        "drugs_affected": ["ciprofloxacin", "doxycycline", "levothyroxine"],
        "severity": "moderate",
        "effect": "Significantly reduced drug absorption",
        "mechanism": "Calcium ions chelate (bind) these drugs in the GI tract",
        "recommendation": "Take ciprofloxacin/doxycycline 2 hours before or 6 hours after dairy; levothyroxine 4 hours before/after",
    },
    {
        "food": "Vitamin K-rich foods (leafy greens: spinach, kale, broccoli)",
        "drugs_affected": ["warfarin"],
        "severity": "moderate",
        "effect": "Reduced anticoagulant efficacy of warfarin",
        "mechanism": "Vitamin K competes with warfarin's mechanism of action on clotting factors",
        "recommendation": "Maintain consistent (not zero) leafy green intake; avoid sudden large changes in consumption",
    },
    {
        "food": "Alcohol",
        "drugs_affected": ["metronidazole", "metformin", "alprazolam", "sertraline", "warfarin"],
        "severity": "severe",
        "effect": "Varies: disulfiram reaction, lactic acidosis, CNS depression, increased bleeding",
        "mechanism": "Alcohol affects drug metabolism and has additive pharmacological effects",
        "recommendation": "Avoid alcohol with these medications; consult your pharmacist for specifics",
    },
    {
        "food": "Licorice (glycyrrhizin)",
        "drugs_affected": ["hydrochlorothiazide", "furosemide"],
        "severity": "mild",
        "effect": "Increased potassium loss and worsened hypertension",
        "mechanism": "Glycyrrhizin has mineralocorticoid-like effects that promote sodium retention",
        "recommendation": "Avoid excessive licorice candy or supplements with diuretics",
    },
    {
        "food": "St. John's Wort (herbal supplement)",
        "drugs_affected": ["sertraline", "fluoxetine", "warfarin", "oral contraceptives"],
        "severity": "severe",
        "effect": "Serotonin syndrome risk (with antidepressants); reduced drug efficacy (warfarin, contraceptives)",
        "mechanism": "Potent CYP inducer and serotonergic activity",
        "recommendation": "Avoid St. John's Wort with any prescription medication; inform your doctor of all supplements",
    },
]


def check_interactions(drug_list: list) -> dict:
    """
    Check for drug-drug interactions among a list of drug names.

    Args:
        drug_list: List of drug name strings (lowercased)

    Returns:
        Dictionary with interaction findings
    """
    drug_list_lower = [d.lower().strip() for d in drug_list]

    found_interactions = []
    severity_order = {"mild": 1, "moderate": 2, "severe": 3, "contraindicated": 4}

    # Check all pairs
    for i in range(len(drug_list_lower)):
        for j in range(i + 1, len(drug_list_lower)):
            d1 = drug_list_lower[i]
            d2 = drug_list_lower[j]

            for interaction in DRUG_DRUG_INTERACTIONS:
                a = interaction["drug_a"].lower()
                b = interaction["drug_b"].lower()
                if (d1 == a and d2 == b) or (d1 == b and d2 == a):
                    found_interactions.append({
                        **interaction,
                        "drug_a_class": DRUG_CLASSES.get(interaction["drug_a"], "Unknown"),
                        "drug_b_class": DRUG_CLASSES.get(interaction["drug_b"], "Unknown"),
                    })

    # Check food interactions
    food_alerts = []
    for fi in FOOD_DRUG_INTERACTIONS:
        affected = [d.lower() for d in fi["drugs_affected"]]
        matched_drugs = [d for d in drug_list_lower if d in affected]
        if matched_drugs:
            food_alerts.append({
                **fi,
                "matched_drugs": matched_drugs,
            })

    # Overall safety level
    if not found_interactions and not food_alerts:
        overall = "safe"
        summary = "No significant drug-drug interactions found among the entered medications."
    else:
        max_sev = max(
            (severity_order.get(i["severity"], 0) for i in found_interactions),
            default=0
        )
        if max_sev == 4:
            overall = "contraindicated"
            summary = "⚠️ CRITICAL: One or more absolute contraindications detected. Seek immediate pharmacist/physician review."
        elif max_sev == 3:
            overall = "severe"
            summary = "High-severity interactions detected. Medical review is strongly recommended before continuing this combination."
        elif max_sev == 2:
            overall = "moderate"
            summary = "Moderate interactions found. Consult your pharmacist or doctor about these combinations."
        else:
            overall = "mild"
            summary = "Minor interactions detected. Generally manageable but worth discussing with your healthcare provider."

    # Identify unrecognized drugs
    unrecognized = [d for d in drug_list_lower if d not in DRUG_CLASSES]

    return {
        "drugs_checked": drug_list_lower,
        "interactions_found": found_interactions,
        "food_drug_alerts": food_alerts,
        "overall_safety": overall,
        "summary": summary,
        "unrecognized_drugs": unrecognized,
        "total_interactions": len(found_interactions),
        "disclaimer": (
            "This drug interaction checker is for educational purposes only. "
            "It does not cover all possible interactions. Always consult a licensed pharmacist "
            "or physician before starting, stopping, or changing any medications."
        )
    }
