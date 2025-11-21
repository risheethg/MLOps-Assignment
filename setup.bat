@echo off
REM Quick setup script for Windows
echo ============================================================
echo MLOps Dashboard Setup
echo ============================================================
echo.

REM Export metrics
echo Step 1: Exporting metrics from MLflow...
cd Q3
python export_metrics.py
cd ..
echo.

REM Install dependencies
echo Step 2: Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo.

echo ============================================================
echo Setup Complete! 
echo ============================================================
echo.
echo To start the development server:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo ============================================================
pause
