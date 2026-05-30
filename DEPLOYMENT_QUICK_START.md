# ⚡ Quick Deployment Guide - AI Architect

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub (2 min)

```bash
cd AI-Architect-main

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ai-architect.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel (5 min)

1. Go to: **https://vercel.com**
2. Click **"New Project"**
3. Import your GitHub repo
4. Click **"Deploy"**
5. Add environment variables in **Settings → Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ozahzhkcakxovvrjidni.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96YWh6aGtjYWt4b3Z2cmppZG5pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NTU5NzcsImV4cCI6MjA1MzAzMTk3N30.sb_publishable_GGu8M1V5jBXCCYU6oSyoVg_4HxQvxyr
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NODE_ENV=production
```

### Step 3: Deploy Backend to Railway (8 min)

1. Go to: **https://railway.app**
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repo → Choose **"Backend"** folder
4. Add **Start Command** in Settings:
   ```
   uvicorn routes:app --host 0.0.0.0 --port $PORT
   ```
5. Add all environment variables (copy from your local `Backend/.env`)
6. Deploy!

### Step 4: Update Frontend with Backend URL (2 min)

1. Copy your Railway backend URL
2. Go to Vercel → **Settings → Environment Variables**
3. Update `NEXT_PUBLIC_BACKEND_URL` with Railway URL
4. Redeploy frontend

---

## ✅ Done!

Your app is live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app

---

## 🔑 Environment Variables Checklist

### Frontend (Vercel)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] NEXT_PUBLIC_BACKEND_URL
- [ ] NODE_ENV

### Backend (Railway)
- [ ] GROQ_API_KEY
- [ ] HUGGING_FACE_API_TOKEN
- [ ] STABILITY_API_KEY
- [ ] OPENAI_API_KEY
- [ ] PEXELS_API_KEY
- [ ] UNSPLASH_ACCESS_KEY
- [ ] UNSPLASH_SECRET_KEY
- [ ] PIXABAY_API_KEY
- [ ] GEOAPIFY_API_KEY
- [ ] TAVILY_API_KEY
- [ ] PROKERALA_CLIENT_ID
- [ ] PROKERALA_SECRET_KEY

---

## 💡 Pro Tips

1. **Test locally first**: `npm run build` before deploying
2. **Check logs**: Vercel and Railway have excellent log viewers
3. **Free tier**: Both services have generous free tiers
4. **Custom domain**: Add in Vercel settings (optional)
5. **CORS**: Update allowed origins in `Backend/routes.py`

---

## 🆘 Quick Fixes

**Build fails?**
```bash
npm install
npm run build
```

**Backend not responding?**
- Check Railway logs
- Verify environment variables
- Test `/health` endpoint

**Features not working?**
- Verify all API keys are set
- Check API quotas
- Review browser console for errors

---

For detailed instructions, see **DEPLOYMENT_GUIDE.md**
