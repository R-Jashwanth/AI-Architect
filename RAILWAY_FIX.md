# 🔧 Railway Deployment Fix

## Problem
Railway is trying to build from the root directory but can't find the Backend files.

## ✅ Solution: Configure Root Directory

### Step 1: Go to Railway Settings
1. Open your Railway project: **archi-backend**
2. Click on **Settings** tab
3. Scroll down to **Service Settings**

### Step 2: Set Root Directory
1. Find **Root Directory** field
2. Enter: `Backend`
3. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Deploy** or trigger a new deployment
3. Railway will now build from the Backend folder

---

## Alternative: Use Dockerfile (If Root Directory doesn't work)

If the above doesn't work, Railway should automatically use the Dockerfile at the root.

Make sure in **Settings**:
- **Builder**: Dockerfile
- **Dockerfile Path**: `Dockerfile` (at root)

Then redeploy.

---

## Expected Build Output

After fixing, you should see:
```
✓ Detected Python
✓ Installing requirements from requirements.txt
✓ Successfully installed all packages
✓ Starting uvicorn server
```

---

## Verify Deployment

Once deployed, test:
```
https://your-backend.railway.app/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": 1234567890,
  "version": "1.0.0"
}
```

---

## 🆘 Still Having Issues?

### Option 1: Delete and Recreate Service
1. Delete current Railway service
2. Create new service
3. Select **Backend** folder during setup
4. Add environment variables
5. Deploy

### Option 2: Use Render Instead
Railway can be tricky with monorepos. Render is simpler:

1. Go to: https://render.com
2. New Web Service
3. Connect GitHub repo
4. **Root Directory**: `Backend`
5. **Build Command**: `pip install -r requirements.txt`
6. **Start Command**: `uvicorn routes:app --host 0.0.0.0 --port $PORT`
7. Add environment variables
8. Deploy

---

## Quick Commands for Testing Locally

```bash
# Test if Backend works
cd Backend
python -m uvicorn routes:app --reload

# Test health endpoint
curl http://localhost:8000/health
```

---

**The key is setting Root Directory to `Backend` in Railway settings!**
