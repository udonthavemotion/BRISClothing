# 🔐 ENVIRONMENT VARIABLES SETUP GUIDE

## Local Development (.env.local)

Create a `.env.local` file in your project root with these variables:

```bash
# BRISCO CLOTHING - LOCAL DEVELOPMENT ENVIRONMENT VARIABLES

# =============================================================================
# STRIPE CONFIGURATION (TEST MODE)
# =============================================================================
# Get these from your Stripe Dashboard -> Developers -> API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_51...your_test_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_51...your_test_publishable_key_here

# Webhook secret from Stripe Dashboard -> Developers -> Webhooks
# Create webhook endpoint: http://localhost:4321/api/stripe-webhook
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret_here

# =============================================================================
# GOHIGHLEVEL INTEGRATION
# =============================================================================
# Your GoHighLevel webhook URL (already configured)
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/9Ax53jRuv9z4JsRTJ60V/webhook-trigger/901f9ecd-0af6-4b78-8353-8678f0510286

# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================
NODE_ENV=development
```

## Production (Vercel Environment Variables)

In your Vercel dashboard, set these environment variables:

```bash
# STRIPE CONFIGURATION (LIVE MODE)
STRIPE_SECRET_KEY=sk_live_51...your_live_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_live_51...your_live_publishable_key_here

# Webhook secret from Stripe Dashboard -> Developers -> Webhooks (Live Mode)
# Create webhook endpoint: https://www.brisclothing.com/api/stripe-webhook
STRIPE_WEBHOOK_SECRET=whsec_...your_live_webhook_secret_here

# GOHIGHLEVEL INTEGRATION (same as development)
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/9Ax53jRuv9z4JsRTJ60V/webhook-trigger/901f9ecd-0af6-4b78-8353-8678f0510286

# PRODUCTION SETTINGS
NODE_ENV=production
```

## Setup Instructions

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers → API Keys**
3. Copy your **Test** keys for local development:
   - `Publishable key` (starts with `pk_test_`)
   - `Secret key` (starts with `sk_test_`)

### 2. Set Up Webhooks

#### For Local Development:
1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click **+ Add endpoint**
3. Set endpoint URL: `http://localhost:4321/api/stripe-webhook`
4. Select events: `checkout.session.completed`, `payment_intent.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)

#### For Production:
1. Create another webhook endpoint
2. Set endpoint URL: `https://www.brisclothing.com/api/stripe-webhook`
3. Same events as above
4. Copy the production webhook secret

### 3. Configure Environment Variables

#### Local Development:
1. Create `.env.local` file in project root
2. Add the variables from the template above
3. Replace placeholder values with your actual Stripe keys

#### Production (Vercel):
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable with your **live** Stripe keys
4. Deploy to apply changes

### 4. Test Your Setup

#### Local Testing:
```bash
# Start development server
npm run dev

# Test with Stripe test card: 4242 4242 4242 4242
# Any future expiry date, any 3-digit CVC
```

#### Production Testing:
1. Use a small real transaction ($1-5)
2. Verify money appears in Stripe dashboard
3. Check GoHighLevel receives order data

## Security Notes

- ⚠️ **Never commit `.env.local` to Git**
- 🔒 **Keep secret keys private**
- 🔄 **Use test keys for development, live keys for production**
- 📋 **Regenerate keys if compromised**

## Troubleshooting

### "Stripe not configured" Error
- Check that `STRIPE_SECRET_KEY` is set correctly
- Verify the key starts with `sk_test_` (development) or `sk_live_` (production)
- Redeploy after adding environment variables in Vercel

### Webhook Signature Verification Failed
- Ensure `STRIPE_WEBHOOK_SECRET` matches your Stripe dashboard
- Check that webhook URL is correct
- Verify webhook is receiving POST requests

### Environment Variables Not Loading
- Restart development server after creating `.env.local`
- Check file is in project root (same level as `package.json`)
- Ensure no typos in variable names
