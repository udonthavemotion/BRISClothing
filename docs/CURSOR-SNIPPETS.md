# CURSOR CODE SNIPPETS - BRISCO PROJECT

## Vercel GHL Webhook Template
Use this exact pattern for any GHL webhook integration:

```javascript
// api/ghl-webhook.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.brisclothing.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ ok: false, error: 'Missing email' });
    
    const webhook = process.env.GHL_WEBHOOK_URL;
    if (!webhook) return res.status(500).json({ ok: false, error: 'Webhook not configured' });
    
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        name: name || '', 
        source: 'brisclothing.com', 
        tag: 'exclusive_access',
        timestamp: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      return res.status(502).json({ ok: false, error: 'GHL error', detail });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Access email triggered successfully',
      email: email,
      provider: 'GoHighLevel',
      timestamp: new Date().toISOString(),
      ghlStatus: 200
    });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
```

## Diagnostic Endpoint Template
Always create this first when debugging API issues:

```javascript
// api/test.js
export default async function handler(req, res) {
  return res.status(200).json({
    status: 'working',
    timestamp: new Date().toISOString(),
    method: req.method,
    env_check: !!process.env.GHL_WEBHOOK_URL,
    host: req.headers.host
  });
}
```

## Environment Check Template
Use this to verify environment variables:

```javascript
// api/env-check.js
export default async function handler(req, res) {
  const webhook = process.env.GHL_WEBHOOK_URL || '';
  
  return res.status(200).json({
    host: req.headers.host,
    hasWebhook: Boolean(webhook),
    webhookStart: webhook ? webhook.slice(0, 12) : null,
    webhookLength: webhook.length,
    runtime: 'node'
  });
}
```

## Frontend API Integration Pattern
Use different endpoints for local vs production:

```javascript
// Frontend integration pattern
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const apiUrl = isLocalhost 
  ? `${window.location.origin}/api/send-access-email`  // Local (Astro)
  : '/api/ghl-webhook';  // Production (native Vercel)

const response = await fetch(apiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});

const data = await response.json();
if (response.ok && data.success) {
  // Handle success
} else {
  // Handle error
  throw new Error(data.error || 'API call failed');
}
```

## Testing Commands
Always test API routes directly:

```bash
# Test diagnostic endpoint
curl -s https://www.brisclothing.com/api/test | jq .

# Test GHL webhook
curl -X POST https://www.brisclothing.com/api/ghl-webhook \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}' | jq .

# Expected success response:
# {
#   "success": true,
#   "message": "Access email triggered successfully",
#   "email": "test@example.com",
#   "provider": "GoHighLevel",
#   "ghlStatus": 200
# }
```

## Cursor Prompt Templates
Use these when starting new Cursor sessions:

```
"Reference .cursorrules file. For BRISCO project: Use native Vercel API routes (api/*.js) for external integrations, NOT Astro serverless functions. GHL webhook at api/ghl-webhook.js uses process.env.GHL_WEBHOOK_URL. See docs/ASTRO-VERCEL-GHL-BIBLE.md for full context."
```

## Never Do This (Anti-Patterns)
```javascript
// ❌ DON'T: Astro serverless function for external APIs
// src/pages/api/webhook.js
export async function POST({ request }) {
  // This will fail with FUNCTION_INVOCATION_FAILED
}

// ❌ DON'T: Mix environment variable access
const webhook = import.meta.env.GHL_WEBHOOK_URL || process.env.GHL_WEBHOOK_URL;

// ❌ DON'T: Deploy without testing API directly
// Always curl test before frontend integration
```
