// Go High Level Configuration
const GHL_WEBHOOK_URL = import.meta.env.GHL_WEBHOOK_URL || process.env.GHL_WEBHOOK_URL;
const GHL_API_KEY = import.meta.env.GHL_API_KEY || process.env.GHL_API_KEY;

console.log('[BRISC API] Using Go High Level for email delivery');
console.log('[BRISC API] GHL Webhook URL present:', !!GHL_WEBHOOK_URL);
console.log('[BRISC API] GHL API Key present:', !!GHL_API_KEY);



// Go High Level Email Sending Function
async function sendEmailViaGHL(email, accessCode = 'light2025') {
  console.log(`[BRISC API] 🚀 Sending email via Go High Level to: ${email}`);
  
  if (GHL_WEBHOOK_URL) {
    // Option 1: Webhook approach (easiest)
    try {
      const webhookPayload = {
        email: email,
        accessCode: accessCode,
        timestamp: new Date().toISOString(),
        source: 'brisc_website',
        campaign: 'access_code_delivery'
      };
      
      console.log('[BRISC API] Triggering GHL webhook...');
      const response = await fetch(GHL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      });
      
      if (!response.ok) {
        throw new Error(`GHL Webhook failed: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('[BRISC API] ✅ GHL webhook triggered successfully:', result);
      
      return {
        success: true,
        provider: 'ghl_webhook',
        messageId: result.id || 'webhook_triggered',
        message: 'Email queued via Go High Level automation'
      };
      
    } catch (error) {
      console.error('[BRISC API] GHL Webhook error:', error);
      throw error;
    }
  }
  
  throw new Error('No GHL configuration found (webhook URL required)');
}

console.log('[BRISC API] GHL email functions initialized');

export async function POST({ request }) {
  try {
    console.log('[BRISC API] 🔍 Environment debug:');
    console.log('[BRISC API] GHL_WEBHOOK_URL from import.meta.env:', import.meta.env.GHL_WEBHOOK_URL);
    console.log('[BRISC API] GHL_WEBHOOK_URL from process.env:', process.env.GHL_WEBHOOK_URL);
    console.log('[BRISC API] Final GHL_WEBHOOK_URL:', GHL_WEBHOOK_URL);
    
    const { email } = await request.json();

    // Validate email
    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`[BRISC API] Processing access request for: ${email} - v4.0 (GHL Only)`);

    // Step 2: Send access email via Go High Level (non-blocking)
    console.log(`[BRISC API] Processing access request for: ${email}`);
    console.log(`[BRISC API] Recipient email: ${email} (this should be the client's email, not yours)`);
    
    let emailResult = null;
    let emailError = null;
    
    // Try Go High Level webhook (non-blocking - always allow user to proceed)
    if (GHL_WEBHOOK_URL) {
      try {
        console.log('[BRISC API] 🚀 Triggering Go High Level webhook for email delivery');
        emailResult = await sendEmailViaGHL(email, 'light2025');
        console.log('[BRISC API] ✅ GHL webhook triggered successfully:', emailResult);
        
      } catch (ghlError) {
        console.error('[BRISC API] GHL webhook failed (non-blocking):', ghlError.message);
        emailError = ghlError.message;
        // Continue execution - don't block user flow
      }
    } else {
      console.warn('[BRISC API] ⚠️ GHL webhook not configured - email will not be sent');
      emailError = 'GHL webhook URL not configured';
    }
    
    // ALWAYS return success to allow user to proceed to password screen
    // The email sending is now a background process that doesn't block user flow
    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResult?.messageId || 'no-email-sent',
      message: emailResult ? 'Access email sent successfully' : 'Access granted - proceed to enter password',
      provider: emailResult?.provider || 'none',
      emailSent: !!emailResult,
      emailError: emailError,
      userMessage: emailResult 
        ? 'Check your email for the access code, then enter it below.' 
        : 'Check your email for the access code'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[BRISC API] Server error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: import.meta.env.DEV ? error.message : 'Please try again'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}