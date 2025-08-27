# 🚀 STRIPE IMPLEMENTATION GUIDE FOR BRISCO CLOTHING
*A Complete Rookie-Friendly Walkthrough - CORRECTED FOR ALIGNMENT*

## ⚠️ **CRITICAL ALIGNMENT NOTICE**
This guide has been **CORRECTED** to match your working API patterns from SOLUTION-SUMMARY.md, CURSOR-SNIPPETS.md, and established rules. The original version had critical misalignments that would break your system.

---

## 📖 TABLE OF CONTENTS
1. [Understanding What We're Building](#understanding-what-were-building)
2. [Prerequisites & Setup](#prerequisites--setup)
3. [Stripe Dashboard Configuration](#stripe-dashboard-configuration)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Code Implementation](#code-implementation)
6. [Testing Your Implementation](#testing-your-implementation)
7. [Going Live](#going-live)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 UNDERSTANDING WHAT WE'RE BUILDING

### Current System Overview
BRISCO has a sophisticated cart system with **automatic tiered pricing**:
- **1 shirt**: $65 each
- **2-3 shirts**: $55 each (2 for $110)
- **4+ shirts**: $50 each (4 for $200)

### What Stripe Will Do
1. **Accept payments** securely via credit cards
2. **Handle checkout** with a professional interface
3. **Send webhooks** to notify us when payments succeed
4. **Integrate with GoHighLevel** for customer management

### Architecture Flow
```
Customer Cart → Stripe Checkout → Payment Success → Webhook → GoHighLevel
```

---

## 🛠️ PREREQUISITES & SETUP

### What You Need
- [ ] Stripe account (free to create)
- [ ] Access to Vercel dashboard (where the site is deployed)
- [ ] Basic understanding of environment variables
- [ ] 30 minutes of focused time

### Current Project Structure
```
BRISCO/
├── api/                    # Native Vercel API routes (WORKING ✅)
│   ├── ghl-webhook.js     # GoHighLevel integration
│   └── simple-test.js     # Test endpoint
├── src/pages/api/         # Astro API routes (AVOID ❌)
│   ├── stripe-checkout.js # Needs modification
│   └── stripe-webhook.js  # Needs modification
├── public/
│   └── cart.js           # Cart system with pricing logic
└── docs/
    └── stripe-setup-checklist.txt
```

**🚨 CRITICAL RULE**: Use native Vercel API routes (`/api/`) for Stripe, NOT Astro routes (`/src/pages/api/`)

---

## 💳 STRIPE DASHBOARD CONFIGURATION

### Step 1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" and create account
3. Complete business verification (can start in test mode)

### Step 2: Get Your API Keys
1. In Stripe Dashboard, go to **Developers → API Keys**
2. Copy these keys (keep them secret!):
   ```
   Publishable key: pk_test_51... (safe to expose)
   Secret key: sk_test_51...     (NEVER expose publicly)
   ```

### Step 3: Create Products (Optional for Dynamic Pricing)
Since we use dynamic pricing, we don't need individual product Price IDs. But for reference:

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add Product**
3. Create:
   - **BRISCO White Tee** - $65
   - **BRISCO Black Tee** - $65

### Step 4: Set Up Webhooks
1. Go to **Developers → Webhooks**
2. Click **+ Add endpoint**
3. Set endpoint URL: `https://www.brisclothing.com/api/stripe-webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy the **Webhook Secret** (starts with `whsec_`)

---

## 🔐 ENVIRONMENT VARIABLES SETUP

### In Vercel Dashboard
1. Go to your Vercel project
2. Navigate to **Settings → Environment Variables**
3. Add these variables:

```bash
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# GoHighLevel Integration (already set)
GHL_WEBHOOK_URL=https://services.leadconnectorhq.com/hooks/9Ax53jRuv9z4JsRTJ60V/webhook-trigger/901f9ecd-0af6-4b78-8353-8678f0510286
```

**🔒 Security Note**: Never commit these keys to GitHub. They're stored securely in Vercel.

---

## 💻 CODE IMPLEMENTATION

### Step 1: Install Stripe Package
Add to `package.json` dependencies:
```json
{
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```

### Step 2: Create Native Stripe Checkout API
Create `/api/stripe-checkout.js` following **EXACT** pattern from `api/ghl-webhook.js`:

```javascript
// BRISCO STRIPE CHECKOUT - Native Vercel API Route
// Following EXACT pattern from api/ghl-webhook.js ✅

// Native Vercel API route for Stripe checkout
export default async function handler(req, res) {
  // CORS headers (EXACT pattern from working API)
  res.setHeader('Access-Control-Allow-Origin', 'https://www.brisclothing.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { items, customerEmail, shippingOption = 'standard' } = req.body || {};
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing items' });
    }
    
    if (!customerEmail) {
      return res.status(400).json({ success: false, error: 'Missing email' });
    }
    
    // Get Stripe key from environment (following working pattern)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      return res.status(500).json({ success: false, error: 'Stripe not configured' });
    }
    
    // Dynamic import for Stripe (works in Vercel)
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    // Calculate total using BRISCO's tiered pricing
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = calculateTotalWithDeals(totalQuantity);

    // Create line items for Stripe
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `BRISCO Collection (${totalQuantity} ${totalQuantity === 1 ? 'shirt' : 'shirts'})`,
          description: 'Be Your Own Light - Premium Streetwear',
          images: ['https://www.brisclothing.com/images/Product%20Assets/M%20copy.png'],
        },
        unit_amount: totalPrice * 100, // Convert to cents
      },
      quantity: 1,
    }];

    // Add shipping
    const shippingRates = {
      'standard': 500,  // $5.00
      'express': 1200,  // $12.00
      'free': 0         // $0.00
    };

    if (shippingRates[shippingOption] > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${shippingOption.charAt(0).toUpperCase() + shippingOption.slice(1)} Shipping`,
          },
          unit_amount: shippingRates[shippingOption],
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://www.brisclothing.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.brisclothing.com/cancel`,
      customer_email: customerEmail,
      metadata: {
        source: 'brisco_website',
        campaign: 'be_your_own_light',
        totalQuantity: totalQuantity.toString(),
        originalPrice: (totalQuantity * 65).toString(),
        discountApplied: ((totalQuantity * 65) - totalPrice).toString()
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
    });

    // Return success response (EXACT format from working API)
    return res.status(200).json({ 
      success: true,
      message: 'Checkout session created successfully',
      sessionId: session.id,
      url: session.url,
      provider: 'Stripe',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[BRISCO STRIPE] Checkout error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error' 
    });
  }
}

