import os
import urllib.request
import zipfile
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torchvision.models import mobilenet_v2, MobileNet_V2_Weights
from torch.utils.data import DataLoader

def download_dataset(data_dir):
    print("Downloading Chest X-Ray dataset directly from Mendeley Data (approx 1.2GB)...")
    url = "https://data.mendeley.com/public-files/datasets/rscbjbr9sj/files/f12eaf6d-6023-432f-acc9-80c9d7393433/file_downloaded"
    zip_path = os.path.join(data_dir, "chest_xray.zip")
    
    # Configure custom opener with User-Agent to prevent 403 Forbidden
    opener = urllib.request.build_opener()
    opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
    urllib.request.install_opener(opener)
    
    urllib.request.urlretrieve(url, zip_path)
    print("Download complete. Extracting...")
    
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(data_dir)
        
    os.remove(zip_path)
    
    # Mendeley dataset extracts into a ChestXRay2017 folder
    extracted_folder = os.path.join(data_dir, "ChestXRay2017", "chest_xray")
    target_folder = os.path.join(data_dir, "chest_xray")
    if os.path.exists(extracted_folder):
        os.rename(extracted_folder, target_folder)
    print("Extraction complete.")

def build_and_train_model():
    data_dir = os.path.join(os.path.dirname(__file__), 'Data', 'pneumonia')
    chest_xray_dir = os.path.join(data_dir, 'chest_xray')
    
    # Download dataset if not exists
    if not os.path.exists(chest_xray_dir):
        os.makedirs(data_dir, exist_ok=True)
        try:
            download_dataset(data_dir)
        except Exception as e:
            print(f"Failed to download dataset: {e}")
            return

    # Set up MPS for Apple Silicon
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"Using compute device: {device}")

    # Define Data Transforms with Data Augmentation
    train_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.RandomResizedCrop(224),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    val_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])

    train_dir = os.path.join(chest_xray_dir, 'train')
    val_dir = os.path.join(chest_xray_dir, 'val')
    # Use test dir as validation if val dir is too small (which it is in this dataset, usually 16 images)
    test_dir = os.path.join(chest_xray_dir, 'test')
    
    print(f"Loading datasets from: {chest_xray_dir}")
    train_dataset = datasets.ImageFolder(train_dir, transform=train_transforms)
    # The standard kaggle val set only has 16 images. Test set has 624. We'll use test for validation.
    val_dataset = datasets.ImageFolder(test_dir if os.path.exists(test_dir) else val_dir, transform=val_transforms)
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=4)

    print("Initializing PyTorch MobileNetV2 Base Model...")
    weights = MobileNet_V2_Weights.DEFAULT
    model = mobilenet_v2(weights=weights)
    
    # Freeze base model parameters
    for param in model.parameters():
        param.requires_grad = False
        
    # Overwrite the classifier head for Binary Classification (Normal vs Pneumonia)
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(model.last_channel, 128),
        nn.ReLU(),
        nn.Linear(128, 1),
        nn.Sigmoid()
    )
    
    model = model.to(device)
    
    criterion = nn.BCELoss()
    # Only optimize the classifier parameters
    optimizer = optim.Adam(model.classifier.parameters(), lr=0.001)
    
    epochs = 3
    print("Starting Training Loop...")
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        
        for i, (inputs, labels) in enumerate(train_loader):
            inputs, labels = inputs.to(device), labels.float().unsqueeze(1).to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * inputs.size(0)
            predicted = (outputs > 0.5).float()
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            if (i+1) % 50 == 0:
                print(f"  Batch {i+1}/{len(train_loader)} - Loss: {loss.item():.4f}")
            
        epoch_loss = running_loss / total
        epoch_acc = correct / total
        print(f"Epoch [{epoch+1}/{epochs}] Train Loss: {epoch_loss:.4f}, Train Acc: {epoch_acc:.4f}\n")

    # Ensure models directory exists
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save the trained PyTorch Model state_dict
    model_path = os.path.join(models_dir, 'pneumonia_cnn.pth')
    print(f"Saving PyTorch state_dict to {model_path}...")
    torch.save(model.state_dict(), model_path)
    
    # Cleanup legacy model
    old_tf_model = os.path.join(models_dir, 'pneumonia_cnn.h5')
    if os.path.exists(old_tf_model):
        os.remove(old_tf_model)
        print(f"Successfully cleaned up deprecated TensorFlow weights ({old_tf_model})")
    
    print("Success! Pneumonia CNN PyTorch architecture deployed and trained.")

if __name__ == "__main__":
    build_and_train_model()
