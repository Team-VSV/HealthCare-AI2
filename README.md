# Healthcare AI Platform

Healthcare AI Platform is a full-stack application leveraging Machine Learning models and Generative AI to provide healthcare insights. It uses a modern architecture with a React frontend and a FastAPI backend.

## Project Structure

```text
├── backend/            # FastAPI server containing API endpoints, LangChain integrations, and model inference logic
├── frontend/           # React frontend application built with Vite and TailwindCSS
├── models/             # Pre-trained ML/DL models (PyTorch and Scikit-learn) for Heart Disease and Pneumonia detection
└── start_servers.sh    # Convenience script to start both backend and frontend servers
```

## Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS 4
- Lucide React (Icons)
- Axios

### Backend
- FastAPI
- PyTorch & Scikit-learn (Model Inference)
- LangChain & LangGraph (AI Workflows)
- OpenAI (LLM Integration)
- Pandas & NumPy

## Getting Started

### Prerequisites
- Node.js & npm (for the frontend)
- Python 3 (for the backend)
- Virtual Environment (recommended)

### Running the Application (Quick Start)

You can run both the frontend and backend servers concurrently using the provided shell script:

```bash
./start_servers.sh
```

This script will automatically:
1. Create a Python virtual environment and install backend dependencies if needed.
2. Start the FastAPI backend on `http://localhost:8000`.
3. Install Node modules if needed.
4. Start the Vite React development server on `http://localhost:5173`.

### Running Manually

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Features
- **Heart Disease Prediction**: Uses Random Forest and Neural Network models to predict heart disease risk.
- **Pneumonia Detection**: Uses a PyTorch Convolutional Neural Network (CNN) to detect pneumonia from chest X-rays.
- **AI Assistant**: Integrates LangChain and OpenAI to provide AI-driven healthcare insights and assistance.
