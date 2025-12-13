# 🚂 RAILWAY DEPLOYMENT GUIDE - CRYSTAL AI

## 🎯 QUICK START (5 MINUTES TO LIVE!)

Railway is the **easiest** way to deploy Crystal with everything included.

---

## 📋 STEP-BY-STEP DEPLOYMENT

### **STEP 1: CREATE RAILWAY ACCOUNT** (30 seconds)

1. Go to **railway.app**
2. Click "**Login with GitHub**"
3. Authorize Railway

---

### **STEP 2: DEPLOY CRYSTAL** (2 minutes)

#### **A. Create New Project**
1. Railway Dashboard → Click "**New Project**"
2. Select "**Deploy from GitHub repo**"
3. Choose your Crystal repository
4. Railway will:
   - ✅ Auto-detect Node.js
   - ✅ Install dependencies
   - ✅ Build automatically
   - ✅ Start the server

#### **B. Railway Auto-Configuration**
Railway detects these automatically:
```json
Build Command: npm run build
Start Command: npm start
Port: 5000 (auto-detected from process.env.PORT)
```

No configuration needed! 🎉

---

### **STEP 3: ADD POSTGRESQL DATABASE** (30 seconds)

1. In your Railway project, click "**+ New**"
2. Select "**Database**" → "**PostgreSQL**"
3. Railway automatically:
   - Creates database
   - Sets `DATABASE_URL` environment variable
   - Connects it to your app

---

### **STEP 4: SET ENVIRONMENT VARIABLES** (1 minute)

1. Click on your web service
2. Go to "**Variables**" tab
3. Add these:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=production
```

**That's it!** Railway auto-provides:
- ✅ DATABASE_URL (from PostgreSQL)
- ✅ PORT (Railway sets this)

4. Click "**Deploy**" (if not auto-deploying)

---

### **STEP 5: GET YOUR URL** (instant)

After deployment completes (~2 minutes):

1. Click on your service
2. Go to "**Settings**" tab
3. Find "**Domains**" section
4. You'll see: `crystal-production.up.railway.app`

**Copy this URL!** You'll need it for Netlify.

---

### **STEP 6: CUSTOM DOMAIN (OPTIONAL)** (2 minutes)

#### **A. Add Domain to Railway**
1. Settings → Domains
2. Click "**+ Custom Domain**"
3. Enter: `api.lilhelper.ai`
4. Railway shows DNS record to add

#### **B. Update DNS**
At your domain registrar (GoDaddy, Namecheap, etc.):
```
Type: CNAME
Name: api
Value: [your-app].up.railway.app
TTL: 3600
```

Wait 5-60 minutes for DNS propagation.

---

### **STEP 7: DEPLOY FRONTEND TO NETLIFY** (3 minutes)

#### **A. Netlify Setup**
1. Go to **app.netlify.com**
2. "**Add new site**" → "**Import from Git**"
3. Connect GitHub, select repo

#### **B. Build Settings**
```
Base directory: client
Build command: npm run build
Publish directory: client/dist
```

#### **C. Environment Variables**
Add in Netlify → Site settings → Environment variables:

```env
VITE_API_BASE_URL=https://crystal-production.up.railway.app
```

**Or if using custom domain:**
```env
VITE_API_BASE_URL=https://api.lilhelper.ai
```

#### **D. Deploy**
Click "**Deploy site**" - Netlify builds in ~2 minutes

#### **E. Custom Domain**
1. Domain settings → Add domain: `www.lilhelper.ai`
2. Netlify shows DNS configuration
3. Update at your registrar:
   ```
   Type: CNAME
   Name: www
   Value: [your-site].netlify.app
   ```

---

## ✅ VERIFICATION CHECKLIST

After deployment, test these URLs:

### **1. Backend Health Check**
```
https://crystal-production.up.railway.app/api/health
```
**Expected**: `{"status":"ok","timestamp":"2025-..."}`

### **2. Frontend Loads**
```
https://www.lilhelper.ai
```
**Expected**: Beautiful Crystal orb interface

### **3. WebSocket Test** (in browser console on www.lilhelper.ai)
```javascript
const ws = new WebSocket('wss://crystal-production.up.railway.app/api/voice');
ws.onopen = () => console.log('✅ Connected!');
ws.onerror = (e) => console.error('❌ Error:', e);
```
**Expected**: "✅ Connected!"

### **4. Voice Conversation**
1. Go to www.lilhelper.ai
2. Tap the Crystal orb
3. Allow microphone
4. Say: "Hello Crystal"
5. Crystal responds with voice!

---

## 📊 RAILWAY DASHBOARD

### **Monitor Your App:**
- **Logs**: See real-time application logs
- **Metrics**: CPU, Memory, Network usage
- **Deployments**: View deployment history
- **Variables**: Manage environment variables

### **View Logs:**
Railway Dashboard → Your Service → "**Deployments**" → Click latest → "**View Logs**"

---

## 💰 PRICING

### **Railway Costs:**
- **Trial**: $5 credit (no credit card required)
- **Hobby Plan**: $5/month (after trial)
  - Includes: 512MB RAM, PostgreSQL, unlimited bandwidth
  - Perfect for production!

### **Total Monthly Cost:**
- Netlify: **FREE** (100GB bandwidth)
- Railway: **$5/month**
- Domain: **Your existing cost**
- **Total**: **$5/month** 🎉

---

## 🔧 TROUBLESHOOTING

### **Build Fails**
**Check Railway logs for errors:**
1. Dashboard → Deployments → Latest build
2. Check for missing dependencies
3. Verify `package.json` is correct

**Common fixes:**
```bash
# If Railway can't find build script
# Verify package.json has:
"scripts": {
  "build": "npx tsc",
  "start": "cross-env NODE_ENV=production node dist/index.js"
}
```

### **Database Connection Error**
**Verify PostgreSQL is added:**
1. Railway project should show 2 services:
   - Your web app
   - PostgreSQL database
2. Check Variables tab has `DATABASE_URL`

### **OpenAI API Errors**
**Verify API key:**
1. Check Variables tab has `OPENAI_API_KEY`
2. Test key at platform.openai.com
3. Ensure you have API credits

### **WebSocket Won't Connect**
**Check CORS:**
- Verify `server/index.ts` has correct Netlify URL in CORS origins
- Must use `wss://` (not `ws://`) for HTTPS sites

