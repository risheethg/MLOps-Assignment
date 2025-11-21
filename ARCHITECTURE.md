# 🏗️ Architecture Overview

## System Design - No Backend Needed!

```
┌─────────────────────────────────────────────────────────┐
│                    MLflow Training                       │
│  (Your existing Q3/src/train.py + MLflow experiments)   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Stores metrics
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Q3/mlruns/ (MLflow Data)                    │
│  • Experiments and runs                                  │
│  • Metrics files (train_rmse, test_r2, etc.)            │
│  • Model parameters                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Python script extracts
                     ↓
┌─────────────────────────────────────────────────────────┐
│         Q3/export_metrics.py (Data Pipeline)             │
│  • Reads MLflow metric files                            │
│  • Aggregates all model data                            │
│  • Outputs JSON format                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Generates
                     ↓
┌─────────────────────────────────────────────────────────┐
│     frontend/public/data/metrics.json (Static Data)     │
│  [                                                       │
│    {                                                     │
│      "model": "rf",                                      │
│      "train_rmse": 0.0198,                              │
│      "test_r2": 0.8571,                                 │
│      ...                                                 │
│    }                                                     │
│  ]                                                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Read by
                     ↓
┌─────────────────────────────────────────────────────────┐
│           Next.js Frontend (React + TS)                  │
│                                                          │
│  ┌──────────────────────────────────────────┐           │
│  │  app/page.tsx (Main Dashboard)           │           │
│  │  • Fetches /data/metrics.json            │           │
│  │  • Manages state                         │           │
│  │  • Filters models                        │           │
│  └──────────────────┬───────────────────────┘           │
│                     │                                    │
│  ┌──────────────────┴───────────────────────┐           │
│  │   Components (Reusable UI)               │           │
│  │  • MetricCard.tsx - Summary cards        │           │
│  │  • MetricsChart.tsx - Bar charts         │           │
│  │  • ModelComparison.tsx - Table           │           │
│  └──────────────────────────────────────────┘           │
│                                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Deployed as static site
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Vercel CDN (Production)                     │
│  • Serves static HTML/CSS/JS                            │
│  • No server needed                                      │
│  • Auto-deploys on git push                             │
│  • Global CDN for fast loading                          │
└─────────────────────────────────────────────────────────┘
                     │
                     │ Accessed by
                     ↓
                 👤 Users
           (Browser - Any Device)
```

## Data Flow

### One-Time Setup
1. `npm install` in frontend/ → Install dependencies
2. Ready to develop!

### Regular Workflow
1. Train models → MLflow stores runs in mlruns/
2. Run `python export_metrics.py` → Generates metrics.json
3. Frontend reads metrics.json → Displays in dashboard
4. `git push` → Vercel auto-deploys

### Why This Works

**No Backend Server Needed Because:**
- ✅ MLflow already stores all metrics persistently
- ✅ Python script reads from local files
- ✅ Generates static JSON once
- ✅ Frontend fetches JSON like any static asset
- ✅ No database, no API, no server costs!

**Benefits:**
- 🚀 **Fast**: No API calls, just static files
- 💰 **Free**: Vercel hosts static sites free
- 🔒 **Secure**: No exposed endpoints
- 📈 **Scalable**: CDN handles any traffic
- 🛠️ **Simple**: Just HTML + JSON

## File Sizes

```
metrics.json:        ~2-10 KB (depending on # of models)
Total JS bundle:     ~200 KB (gzipped)
Page load time:      < 2 seconds
```

## Technology Stack

```
Frontend (Client-Side)
├── Next.js 14        → React framework with App Router
├── TypeScript        → Type safety
├── Tailwind CSS      → Styling
├── Recharts          → Data visualization
└── Axios             → Fetch JSON

Data Pipeline (CLI)
└── Python            → Extract from MLflow

Deployment
├── Vercel            → Static hosting + CDN
├── GitHub Actions    → Auto-deploy on push
└── Git               → Version control
```

## Performance Characteristics

| Metric | Value |
|--------|-------|
| First Load | < 1s |
| Time to Interactive | < 2s |
| Bundle Size | ~200KB |
| Lighthouse Score | 95+ |
| Monthly Cost | $0 |

## Scalability

- **Models**: Can handle 100+ models easily
- **Metrics**: Add unlimited metrics to JSON
- **Users**: CDN scales automatically
- **Updates**: Instant via git push

## Security

- ✅ No API keys needed
- ✅ No database credentials
- ✅ No exposed endpoints
- ✅ All data is public by design
- ✅ Read-only static files

Perfect for internal dashboards or public showcases!

---

## Alternative: With Backend (Optional)

If you need dynamic updates without regenerating JSON:

```
User → Next.js → FastAPI → MLflow → Metrics
       (3000)    (8000)    (files)
```

The `backend/` folder contains this FastAPI implementation, but it's **completely optional**. The static approach is recommended for simplicity!
