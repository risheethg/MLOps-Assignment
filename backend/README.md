# MLOps Metrics API Backend

FastAPI backend for serving ML model metrics from MLflow experiments.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python main.py
```

Or use uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/metrics` - Get all model metrics
- `GET /api/metrics/{model_name}` - Get metrics for specific model
- `GET /api/models` - Get list of available models

## Environment Variables

- `MLRUNS_PATH` - Path to MLflow runs directory (default: `../Q3/mlruns`)
