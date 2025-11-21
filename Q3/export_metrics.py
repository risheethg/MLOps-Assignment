"""
Script to extract metrics from MLflow runs and generate static JSON files
for the frontend dashboard. Run this script whenever you train new models.
"""

import os
import json
from pathlib import Path
from typing import List, Dict

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

def extract_metrics_from_mlflow(mlruns_path: str = "mlruns") -> List[Dict]:
    """Extract metrics from MLflow experiment runs"""
    metrics_list = []
    
    experiment_path = Path(mlruns_path) / "0"  # Default experiment ID
    
    if not experiment_path.exists():
        print(f"MLflow experiment path not found: {experiment_path}")
        return metrics_list
    
    print(f"Reading MLflow runs from: {experiment_path}")
    
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
            metrics = {
                "model": model_name,
                "train_rmse": read_mlflow_metric(metrics_dir / "train_rmse"),
                "train_mae": read_mlflow_metric(metrics_dir / "train_mae"),
                "train_r2": read_mlflow_metric(metrics_dir / "train_r2"),
                "test_rmse": read_mlflow_metric(metrics_dir / "test_rmse"),
                "test_mae": read_mlflow_metric(metrics_dir / "test_mae"),
                "test_r2": read_mlflow_metric(metrics_dir / "test_r2"),
                "mlflow_run_id": run_dir.name,
            }
            
            metrics_list.append(metrics)
            print(f"✓ Extracted metrics for {model_name} (run: {run_dir.name[:8]}...)")
            
        except Exception as e:
            print(f"✗ Error processing run {run_dir.name}: {e}")
            continue
    
    return metrics_list

def main():
    """Main function to extract and save metrics"""
    print("=" * 60)
    print("MLOps Metrics Extractor")
    print("=" * 60)
    
    # Extract metrics from MLflow
    metrics = extract_metrics_from_mlflow()
    
    if not metrics:
        print("\n⚠ No metrics found. Make sure you have trained models in MLflow.")
        return
    
    # Create output directory
    output_dir = Path("../frontend/public/data")
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save metrics to JSON file
    output_file = output_dir / "metrics.json"
    with open(output_file, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\n✓ Successfully exported {len(metrics)} model metrics")
    print(f"✓ Saved to: {output_file}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("Summary:")
    print("=" * 60)
    for metric in metrics:
        print(f"  • {metric['model'].upper()}: R² = {metric['test_r2']:.4f}, RMSE = {metric['test_rmse']:.4f}")
    print("=" * 60)
    print("\n✓ Run 'npm run dev' in the frontend directory to view dashboard")

if __name__ == "__main__":
    main()
