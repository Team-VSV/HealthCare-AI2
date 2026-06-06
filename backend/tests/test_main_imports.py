print("Testing imports")
from fastapi import FastAPI
print("Fastapi")
import torch
print("Torch")
import pandas as pd
print("Pandas")
import uvicorn
print("Uvicorn")
try:
    from symptom_knowledge_base import DISEASE_DATABASE
    print("Symptom base")
except Exception as e:
    print(f"Error symptom: {e}")
try:
    import main
    print("Main loaded cleanly!")
except Exception as e:
    print(f"Error loading main: {e}")
