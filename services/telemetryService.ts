// Telemetry Service — Real visit tracking via Cloudflare KV
// All data is persisted server-side through /api/visits endpoint

export interface TelemetryLog {
  ts: number;
  device: 'Desktop' | 'Mobile' | 'Tablet';
  country: string;
  city: string;
}

// Helper to detect current device type (sent to server as a hint)
export const getDeviceType = (): 'Desktop' | 'Mobile' | 'Tablet' => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'Tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'Mobile';
  return 'Desktop';
};

/**
 * Record a page visit via the server API.
 * Server adds real geo data from Cloudflare edge (country, city).
 */
export const logVisit = async (): Promise<void> => {
  try {
    await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device: getDeviceType() }),
    });
  } catch (e) {
    console.warn('Visit tracking failed:', e);
  }
};

/**
 * Fetch visit logs from the server (KV) for a given time range.
 */
export const getVisitLogs = async (from: number = 0, to: number = Date.now()): Promise<TelemetryLog[]> => {
  try {
    const res = await fetch(`/api/visits?from=${from}&to=${to}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.logs || []) as TelemetryLog[];
  } catch (e) {
    console.warn('Failed to fetch visit logs:', e);
    return [];
  }
};
