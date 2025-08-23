// Native Vercel API route for GHL webhook proxy
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.brisclothing.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  
  try {
    const { email, name } = req.body || {};
    
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Missing email' });
    }
    
    // Get webhook URL from environment
    const webhook = process.env.GHL_WEBHOOK_URL;
    
    if (!webhook) {
      return res.status(500).json({ ok: false, error: 'Webhook not configured' });
    }
    
    // Call GHL webhook
    const payload = { 
      email, 
      name: name || '', 
      source: 'brisclothing.com', 
      tag: 'exclusive_access',
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      return res.status(502).json({ ok: false, error: 'GHL error', detail });
    }
    
    const result = await response.json().catch(() => ({ success: true }));
    
    return res.status(200).json({ 
      success: true,
      message: 'Access email triggered successfully',
      email: email,
      provider: 'GoHighLevel',
      timestamp: new Date().toISOString(),
      ghlStatus: 200
    });
    
  } catch (error) {
    return res.status(500).json({ 
      ok: false, 
      error: error.message || 'Server error' 
    });
  }
}
