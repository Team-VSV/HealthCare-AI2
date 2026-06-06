from main import predict_heart_disease, HeartDiseaseInput
data = {
  "age": 50.0,
  "gender": 1.0,
  "height": 170.0,
  "weight": 70.0,
  "ap_hi": 120.0,
  "ap_lo": 80.0,
  "cholesterol": 1.0,
  "gluc": 1.0,
  "smoke": 0.0,
  "alco": 0.0,
  "active": 1.0
}
try:
    print(predict_heart_disease(HeartDiseaseInput(**data)))
except Exception as e:
    print(f"FAILED: {e}")
