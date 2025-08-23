export const prerender = false;

export async function GET({ request }) {
  try {
    const raw = process.env.GHL_WEBHOOK_URL || import.meta.env.GHL_WEBHOOK_URL || '';
    const host = new URL(request.url).host;

    return new Response(JSON.stringify({
      host,
      hasVar: Boolean(raw),
      startsWith: raw ? raw.slice(0, 12) : null,
      length: raw ? raw.length : 0,
      runtime: 'node',
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message,
      hasVar: false
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}
