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
    
    // Detailed error for debugging
    const errorDetails = {
      message: error.message,
      type: error.type,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'NOT_SET'
    };
    
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error',
      details: errorDetails,
      timestamp: new Date().toISOString()
    });
  }
}

// BRISCO's tiered pricing calculation (matches cart.js logic)
function calculateTotalWithDeals(totalQuantity) {
  if (totalQuantity >= 4) {
    return totalQuantity * 50; // $50 per shirt for 4+ shirts
  } else if (totalQuantity >= 2) {
    return totalQuantity * 55; // $55 per shirt for 2-3 shirts
  } else {
    return totalQuantity * 65; // $65 per shirt for 1 shirt
  }
}
