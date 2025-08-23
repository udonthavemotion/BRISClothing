// BRISCO STREETWEAR - STRIPE WEBHOOK HANDLER
// Handles Stripe webhook events and integrates with GoHighLevel

export const prerender = false;

// Environment Variables
const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;
const GHL_WEBHOOK_URL = import.meta.env.GHL_WEBHOOK_URL || process.env.GHL_WEBHOOK_URL;

export async function POST({ request }) {
  try {
    console.log('[BRISCO WEBHOOK] Processing Stripe webhook...');
    
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!STRIPE_WEBHOOK_SECRET) {
      console.error('[BRISCO WEBHOOK] Missing webhook secret');
      return new Response('Webhook secret not configured', { status: 400 });
    }

    // TODO: Uncomment when Stripe is configured
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('[BRISCO WEBHOOK] Webhook signature verification failed:', err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log('[BRISCO WEBHOOK] Payment successful:', session.id);
        
        // Send order data to GoHighLevel
        if (GHL_WEBHOOK_URL) {
          await sendOrderToGHL({
            orderId: session.id,
            customerEmail: session.customer_email,
            amount: session.amount_total / 100, // Convert from cents
            currency: session.currency,
            paymentStatus: 'paid',
            productName: 'BRISCO - Be Your Own Light',
            timestamp: new Date().toISOString()
          });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const paymentIntent = event.data.object;
        console.log('[BRISCO WEBHOOK] Payment failed:', paymentIntent.id);
        break;
        
      default:
        console.log(`[BRISCO WEBHOOK] Unhandled event type: ${event.type}`);
    }
    */

    // Placeholder response until Stripe is configured
    console.log('[BRISCO WEBHOOK] Webhook placeholder - configure Stripe to enable');
    
    return new Response('Webhook received (placeholder)', { status: 200 });

  } catch (error) {
    console.error('[BRISCO WEBHOOK] Error processing webhook:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}

// Helper function to send order data to GoHighLevel
async function sendOrderToGHL(orderData) {
  try {
    console.log('[BRISCO WEBHOOK] Sending order to GHL:', orderData);
    
    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      console.log('[BRISCO WEBHOOK] Order sent to GHL successfully');
    } else {
      console.error('[BRISCO WEBHOOK] Failed to send order to GHL:', response.status);
    }
  } catch (error) {
    console.error('[BRISCO WEBHOOK] Error sending to GHL:', error);
  }
}
