// Cloudflare Pages Function — Visit tracking with D1
// Binding: PIMX_VISITS (configured in Cloudflare Dashboard → Pages → Settings → Functions → D1 bindings)

interface Env {
  PIMX_VISITS: D1Database;
}

interface VisitRow {
  id: number;
  timestamp: number;
  type: string;
  device: string;
  country: string;
  city: string;
  user_agent: string;
}

// Device detection from User-Agent
function detectDevice(ua: string): 'Desktop' | 'Mobile' | 'Tablet' {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

// Ensure the table exists (idempotent)
async function ensureTable(db: D1Database): Promise<void> {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS visits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp INTEGER NOT NULL,
      type TEXT NOT NULL DEFAULT 'visit',
      device TEXT NOT NULL DEFAULT 'Desktop',
      country TEXT NOT NULL DEFAULT 'Unknown',
      city TEXT NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS idx_visits_timestamp ON visits(timestamp);
    CREATE INDEX IF NOT EXISTS idx_visits_type ON visits(type);
  `);
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  await ensureTable(env.PIMX_VISITS);

  const from = url.searchParams.get('from') ? Number(url.searchParams.get('from')) : 0;
  const to = url.searchParams.get('to') ? Number(url.searchParams.get('to')) : Date.now();

  const results = await env.PIMX_VISITS.prepare(
    'SELECT id, timestamp, type, device, country, city, user_agent FROM visits WHERE timestamp >= ? AND timestamp <= ? ORDER BY timestamp ASC'
  ).bind(from, to).all<VisitRow>();

  return new Response(JSON.stringify({ logs: results.results }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  await ensureTable(env.PIMX_VISITS);

  let body: { type?: string; device?: string };
  try {
    body = await request.json() as { type?: string; device?: string };
  } catch {
    body = {};
  }

  const type = ['visit', 'test', 'dns'].includes(body.type || '') ? body.type! : 'visit';
  const ua = request.headers.get('user-agent') || '';
  const device = body.device && ['Desktop', 'Mobile', 'Tablet'].includes(body.device)
    ? body.device
    : detectDevice(ua);

  // Cloudflare provides geo data on the request.cf object
  const cf = (request as any).cf || {};
  const country = cf.country || 'Unknown';
  const city = cf.city || '';

  await env.PIMX_VISITS.prepare(
    'INSERT INTO visits (timestamp, type, device, country, city, user_agent) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(Date.now(), type, device, country, city, ua).run();

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
