@echo off
echo ========================================
echo   MLOps Dashboard - Quick Deploy
echo ========================================
echo.

echo [1/3] Generating metrics from MLflow...
cd Q3
python generate_metrics.py
if errorlevel 1 (
    echo ERROR: Failed to generate metrics
    pause
    exit /b 1
)

echo.
echo [2/3] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Starting development server...
echo.
echo ========================================
echo   Dashboard will open at:
echo   http://localhost:3000
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
