#!/usr/bin/env python3
"""
Generate static metrics JSON file from MLflow runs
Run this script whenever you update your models to regenerate the metrics
"""

import os
import json
from pathlib import Path

def read_metric_file(file_path):
    """Read metric value from MLflow metric file"""
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
            if lines:
                parts = lines[0].strip().split()
                if len(parts) >= 2:
                    return float(parts[1])
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return 0.0

def read_param_file(file_path):
    """Read parameter value from MLflow param file"""
    try:
        with open(file_path, 'r') as f:
            return f.read().strip()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return ""

def generate_metrics_json():
    """Generate metrics.json from MLflow runs"""
    metrics_list = []
    
    # Path to mlruns
    mlruns_path = Path(__file__).parent / "mlruns" / "0"
    
    if not mlruns_path.exists():
        print(f"Error: MLflow runs path not found: {mlruns_path}")
        return
    
    print(f"Reading metrics from: {mlruns_path}")
    
    # Iterate through all run directories
    for run_dir in mlruns_path.iterdir():
        if not run_dir.is_dir() or run_dir.name in ['meta.yaml', 'models']:
            continue
        
        metrics_dir = run_dir / "metrics"
        params_dir = run_dir / "params"
        
        if not metrics_dir.exists() or not params_dir.exists():
            continue
        
        try:
            # Read model name
            model_file = params_dir / "model"
            if not model_file.exists():
                continue
            
            model_name = read_param_file(model_file)
            
            # Read all metrics
            metric_data = {
                "model": model_name,
                "train_rmse": read_metric_file(metrics_dir / "train_rmse"),
                "train_mae": read_metric_file(metrics_dir / "train_mae"),
                "train_r2": read_metric_file(metrics_dir / "train_r2"),
                "test_rmse": read_metric_file(metrics_dir / "test_rmse"),
                "test_mae": read_metric_file(metrics_dir / "test_mae"),
                "test_r2": read_metric_file(metrics_dir / "test_r2"),
                "mlflow_run_id": run_dir.name,
            }
            
            metrics_list.append(metric_data)
            print(f"✓ Processed {model_name} (run: {run_dir.name[:8]}...)")
            
        except Exception as e:
            print(f"Error processing run {run_dir.name}: {e}")
    
    # Save to frontend public directory
    output_path = Path(__file__).parent.parent / "frontend" / "public" / "metrics.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(metrics_list, f, indent=2)
    
    print(f"\n✓ Generated metrics.json with {len(metrics_list)} model runs")
    print(f"✓ Saved to: {output_path}")

if __name__ == "__main__":
    generate_metrics_json()
