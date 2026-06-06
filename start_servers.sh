#!/bin/bash

# Function to clean up background processes on exit
cleanup() {
    echo ""
    echo "Stopping Healthcare AI servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    exit 0
}

# Trap Ctrl+C (SIGINT) and SIGTERM to clean up background processes
trap cleanup SIGINT SIGTERM

echo "================================================="
echo "   Starting Healthcare AI Platform Servers       "
echo "================================================="

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# 1. Start Backend
echo "--> Starting backend FastAPI server..."
cd backend
if [ ! -d ".venv" ]; then
    echo "Python virtual environment (.venv) not found. Setting up..."
    python3 -m venv .venv
    .venv/bin/pip install -r requirements.txt
fi

# Run uvicorn in the background and save its PID
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID) on http://localhost:8000"

# Wait a bit for backend to start up
sleep 2

# 2. Start Frontend
cd "$SCRIPT_DIR/frontend"
echo "--> Starting frontend React dev server..."
if [ ! -d "node_modules" ]; then
    echo "Frontend node_modules not found. Installing dependencies..."
    npm install
fi

# Run Vite dev server (usually launches on http://localhost:5173)
npm run dev

# Keep script alive to wait for background process
wait $BACKEND_PID
