# AI Architect - Complete Feature Setup Guide

## 🎯 Overview
This guide will help you set up each feature of the AI Architect platform step by step.

---

## 📋 Prerequisites

### 1. Frontend (Already Done ✅)
- Node.js v22.x installed
- Dependencies installed (`npm install`)
- Supabase configured in `.env.local`
- Dev server running on http://localhost:3000

### 2. Backend (Needs Setup)
- Python 3.8+ installed
- Backend dependencies need to be installed
- API keys need to be configured

---

## 🚀 Quick Start - Backend Setup

### Step 1: Install Python Dependencies
```bash
cd Backend
pip install -r requirements.txt
```

### Step 2: Create Backend Environment File
Create a `.env` file in the `Backend` directory with the following:

```env
# Required for AI Features
GROQ_API_KEY=your_groq_api_key_here

# Optional but Recommended
HUGGING_FACE_API_TOKEN=your_huggingface_token
STABILITY_API_KEY=your_stability_api_key
OPENAI_API_KEY=your_openai_api_key

# Image Provider APIs (for design feed)
PEXELS_API_KEY=your_pexels_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
PIXABAY_API_KEY=your_pixabay_key

# Location Services (for contractor marketplace)
GEOAPIFY_API_KEY=your_geoapify_key

# Vastu/Astrology Services (optional)
ASTROLOGY_API_KEY=your_astrology_api_key
```

### Step 3: Start Backend Server
```bash
cd Backend
python -m uvicorn routes:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at: http://localhost:8000

---

## 🎨 Feature-by-Feature Setup

### 1. ✅ Authentication (WORKING)
**Status**: Already configured with Supabase
**Pages**: `/auth/signin`, `/auth/signup`
**What works**:
- User registration
- Email/password login
- Session management
- Protected routes

**No additional setup needed!**

---

### 2. 🎨 AI Design Generator
**Status**: Requires Backend + API Keys
**Page**: `/ai-generator` or `/dashboard/ai-generator`

**Required API Keys**:
- `GROQ_API_KEY` (Primary - Free tier available)
- OR `OPENAI_API_KEY` (Alternative)
- OR `HUGGING_FACE_API_TOKEN` (Alternative)

**How to get API keys**:

#### Groq API (Recommended - Fast & Free)
1. Visit: https://console.groq.com
2. Sign up for free account
3. Go to API Keys section
4. Create new API key
5. Add to Backend `.env`: `GROQ_API_KEY=gsk_...`

#### OpenAI API (Alternative)
1. Visit: https://platform.openai.com
2. Sign up and add payment method
3. Go to API Keys
4. Create new key
5. Add to Backend `.env`: `OPENAI_API_KEY=sk-...`

**Features**:
- Upload room photo
- AI generates redesign suggestions
- Multiple style options
- Download generated images

---

### 3. 📱 AR Furniture Placement
**Status**: Works with Backend (No API keys needed)
**Page**: `/ar-placement` or `/dashboard/ar-placement`

**Setup**:
1. Start backend server (it will auto-seed furniture models)
2. Access the page
3. Browse furniture catalog
4. Click "View AR" on any item

**Features**:
- 3D furniture preview (works on desktop)
- AR placement (works on mobile with AR support)
- iOS: Uses AR Quick Look
- Android: Uses Scene Viewer
- Desktop: Interactive 3D viewer

**Testing**:
- Desktop: Works immediately with 3D viewer
- Mobile: Scan QR code shown on desktop, or access directly on mobile device

---

### 4. 💰 AI Budget Planner
**Status**: Requires Backend + Groq API
**Page**: `/ai-budget` or `/dashboard/ai-budget`

**Required**:
- Backend running
- `GROQ_API_KEY` configured

**Features**:
- Room type selection
- Design style selection
- Material selection
- Budget estimation
- Cost breakdown by category
- Payment schedule
- Timeline estimation
- Money-saving tips
- Indian market insights

**How to use**:
1. Select room type (e.g., Living Room)
2. Choose design style (e.g., Modern)
3. Enter room size in sq meters
4. Add materials (e.g., "marble flooring", "wooden cabinets")
5. Select renovation scope
6. Click "Get Budget Prediction"

---

### 5. 🎨 AI Color Palette Generator
**Status**: Requires Backend + Groq API
**Page**: `/ai-colors` or `/dashboard/ai-colors`

**Required**:
- Backend running
- `GROQ_API_KEY` configured

**Features**:
- Generate color palettes for rooms
- Style-based recommendations
- Mood-based color selection
- Export color codes

---

### 6. 🏗️ AI Materials Recommender
**Status**: Requires Backend + Groq API
**Page**: `/ai-materials` or `/dashboard/ai-materials`

**Required**:
- Backend running
- `GROQ_API_KEY` configured

**Features**:
- Material recommendations based on room type
- Budget-conscious suggestions
- Durability ratings
- Maintenance requirements

---

### 7. 📐 AI Layout Planner
**Status**: Requires Backend + Groq API
**Page**: `/ai-layout` or `/dashboard/ai-layout`

**Required**:
- Backend running
- `GROQ_API_KEY` configured

**Features**:
- Room layout suggestions
- Furniture placement recommendations
- Space optimization
- Traffic flow analysis

---

### 8. 📊 Floor Plans
**Status**: Requires Backend
**Page**: `/floor-plans` or `/dashboard/floor-plans`

**Required**:
- Backend running

**Features**:
- Pre-made floor plan templates
- Customizable layouts
- Room dimensions
- Multiple styles (1BHK, 2BHK, 3BHK, etc.)

---

### 9. 🕉️ Vastu Analyzer
**Status**: Requires Backend + Groq API
**Page**: `/dashboard/vastu` or `/dashboard/vastu/vastu-analyzer`

**Required**:
- Backend running
- `GROQ_API_KEY` configured
- Optional: `ASTROLOGY_API_KEY` for enhanced features

**Features**:
- Vastu compliance checking
- Direction analysis
- Room placement recommendations
- Remedies for Vastu defects

---

### 10. 🛍️ Shopping Integration
**Status**: Requires Backend + Image APIs
**Page**: `/dashboard/shopping`

**Required**:
- Backend running
- Optional: `PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY` for better results

**Features**:
- Browse furniture and decor
- Price comparisons
- Product recommendations
- Direct purchase links

---

### 11. 🎨 Design Feed
**Status**: Requires Backend + Image APIs
**Page**: `/design-feed` or `/dashboard/design-feed`

**Required**:
- Backend running
- Recommended: `PEXELS_API_KEY`, `UNSPLASH_ACCESS_KEY`, `PIXABAY_API_KEY`

**How to get Image API keys**:

#### Pexels (Free)
1. Visit: https://www.pexels.com/api/
2. Sign up for free
3. Get API key
4. Add to Backend `.env`: `PEXELS_API_KEY=...`

#### Unsplash (Free)
1. Visit: https://unsplash.com/developers
2. Create app
3. Get Access Key
4. Add to Backend `.env`: `UNSPLASH_ACCESS_KEY=...`

#### Pixabay (Free)
1. Visit: https://pixabay.com/api/docs/
2. Sign up
3. Get API key
4. Add to Backend `.env`: `PIXABAY_API_KEY=...`

**Features**:
- Browse design inspiration
- Filter by room type and style
- Save favorites
- Share designs

---

### 12. 🤝 Collaboration & Contractor Marketplace
**Status**: Requires Backend + Supabase + Location API
**Page**: `/collaborate` or `/dashboard/collaborate`

**Required**:
- Backend running
- Supabase configured (already done)
- Optional: `GEOAPIFY_API_KEY` for location features

**Features**:
- Find contractors, architects, designers
- Post project requirements
- Receive bids
- Real-time chat
- Project collaboration

---

### 13. 📈 Analytics Dashboard
**Status**: Requires Supabase
**Page**: `/analytics` or `/dashboard/analytics`

**Required**:
- Supabase configured (already done)

**Features**:
- Project statistics
- Budget tracking
- Timeline visualization
- Activity logs

---

### 14. 🤖 AI Assistant
**Status**: Requires Backend + Groq API
**Page**: `/assistant` or `/dashboard/assistant`

**Required**:
- Backend running
- `GROQ_API_KEY` configured

**Features**:
- Chat with AI about design questions
- Get recommendations
- Ask about materials, colors, layouts
- Project planning assistance

---

## 🔑 Priority API Keys to Get Started

### Essential (Get These First):
1. **Groq API** (Free) - Powers most AI features
   - https://console.groq.com
   - Used for: AI Generator, Budget, Colors, Materials, Layout, Vastu, Assistant

### Recommended (Free Tier Available):
2. **Pexels API** (Free) - Design inspiration images
   - https://www.pexels.com/api/
3. **Unsplash API** (Free) - High-quality design photos
   - https://unsplash.com/developers

### Optional (For Enhanced Features):
4. **OpenAI API** (Paid) - Alternative to Groq
5. **Stability AI** (Paid) - Advanced image generation
6. **Geoapify** (Free tier) - Location services

---

## 🧪 Testing Each Feature

### 1. Test Backend Connection
```bash
# In a new terminal
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

