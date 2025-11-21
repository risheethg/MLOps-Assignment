# 🎯 Deployment Guide - Super Simple!

## For Vercel (Recommended - FREE)

### Option A: GitHub Auto-Deploy (Best for continuous updates)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add MLOps dashboard"
   git push
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Configure:
     - **Root Directory**: `frontend`
     - **Framework Preset**: Next.js
     - Click "Deploy"

3. **Done!** Your dashboard is live at `https://your-project.vercel.app`

### Option B: Direct Deploy (Quickest)

```bash
npm i -g vercel
cd frontend
vercel --prod
```

Follow prompts, get instant URL!

## For Netlify (Alternative - also FREE)

1. **Build the static site**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Drag the `.next` folder to https://app.netlify.com/drop
   - Or install CLI:
     ```bash
     npm i -g netlify-cli
     netlify deploy --prod --dir=.next
     ```

## For GitHub Pages

```bash
cd frontend
npm run build
npm run export
# Upload the 'out' folder to GitHub Pages
```

## Update Your Dashboard

Whenever you train new models:

```bash
# 1. Export new metrics
cd Q3
python export_metrics.py

# 2. Commit and push
git add frontend/public/data/metrics.json
git commit -m "Update metrics"
git push
```

Vercel/Netlify will auto-deploy the update!

## Custom Domain

In Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (they'll show you how)

## Troubleshooting

**404 on pages?**
- Make sure Root Directory is set to `frontend` in Vercel

**Metrics not updating?**
- Check `frontend/public/data/metrics.json` is in git
- Verify the file has actual data (not empty)

**Build failing?**
- Check Node.js version is 18+ in platform settings
- Verify all npm packages installed correctly

## Environment Variables (Optional)

None required! But if you want to customize:

Go to Vercel → Settings → Environment Variables:
- `NODE_ENV` = `production`
- `NEXT_PUBLIC_APP_NAME` = `Your Dashboard Name`

---

## 🎉 That's It!

Your dashboard is now live and will auto-update whenever you push changes!
