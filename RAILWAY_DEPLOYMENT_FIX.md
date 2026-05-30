# Railway Deployment Fix - CRITICAL SOLUTION

## Problem Summary
Railway deployment fails with "Healthcheck failed" because:
- Railway auto-detects Python and uses Railpack builder
- Start command runs `uvicorn routes:app` from project root
- But `routes.py` is located in `Backend/` subdirectory
- Server never starts → healthcheck fails → deployment fails

## ✅ SOLUTION (Choose ONE method)

### Method 1: Set Root Directory (RECOMMENDED - Easiest)

1. Go to Railway Dashboard → Your Project → `archi-backend` service
2. Click **Settings** tab
3. Scroll to **Root Directory**
4. Set value to: `Backend`
5. Click **Save**
6. **Redeploy** (Railway will automatically redeploy)

This tells Railway to treat `Backend/` as the project root, so it will find `requirements.txt` and `routes.py` correctly.

---

### Method 2: Force Dockerfile Builder

If Method 1 doesn't work, force Railway to use the Dockerfile:

1. Go to Railway Dashboard → Your Project → `archi-backend` service
2. Click **Settings** tab
3. Scroll to **Builder** section
4. Change from "Railpack" to **Dockerfile**
5. Set **Dockerfile Path** to: `Dockerfile`
6. Click **Save**
7. **Redeploy**

The Dockerfile at root is already configured to copy from `Backend/` and run correctly.

---

### Method 3: Custom Start Command (Alternative)

If you want to keep Railpack but fix the path:

1. Go to Railway Dashboard → Your Project → `archi-backend` service
2. Click **Settings** tab
3. Scroll to **Custom Start Command**
4. Set to: `cd Backend && uvicorn routes:app --host 0.0.0.0 --port $PORT`
5. Click **Save**
6. **Redeploy**

---

## Verify Deployment Success

After redeploying, check:

1. **Deploy Logs** should show:
   ```
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:XXXX
   ```

2. **Healthcheck** should pass:
   ```
   ==================== Starting Healthcheck ====================
   Path: /health
   ✓ Healthcheck passed
   ```

3. Test the health endpoint:
   - Visit: `https://your-railway-url.railway.app/health`
   - Should return: `{"status":"healthy","timestamp":...}`

---

## Update Frontend After Backend is Live

Once Railway deployment succeeds:

1. Copy your Railway backend URL (e.g., `https://archi-backend-production-ca91.up.railway.app`)

2. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

3. Add/Update:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-railway-url.railway.app
   ```

4. **Redeploy** frontend on Vercel

---

## Why This Happens

Railway's auto-detection (Railpack) looks for:
- `requirements.txt` in root → Found ✓
- Runs `uvicorn routes:app` from root → routes.py not found ✗

The fix ensures Railway either:
- Runs from `Backend/` directory (Method 1)
- Uses Dockerfile that handles paths correctly (Method 2)
- Changes directory before starting (Method 3)

---

## Current File Structure
```
AI-Architect-main/
├── Backend/
│   ├── routes.py          ← FastAPI app is here
│   ├── requirements.txt   ← Dependencies here
│   └── .env              ← Backend env vars
├── Dockerfile            ← Configured for Backend/
├── railway.toml          ← Tries to force Dockerfile
└── nixpacks.toml         ← Tries to set correct path
```

The configuration files (railway.toml, nixpacks.toml) are present but Railway may ignore them if it auto-detects Python first.

---

## Next Steps

1. **Apply Method 1** (Root Directory = `Backend`) - This is the cleanest solution
2. Wait for Railway to redeploy automatically
3. Check Deploy Logs for success
4. Test `/health` endpoint
5. Update Vercel with Railway URL
6. Test full application

Your backend code is correct - it's just a deployment configuration issue!
