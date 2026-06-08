# AI-Based Integrated Healthcare Diagnosis & Recommendation System

This is a comprehensive, full-stack healthcare application leveraging cutting-edge Machine Learning models, Deep Learning, and Natural Language Processing to provide predictive diagnostics, clinical workflow automation, and specialized healthcare insights.

## 🚀 Key Features

*   **Pneumonia Detection (Computer Vision):** Uses a PyTorch MobileNetV2 Convolutional Neural Network (CNN) to detect pneumonia from Chest X-Ray images.
*   **Heart Disease Prediction:** A PyTorch Deep Neural Network (DNN) that analyzes clinical parameters (like BP, BMI, and Cholesterol) using engineered features and standard scaling.
*   **NLP Symptom Checker:** Uses a deterministic TF-IDF and Cosine Similarity engine mapping user free-text against a clinical `DISEASE_DATABASE` for highly accurate triage.
*   **Mental Health Assessments:** Implements clinically validated PHQ-9 (Depression) and GAD-7 (Anxiety) screening instruments.
*   **Deterministic Clinical Rule Engines:** Includes a Diabetes Risk Calculator, Drug Interaction Checker, and Lifestyle Planner.
*   **AI Scribe & EHR Analyzer:** Demonstrative modules to simulate automated SOAP note generation and lab result extraction.

## 📂 Project Directory Structure

```text
Attendo-Health/
├── backend/                  # FastAPI Application Server
│   ├── app/                  # Main application package
│   │   ├── main.py           # API Endpoints & ML Model Loading
│   │   ├── schemas.py        # Pydantic data validation models
│   │   └── services/         # Core business logic & rule engines
│   │       ├── symptom_knowledge_base.py
│   │       ├── diabetes_risk_model.py
│   │       ├── drug_interaction_db.py
│   │       ├── lifestyle_planner_db.py
│   │       └── treatment_protocols.py
│   ├── scripts/              # ML Model Training Scripts
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React.js UI Application
│   ├── src/                  # React components, styles, and assets
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite bundler configuration
├── models/                   # Pre-trained ML/DL Model Weights
│   ├── heart_disease_nn.pth
│   ├── heart_disease_scaler.pkl
│   └── pneumonia_cnn.pth
├── docs/                     # Project Reports, Presentations
│   └── PROJECT REPORT:document .pdf
├── start_servers.sh          # Quick-start execution script
└── README.md                 # Project Documentation
```

## 🛠 Tech Stack

### Frontend (Client-Side)
*   **Framework:** React.js 19
*   **Build Tool:** Vite
*   **Styling:** TailwindCSS 4
*   **Icons:** Lucide React

### Backend (Server-Side & ML)
*   **API Framework:** FastAPI (Asynchronous Python)
*   **Computer Vision:** PyTorch (MobileNetV2)
*   **Tabular Data ML:** PyTorch (Custom DNN) & Scikit-Learn
*   **NLP Processing:** Scikit-Learn (TfidfVectorizer)
*   **Data Validation:** Pydantic

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm (for the frontend)
*   Python 3 (for the backend)
*   Virtual Environment (recommended)

### Running the Application (Quick Start)

The easiest way to launch the entire stack is by using the provided shell script from the root directory:

```bash
chmod +x start_servers.sh
./start_servers.sh
```

This script will automatically:
1.  Initialize a Python virtual environment and install all backend dependencies.
2.  Boot the FastAPI backend server on `http://localhost:8000`.
3.  Install Node modules.
4.  Launch the Vite React development server on `http://localhost:5173`.

### Running Manually

If you prefer to run the services separately:

**1. Start the Backend:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🧠 Architecture Overview

Attendo-Health uses a **Decoupled Client-Server Architecture**. 
*   The **Frontend (React)** acts purely as a presentation layer, ensuring a smooth, non-blocking user experience.
*   The **Backend (FastAPI)** acts as the orchestrator. When it boots, it pre-loads all PyTorch and Scikit-Learn models into RAM. 
*   When a request is received, FastAPI uses Pydantic to validate the payload, routes the data to the appropriate ML model for fast inference, and returns a sanitized JSON response back to the client. This decoupling guarantees that heavy computer vision tasks (like X-Ray scanning) do not crash or freeze the web interface.
