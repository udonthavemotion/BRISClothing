// BRISCO STREETWEAR - STRIPE CHECKOUT API
// This endpoint creates Stripe checkout sessions for Brisco products

export const prerender = false;

// Stripe Configuration (Environment Variables)
const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
const STRIPE_PUBLISHABLE_KEY = import.meta.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY;

// Product Price IDs (to be configured in Stripe Dashboard)
const PRODUCT_PRICES = {
  'brisco-white-tee': import.meta.env.BRISCO_WHITE_TEE_PRICE_ID || 'price_PLACEHOLDER_WHITE',
  'brisco-black-tee': import.meta.env.BRISCO_BLACK_TEE_PRICE_ID || 'price_PLACEHOLDER_BLACK'
};

// Shipping Price IDs
const SHIPPING_PRICES = {
  'standard': import.meta.env.STANDARD_SHIPPING_PRICE_ID || 'price_PLACEHOLDER_SHIPPING_5',
  'express': import.meta.env.EXPRESS_SHIPPING_PRICE_ID || 'price_PLACEHOLDER_SHIPPING_12',
  'free': import.meta.env.FREE_SHIPPING_PRICE_ID || 'price_PLACEHOLDER_SHIPPING_0'
};

export async function POST({ request }) {
  try {
    console.log('[BRISCO STRIPE] Processing checkout request...');
    
    if (!STRIPE_SECRET_KEY) {
      console.error('[BRISCO STRIPE] Missing Stripe secret key');
      return new Response(JSON.stringify({ 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const { items, customerEmail, shippingOption = 'standard' } = body;

    // Initialize Stripe (uncomment when ready to integrate)
    // const stripe = require('stripe')(STRIPE_SECRET_KEY);

    // Prepare line items
    const lineItems = items.map(item => ({
      price: PRODUCT_PRICES[item.productId] || 'price_PLACEHOLDER',
      quantity: item.quantity || 1,
    }));

    // Add shipping
    if (shippingOption && SHIPPING_PRICES[shippingOption]) {
      lineItems.push({
        price: SHIPPING_PRICES[shippingOption],
        quantity: 1,
      });
    }

    console.log('[BRISCO STRIPE] Line items prepared:', lineItems);

    // TODO: Uncomment when Stripe is configured
    /*
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `https://www.brisclothing.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.brisclothing.com/cancel`,
      customer_email: customerEmail,
      metadata: {
        source: 'brisco_website',
        campaign: 'be_your_own_light'
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
    });

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    */

    // Placeholder response until Stripe is configured
    return new Response(JSON.stringify({ 
      message: 'Stripe checkout placeholder - configure environment variables to enable',
      lineItems: lineItems,
      customerEmail: customerEmail,
      shippingOption: shippingOption
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[BRISCO STRIPE] Checkout error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to create checkout session',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
