import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import openml
import numpy as np

def load_advanced_data():
    dataset = openml.datasets.get_dataset(45547)
    df, y, _, _ = dataset.get_data(dataset_format="dataframe", target=dataset.default_target_attribute)
    df['target'] = y
    
    # Base cleaning
    df['age'] = df['age'] / 365.25
    df = df[(df['ap_hi'] >= 50) & (df['ap_hi'] <= 250)]
    df = df[(df['ap_lo'] >= 30) & (df['ap_lo'] <= 150)]
    df = df[df['ap_hi'] > df['ap_lo']]
    
    for col in ['gender', 'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'target']:
        df[col] = df[col].astype(int)
        
    df['gender'] = df['gender'].apply(lambda x: 0 if x == 1 else 1)
    
    # --- Feature Engineering ---
    # BMI = weight(kg) / (height(cm)/100)^2
    df['bmi'] = df['weight'] / ((df['height'] / 100) ** 2)
    # Pulse Pressure = Systolic - Diastolic 
    df['pulse_pressure'] = df['ap_hi'] - df['ap_lo']
    # Mean Arterial Pressure = Diastolic + 1/3(Pulse Pressure)
    df['map'] = df['ap_lo'] + (df['pulse_pressure'] / 3)
    
    # Drop rows with impossible BMI (e.g. < 10 or > 100)
    df = df[(df['bmi'] >= 10) & (df['bmi'] <= 100)]
    
    return df

class BigNN(nn.Module):
    def __init__(self, input_size):
        super(BigNN, self).__init__()
        self.net = nn.Sequential(
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
        return self.net(x)

def test():
    df = load_advanced_data()
    X = df.drop(columns=['target']).values
    y = df['target'].values
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)
    
    X_tr = torch.FloatTensor(X_train)
    y_tr = torch.FloatTensor(y_train).view(-1, 1)
    X_te = torch.FloatTensor(X_test)
    y_te = torch.FloatTensor(y_test).view(-1, 1)
    
    loader = DataLoader(TensorDataset(X_tr, y_tr), batch_size=256, shuffle=True)
    model = BigNN(X_train.shape[1])
    
    opt = optim.AdamW(model.parameters(), lr=0.003, weight_decay=1e-4) # AdamW
    sched = optim.lr_scheduler.ReduceLROnPlateau(opt, mode='min', factor=0.5, patience=2)
    crit = nn.BCELoss()
    
    for epoch in range(15):
        model.train()
        losses = []
        for x_b, y_b in loader:
            opt.zero_grad()
            out = model(x_b)
            l = crit(out, y_b)
            l.backward()
            opt.step()
            losses.append(l.item())
        avg_loss = sum(losses)/len(losses)
        sched.step(avg_loss)
        
    model.eval()
    with torch.no_grad():
        preds = (model(X_te) >= 0.5).float()
    acc = (preds == y_te).float().mean()
    print(f"Engineered Features: {X_train.shape[1]}")
    print(f"Accuracy with BigNN & BMI/MAP: {acc.item():.4f}")

    total_params = sum(p.numel() for p in model.parameters())
    print(f"Total Parameters: {total_params}")

if __name__ == '__main__':
    test()