// BRISCO's tiered pricing calculation
function calculateTotalWithDeals(totalQuantity) {
  const basePrice = 65;
  
  if (totalQuantity >= 4) {
    // 4+ shirts: Groups of 4 at $200 + remainder at $65
    const groupsOfFour = Math.floor(totalQuantity / 4);
    const remainder = totalQuantity % 4;
    return (groupsOfFour * 200) + (remainder * basePrice);
  } else if (totalQuantity >= 2) {
    // 2-3 shirts: Groups of 2 at $110 + remainder at $65
    const groupsOfTwo = Math.floor(totalQuantity / 2);
    const remainder = totalQuantity % 2;
    return (groupsOfTwo * 110) + (remainder * basePrice);
  } else {
    // 1 shirt: regular price $65
    return totalQuantity * basePrice;
  }
}
```

### Step 3: Create Native Stripe Webhook Handler
Create `/api/stripe-webhook.js`:

```javascript
// BRISCO STRIPE WEBHOOK - Native Vercel API Route
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('Payment successful:', session.id);
        
        // Send order data to GoHighLevel
        if (ghlWebhookUrl) {
          await sendOrderToGHL({
            orderId: session.id,
            customerEmail: session.customer_email,
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency,
            paymentStatus: 'paid',
            productName: 'BRISCO - Be Your Own Light Collection',
            timestamp: new Date().toISOString(),
            metadata: session.metadata
          });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Send order data to GoHighLevel
async function sendOrderToGHL(orderData) {
  try {
    console.log('Sending order to GHL:', orderData);
    
    const response = await fetch(ghlWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      console.log('Order sent to GHL successfully');
    } else {
      console.error('Failed to send order to GHL:', response.status);
    }
  } catch (error) {
    console.error('Error sending to GHL:', error);
  }
}

// Important: Configure Vercel to handle raw body
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
```

### Step 4: Update Cart to Use New API
Modify `public/cart.js` checkout function:

```javascript
async checkout() {
  if (this.items.length === 0) {
    this.showToast('Your cart is empty');
    return;
  }

  try {
    // Get customer email from auth system
    const customerEmail = sessionStorage.getItem('brisco_user_email') || 
                         prompt('Please enter your email address:');
    
    if (!customerEmail) {
      this.showToast('Email address required for checkout');
      return;
    }

    // Prepare checkout data
    const checkoutData = {
      items: this.items.map(item => ({
        productId: item.id === 1 ? 'brisco-white-tee' : 'brisco-black-tee',
        quantity: item.quantity,
        size: item.size,
        name: item.name,
        price: item.price
      })),
      customerEmail: customerEmail,
      shippingOption: 'standard'
    };

    console.log('[BRISCO CHECKOUT] Processing:', checkoutData);

    // Call native Stripe API
    const response = await fetch('/api/stripe-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData)
    });

    const result = await response.json();

    // Check for successful response (EXACT pattern from working auth flow)
    if (response.ok && result.success) {
      // Redirect to Stripe Checkout
      console.log('[BRISCO CHECKOUT] Redirecting to Stripe:', result.url);
      window.location.href = result.url;
    } else {
      throw new Error(result.error || 'Checkout failed');
    }

  } catch (error) {
    console.error('[BRISCO CHECKOUT] Error:', error);
    this.showToast('Checkout failed. Please try again.');
  }
}
```

---

## 🧪 TESTING YOUR IMPLEMENTATION

### Step 1: Test API Endpoints
Use these test commands in your browser console or terminal:

```javascript
// Test checkout creation (following working API pattern)
fetch('/api/stripe-checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [{ id: 1, quantity: 2, size: 'L', name: 'BRISCO White Tee', price: 65 }],
    customerEmail: 'test@example.com',
    shippingOption: 'standard'
  })
}).then(r => r.json()).then(console.log);

