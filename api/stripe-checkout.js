// BRISCO STRIPE CHECKOUT - Native Vercel API Route
// Following EXACT pattern from api/ghl-webhook.js ✅

// Native Vercel API route for Stripe checkout
export default async function handler(req, res) {
  // CORS headers (EXACT pattern from working API) - Allow localhost for development
  const allowedOrigins = [
    'https://www.brisclothing.com',
    'http://localhost:4321',
    'http://localhost:3000',
    'http://127.0.0.1:4321'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
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
    
    console.log('[BRISCO STRIPE] Processing checkout:', { 
      itemCount: items?.length, 
      customerEmail, 
      shippingOption 
    });
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing items' });
    }
    
    if (!customerEmail) {
      return res.status(400).json({ success: false, error: 'Missing email' });
    }
    
    // Get Stripe key from environment (following working pattern)
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      console.error('[BRISCO STRIPE] Missing Stripe secret key');
      return res.status(500).json({ 
        success: false, 
        error: 'Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      });
    }
    
    // Dynamic import for Stripe (works in Vercel)
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    // Calculate total using BRISCO's tiered pricing
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const effectivePrice = getEffectivePrice(totalQuantity);

    console.log('[BRISCO STRIPE] Pricing calculation:', { 
      totalQuantity, 
      effectivePrice, 
      totalPrice: totalQuantity * effectivePrice 
    });

    // Create individual line items for each product with size/color details
    const lineItems = items.map(item => {
      // Determine product details
      const isWhiteShirt = item.productId === 'brisco-white-tee' || item.name?.toLowerCase().includes('white');
      const productName = isWhiteShirt ? 'BRISCO White Tee' : 'BRISCO Black Tee';
      const productImage = isWhiteShirt 
        ? 'https://www.brisclothing.com/images/white-front.jpg'
        : 'https://www.brisclothing.com/images/black-front.jpg';
      
      // Build description with size and pricing info
      let description = 'Be Your Own Light - Premium Streetwear';
      if (item.size) {
        description += ` | Size: ${item.size}`;
      }
      if (totalQuantity >= 2) {
        description += ` | Bulk pricing: $${effectivePrice} each`;
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: description,
            images: [productImage],
            metadata: {
              size: item.size || 'Not specified',
              color: isWhiteShirt ? 'White' : 'Black',
              originalPrice: '65',
              bulkPrice: effectivePrice.toString()
            }
          },
          unit_amount: effectivePrice * 100, // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Add shipping (simplified - no need for Stripe shipping rate IDs)
    const shippingRates = {
      'standard': 0,    // 🧪 TEMP: $0.00 for testing (was $5.00)
      'express': 0,     // 🧪 TEMP: $0.00 for testing (was $12.00)
      'free': 0         // $0.00
    };

    if (shippingRates[shippingOption] > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${shippingOption.charAt(0).toUpperCase() + shippingOption.slice(1)} Shipping`,
            description: 'Shipping and handling'
          },
          unit_amount: shippingRates[shippingOption],
        },
        quantity: 1,
      });
    }

    // Determine success/cancel URLs based on environment
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:4321' 
      : 'https://www.brisclothing.com';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      customer_email: customerEmail,
      metadata: {
        source: 'brisco_website',
        totalQuantity: totalQuantity.toString(),
        effectivePrice: effectivePrice.toString(),
        originalPrice: (totalQuantity * 65).toString(),
        totalSavings: ((totalQuantity * 65) - (totalQuantity * effectivePrice)).toString(),
        // Compact item summary to avoid 500-char limit
        itemSummary: createCompactItemSummary(items),
        // Store full details in our backup system instead
        hasFullBackup: 'true'
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
    });

    console.log('[BRISCO STRIPE] Checkout session created:', session.id);

    // 💾 BACKUP ORDER LOCALLY (in case Stripe goes down)
    try {
      const { default: backupSystem, createOrderBackupData } = await import('./order-backup.js');
      
      const backupData = createOrderBackupData(session, { items, shippingOption }, {
        customerName: 'N/A', // Will be collected by Stripe
        userAgent: req.headers['user-agent'] || 'N/A',
        ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'N/A'
      });
      
      await backupSystem.saveOrder(backupData);
      console.log('[BRISCO BACKUP] Order backed up locally:', backupData.internalOrderId);
    } catch (backupError) {
      // Don't fail the checkout if backup fails
      console.error('[BRISCO BACKUP] Failed to backup order (non-critical):', backupError);
    }

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
  const effectivePrice = getEffectivePrice(totalQuantity);
  return totalQuantity * effectivePrice;
}

// Get effective price per item based on quantity tiers
function getEffectivePrice(totalQuantity) {
  return 1; // 🧪 TEMPORARY $1 TESTING - REMOVE AFTER TESTING
  
  if (totalQuantity >= 4) {
    return 50; // $50 per shirt for 4+ shirts
  } else if (totalQuantity >= 2) {
    return 55; // $55 per shirt for 2-3 shirts
  } else {
    return 65; // $65 per shirt for 1 shirt
  }
}

// Create compact item summary for Stripe metadata (under 500 chars)
function createCompactItemSummary(items) {
  // Group items by color and size for compact representation
  const summary = {};
  
  items.forEach(item => {
    const color = item.productId === 'brisco-white-tee' ? 'W' : 'B'; // W=White, B=Black
    const size = item.size || 'NS'; // NS=No Size
    const key = `${color}${size}`;
    
    summary[key] = (summary[key] || 0) + item.quantity;
  });
  
  // Convert to compact string: "W_L:2,B_XL:3,W_M:1" format
  const compactString = Object.entries(summary)
    .map(([key, qty]) => `${key}:${qty}`)
    .join(',');
  
  // Ensure it's under 400 chars (leaving buffer for other metadata)
  if (compactString.length > 400) {
    // Fallback: just show total quantities by color
    const whiteTotal = items.filter(i => i.productId === 'brisco-white-tee').reduce((sum, i) => sum + i.quantity, 0);
    const blackTotal = items.filter(i => i.productId === 'brisco-black-tee').reduce((sum, i) => sum + i.quantity, 0);
    return `W:${whiteTotal},B:${blackTotal}`;
  }
  
  return compactString;
}
