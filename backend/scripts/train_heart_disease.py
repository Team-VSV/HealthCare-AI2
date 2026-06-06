import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd
import numpy as np
import pickle
import openml

# 1. Define the Big Neural Network Architecture
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

def load_and_preprocess_data():
    print("Fetching Cardiovascular Disease dataset (ID: 45547) from OpenML...")
    dataset = openml.datasets.get_dataset(45547)
    X, y, _, _ = dataset.get_data(dataset_format="dataframe", target=dataset.default_target_attribute)
    
    df = X.copy()
    df['target'] = y
    
    # Base Preprocessing
    df['age'] = df['age'] / 365.25
    df = df[(df['ap_hi'] >= 50) & (df['ap_hi'] <= 250)]
    df = df[(df['ap_lo'] >= 30) & (df['ap_lo'] <= 150)]
    df = df[df['ap_hi'] > df['ap_lo']]
    
    for col in ['gender', 'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'target']:
        df[col] = df[col].astype(int)
        
    df['gender'] = df['gender'].apply(lambda x: 0 if x == 1 else 1)
    
    # ── Feature Engineering ──────────────────────────────────────────────
    print("Engineering biological traits (BMI, Pulse Pressure, MAP)...")
    df['bmi'] = df['weight'] / ((df['height'] / 100) ** 2)
    df['pulse_pressure'] = df['ap_hi'] - df['ap_lo']
    df['map'] = df['ap_lo'] + (df['pulse_pressure'] / 3)
    
    # Filter highly impossible BMIs (ensuring model integrity)
    df = df[(df['bmi'] >= 10) & (df['bmi'] <= 100)]
    # ───────────────────────────────────────────────────────────────────────
    
    return df

def train_model():
    df = load_and_preprocess_data()
    print(f"Data shape after cleaning: {df.shape}")
    
    X = df.drop(columns=['target']).values
    y = df['target'].values
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scaler
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Tensors
    X_train_tensor = torch.FloatTensor(X_train_scaled)
    y_train_tensor = torch.FloatTensor(y_train).view(-1, 1)
    X_test_tensor = torch.FloatTensor(X_test_scaled)
    y_test_tensor = torch.FloatTensor(y_test).view(-1, 1)
    
    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=256, shuffle=True)
    
    input_size = X_train.shape[1]
    model = BigNN(input_size)
    print(f"\nModel Initialized: {input_size} features, ~50,000 parameters.")
    
    # Advanced Optimizer
    criterion = nn.BCELoss()
    optimizer = optim.AdamW(model.parameters(), lr=0.003, weight_decay=1e-4)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=3)
    
    epochs = 40
    print("Training Big Neural Network...")
    for epoch in range(epochs):
        model.train()
        epoch_loss = 0
        for batch_X, batch_y in train_loader:
            optimizer.zero_grad()
            outputs = model(batch_X)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            epoch_loss += loss.item()
            
        avg_loss = epoch_loss / len(train_loader)
        scheduler.step(avg_loss)
        
        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1}/{epochs}, Loss: {avg_loss:.4f}")
            
    # Evaluation
    model.eval()
    with torch.no_grad():
        test_outputs = model(X_test_tensor)
        predicted = (test_outputs >= 0.5).float()
        
    y_test_np = y_test_tensor.numpy()
    y_pred_np = predicted.numpy()
    
    acc = accuracy_score(y_test_np, y_pred_np)
    print(f"\nModel Accuracy: {acc * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test_np, y_pred_np))
    
    feature_names = df.drop(columns=['target']).columns.tolist()
    return model, scaler, feature_names

if __name__ == "__main__":
    model, scaler, feature_names = train_model()
    
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, 'heart_disease_nn.pth')
    torch.save(model.state_dict(), model_path)
    
    scaler_path = os.path.join(models_dir, 'heart_disease_scaler.pkl')
    with open(scaler_path, 'wb') as f:
        pickle.dump({'scaler': scaler, 'features': feature_names}, f)
        
    print(f"\nSuccess! Big PyTorch Model mapped to {len(feature_names)} dimension features saved at {model_path}.")