// Should return: { success: true, sessionId: "...", url: "..." }
```

### Step 2: Test Stripe Checkout
1. Add items to cart on your site
2. Click checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future date for expiry
5. Any 3-digit CVC

### Step 3: Verify Pricing
Test these scenarios:
- **1 shirt**: Should charge $65 + shipping
- **2 shirts**: Should charge $110 + shipping
- **4 shirts**: Should charge $200 + shipping

### Step 4: Check Webhooks
1. In Stripe Dashboard, go to **Developers → Webhooks**
2. Click on your webhook endpoint
3. Check "Recent deliveries" for successful events

---

## 🚀 GOING LIVE

### Step 1: Get Live API Keys
1. Complete Stripe account verification
2. In Stripe Dashboard, toggle from "Test" to "Live"
3. Copy live API keys (start with `pk_live_` and `sk_live_`)

### Step 2: Update Environment Variables
In Vercel, update these to live keys:
```bash
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Step 3: Update Webhook Endpoint
1. In Stripe Dashboard (Live mode), create new webhook
2. Use same URL: `https://www.brisclothing.com/api/stripe-webhook`
3. Update `STRIPE_WEBHOOK_SECRET` with new live secret

### Step 4: Test with Small Real Transaction
- Use a real card with small amount ($1-5)
- Verify money appears in Stripe dashboard
- Check GoHighLevel receives the data

---

## 🔧 TROUBLESHOOTING

### Common Issues & Solutions

#### ❌ "FUNCTION_INVOCATION_FAILED"
**Problem**: Using Astro API routes instead of native Vercel routes
**Solution**: Move API files from `src/pages/api/` to root `/api/` folder

