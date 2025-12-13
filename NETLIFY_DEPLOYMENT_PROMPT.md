# 🚀 DEPLOYMENT PROMPT FOR COMET ASSISTANT

**Copy this entire message to your Comet browser assistant:**

---

## 📋 DEPLOY CRYSTAL TO WWW.LILHELPER.AI (NETLIFY + RAILWAY)

I need to deploy my Crystal AI voice assistant app. The site uses **split architecture**:
- **Frontend (React)** → Netlify at www.lilhelper.ai
- **Backend (Node.js + WebSocket)** → Railway (or Render)
- **Database** → PostgreSQL on Railway/Neon

---

## 🎯 STEP 1: DEPLOY BACKEND TO RAILWAY

### Railway Setup:
1. Go to **railway.app** and create account
2. Click "**New Project**" → "**Deploy from GitHub repo**"
3. Authorize and select my repo
4. Railway will auto-detect Node.js

### Add PostgreSQL:
- Click "**+ New**" → "**Database**" → "**PostgreSQL**"
- Railway automatically connects it (sets DATABASE_URL)

### Set Environment Variables:
```env
OPENAI_API_KEY=sk-your-openai-key-here
NODE_ENV=production
```

### Deploy Settings (auto-detected):
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 5000

### Get Railway URL:
- After deployment, Railway gives you a URL like:
  - `crystal-production.up.railway.app`
- **Save this URL!** You'll need it for frontend.

### Optional - Custom Domain:
- Railway Settings → Add domain: `api.lilhelper.ai`
- Add CNAME record at your DNS provider

---

## 🎯 STEP 2: DEPLOY FRONTEND TO NETLIFY

### Netlify Setup:
1. Go to **app.netlify.com**
2. Click "**Add new site**" → "**Import an existing project**"
3. Connect to GitHub and select my repo

### Build Settings:
```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

### Environment Variables (CRITICAL!):
Add this in Netlify dashboard → Site settings → Environment variables:

```
VITE_API_BASE_URL=https://crystal-production.up.railway.app
```

**Replace with your actual Railway URL from Step 1!**

If using custom domain for backend:
```
VITE_API_BASE_URL=https://api.lilhelper.ai
```

### Deploy:
- Click "**Deploy site**"
- Netlify will build and deploy automatically

### Custom Domain:
1. Site settings → Domain management
2. Add custom domain: **www.lilhelper.ai**
3. Netlify shows DNS configuration
4. Update DNS at your registrar:
   - **A Record**: Point to Netlify (they provide IP)
   - **CNAME**: www → your-site.netlify.app
5. Enable HTTPS (automatic with Netlify)

---

## ✅ VERIFICATION STEPS

After deployment, test these:

### 1. Frontend loads:
```
https://www.lilhelper.ai
```
Should show Crystal app with animated orb

### 2. Backend health check:
```
https://your-railway-url.railway.app/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### 3. WebSocket (in browser console on www.lilhelper.ai):
```javascript
const ws = new WebSocket('wss://your-railway-url.railway.app/api/voice');
ws.onopen = () => console.log('✅ WebSocket Connected!');
ws.onerror = (e) => console.error('❌ WebSocket Error:', e);
```

### 4. Test voice conversation:
- Go to www.lilhelper.ai
- Tap the Crystal orb
- Allow microphone access
- Speak - Crystal should respond!

---

## 🔧 DNS CONFIGURATION

At your domain registrar (GoDaddy, Namecheap, etc.):

### For www.lilhelper.ai (Netlify):
```
Type: CNAME
Name: www
Value: your-site.netlify.app
TTL: Automatic
```

### For api.lilhelper.ai (Railway - OPTIONAL):
```
Type: CNAME  
Name: api
Value: your-railway-url.railway.app
TTL: Automatic
```

### For root domain redirect:
```
Type: A
Name: @
Value: 75.2.60.5 (Netlify load balancer)
```

---

## 📦 FILES ALREADY CONFIGURED

These files are ready in the repo:
- ✅ `netlify.toml` - Netlify configuration
- ✅ CORS enabled on backend (accepts Netlify domain)
- ✅ Environment variable support
- ✅ WebSocket URL configuration
- ✅ SPA routing configured

---

## 🚨 TROUBLESHOOTING

### "Failed to fetch" errors:
- Check `VITE_API_BASE_URL` is set correctly in Netlify
- Verify CORS is working on backend
- Check Railway logs for errors

### WebSocket won't connect:
- Must use `wss://` (secure) for HTTPS sites
- Verify Railway backend is running
- Check browser console for errors

### 404 on routes:
- Ensure `netlify.toml` is in repo root
- Redeploy frontend if needed

### Build fails:
- Check build logs in Netlify dashboard
- Verify `client/` directory structure
- Check Node version (should be 20.x)

---

## 💰 COST

- **Netlify**: FREE (100GB bandwidth, 300 build minutes)
- **Railway**: ~$5/month (includes PostgreSQL)
- **Domain**: Your existing domain cost
- **Total**: ~$5/month

---

## 🎉 SUCCESS CRITERIA

When done, you should have:
- ✅ www.lilhelper.ai shows Crystal app
- ✅ Voice conversation works
- ✅ HTTPS enabled (automatic)
- ✅ WebSocket connects
- ✅ Database connected
- ✅ Crystal responds to voice

---

## 📝 QUICK REFERENCE

**Repo structure:**
```
/client       → Frontend (React) - deploys to Netlify
/server       → Backend (Node.js) - deploys to Railway
/shared       → Shared types
netlify.toml  → Netlify config (in root)
```

**Key environment variables:**
```
Backend (Railway):
- OPENAI_API_KEY (required)
- DATABASE_URL (auto-set by Railway)
- NODE_ENV=production

Frontend (Netlify):
- VITE_API_BASE_URL (your Railway URL)
```

**Test URLs after deployment:**
- Frontend: https://www.lilhelper.ai
- Backend health: https://[railway-url]/api/health
- Backend test: https://[railway-url]/api/test

---

## 🎯 DEPLOYMENT CHECKLIST

- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database added on Railway
- [ ] OPENAI_API_KEY set on Railway
- [ ] Railway URL obtained
- [ ] Netlify account created
- [ ] VITE_API_BASE_URL set in Netlify
- [ ] Frontend deployed to Netlify
- [ ] Custom domain added to Netlify
- [ ] DNS records updated
- [ ] HTTPS enabled (automatic)
- [ ] www.lilhelper.ai loads ✅
- [ ] Voice conversation tested ✅

---

**Please deploy following these steps. Report any errors with the specific error message and which step failed.**

