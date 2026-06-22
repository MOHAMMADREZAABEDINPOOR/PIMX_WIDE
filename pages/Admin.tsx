import React, { useState, useEffect, useCallback } from 'react';
import { getVisitLogs, TelemetryLog, logVisit } from '../services/telemetryService';
import { Shield, Users, Laptop, MapPin, Eye, EyeOff, Lock, ArrowLeft, RefreshCw, Calendar, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Define the time ranges with their names and durations in milliseconds
interface TimeRangeOption {
  label: string;
  durationMs: number;
}

const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { label: '1 min', durationMs: 60 * 1000 },
  { label: '3 min', durationMs: 3 * 60 * 1000 },
  { label: '5 min', durationMs: 5 * 60 * 1000 },
  { label: '7 min', durationMs: 7 * 60 * 1000 },
  { label: '10 min', durationMs: 10 * 60 * 1000 },
  { label: '30 min', durationMs: 30 * 60 * 1000 },
  { label: '1 hour', durationMs: 60 * 60 * 1000 },
  { label: '2 hours', durationMs: 2 * 60 * 60 * 1000 },
  { label: '3 hours', durationMs: 3 * 60 * 60 * 1000 },
  { label: '5 hours', durationMs: 5 * 60 * 60 * 1000 },
  { label: '10 hours', durationMs: 10 * 60 * 60 * 1000 },
  { label: '17 hours', durationMs: 17 * 60 * 60 * 1000 },
  { label: '22 hours', durationMs: 22 * 60 * 60 * 1000 },
  { label: '1 day', durationMs: 24 * 60 * 60 * 1000 },
  { label: '2 days', durationMs: 2 * 24 * 60 * 60 * 1000 },
  { label: '3 days', durationMs: 3 * 24 * 60 * 60 * 1000 },
  { label: '5 days', durationMs: 5 * 24 * 60 * 60 * 1000 },
  { label: '7 days', durationMs: 7 * 24 * 60 * 60 * 1000 },
  { label: '9 days', durationMs: 9 * 24 * 60 * 60 * 1000 },
  { label: '10 days', durationMs: 10 * 24 * 60 * 60 * 1000 },
  { label: '1 month', durationMs: 30 * 24 * 60 * 60 * 1000 },
  { label: '3 months', durationMs: 3 * 30 * 24 * 60 * 60 * 1000 },
  { label: '6 months', durationMs: 6 * 30 * 24 * 60 * 60 * 1000 },
  { label: '8 months', durationMs: 8 * 30 * 24 * 60 * 60 * 1000 },
  { label: '10 months', durationMs: 10 * 30 * 24 * 60 * 60 * 1000 },
  { label: '1 year', durationMs: 365 * 24 * 60 * 60 * 1000 },
  { label: '2 years', durationMs: 2 * 365 * 24 * 60 * 60 * 1000 },
  { label: '4 years', durationMs: 4 * 365 * 24 * 60 * 60 * 1000 },
  { label: '7 years', durationMs: 7 * 365 * 24 * 60 * 60 * 1000 },
  { label: '10 years', durationMs: 10 * 365 * 24 * 60 * 60 * 1000 },
  { label: '12 years', durationMs: 12 * 365 * 24 * 60 * 60 * 1000 },
  { label: '15 years', durationMs: 15 * 365 * 24 * 60 * 60 * 1000 },
  { label: '18 years', durationMs: 18 * 365 * 24 * 60 * 60 * 1000 },
  { label: '20 years', durationMs: 20 * 365 * 24 * 60 * 60 * 1000 },
];

