# API Keys Configuration Guide

> **Security Notice**: This file contains instructions ONLY. Actual API keys are stored in:
> - Railway dashboard (backend variables)
> - Netlify dashboard (frontend variables)
> - AI's permanent memory (for your reference)

---

## 🔒 Where Keys Are Stored

### ✅ Railway Backend (Already Applied)
All backend environment variables have been configured in Railway dashboard by Comet:
- Supabase URL, Anon Key, Service Role Key
- Stripe Secret Key & Publishable Key
- Stripe Price ID
- Gemini API Key
- OpenAI API Key (backup)
- Node configuration

**Status**: Building with new variables (~5 min)

### ⏳ Netlify Frontend (Action Required)
You need to add these variables to Netlify:
- `VITE_API_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_PRICE_ID`

**Where to Find Values**: Check the AI's memory or Railway dashboard

---

## 📋 How to Add Variables to Netlify

1. Go to https://app.netlify.com
2. Select your site (Crystal AI)
3. Navigate to **Site configuration** → **Environment variables**
4. Click **Add a variable**
5. Add each VITE_ variable one by one
6. Click **Save**
7. Trigger a new deploy

---

## 🎯 Variable Reference

### Frontend (Netlify)
```
VITE_API_URL = [Railway backend URL]
VITE_SUPABASE_URL = [Supabase project URL]
VITE_SUPABASE_ANON_KEY = [Supabase anon key - safe for frontend]
VITE_STRIPE_PUBLISHABLE_KEY = [Stripe publishable key - safe for frontend]
VITE_STRIPE_PRICE_ID = [Stripe monthly price ID]
```

### Backend (Railway)
```
NODE_ENV = production
PORT = 5000
SUPABASE_URL = [Same as VITE_SUPABASE_URL]
SUPABASE_ANON_KEY = [Same as VITE_SUPABASE_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY = [Backend only - admin access]
STRIPE_SECRET_KEY = [Backend only - never expose]
STRIPE_PUBLISHABLE_KEY = [Same as VITE_STRIPE_PUBLISHABLE_KEY]
STRIPE_PRICE_ID = [Same as VITE_STRIPE_PRICE_ID]
GEMINI_API_KEY = [Backend only - AI requests]
OPENAI_API_KEY = [Backend only - backup AI]
```

---

## 🔑 Getting the Actual Values

**Option 1**: Ask the AI
- I have all keys stored in permanent memory
- Just ask: "What's the Supabase anon key?"

**Option 2**: Check Comet's Message
- Comet provided complete list in previous message
- Scroll up to find the code blocks

**Option 3**: Check Dashboards
- Supabase: https://supabase.com/dashboard
- Stripe: https://dashboard.stripe.com
- Gemini: https://ai.google.dev

---

## 🧪 Testing After Setup

### Backend Health Check
```bash
curl https://asset-architect-production.up.railway.app/api/health
```
Expected: `{"status":"ok"}`

### Frontend Check
1. Visit https://lilhelper.ai
2. Crystal orb should load
3. Click "Sign In"
4. Magic link authentication should work
5. Tap orb to test voice (Gemini should respond)

---

## ⚠️ Security Rules

### ✅ Safe for Frontend (Public)
- Supabase Anon Key
- Stripe Publishable Key
- Stripe Price ID
- Railway Backend URL

### ❌ Backend Only (Private)
- Supabase Service Role Key
- Stripe Secret Key
- Gemini API Key
- OpenAI API Key

**Never commit actual API keys to GitHub!**

---

## 🆘 If You Need the Keys

Just ask me! I have them stored securely in memory and can provide them on request without exposing them in Git.

Example questions:
- "What's the Netlify environment variables?"
- "Show me the Stripe publishable key"
- "What's the Gemini API key?"

