# Stripe Configuration - Crystal AI / LilHelper

> **Last Updated**: December 12, 2025  
> **Status**: ✅ Keys Configured

---

## 🔑 Stripe Keys

### Publishable Key (Frontend - Safe to expose)
```
[Stored in AI memory - ask for value]
```
**Usage**: Add to Netlify as `VITE_STRIPE_PUBLISHABLE_KEY`

### Secret Key (Backend - Keep Private)
```
[Stored securely in Railway dashboard and AI memory]
```
**Usage**: Already configured in Railway ✅

---

## 💰 Product Price IDs

### Monthly Subscription - $9.99/month
```
[Stored in AI memory - ask for value]
```
**Usage**: Add to Netlify as `VITE_STRIPE_PRICE_ID`

---

## 🔗 Payment Link

### Direct Checkout URL
```
https://buy.stripe.com/6oUfZgDU5L9ixa3izgA801
```
**Usage**: 
- Add to Netlify as `VITE_STRIPE_PAYMENT_LINK`
- Can be used for direct checkout bypassing modal
- Pre-configured with pricing

---

## 📋 Deployment Checklist

### Netlify Environment Variables:
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_1SdPqmLL10W7bcCZ9LuAISAl
VITE_LILHELPER_MONTHLY_PRICE_ID=[paste-from-clipboard]
VITE_CRYSTAL_LIFETIME_PRICE_ID=price_1SdQDMLL10W7bcCZeVBjoHgV
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/6oUfZgDU5L9ixa3izgA801
```

### Railway Environment Variables:
```bash
STRIPE_SECRET_KEY=sk_1SdPqsLL10W7bcCZmq5YGPaX
```

---

## 🎯 Integration Points

### SubscriptionGate Component
**File**: `client/src/components/SubscriptionGate.tsx`

Currently uses price IDs to construct Stripe URLs:
```typescript
const monthlyPriceId = import.meta.env.VITE_LILHELPER_MONTHLY_PRICE_ID;
const lifetimePriceId = import.meta.env.VITE_CRYSTAL_LIFETIME_PRICE_ID;
```

**Alternative**: Can use direct payment link:
```typescript
const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK;
```

### Backend Webhook (Future)
When payment succeeds, Stripe webhook should:
1. Receive event at `/api/stripe/webhook`
2. Verify signature with `STRIPE_SECRET_KEY`
3. Update Supabase `profiles.is_subscriber = true`
4. Set `subscription_tier` to 'monthly' or 'lifetime'

---

## 🧪 Testing

### Test Mode Keys (If needed)
If you have test mode keys, add them to local `.env`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Live Mode Keys (Current - Production)
The keys above are **LIVE MODE** - real payments will be processed.

---

## 🔒 Security Notes

- ✅ Publishable key is safe to expose (starts with `pk_`)
- ⚠️ Secret key must NEVER be in frontend code
- ⚠️ Secret key should ONLY be in Railway environment variables
- ✅ Price IDs are safe to expose
- ✅ Payment links are safe to share

---

## 📝 Next Steps

1. **Add to Netlify**: Go to Site Settings → Environment Variables
2. **Add to Railway**: Go to Variables tab
3. **Redeploy**: Push to trigger new build with variables
4. **Test**: Try subscribing on staging/production

---

**Stripe Dashboard**: https://dashboard.stripe.com/

