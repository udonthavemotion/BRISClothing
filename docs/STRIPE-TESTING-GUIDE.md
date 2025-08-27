# 🧪 STRIPE CHECKOUT TESTING GUIDE

## Quick Start Testing

### 1. Environment Setup
```bash
# Create .env.local file with your Stripe test keys
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/9Ax53jRuv9z4JsRTJ60V/webhook-trigger/901f9ecd-0af6-4b78-8353-8678f0510286
NODE_ENV=development
```

### 2. Start Development Server
```bash
npm run dev
# Server should start at http://localhost:4321
```

### 3. Test API Endpoint
```bash
# Test the diagnostic endpoint first
curl http://localhost:4321/api/test-stripe

# Should return environment status and Stripe connection info
```

### 4. Test Checkout Flow
```bash
# Test checkout API directly
curl -X POST http://localhost:4321/api/stripe-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "brisco-white-tee",
        "quantity": 2,
        "size": "L", 
        "name": "BRISCO White Tee",
        "price": 65
      }
    ],
    "customerEmail": "test@example.com",
    "shippingOption": "standard"
  }'

# Should return: {"success": true, "url": "https://checkout.stripe.com/..."}
```

## Frontend Testing

### 1. Add Items to Cart
1. Go to http://localhost:4321
2. Add 2 white shirts (size L) to cart
3. Open cart drawer
4. Enter email address: `test@example.com`

### 2. Test Checkout
1. Click "Checkout" button
2. Should redirect to Stripe Checkout page
3. Use test card: `4242 4242 4242 4242`
4. Any future expiry date, any 3-digit CVC
5. Complete checkout

### 3. Verify Success
1. Should redirect to success page
2. Check console logs for session info
3. Verify webhook received in Stripe dashboard

## Pricing Verification

Test these scenarios to verify tiered pricing:

### Single Shirt ($65)
```bash
curl -X POST http://localhost:4321/api/stripe-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "brisco-white-tee", "quantity": 1, "name": "BRISCO White Tee", "price": 65}],
    "customerEmail": "test@example.com"
  }'
# Expected: $65 + $5 shipping = $70 total
```

### Two Shirts ($55 each = $110)
```bash
curl -X POST http://localhost:4321/api/stripe-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "brisco-white-tee", "quantity": 2, "name": "BRISCO White Tee", "price": 65}],
    "customerEmail": "test@example.com"
  }'
# Expected: $110 + $5 shipping = $115 total
```

### Four Shirts ($50 each = $200)
```bash
curl -X POST http://localhost:4321/api/stripe-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "brisco-white-tee", "quantity": 4, "name": "BRISCO White Tee", "price": 65}],
    "customerEmail": "test@example.com"
  }'
# Expected: $200 + $5 shipping = $205 total
```

## Troubleshooting Common Issues

### ❌ "Stripe not configured" Error
**Problem**: Missing or invalid Stripe secret key

**Solution**:
1. Check `.env.local` file exists in project root
2. Verify `STRIPE_SECRET_KEY` starts with `sk_test_`
3. Restart development server after adding variables

### ❌ "CORS Error" in Browser
**Problem**: Cross-origin request blocked

**Solution**:
1. Ensure you're accessing via `http://localhost:4321` (not `127.0.0.1`)
2. Check browser console for specific CORS error
3. Verify API route has correct CORS headers

### ❌ "Invalid response from server"
**Problem**: API returning non-JSON response

**Solution**:
1. Check server console for error logs
2. Test API endpoint directly with curl
3. Verify all environment variables are set

### ❌ Checkout button shows "Processing..." forever
**Problem**: Frontend not receiving proper response

**Solution**:
1. Open browser dev tools → Network tab
2. Click checkout and check API request/response
3. Look for error in console logs
4. Verify email validation is passing

## Test Cards

Use these Stripe test cards for different scenarios:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Card declined |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 9987` | Lost card |
| `4000 0000 0000 9979` | Stolen card |

## Webhook Testing

### 1. Set Up Local Webhook
```bash
# Install Stripe CLI (optional)
stripe listen --forward-to localhost:4321/api/stripe-webhook

# Or use ngrok for public URL
ngrok http 4321
# Use the https URL in Stripe dashboard
```

### 2. Test Webhook Delivery
1. Complete a test checkout
2. Check Stripe Dashboard → Developers → Webhooks
3. Look for successful delivery of `checkout.session.completed`
4. Check server logs for webhook processing

## Production Testing Checklist

Before going live:

- [ ] ✅ Test mode checkout works completely
- [ ] ✅ All pricing tiers calculate correctly (1=$65, 2=$110, 4=$200)
- [ ] ✅ Webhook receives and processes orders
- [ ] ✅ GoHighLevel integration receives data
- [ ] ✅ Success/cancel pages work properly
- [ ] ✅ Mobile checkout experience tested
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Live webhook endpoint configured
- [ ] ✅ Small real money test completed ($1-5)

## Debug Commands

### Check Environment Variables
```javascript
// In browser console on your site
fetch('/api/test-stripe').then(r => r.json()).then(console.log);
```

### Test Pricing Logic
```javascript
// In browser console
function testPricing(qty) {
  let price = qty >= 4 ? 50 : qty >= 2 ? 55 : 65;
  return qty * price;
}

console.log('1 shirt:', testPricing(1)); // Should be 65
console.log('2 shirts:', testPricing(2)); // Should be 110  
console.log('4 shirts:', testPricing(4)); // Should be 200
```

### Monitor Network Requests
1. Open browser dev tools (F12)
2. Go to Network tab
3. Add item to cart and checkout
4. Look for `/api/stripe-checkout` request
5. Check request payload and response

## Success Indicators

✅ **Working correctly when you see**:
- Console log: `[BRISCO STRIPE] Checkout session created: cs_test_...`
- Redirect to `https://checkout.stripe.com/c/pay/cs_test_...`
- Stripe checkout page loads with correct items and pricing
- Test payment completes successfully
- Redirect to success page with session ID

❌ **Something's wrong when you see**:
- Console error: `[BRISCO CHECKOUT] Error: ...`
- Toast message: "Checkout temporarily unavailable"
- No redirect after clicking checkout
- Stripe checkout page shows wrong pricing
- Webhook delivery failures in Stripe dashboard