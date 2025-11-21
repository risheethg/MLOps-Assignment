#!/bin/bash

echo "========================================"
echo "  MLOps Dashboard - Quick Deploy"
echo "========================================"
echo ""

echo "[1/3] Generating metrics from MLflow..."
cd Q3
python3 generate_metrics.py
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate metrics"
    exit 1
fi

echo ""
echo "[2/3] Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "[3/3] Starting development server..."
echo ""
echo "========================================"
echo "  Dashboard will open at:"
echo "  http://localhost:3000"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
