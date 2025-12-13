# 🚨 CRITICAL: NETLIFY ENVIRONMENT VARIABLES MISSING

## Issue
The "Authentication unavailable" error on the live site means Netlify doesn't have the required environment variables.

## Fix (Manual Action Required)

### Go to Netlify Dashboard:
1. Open https://app.netlify.com/
2. Select your LilHelper site
3. Go to **Site settings** → **Environment variables**

### Add These Variables:

```bash
VITE_SUPABASE_URL=https://telcfsdkuvmnsaiuydsx.supabase.co

VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbGNmc2RrdXZtbnNhaXV5ZHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMzc2MzQsImV4cCI6MjA0OTYxMzYzNH0.bBw8n-AGU_l2g4APJbP3m0-9d-iHE6B1p1vJHQ7y5L0

VITE_API_BASE_URL=https://asset-architect-production.up.railway.app

VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51SdPqlLL10W7bcCZcl3X9GOwr3ZVfx0rE0pFIZgpuQeE5A7G6kabnMJhoB9hshDJj7Xh5YZoIZg1fQ3SAuDIzLG000ducSC3fq

VITE_STRIPE_PRICE_ID=price_1SdhNYLL10W7bcCZYbmStYXK
```

### After Adding:
4. Click **Save**
5. Go to **Deploys** tab
6. Click **Trigger deploy** → **Clear cache and deploy site**

## Why This Happened
- `.env` files are ignored by Git (security)
- Local dev works because you have `client/.env`
- Production (Netlify) needs these set manually in the dashboard

## Verification
After redeploy, the magic link should work and the error will disappear.