### **"Connection Refused" on Frontend**
**Check environment variable:**
- Netlify must have `VITE_API_BASE_URL` set
- Must match your Railway URL exactly
- Redeploy frontend after changing

---

## 🚀 DEPLOYMENT COMMANDS

### **Redeploy Backend:**
Railway auto-deploys on Git push. Or manually:
1. Railway Dashboard → Your service
2. Click "**Deploy**" button

### **Redeploy Frontend:**
Netlify auto-deploys on Git push. Or manually:
1. Netlify Dashboard → Deploys
2. Click "**Trigger deploy**"

### **View Environment Variables:**
```bash
# Railway CLI (optional)
npm install -g @railway/cli
railway login
railway variables
```

---

## 📱 MOBILE TESTING

### **iOS (iPhone/iPad):**
1. Open Safari
2. Go to www.lilhelper.ai
3. Tap orb → Allow microphone
4. Speak clearly
5. Works perfectly! ✅

### **Android:**
1. Open Chrome
2. Go to www.lilhelper.ai
3. Tap orb → Allow microphone
4. Speak clearly
5. Works perfectly! ✅

### **Mobile Optimization:**
- ✅ Touch targets: 44x44px minimum
- ✅ Responsive design
- ✅ Safe area insets for notches
- ✅ PWA-ready (add to home screen)

---

## 🎯 POST-DEPLOYMENT OPTIMIZATION

### **Enable Caching:**
Already configured in `netlify.toml`:
- Static assets cached 1 year
- HTML served fresh

### **Monitor Performance:**
- Railway metrics show CPU/memory
- Netlify analytics show traffic
- Use lighthouse for scores

### **Database Maintenance:**
Railway PostgreSQL includes:
- ✅ Automatic backups
- ✅ Connection pooling
- ✅ SSL connections

---

## 🔐 SECURITY CHECKLIST

- ✅ HTTPS enabled (automatic)
- ✅ Environment variables secured
- ✅ CORS configured properly
- ✅ Database SSL enabled
- ✅ API keys not in code
- ✅ .env in .gitignore

---

## 📈 SCALING

### **When to Scale:**
If you hit these limits:
- 512MB RAM usage consistently
- Database storage > 1GB
- Need faster response times

### **Railway Scaling:**
1. Dashboard → Service → Settings
2. Increase resources:
   - RAM: Up to 32GB
   - CPU: Up to 32 cores
   - Database: Up to 512GB

Cost increases proportionally.

---

## 🎉 SUCCESS!

Once deployed, you have:
- ✅ Production-ready app at www.lilhelper.ai
- ✅ Voice AI working on all devices
- ✅ Database for user data
- ✅ WebSocket real-time communication
- ✅ Automatic HTTPS
- ✅ Global CDN (Netlify)
- ✅ 99.9% uptime

**Crystal is live and helping seniors worldwide! 🔮✨**

---

## 🆘 NEED HELP?

**Railway Support:**
- Discord: railway.app/discord
- Docs: docs.railway.app

**Netlify Support:**
- Docs: docs.netlify.com
- Forums: answers.netlify.com

**App Issues:**
- Check Railway logs
- Check browser console
- Verify environment variables
- Test API endpoints directly