export const AdminPage: React.FC<{ onNavigate: (route: any) => void }> = ({ onNavigate }) => {
  const { currentLang, t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');
  const [selectedRangeIndex, setSelectedRangeIndex] = useState<number>(6); // Default: "1 hour" (index 6)
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Fetch logs from KV via API for the currently selected time range
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    const range = TIME_RANGE_OPTIONS[selectedRangeIndex];
    const now = Date.now();
    const from = now - range.durationMs;
    const fetched = await getVisitLogs(from, now);
    setLogs(fetched);
    setIsLoading(false);
  }, [selectedRangeIndex]);

  // Register admin visit & load initial data
  useEffect(() => {
    logVisit(); // fire-and-forget
    const authed = sessionStorage.getItem('pimx_admin_authed');
    if (authed === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated or range changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated, fetchLogs]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'pimxwide' && password === '123456789PIMX_WIDe@#$%^&') {
      setIsAuthenticated(true);
      sessionStorage.setItem('pimx_admin_authed', 'true');
      setLoginError('');
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoginError(currentLang.code === 'fa' ? 'نام کاربری یا رمز عبور اشتباه است.' : 'Invalid credentials.');
    }
  };

  const currentRange = TIME_RANGE_OPTIONS[selectedRangeIndex];
  
  // Filter logs that fall within the selected duration range
  const now = Date.now();
  const cutoffTime = now - currentRange.durationMs;
  const filteredLogs = logs.filter(log => log.ts >= cutoffTime);

  // Calculate total visits
  const totalVisitsCount = filteredLogs.length;

  // Divide the current range bucket into 12 periods for the timeseries
  const bucketsCount = 12;
  const bucketSize = currentRange.durationMs / bucketsCount;

  const visitsSeries = Array(bucketsCount).fill(0);

  filteredLogs.forEach(log => {
    const elapsed = log.ts - cutoffTime;
    let idx = Math.floor(elapsed / bucketSize);
    if (idx < 0) idx = 0;
    if (idx >= bucketsCount) idx = bucketsCount - 1;
    visitsSeries[idx]++;
  });

  // CalculateStats helper for chart summary widgets (Total, Avg, Max, Min)
  const getStats = (series: number[]) => {
    const total = series.reduce((a, b) => a + b, 0);
    const avg = total / bucketsCount;
    const max = Math.max(...series, 0);
    const min = Math.min(...series, 0);
    return {
      total,
      avg: Math.round(avg * 10) / 10,
      max,
      min
    };
  };

  const visitsStats = getStats(visitsSeries);

  // Calculate Device Share
  const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  filteredLogs.forEach(log => {
    if (log.device) deviceCounts[log.device]++;
  });
  const totalDevicesLogged = Object.values(deviceCounts).reduce((a, b) => a + b, 0) || 1;

  // Calculate Location shares — show "Country (City)" when city is available
  const locationCounts: Record<string, number> = {};
  filteredLogs.forEach(log => {
    const loc = log.city && log.city !== 'Unknown' && log.city !== ''
      ? `${log.country} (${log.city})`
      : log.country || 'Unknown';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  const totalLocationsLogged = Object.values(locationCounts).reduce((a, b) => a + b, 0) || 1;

  // Visual SVG chart renderer
  const renderLineChart = (data: number[]) => {
    const chartHeight = 110;
    const chartWidth = 320;
    const padding = 15;
    
    const maxVal = Math.max(...data, 1);
    const stepX = (chartWidth - padding * 2) / (bucketsCount - 1);
    
    const points = data.map((val, idx) => {
      const x = padding + idx * stepX;
      const y = chartHeight - padding - (val / maxVal) * (chartHeight - padding * 2);
      return { x, y };
    });

    const pathD = points.length > 0 
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
      : '';

    return (
      <div className="relative w-full h-[120px] bg-pimx-bg/30 border border-pimx-border/30 rounded-xl overflow-hidden mt-4">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--color-border)" strokeDasharray="3 3" opacity={0.2} />
          <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="var(--color-border)" strokeDasharray="3 3" opacity={0.2} />
          <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--color-border)" strokeDasharray="3 3" opacity={0.3} />

          {/* Area fill */}
          {points.length > 1 && (
            <path
              d={`${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`}
              fill="url(#chart-glow-gradient)"
              opacity={0.15}
            />
          )}

          {/* Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#4f46e5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_4px_rgba(79,70,229,0.5)]"
          />

          {/* Vertex Nodes / Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#818cf8"
                stroke="var(--color-bg)"
                strokeWidth={1}
                className="hover:r-5 transition-all duration-200 cursor-pointer"
              />
              <title>{data[i]}</title>
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="chart-glow-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 font-sans" dir="ltr">
        <div className={`max-w-md w-full space-y-8 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transition-transform ${shake ? 'animate-shake' : ''}`}>
          <div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full"></div>
                <Lock className="w-16 h-16 text-yellow-500 relative z-10" strokeWidth={1} />
              </div>
            </div>
            <h1 className="text-3xl font-black text-center mt-6 text-zinc-100 tracking-wider">
              PIMX<span className="text-yellow-500">_WIDE</span> ADMIN
            </h1>
            <p className="text-center text-xs text-zinc-500 tracking-widest uppercase mt-2">
              RESTRICTED CRYPTO PORTAL
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
            <div className="space-y-4 rounded-lg">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 transition-colors font-mono text-sm shadow-inner"
                  placeholder="Enter system username"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-zinc-400 mb-1">
                  Authentication Secrets
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 text-zinc-100 border border-zinc-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500 transition-colors font-mono text-sm tracking-widest shadow-inner"
                    placeholder="••••••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {loginError && (
              <div className="text-xs text-red-500 bg-red-950/20 border border-red-900/30 rounded-lg p-3 text-center font-mono">
                {loginError}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="flex-1 flex justify-center items-center gap-2 py-3 border border-zinc-800 rounded-lg text-xs font-mono font-bold text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Site
              </button>

              <button
                type="submit"
                className="flex-1 flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-mono font-bold text-xs rounded-lg shadow-lg hover:shadow-yellow-500/10 transition-all cursor-pointer"
              >
                Access Console
              </button>
            </div>
            
            <div className="text-[9px] text-zinc-600 text-center font-mono mt-4">
              SECURE CONTEXT IP-BOUND: CLOUDFLARE SHIELD ACTIVE
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-20 pt-8 font-sans" dir="ltr">
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 bg-pimx-card border border-pimx-border rounded-xl px-6 py-4 shadow-2xl">
            <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
            <span className="text-xs font-mono text-pimx-muted">Syncing from KV...</span>
          </div>
        </div>
      )}
      
      {/* Admin Title Bar */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-pimx-border pb-6 gap-6">
        <div>
          <span className="text-[10px] text-yellow-500 font-mono tracking-widest uppercase mb-1 block">
            {t('app_title')} Security
          </span>
          <h1 className="text-3xl font-black text-pimx-text tracking-tight flex items-center gap-3">
            <Shield className="text-yellow-500 w-8 h-8" />
            Admin Panel
          </h1>
        </div>

        {/* Dropdown controls row */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-pimx-surface/40 hover:bg-pimx-surface/60 border border-pimx-border/60 rounded-xl px-4 py-2.5 transition">
            <Calendar className="w-4 h-4 text-pimx-muted" />
            <span className="text-xs text-pimx-muted font-mono font-medium">Time Range:</span>
            <select
              value={selectedRangeIndex}
              onChange={(e) => setSelectedRangeIndex(Number(e.target.value))}
              className="bg-transparent text-pimx-text text-xs font-bold font-mono focus:outline-none cursor-pointer pr-1"
            >
              {TIME_RANGE_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx} className="bg-pimx-card text-pimx-text font-mono">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              fetchLogs();
              const alertElem = document.getElementById('refresh-notice');
              if (alertElem) {
                alertElem.classList.remove('opacity-0');
                setTimeout(() => alertElem.classList.add('opacity-0'), 1500);
              }
            }}
            className="flex items-center justify-center gap-2 bg-pimx-surface hover:bg-pimx-surface/80 text-pimx-text border border-pimx-border rounded-xl px-4 py-2.5 text-xs font-bold tracking-wide transition cursor-pointer"
            title="Reload telemetry logs"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Sync Data
          </button>
        </div>
      </div>

      <div id="refresh-notice" className="opacity-0 transition-opacity duration-300 fixed bottom-6 right-6 bg-green-500/10 border border-green-500/20 text-green-500 text-xs px-4 py-2.5 rounded-xl shadow-2xl font-mono z-50">
        Visit sync completed.
      </div>

      {/* Visits Metric Card */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        <div className="bg-pimx-card/60 backdrop-blur-sm p-6 rounded-2xl border border-pimx-border/40 hover:border-pimx-border/80 transition-all shadow-lg flex items-center justify-between group">
          <div>
            <span className="text-[10px] text-pimx-muted font-mono font-bold tracking-widest uppercase block mb-1">
              TOTAL VISITS
            </span>
            <span className="text-5xl font-extrabold text-pimx-text group-hover:text-indigo-400 transition-colors">
              {totalVisitsCount.toLocaleString()}
            </span>
          </div>
          <div className="p-4 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-xl transition border border-indigo-500/10">
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
        </div>
      </div>

      {/* Visits Trend Chart */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className="bg-pimx-card/45 backdrop-blur-sm p-6 rounded-2xl border border-pimx-border/30 hover:border-pimx-border/50 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-pimx-muted font-mono font-bold tracking-widest uppercase block">
                VISITS TREND
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-mono">
                {currentRange.label} range
              </span>
            </div>
            {renderLineChart(visitsSeries)}
          </div>
          
          {/* Stats Badges */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-pimx-border/20">
            <div className="bg-pimx-surface/30 border border-pimx-border/20 rounded-lg p-2 text-center">
              <span className="text-[9px] text-pimx-muted font-mono block">Total:</span>
              <span className="text-xs font-bold text-pimx-text font-mono">{visitsStats.total}</span>
            </div>
            <div className="bg-pimx-surface/30 border border-pimx-border/20 rounded-lg p-2 text-center">
              <span className="text-[9px] text-pimx-muted font-mono block">Avg:</span>
              <span className="text-xs font-bold text-pimx-text font-mono">{visitsStats.avg}</span>
            </div>
            <div className="bg-pimx-surface/30 border border-pimx-border/20 rounded-lg p-2 text-center">
              <span className="text-[9px] text-pimx-muted font-mono block">Max:</span>
              <span className="text-xs font-bold text-pimx-text font-mono">{visitsStats.max}</span>
            </div>
            <div className="bg-pimx-surface/30 border border-pimx-border/20 rounded-lg p-2 text-center">
              <span className="text-[9px] text-pimx-muted font-mono block">Min:</span>
              <span className="text-xs font-bold text-pimx-text font-mono">{visitsStats.min}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* DEVICE SHARE PROGRESS BARS */}
        <div className="bg-pimx-card/45 backdrop-blur-sm p-6 rounded-2xl border border-pimx-border/30 hover:border-pimx-border/50 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs text-pimx-muted font-mono font-bold tracking-widest uppercase block mb-6">
              DEVICE SHARE
            </span>
            
            <div className="space-y-6">
              {['Desktop', 'Mobile', 'Tablet'].map(dev => {
                const count = deviceCounts[dev];
                const percentage = totalDevicesLogged > 0 ? (count / totalDevicesLogged) * 100 : 0;
                
                return (
                  <div key={dev} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-pimx-text font-bold flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                        {dev}
                      </span>
                      <span className="text-pimx-muted">
                        {percentage.toFixed(1)}% ({count})
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-pimx-bg border border-pimx-border/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)] transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-[10px] text-pimx-muted font-mono text-center mt-6 py-2 border-t border-pimx-border/10">
            REAL UA SNAPSHOT
          </div>
        </div>

        {/* USER LOCATIONS PANEL */}
        <div className="bg-pimx-card/45 backdrop-blur-sm p-6 rounded-2xl border border-pimx-border/30 hover:border-pimx-border/50 shadow-lg">
          <span className="text-xs text-pimx-muted font-mono font-bold tracking-widest uppercase block mb-6">
            USER LOCATIONS
          </span>

          <div className="space-y-4">
            {Object.entries(locationCounts).length === 0 ? (
              <div className="text-center text-xs text-pimx-muted py-6 font-mono">
                No visits recorded for the selected range. Data will appear as real users visit the site.
              </div>
            ) : (
              Object.entries(locationCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([loc, count]) => {
                  const percentage = totalLocationsLogged > 0 ? (count / totalLocationsLogged) * 100 : 0;
                  
                  return (
                    <div key={loc} className="space-y-2 pb-2 border-b border-pimx-border/15">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-pimx-text font-bold flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                          {loc}
                        </span>
                        <span className="text-pimx-muted">
                          {percentage.toFixed(1)}% ({count})
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-pimx-bg border border-pimx-border/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 shadow-[0_0_8px_rgba(234,179,8,0.4)] transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* Exit Button */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => {
            sessionStorage.removeItem('pimx_admin_authed');
            setIsAuthenticated(false);
            onNavigate('home');
          }}
          className="flex items-center gap-2 px-6 py-3 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Logout & Exit Dashboard
        </button>
      </div>

    </div>
  );
};
