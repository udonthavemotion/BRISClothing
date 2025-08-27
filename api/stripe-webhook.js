// BRISCO STRIPE WEBHOOK - Native Vercel API Route
// Simple webhook handler for payment confirmations (NO GHL complexity)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get environment variables
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeKey || !webhookSecret) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    // Dynamic import for Stripe
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    // Get raw body and signature
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
    console.log(`[BRISCO STRIPE] Processing event: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('✅ Payment successful!');
        console.log(`Order ID: ${session.id}`);
        console.log(`Customer: ${session.customer_email}`);
        console.log(`Amount: $${session.amount_total / 100}`);
        
        // That's it! Stripe handles everything else:
        // - Email receipts to customer
        // - Payment processing
        // - Fraud protection
        // - Dispute handling
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        console.log('❌ Payment failed:', paymentIntent.id);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('[BRISCO STRIPE] Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Important: Configure Vercel to handle raw body for webhook signature verification
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