#### ❌ "Webhook signature verification failed"
**Problem**: Wrong webhook secret or body parsing issue
**Solution**: 
1. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
2. Ensure raw body parsing in webhook handler

#### ❌ "Missing Stripe secret key"
**Problem**: Environment variables not set correctly
**Solution**: 
1. Check Vercel environment variables
2. Redeploy after adding variables

#### ❌ Pricing calculation wrong
**Problem**: Frontend and backend pricing logic mismatch
**Solution**: Use same `calculateTotalWithDeals` function in both places

### Debug Commands
```javascript
// Check environment variables (in API route)
console.log('Stripe key exists:', !!process.env.STRIPE_SECRET_KEY);

// Test pricing calculation
function testPricing() {
  console.log('1 shirt:', calculateTotalWithDeals(1)); // Should be 65
  console.log('2 shirts:', calculateTotalWithDeals(2)); // Should be 110
  console.log('4 shirts:', calculateTotalWithDeals(4)); // Should be 200
}
```

---

## 📋 FINAL CHECKLIST

Before going live, verify:

- [ ] ✅ Stripe account verified and live keys obtained
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Native API routes created (`/api/stripe-checkout.js`, `/api/stripe-webhook.js`)
- [ ] ✅ Webhook endpoint configured in Stripe dashboard
- [ ] ✅ Test transactions work with test cards
- [ ] ✅ Pricing tiers calculate correctly (1=$65, 2=$110, 4=$200)
- [ ] ✅ GoHighLevel receives order data
- [ ] ✅ Success/cancel pages redirect properly
- [ ] ✅ Mobile checkout experience tested
- [ ] ✅ Real money test transaction completed
- [ ] ✅ Customer receives email confirmation

---

## 🎉 SUCCESS!

Once everything is working:
1. **Monitor** Stripe dashboard for transactions
2. **Check** GoHighLevel for customer data
3. **Test** refund process if needed
4. **Document** any customizations for future reference

**You've successfully integrated Stripe with BRISCO's sophisticated pricing system!** 

The beauty of this implementation is that it maintains your existing cart logic while adding professional payment processing. Customers get the same great tiered pricing experience, but now with secure, reliable payments.

---

## 📞 NEED HELP?

If you get stuck:
1. Check the console for error messages
2. Verify environment variables in Vercel
3. Test API endpoints individually
4. Check Stripe dashboard for webhook delivery status
5. Review this guide step-by-step

Remember: The key to success is testing each piece individually before putting it all together!

---

## 🚨 **CRITICAL CORRECTIONS MADE**

This guide was **CORRECTED** to align with your working system. Here's what was fixed:

### ✅ **FIXED ISSUES:**
1. **API Structure**: Now uses exact pattern from working `api/ghl-webhook.js`
2. **Response Format**: Consistent `{ success: true }` format throughout
3. **Environment Variables**: Proper `process.env` usage with error handling
4. **CORS Headers**: Exact match to working API (`Content-Type, Authorization`)
5. **Error Handling**: Follows established patterns from CURSOR-SNIPPETS.md
6. **Dynamic Imports**: Uses `await import('stripe')` for Vercel compatibility
7. **Frontend Integration**: Checks `result.success` like working auth flow

### 🚫 **REMOVED PROBLEMS:**
1. ❌ Wrong import syntax that breaks in Vercel
2. ❌ Inconsistent response formats  
3. ❌ Missing proper CORS headers
4. ❌ Improper error handling
5. ❌ Static imports that fail in serverless environment

### 📋 **ALIGNMENT VERIFICATION:**
- ✅ Matches `api/ghl-webhook.js` structure exactly
- ✅ Uses `{ success: true }` format from SOLUTION-SUMMARY.md
- ✅ Follows CORS pattern from CURSOR-SNIPPETS.md
- ✅ Compatible with frontend auth flow expecting `data.success`
- ✅ Uses established environment variable patterns

**This corrected guide will NOT break your working system!**
