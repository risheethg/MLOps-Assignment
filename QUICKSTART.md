# Quick Start Guide

## Setup (5 minutes)

### 1. Generate Metrics Data
```bash
cd Q3
python export_metrics.py
```

### 2. Install & Run
```bash
cd ../frontend
npm install
npm run dev
```

Visit http://localhost:3000 🎉

## Deploy to Vercel (2 minutes)

### Option 1: GitHub + Vercel (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Set root directory: `frontend`
5. Click Deploy!

### Option 2: Vercel CLI
```bash
npm i -g vercel
cd frontend
vercel --prod
```

## Updating Dashboard

When you train new models:
```bash
cd Q3
python export_metrics.py
git add frontend/public/data/metrics.json
git commit -m "Update metrics"
git push
```

Vercel auto-deploys on push!

## No Backend Required ✨
This is a 100% static site - just JSON files and React!
