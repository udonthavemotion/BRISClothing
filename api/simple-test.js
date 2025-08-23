// Simple Vercel API route (not Astro)
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'working',
      timestamp: new Date().toISOString(),
      method: 'GET'
    });
  }
  
  if (req.method === 'POST') {
    const { email } = req.body || {};
    
    return res.status(200).json({
      status: 'post working',
      timestamp: new Date().toISOString(),
      method: 'POST',
      email: email || 'none'
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
