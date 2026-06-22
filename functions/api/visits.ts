// Cloudflare Pages Function — Visit tracking with KV
// Binding: PIMX_VISITS (KV namespace configured in Cloudflare Dashboard)
// Dashboard: Pages → Your project → Settings → Functions → KV namespace bindings
// Variable name: PIMX_VISITS

interface Env {
  PIMX_VISITS: KVNamespace;
}

interface VisitRecord {
  ts: number;
  device: string;
  country: string;
  city: string;
}

// Device detection from User-Agent
function detectDevice(ua: string): 'Desktop' | 'Mobile' | 'Tablet' {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const from = Number(url.searchParams.get('from') || '0');
  const to = Number(url.searchParams.get('to') || String(Date.now()));

  const raw = await env.PIMX_VISITS.get('visits', 'json');
  const all: VisitRecord[] = (raw as VisitRecord[]) || [];

  // Filter by time range
  const filtered = all.filter(v => v.ts >= from && v.ts <= to);

  return new Response(JSON.stringify({ logs: filtered }), { headers: CORS_HEADERS });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: { device?: string };
  try {
    body = await request.json() as { device?: string };
  } catch {
    body = {};
  }

  const ua = request.headers.get('user-agent') || '';
  const device = body.device && ['Desktop', 'Mobile', 'Tablet'].includes(body.device)
    ? body.device
    : detectDevice(ua);

  // Cloudflare provides real geo data on the request.cf object
  const cf = (request as any).cf || {};
  const country = cf.country || 'Unknown';
  const city = cf.city || '';

  const record: VisitRecord = { ts: Date.now(), device, country, city };

  // Read existing, append, write back
  const raw = await env.PIMX_VISITS.get('visits', 'json');
  const all: VisitRecord[] = (raw as VisitRecord[]) || [];
  all.push(record);

  // Keep last 10000 records to stay within KV limits
  if (all.length > 10000) {
    all.splice(0, all.length - 10000);
  }

  await env.PIMX_VISITS.put('visits', JSON.stringify(all));

  return new Response(JSON.stringify({ success: true }), { headers: CORS_HEADERS });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { headers: CORS_HEADERS });
};
