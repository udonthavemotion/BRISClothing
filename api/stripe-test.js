// BRISCO STRIPE DIAGNOSTIC - Check if Stripe is configured
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.brisclothing.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripePublishable: !!process.env.STRIPE_PUBLISHABLE_KEY,
      stripeSecretPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'NOT_SET',
      stripePublishablePrefix: process.env.STRIPE_PUBLISHABLE_KEY ? process.env.STRIPE_PUBLISHABLE_KEY.substring(0, 7) + '...' : 'NOT_SET'
    };

    // Test Stripe initialization
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const { default: Stripe } = await import('stripe');
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        
        // Test API call
        const account = await stripe.accounts.retrieve();
        diagnostics.stripeConnected = true;
        diagnostics.stripeAccountId = account.id;
        diagnostics.stripeMode = account.id.startsWith('acct_') ? 'live' : 'test';
      } catch (stripeError) {
        diagnostics.stripeConnected = false;
        diagnostics.stripeError = stripeError.message;
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Stripe diagnostic complete',
      diagnostics
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}
