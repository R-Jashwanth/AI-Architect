# 🚀 Quick Start Guide - AI Architect

## Current Status ✅

### What's Already Running:
- ✅ Frontend: http://localhost:3000
- ✅ Supabase: Connected and configured
- ✅ Authentication: Working

### What Needs Setup:
- ⏳ Backend API Server
- ⏳ API Keys for AI features

---

## 🎯 Get Started in 3 Steps

### Step 1: Start the Backend (5 minutes)

```bash
# Open a NEW terminal window

# Navigate to backend folder
cd AI-Architect-main/Backend

# Install Python dependencies (first time only)
pip install -r requirements.txt

# Create .env file from example
copy .env.example .env

# Start the backend server
python -m uvicorn routes:app --host 0.0.0.0 --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Step 2: Get Your Free Groq API Key (2 minutes)

1. Visit: **https://console.groq.com**
2. Click "Sign Up" (free account)
3. Go to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_...`)
6. Open `Backend/.env` file
7. Replace `your_groq_api_key_here` with your actual key:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
8. Save the file
9. Restart the backend server (Ctrl+C, then run uvicorn command again)

### Step 3: Test Your Setup (1 minute)

1. Open browser: http://localhost:3000/ai-budget
2. Fill in the form:
   - Room Type: Living Room
   - Style: Modern
   - Room Size: 25
   - Add materials: "marble flooring", "wooden cabinets"
   - Renovation Scope: Full
3. Click "Get Budget Prediction"
4. You should see AI-generated budget breakdown! 🎉

---

## 🎨 Try Other Features

### AR Furniture Placement (No API key needed!)
1. Go to: http://localhost:3000/ar-placement
2. Browse furniture catalog
3. Click "View AR" on any item
4. See 3D model in your browser!

### AI Design Generator
1. Go to: http://localhost:3000/ai-generator
2. Upload a room photo
3. Select design style
4. Generate AI redesign

### AI Assistant
1. Go to: http://localhost:3000/assistant
2. Chat with AI about design questions
3. Get instant recommendations

---

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Check Python version (need 3.8+)
python --version

# Try installing dependencies again
pip install --upgrade -r requirements.txt
```

### "Connection refused" errors?
- Make sure backend is running on port 8000
- Check: http://localhost:8000 (should show FastAPI docs)

### AI features not working?
- Verify Groq API key is set in `Backend/.env`
- Restart backend server after adding API key
- Check browser console (F12) for errors

---

## 📚 What Each Feature Needs

| Feature | Backend | Groq API | Other APIs |
|---------|---------|----------|------------|
| Authentication | ❌ | ❌ | ✅ Supabase (done) |
| AR Placement | ✅ | ❌ | ❌ |
| AI Budget | ✅ | ✅ | ❌ |
| AI Generator | ✅ | ✅ | ❌ |
| AI Colors | ✅ | ✅ | ❌ |
| AI Materials | ✅ | ✅ | ❌ |
| AI Layout | ✅ | ✅ | ❌ |
| AI Assistant | ✅ | ✅ | ❌ |
| Vastu Analyzer | ✅ | ✅ | ❌ |
| Design Feed | ✅ | ❌ | 🔶 Pexels/Unsplash (optional) |
| Shopping | ✅ | ❌ | 🔶 Image APIs (optional) |
| Floor Plans | ✅ | ❌ | ❌ |
| Analytics | ❌ | ❌ | ✅ Supabase (done) |
| Collaboration | ✅ | ❌ | ✅ Supabase (done) |

**Legend:**
- ✅ Required and configured
- ✅ Required (needs setup)
- 🔶 Optional (enhances feature)
- ❌ Not needed

---

## 🎁 Bonus: Get More Free API Keys

### For Design Feed (Optional but Recommended):

**Pexels** (Free, unlimited):
1. Visit: https://www.pexels.com/api/
2. Sign up → Get API key
3. Add to `Backend/.env`: `PEXELS_API_KEY=your_key`

**Unsplash** (Free, 50 requests/hour):
1. Visit: https://unsplash.com/developers
2. Create app → Get Access Key
3. Add to `Backend/.env`: `UNSPLASH_ACCESS_KEY=your_key`

---

## 🎯 Recommended Order

1. ✅ **Start Backend** (5 min)
2. ✅ **Get Groq API Key** (2 min)
3. ✅ **Test AI Budget** (1 min)
4. ✅ **Try AR Placement** (1 min)
5. 🔶 **Add Image APIs** (optional, 5 min)
6. 🔶 **Explore all features** (fun!)

---

## 📱 Mobile Testing

Want to test AR on your phone?

```bash
# Stop current dev server (Ctrl+C)
# Start with network access
npm run dev:mobile
```

Then on your phone:
1. Connect to same WiFi as your computer
2. Open: http://YOUR_COMPUTER_IP:3000
3. Go to AR Placement
4. Try placing furniture in your real space!

---

## 💡 Pro Tips

- **Keep both terminals open**: One for frontend, one for backend
- **Groq is fast**: Responses come in 1-2 seconds
- **Free tier is generous**: 30 requests/minute on Groq
- **Start simple**: Get Groq key first, add others later
- **Check logs**: Backend terminal shows what's happening

---

## 🆘 Still Stuck?

1. Check `FEATURE_SETUP_GUIDE.md` for detailed instructions
2. Verify both servers are running:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
3. Check browser console (F12) for errors
4. Ensure `.env` files are in correct locations:
   - `AI-Architect-main/.env.local` (frontend)
   - `AI-Architect-main/Backend/.env` (backend)

---

**You're all set! Start with the AI Budget feature - it's impressive! 💰✨**
