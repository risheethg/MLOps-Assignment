from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import json
from pathlib import Path

app = FastAPI(
    title="MLOps Metrics API",
    description="API for serving ML model metrics from MLflow experiments",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ModelMetrics(BaseModel):
    model: str
    train_rmse: float
    train_mae: float
    train_r2: float
    test_rmse: float
    test_mae: float
    test_r2: float
    mlflow_run_id: str
    timestamp: Optional[str] = None

class MetricsResponse(BaseModel):
    metrics: List[ModelMetrics]
    total_count: int

def read_mlflow_metric(metric_file: Path) -> float:
    """Read metric value from MLflow metric file"""
    try:
        with open(metric_file, 'r') as f:
            lines = f.readlines()
            if lines:
                # Format: timestamp value step
                parts = lines[0].strip().split()
                if len(parts) >= 2:
                    return float(parts[1])
    except Exception as e:
        print(f"Error reading metric file {metric_file}: {e}")
    return 0.0

def read_mlflow_param(param_file: Path) -> str:
    """Read parameter value from MLflow param file"""
    try:
        with open(param_file, 'r') as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading param file {param_file}: {e}")
    return ""

def get_metrics_from_mlflow(mlruns_path: str = "../Q3/mlruns") -> List[ModelMetrics]:
    """Extract metrics from MLflow experiment runs"""
    metrics_list = []
    
    # Get the absolute path to mlruns
    base_path = Path(__file__).parent / mlruns_path
    experiment_path = base_path / "0"  # Default experiment ID
    
    if not experiment_path.exists():
        print(f"MLflow experiment path not found: {experiment_path}")
        return metrics_list
    
    # Iterate through all run directories
    for run_dir in experiment_path.iterdir():
        if not run_dir.is_dir() or run_dir.name in ['meta.yaml', 'models']:
            continue
        
        metrics_dir = run_dir / "metrics"
        params_dir = run_dir / "params"
        
        if not metrics_dir.exists() or not params_dir.exists():
            continue
        
        try:
            # Read model name from params
            model_file = params_dir / "model"
            if not model_file.exists():
                continue
            
            model_name = read_mlflow_param(model_file)
            
            # Read all metrics
            metrics = ModelMetrics(
                model=model_name,
                train_rmse=read_mlflow_metric(metrics_dir / "train_rmse"),
                train_mae=read_mlflow_metric(metrics_dir / "train_mae"),
                train_r2=read_mlflow_metric(metrics_dir / "train_r2"),
                test_rmse=read_mlflow_metric(metrics_dir / "test_rmse"),
                test_mae=read_mlflow_metric(metrics_dir / "test_mae"),
                test_r2=read_mlflow_metric(metrics_dir / "test_r2"),
                mlflow_run_id=run_dir.name,
            )
            
            metrics_list.append(metrics)
            
        except Exception as e:
            print(f"Error processing run {run_dir.name}: {e}")
            continue
    
    return metrics_list

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "MLOps Metrics API",
        "version": "1.0.0",
        "endpoints": {
            "/api/metrics": "Get all model metrics",
            "/api/metrics/{model_name}": "Get metrics for specific model",
            "/health": "Health check endpoint"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/api/metrics", response_model=List[ModelMetrics])
async def get_all_metrics():
    """Get all model metrics from MLflow"""
    try:
        metrics = get_metrics_from_mlflow()
        if not metrics:
            # Return empty list instead of error for better UX
            return []
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching metrics: {str(e)}")

@app.get("/api/metrics/{model_name}", response_model=List[ModelMetrics])
async def get_model_metrics(model_name: str):
    """Get metrics for a specific model"""
    try:
        all_metrics = get_metrics_from_mlflow()
        filtered_metrics = [m for m in all_metrics if m.model.lower() == model_name.lower()]
        
        if not filtered_metrics:
            raise HTTPException(status_code=404, detail=f"No metrics found for model: {model_name}")
        
        return filtered_metrics
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching metrics: {str(e)}")

@app.get("/api/models")
async def get_available_models():
    """Get list of available models"""
    try:
        metrics = get_metrics_from_mlflow()
        models = list(set(m.model for m in metrics))
        return {"models": models, "count": len(models)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching models: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
