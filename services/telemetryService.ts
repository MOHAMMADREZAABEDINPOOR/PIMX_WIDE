import { AppRoute } from '../types';

export interface TelemetryLog {
  id: string;
  timestamp: number;
  type: 'visit' | 'test' | 'dns';
  device: 'Desktop' | 'Mobile' | 'Tablet';
  location: string;
}

const TELEMETRY_KEY = 'pimx_v4_telemetry_logs';

// Helper to detect current device type
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

// Helper to simulate a user location based on timezone offset
export const getEstimatedLocation = (): string => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (!tz) return 'Unknown';
  if (tz.includes('Tehran') || tz.includes('Iran')) return 'Iran';
  if (tz.includes('Berlin') || tz.includes('Europe/Berlin') || tz.includes('Germany')) return 'Germany';
  if (tz.includes('London') || tz.includes('Europe/London') || tz.includes('London')) return 'United Kingdom';
  if (tz.includes('New_York') || tz.includes('America/')) return 'United States';
  if (tz.includes('Paris') || tz.includes('Europe/Paris')) return 'France';
  return 'Iran'; // Default fallback matching the audience context
};

// Seed logs if none exist or if they are low
const seedHistoricalData = (): TelemetryLog[] => {
  const logs: TelemetryLog[] = [];
  const now = Date.now();
  
  const devices: ('Desktop' | 'Mobile' | 'Tablet')[] = ['Desktop', 'Mobile', 'Tablet'];
  const deviceWeights = [0.65, 0.28, 0.07]; // Weights for random selection
  
  const locations = ['Iran', 'Germany', 'United States', 'United Kingdom', 'France', 'Netherlands'];
  const locationWeights = [0.70, 0.10, 0.08, 0.05, 0.04, 0.03];

  const getWeightedChoice = <T>(items: T[], weights: number[]): T => {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
      sum += weights[i];
      if (r <= sum) return items[i];
    }
    return items[items.length - 1];
  };

  // Generate logs spanning over different intervals
  // To keep local storage lightweight but still allow rich historical charts, we will seed about 180 points
  // properly distributed from 20 years ago to now.
  const timeSpans = [
    { label: 'recent', count: 40, ageRange: 60 * 60 * 1000 },             // last 1 hour
    { label: 'days', count: 50, ageRange: 10 * 24 * 60 * 60 * 1000 },     // last 10 days
    { label: 'months', count: 50, ageRange: 12 * 30 * 24 * 60 * 60 * 1000 }, // last 12 months
    { label: 'years', count: 60, ageRange: 20 * 365 * 24 * 60 * 60 * 1000 }  // last 20 years
  ];

  let idCounter = 1;

  timeSpans.forEach(span => {
    for (let i = 0; i < span.count; i++) {
      const logTime = now - Math.random() * span.ageRange;
      const typeRand = Math.random();
      const type: 'visit' | 'test' | 'dns' = 
        typeRand < 0.60 ? 'visit' : 
        typeRand < 0.90 ? 'test' : 'dns';

      logs.push({
        id: `seed_${idCounter++}`,
        timestamp: logTime,
        type,
        device: getWeightedChoice(devices, deviceWeights),
        location: getWeightedChoice(locations, locationWeights),
      });
    }
  });

  // Sort chronologically
  logs.sort((a, b) => a.timestamp - b.timestamp);
  return logs;
};

export const getTelemetryLogs = (): TelemetryLog[] => {
  try {
    const item = localStorage.getItem(TELEMETRY_KEY);
    if (!item) {
      localStorage.setItem(TELEMETRY_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: TelemetryLog[] = JSON.parse(item);
    // Explicitly filter out any remnants of mock seed logs
    return parsed.filter(log => log && log.id && !log.id.startsWith('seed_'));
  } catch (e) {
    console.error('Error fetching telemetry logs:', e);
    return [];
  }
};

export const logTelemetryAction = (type: 'visit' | 'test' | 'dns'): void => {
  try {
    const logs = getTelemetryLogs();
    const newLog: TelemetryLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      device: getDeviceType(),
      location: getEstimatedLocation()
    };
    logs.push(newLog);
    
    // Ensure we keep a max buffer of 2000 logs to prevent LocalStorage overflows
    if (logs.length > 2000) {
      logs.shift();
    }
    
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error recording telemetry action:', e);
  }
};
