export const prerender = false;

const CORS = {
  'Access-Control-Allow-Origin': 'https://www.brisclothing.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function POST({ request }) {
  try {
    const { email, name } = await request.json().catch(() => ({}));
    
    if (!email) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing email' }), {
        status: 400, headers: CORS
      });
    }

    const webhook = process.env.GHL_WEBHOOK_URL || import.meta.env.GHL_WEBHOOK_URL || '';

    if (!webhook) {
      return new Response(JSON.stringify({ ok: false, error: 'Webhook not configured' }), {
        status: 500, headers: CORS
      });
    }

    const payload = { 
      email, 
      name: name || '', 
      source: 'brisclothing.com', 
      tag: 'exclusive_access' 
    };

    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      return new Response(JSON.stringify({ ok: false, error: 'GHL error', detail }), {
        status: 502, headers: CORS
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: CORS
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message || 'Server error' }), {
      status: 500, headers: CORS
    });
  }
}
