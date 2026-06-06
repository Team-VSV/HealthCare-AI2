import os
print("Starting imports...")
import torch
print("Imported torch")
import torch.nn as nn
print("Imported nn")
from torchvision.models import mobilenet_v2
print("Imported mobilenet")

pneumonia_model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'pneumonia_cnn.pth')
print(f"Loading from {pneumonia_model_path}")
pneumonia_model = mobilenet_v2()
print("Instantiated mobilenet_v2")

pneumonia_model.classifier = nn.Sequential(
    nn.Dropout(p=0.4),
    nn.Linear(pneumonia_model.last_channel, 128),
    nn.ReLU(),
    nn.Linear(128, 1),
    nn.Sigmoid()
)
print("Modified classifier")

pneumonia_model.load_state_dict(torch.load(pneumonia_model_path, map_location=torch.device('cpu'), weights_only=True))
print("Loaded state dict")
