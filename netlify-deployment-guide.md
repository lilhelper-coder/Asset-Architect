# NETLIFY DEPLOYMENT GUIDE FOR CRYSTAL

## 🚨 IMPORTANT: Split Architecture Required

Netlify hosts static sites only. Crystal needs a Node.js backend with WebSocket support.

## ✅ SOLUTION: Deploy in Two Parts

### Part 1: Backend on Railway (or Render)
### Part 2: Frontend on Netlify

---

## 📋 STEP-BY-STEP DEPLOYMENT

### **STEP 1: DEPLOY BACKEND TO RAILWAY**

1. **Create Railway Account**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Select your repo**
4. **Add PostgreSQL database** (Railway provides this)
5. **Set Environment Variables**:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   NODE_ENV=production
   PORT=5000
   ```
6. **Railway auto-detects** Node.js and runs:
   - Build: `npm run build`
   - Start: `npm start`
7. **Get your Railway URL**: e.g., `crystal-production.up.railway.app`
8. **Optional**: Add custom domain like `api.lilhelper.ai`

---

### **STEP 2: UPDATE FRONTEND FOR PRODUCTION API**

We need to tell the frontend where the backend is hosted.

**Create this file**: `client/.env.production`

```env
VITE_API_BASE_URL=https://crystal-production.up.railway.app
```

Or if using custom domain:
```env
VITE_API_BASE_URL=https://api.lilhelper.ai
```

**Update queryClient.ts**:

```typescript
// client/src/lib/queryClient.ts
import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Use Vite environment variable or fallback to same origin
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                 (typeof window !== 'undefined' ? window.location.origin : '');

// Rest of the file stays the same...
```

---

### **STEP 3: DEPLOY FRONTEND TO NETLIFY**

#### **A. Create Netlify Configuration**

**Create file**: `netlify.toml` in project root:

```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

#### **B. Update Vite Config for Client-Only Build**

**File**: `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "client",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
```

#### **C. Deploy to Netlify**

**Method 1: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

**Method 2: Netlify Dashboard**
1. Go to https://app.netlify.com
2. "Add new site" → "Import from Git"
3. Connect your GitHub repo
4. **Build settings**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
5. **Environment variables**:
   - `VITE_API_BASE_URL` = `https://your-railway-url.railway.app`
6. Deploy!

**Method 3: Drag & Drop**
```bash
cd client
npm run build
# Drag the 'dist' folder to Netlify dashboard
```

---

### **STEP 4: CONFIGURE CORS ON BACKEND**

Your backend needs to accept requests from Netlify domain.

**Update**: `server/index.ts`

Add after line 9:

```typescript
import cors from 'cors';

// Add CORS middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5000',
    'https://www.lilhelper.ai',
    'https://lilhelper.ai',
  ],
  credentials: true,
}));
```

**Install cors**:
```bash
npm install cors
npm install --save-dev @types/cors
```

Redeploy backend to Railway.

---

### **STEP 5: CUSTOM DOMAIN SETUP**

#### **For Netlify (Frontend)**:
1. Netlify Dashboard → Domain settings
2. Add custom domain: `www.lilhelper.ai`
3. Netlify provides DNS instructions
4. Update your DNS records at your registrar

#### **For Railway (Backend)** - OPTIONAL:
1. Railway Dashboard → Settings
2. Add custom domain: `api.lilhelper.ai`
3. Add CNAME record pointing to Railway

---

## 🔧 WEBSOCKET CONFIGURATION

Since backend is on different domain, update WebSocket URL:

**File**: `client/src/hooks/useVoiceConnection.ts`

Around line 176:

```typescript
const wsUrl = import.meta.env.VITE_API_BASE_URL
  ? import.meta.env.VITE_API_BASE_URL.replace(/^http/, 'ws') + '/api/voice'
  : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/voice`;

wsRef.current = new WebSocket(wsUrl);
```

---

## ✅ FINAL CHECKLIST

- [ ] Backend deployed to Railway
- [ ] PostgreSQL database connected
- [ ] OPENAI_API_KEY set on Railway
- [ ] Railway URL obtained
- [ ] `client/.env.production` created with Railway URL
- [ ] `netlify.toml` created
- [ ] CORS configured on backend
- [ ] Frontend deployed to Netlify
- [ ] Custom domain added to Netlify
- [ ] DNS records updated
- [ ] Test: https://www.lilhelper.ai loads
- [ ] Test: API calls work
- [ ] Test: WebSocket connects
- [ ] Test: Voice conversation works

---

## 🧪 TESTING COMMANDS

After deployment:

```bash
# Test frontend
curl https://www.lilhelper.ai

# Test backend health
curl https://your-railway-url.railway.app/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

**Test WebSocket** (in browser console):
```javascript
const ws = new WebSocket('wss://your-railway-url.railway.app/api/voice');
ws.onopen = () => console.log('Connected!');
ws.onerror = (e) => console.error('Error:', e);
```

---

## 🚨 COMMON ISSUES

### **Issue**: "Failed to fetch" errors
**Solution**: Check CORS configuration on backend

### **Issue**: WebSocket fails to connect
**Solution**: Ensure using `wss://` (not `ws://`) for HTTPS sites

### **Issue**: Environment variables not working
**Solution**: Prefix with `VITE_` for client-side access

### **Issue**: 404 on routes
**Solution**: Ensure `netlify.toml` has SPA redirect rule

---

## 💰 COST ESTIMATE

- **Netlify**: Free tier (100GB bandwidth, 300 build minutes)
- **Railway**: ~$5/month (includes PostgreSQL)
- **Total**: ~$5/month

---

## 🎯 ALTERNATIVE: ALL-IN-ONE PLATFORMS

If you want simpler deployment (single platform):

### **Option A: Move to Vercel**
- Supports both frontend and serverless functions
- But: WebSocket needs external service (Pusher, Ably)
- More complex for real-time features

### **Option B: Move to Render**
- Supports full-stack apps
- One platform for everything
- Free PostgreSQL included
- Better for apps with WebSockets

### **Option C: Move to Railway**
- Best for full-stack Node.js apps
- Automatic PostgreSQL
- WebSocket support
- Simple deployment

---

## 📞 NEED HELP?

If something goes wrong:
1. Check Railway logs: Railway Dashboard → Deployments → Logs
2. Check Netlify logs: Netlify Dashboard → Deploys → Build log
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

## 🎉 SUCCESS!

Once deployed:
- Frontend: https://www.lilhelper.ai
- Backend: https://your-railway-url.railway.app
- Health: https://your-railway-url.railway.app/api/health

Users visit www.lilhelper.ai, tap the Crystal orb, and start talking! 🔮✨

