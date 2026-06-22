// Telemetry Service — Real visit tracking via Cloudflare D1
// All data is persisted server-side through /api/visits endpoint

export interface TelemetryLog {
  id: number;
  timestamp: number;
  type: 'visit' | 'test' | 'dns';
  device: 'Desktop' | 'Mobile' | 'Tablet';
  country: string;
  city: string;
}

// Helper to detect current device type (sent to server as a hint)
export const getDeviceType = (): 'Desktop' | 'Mobile' | 'Tablet' => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
};

/**
 * Record a telemetry action (visit / test / dns) via the server API.
 * The server adds real geo data from Cloudflare's edge (country, city)
 * and real device detection from the User-Agent header.
 */
export const logTelemetryAction = async (type: 'visit' | 'test' | 'dns'): Promise<void> => {
  try {
    await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, device: getDeviceType() }),
    });
  } catch (e) {
    // Silently fail — visit tracking should never break the app
    console.warn('Visit tracking failed:', e);
  }
};

/**
 * Fetch telemetry logs from the server (D1 database) for a given time range.
 */
export const getTelemetryLogs = async (from: number = 0, to: number = Date.now()): Promise<TelemetryLog[]> => {
  try {
    const res = await fetch(`/api/visits?from=${from}&to=${to}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.logs || []) as TelemetryLog[];
  } catch (e) {
    console.warn('Failed to fetch telemetry logs:', e);
    return [];
  }
};