### 2. Test AI Features
1. Go to http://localhost:3000/ai-budget
2. Fill in the form
3. Click "Get Budget Prediction"
4. Should see AI-generated budget breakdown

### 3. Test AR Features
1. Go to http://localhost:3000/ar-placement
2. Browse furniture catalog
3. Click "View AR" on any item
4. Should see 3D model viewer

### 4. Test Authentication
1. Go to http://localhost:3000/auth/signup
2. Create account
3. Should redirect to dashboard

---

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is free: `netstat -ano | findstr :8000`

### AI features not working
- Verify backend is running: http://localhost:8000
- Check Groq API key is set in Backend/.env
- Check browser console for errors

### AR not working
- Desktop: Should work immediately with 3D viewer
- Mobile: Need HTTPS or localhost
- Check if backend is running (furniture data comes from backend)

### Images not loading
- Check if image API keys are configured
- Some features work without API keys using fallback data

---

## 📝 Next Steps

1. **Start Backend**: `cd Backend && python -m uvicorn routes:app --reload`
2. **Get Groq API Key**: https://console.groq.com (Free)
3. **Test AI Budget**: http://localhost:3000/ai-budget
4. **Test AR Placement**: http://localhost:3000/ar-placement
5. **Explore Dashboard**: http://localhost:3000/dashboard

---

## 💡 Tips

- **Free Tier Limits**: Most APIs have generous free tiers
- **Start Simple**: Get Groq API key first, add others later
- **Mobile Testing**: Use `npm run dev:mobile` to test on phone
- **Database**: SQLite is used locally (no setup needed)
- **Production**: Set environment variables in deployment platform

---

## 🆘 Need Help?

- Check browser console (F12) for errors
- Check backend logs in terminal
- Verify API keys are correct
- Ensure both frontend and backend are running
- Check `.env` files are in correct locations

---

**Happy Building! 🏗️✨**
