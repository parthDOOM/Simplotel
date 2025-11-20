# 🚀 Deployment Guide

Complete guide for deploying the Intelligent Voice Bot to Vercel or Netlify.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ MongoDB Atlas account (free tier) - [mongodb.com/atlas](https://www.mongodb.com/atlas)
- ✅ Groq API key - [console.groq.com](https://console.groq.com)
- ✅ GitHub account (for CI/CD integration)
- ✅ Vercel or Netlify account

---

## 🎯 Deployment Architecture

```
Frontend (Client)          Backend (Server)
─────────────────         ──────────────────
Vercel/Netlify     ←──→   Vercel/Railway/Render
(Static Site)              (Node.js API)
                             │
                             ↓
                        MongoDB Atlas
                        (Database)
```

---

## 🟢 Option 1: Deploy to Vercel (Recommended)

Vercel provides seamless deployment for both frontend and backend.

### Step 1: Prepare Your Repository

```powershell
# Initialize git repository (if not already)
cd e:\Simplotel
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
# Go to github.com, create new repo, then:
git remote add origin https://github.com/YOUR_USERNAME/voice-bot.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend (Client) to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Click **"Deploy"**

Your frontend will be live at: `https://your-project.vercel.app`

### Step 3: Deploy Backend (Server) to Vercel

1. In Vercel dashboard, click **"Add New Project"**
2. Import the **same repository** again
3. Configure build settings:
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://username:password@cluster.mongodb.net/voicebot`
   - `GROQ_API_KEY` = `your_groq_api_key_here`

5. Click **"Deploy"**

Your backend will be live at: `https://your-project-api.vercel.app`

### Step 4: Update Frontend API URL

Update the API base URL in your client code:

```typescript
// client/src/services/api.ts
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-project-api.vercel.app/api'
  : 'http://localhost:5000/api';
```

Redeploy the frontend for changes to take effect.

---

## 🔵 Option 2: Deploy to Netlify

Netlify is great for static sites. You'll need a separate backend host.

### Step 1: Deploy Frontend to Netlify

1. **Go to [netlify.com](https://netlify.com)** and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

5. Click **"Deploy site"**

Your frontend will be live at: `https://your-project.netlify.app`

### Step 2: Deploy Backend (Choose One)

#### Option A: Railway (Recommended for Backend)

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`

5. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `your_mongodb_atlas_uri`
   - `GROQ_API_KEY` = `your_groq_api_key`

6. Deploy

#### Option B: Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New"** → **"Web Service"**
3. Connect your repository
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node

5. Add environment variables (same as above)

### Step 3: Update Frontend API URL

```typescript
// client/src/services/api.ts
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend.railway.app/api'  // or render URL
  : 'http://localhost:5000/api';
```

Commit and push changes. Netlify will auto-redeploy.

---

## 🗄️ MongoDB Atlas Setup

### Step 1: Create Database

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free cluster (M0)
3. Create database user:
   - Username: `voicebot`
   - Password: (generate strong password)
4. Add IP whitelist: `0.0.0.0/0` (allow from anywhere)

### Step 2: Get Connection String

1. Click **"Connect"** → **"Connect your application"**
2. Copy connection string:
   ```
   mongodb+srv://voicebot:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password
4. Add database name: `/voicebot` before the `?`

Final URI:
```
mongodb+srv://voicebot:yourpassword@cluster0.xxxxx.mongodb.net/voicebot?retryWrites=true&w=majority
```

---

## 🔐 Environment Variables Checklist

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/voicebot
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### Frontend (Optional - for build-time variables)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🧪 Testing Deployment

### 1. Test Backend API
```bash
curl https://your-backend.vercel.app/api/health
# Should return: {"status":"healthy","timestamp":"..."}
```

### 2. Test Frontend
1. Open `https://your-project.vercel.app`
2. Click microphone button
3. Grant permissions
4. Speak a message
5. Verify AI response

### 3. Check MongoDB
- Go to MongoDB Atlas → Collections
- Should see `sessions` and `messages` collections
- Verify data is being saved

---

## 🔄 Automatic Redeployment

Both Vercel and Netlify support automatic deployments:

1. **Push to GitHub:**
   ```powershell
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Auto-Deploy:** Platform automatically rebuilds and deploys

3. **Monitor:** Check deployment logs in platform dashboard

---

## ⚙️ Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain: `voicebot.yourdomain.com`
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

---

## 🐛 Troubleshooting

### Issue: CORS Errors

**Solution:** Update server CORS configuration:

```typescript
// server/src/server.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app',
    'https://your-project.netlify.app'
  ],
  credentials: true
}));
```

### Issue: MongoDB Connection Failed

**Solutions:**
- ✅ Check IP whitelist (use `0.0.0.0/0`)
- ✅ Verify connection string has correct password
- ✅ Ensure database name is included in URI

### Issue: Build Fails

**Solutions:**
- ✅ Check Node.js version (should be 18+)
- ✅ Verify all dependencies in `package.json`
- ✅ Check build logs for specific errors
- ✅ Try: `npm install && npm run build` locally

### Issue: API Key Invalid

**Solutions:**
- ✅ Verify Groq API key is correct
- ✅ Check key hasn't expired
- ✅ Ensure no extra spaces in environment variable

---

## 📊 Performance Optimization

### Frontend (Vercel/Netlify)
- ✅ Automatic CDN distribution
- ✅ Automatic HTTPS
- ✅ Gzip compression enabled
- ✅ HTTP/2 support

### Backend (Vercel/Railway)
- ✅ Use production MongoDB URI (Atlas)
- ✅ Enable connection pooling
- ✅ Add response caching (optional)
- ✅ Monitor with platform analytics

---

## 💰 Cost Estimates

### Free Tier Limits

| Service | Free Tier | Upgrade Needed? |
|---------|-----------|-----------------|
| **Vercel** | 100GB bandwidth/month | Unlikely for demo |
| **Netlify** | 100GB bandwidth/month | Unlikely for demo |
| **Railway** | $5 credit/month | Only for heavy use |
| **MongoDB Atlas** | 512MB storage | Unlikely for demo |
| **Groq API** | 30 req/min free | Sufficient for testing |

**Estimated Cost:** $0-5/month for low-moderate traffic

---

## 🎉 Success Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and health check passes
- [ ] MongoDB Atlas connected
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Microphone permissions work in production
- [ ] AI responses working
- [ ] Analytics dashboard showing data
- [ ] PDF export working
- [ ] Mobile responsive

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com)
- [Groq API Docs](https://console.groq.com/docs)

---

**Need help?** Check the main [README.md](README.md) or create an issue on GitHub.

**Deployment time:** ~15-30 minutes for first-time setup
