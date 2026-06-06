from pydantic import BaseModel
from typing import List, Optional

class HeartDiseaseInput(BaseModel):
    age: float
    gender: float
    height: float
    weight: float
    ap_hi: float
    ap_lo: float
    cholesterol: float
    gluc: float
    smoke: float
    alco: float
    active: float

class SymptomInput(BaseModel):
    symptoms: str
    age: Optional[int] = None
    sex: Optional[str] = None

class MentalHealthInput(BaseModel):
    phq9: List[int]
    gad7: List[int]

class TreatmentInput(BaseModel):
    condition: str
    age: Optional[int] = None
    sex: Optional[str] = None
    severity: Optional[str] = "moderate"
    comorbidities: Optional[List[str]] = []

class SoapNoteInput(BaseModel):
    transcript: str
    patient_age: Optional[int] = None
    chief_complaint: Optional[str] = None
    visit_type: Optional[str] = "follow-up"

class DocumentAnalyzerInput(BaseModel):
    text: str

class ChatInput(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class DiabetesRiskInput(BaseModel):
    age: int
    bmi: float
    fasting_glucose: Optional[float] = None
    hba1c: Optional[float] = None
    blood_pressure: Optional[float] = None
    physical_activity: Optional[str] = "moderate"
    family_history: Optional[bool] = False
    gestational_diabetes: Optional[bool] = False
    sex: Optional[str] = "not_specified"
    ethnicity_high_risk: Optional[bool] = False

class DrugInteractionInput(BaseModel):
    drugs: List[str]

class VitalsLogInput(BaseModel):
    session_id: str
    systolic_bp: Optional[float] = None
    diastolic_bp: Optional[float] = None
    heart_rate: Optional[float] = None
    blood_glucose: Optional[float] = None
    weight_kg: Optional[float] = None
    spo2: Optional[float] = None
    temperature_c: Optional[float] = None
    notes: Optional[str] = None

class VitalsHistoryInput(BaseModel):
    session_id: str

class LifestylePlanInput(BaseModel):
    condition: str
    age: Optional[int] = None
    sex: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
