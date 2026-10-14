import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  RefreshCw,
  LogOut,
  Users,
  Monitor,
  Globe2,
  Activity,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { PageHeading } from "../components/ui";
import { Select } from "../components/Select";
interface Stats {
  total: number;
  daily: { day: string; count: number }[];
  devices: { device: string; count: number }[];
  countries: { country: string; count: number }[];
}
export function AdminPage() {
  const { l } = usePreferences(),
    [auth, setAuth] = useState(false),
    [pass, setPass] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [stats, setStats] = useState<Stats | null>(null),
    [days, setDays] = useState(7),
    [health, setHealth] = useState<any>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => {
        if (active) setAuth(!!(d as { authenticated: boolean }).authenticated);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  async function load() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`/api/visits?days=${days}`);
      if (r.status === 401) {
        setAuth(false);
        throw new Error();
      }
      if (!r.ok) throw new Error();
      setStats(await r.json());
      const h = await fetch("/api/health");
      setHealth(await h.json());
    } catch {
      setError(
        l(
          "دریافت آمار انجام نشد؛ اتصال و پیکربندی سرور را بررسی کنید.",
          "Could not load analytics. Check connectivity and server configuration.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (auth) load();
  }, [auth, days]);
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pass }),
      });
      if (!r.ok) throw new Error();
      setPass("");
      setAuth(true);
    } catch {
      setError(
        l(
          "ورود انجام نشد. رمز، تنظیمات سرور یا محدودیت تلاش‌ها را بررسی کنید.",
          "Login failed. Check your password, server setup or attempt limit.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="workspace wrap">
      <PageHeading
        eyebrow="PIMX / OPERATIONS"
        title={l("مرکز مدیریت", "Operations center")}
        text={l(
          "آمار واقعی و اختیاری بازدید؛ بدون دسترسی به محتوای کاربران.",
          "Real, opt-in visit analytics. No access to user content.",
        )}
      />
      {!auth ? (
        <form className="panel admin-login" onSubmit={login}>
          <span className="tool-icon">
            <LockKeyhole size={25} />
          </span>
          <h2>{l("ورود مدیر", "Administrator sign-in")}</h2>
          <p className="muted">
            {l(
              "ورود با بررسی سمت سرور و نشست HttpOnly انجام می‌شود.",
              "Credentials are checked on the server with an HttpOnly session.",
            )}
          </p>
          <label className="field-label">
            {l("رمز مدیر", "Admin password")}
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              dir="ltr"
            />
          </label>
          {error && (
            <p className="error-note" role="alert">
              {error}
            </p>
          )}
          <button className="btn primary full" disabled={busy}>
            {busy ? l("در حال بررسی…", "Checking…") : l("ورود", "Sign in")}
          </button>
        </form>
      ) : (
        <>
          <div className="vault-toolbar">
            <Select
              compact
              label={l("بازه آمار", "Analytics range")}
              value={days}
              onChange={(value) => setDays(Number(value))}
              options={[7, 30, 90].map((n) => ({
                value: n,
                label: `${n} ${l("روز", "days")}`,
              }))}
            />
            <button className="btn secondary" disabled={busy} onClick={load}>
              <RefreshCw size={16} />
              {l("تازه‌سازی", "Refresh")}
            </button>
            <button
              className="btn secondary"
              onClick={async () => {
                try {
                  const r = await fetch("/api/session", { method: "DELETE" });
                  if (!r.ok) throw new Error();
                  setAuth(false);
                  setStats(null);
                } catch {
                  setError(
                    l(
                      "خروج انجام نشد؛ دوباره تلاش کنید.",
                      "Sign-out failed. Retry.",
                    ),
                  );
                }
              }}
            >
              <LogOut size={16} />
              {l("خروج", "Sign out")}
            </button>
          </div>
          {error && (
            <p className="error-note" role="alert">
              {error}
            </p>
          )}
          <div className="admin-metrics">
            <div className="panel">
              <Users size={22} />
              <strong>{stats?.total ?? "—"}</strong>
              <span>{l("بازدیدهای ثبت‌شده", "Recorded visits")}</span>
            </div>
            <div className="panel">
              <Globe2 size={22} />
              <strong>{stats?.countries.length ?? "—"}</strong>
              <span>{l("کشور در ۱۰ رتبه اول", "Countries in top 10")}</span>
            </div>
            <div className="panel">
              <Activity size={22} />
              <strong>{health?.sharing ? l("آماده", "Ready") : "—"}</strong>
              <span>{l("سرویس اشتراک", "Share service")}</span>
            </div>
          </div>
          <section className="panel analytics-panel">
            <h2>{l("روند بازدید", "Visit trend")}</h2>
            <p className="muted">
              {l(
                "روزها بر اساس منطقه زمانی تهران نمایش داده می‌شوند.",
                "Days use the Asia/Tehran time zone.",
              )}
            </p>
            {stats?.daily.length ? (
              <div className="visit-chart">
                {stats.daily.map((d) => (
                  <div key={d.day} title={`${d.day}: ${d.count}`}>
                    <span>{d.count}</span>
                    <i
                      style={{
                        height: `${Math.max(5, (d.count / Math.max(...stats.daily.map((x) => x.count))) * 150)}px`,
                      }}
                    />
                    <small>{d.day.slice(5)}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="blank-state">
                {l(
                  "در این بازه بازدیدی ثبت نشده است.",
                  "No recorded visits in this range.",
                )}
              </p>
            )}
          </section>
          <div className="settings-grid">
            <section className="panel analytics-panel">
              <h2>
                <Monitor size={20} />
                {l("دستگاه‌ها", "Devices")}
              </h2>
              {stats?.devices.map((d) => (
                <div className="stat-row" key={d.device}>
                  <span>{d.device}</span>
                  <strong>{d.count}</strong>
                </div>
              ))}
            </section>
            <section className="panel analytics-panel">
              <h2>
                <Globe2 size={20} />
                {l("کشورها", "Countries")}
              </h2>
              {stats?.countries.map((d) => (
                <div className="stat-row" key={d.country}>
                  <span>{d.country}</span>
                  <strong>{d.count}</strong>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
    </div>
  );
}
