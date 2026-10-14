import React, { useState } from "react";
import {
  Palette,
  Globe2,
  EyeOff,
  Download,
  Trash2,
  ShieldCheck,
  LockKeyhole,
  Fingerprint,
} from "lucide-react";
import { usePreferences, defaultPreferences } from "../contexts/Preferences";
import { useVault } from "../contexts/VaultContext";
import { deleteVault } from "../services/vault";
import { Modal } from "../components/ui";
import { Select } from "../components/Select";
import { StoryHero } from "../components/StoryHero";
import { Ambient } from "../components/motion";
import {
  Sun,
  Moon,
  Clock,
  Sparkles,
  ArrowUpRight,
  WifiOff,
  SlidersHorizontal,
} from "lucide-react";
export function SettingsPage({
  toast,
  lock,
}: {
  toast: (s: string) => void;
  lock: () => void;
}) {
  const { prefs, update, l } = usePreferences(),
    vault = useVault(),
    [wipe, setWipe] = useState(false),
    [busy, setBusy] = useState(false);
  return (
    <div className="workspace wrap settings-experience">
      <StoryHero
        eyebrow={l("تنظیمات مرورگر", "Browser preferences")}
        title={l("تنظیمات", "Set up")}
        highlight={l("این دستگاه", "this device.")}
        kind="settings"
        text={l(
          "تم، زبان و زمان قفل خودکار را انتخاب کنید. تغییرات در همین مرورگر ذخیره می‌شوند.",
          "Choose your theme, language and automatic lock time. Changes are saved in this browser.",
        )}
      >
        <div className="hero-mini-tags">
          <span>
            <Palette size={14} />
            {l("تم روشن و تیره", "Light and dark themes")}
          </span>
          <span>
            <LockKeyhole size={14} />
            {l("قفل خودکار", "Automatic locking")}
          </span>
          <span>
            <Sparkles size={14} />
            {l("کنترل انیمیشن‌ها", "Animation controls")}
          </span>
        </div>
      </StoryHero>
      <div className="settings-live-preview">
        <span className="preview-orb">
          <Fingerprint size={23} />
        </span>
        <div>
          <span className="eyebrow">
            {l("تنظیمات ذخیره‌شده", "Saved preferences")}
          </span>
          <p>
            {l("تنظیمات فعلی این دستگاه", "Current settings on this device")}
          </p>
        </div>
        <div className="preview-chips">
          <span>
            {prefs.theme === "dark" ? <Moon size={13} /> : <Sun size={13} />}{" "}
            {prefs.theme === "dark" ? l("تیره", "Dark") : l("روشن", "Light")}
          </span>
          <span>
            <Clock size={13} /> {prefs.idle} {l("دقیقه", "min")}
          </span>
          <span>
            <Globe2 size={13} /> {prefs.lang === "fa" ? "فارسی" : "English"}
          </span>
        </div>
      </div>
      <div className="settings-layout">
        <aside className="settings-navigation">
          <span className="eyebrow">
            {l("بخش‌های تنظیمات", "Preferences sections")}
          </span>
          {[
            {
              id: "appearance",
              icon: Palette,
              label: l("ظاهر و تجربه", "Look & feel"),
            },
            {
              id: "privacy-controls",
              icon: ShieldCheck,
              label: l("حریم خصوصی", "Privacy"),
            },
            {
              id: "offline-controls",
              icon: Download,
              label: l("نصب و آفلاین", "Install & offline"),
            },
            {
              id: "device-data",
              icon: SlidersHorizontal,
              label: l("داده‌های دستگاه", "Device data"),
            },
          ].map((s, i) => (
            <a key={s.id} href={`#${s.id}`}>
              <span>0{i + 1}</span>
              <s.icon size={16} />
              {s.label}
              <ArrowUpRight size={13} />
            </a>
          ))}
          <div className="navigation-note">
            <ShieldCheck size={25} />
            <p>
              {l(
                "تنظیمات در همین مرورگر ذخیره می‌شوند.",
                "Settings are saved in this browser.",
              )}
            </p>
          </div>
        </aside>
        <div className="settings-grid">
          <section id="appearance" className="panel settings-card">
            <span className="settings-card-index">
              {l("ظاهر", "Appearance")}
            </span>
            <h2>
              <Palette size={20} />
              {l("ظاهر و تجربه", "Look & feel")}
            </h2>
            <div className="field-label">
              {l("تم", "Theme")}
              <Select
                label={l("تم", "Theme")}
                value={prefs.theme}
                onChange={(value) =>
                  update({ theme: value as "dark" | "light" })
                }
                options={[
                  {
                    value: "dark",
                    label: l("تیره", "Dark"),
                    description: l(
                      "زغالی با طلایی روشن",
                      "Charcoal with light gold accents",
                    ),
                    icon: <Moon size={17} />,
                  },
                  {
                    value: "light",
                    label: l("روشن", "Light"),
                    description: l(
                      "عاجی با طلایی تیره",
                      "Ivory with dark gold accents",
                    ),
                    icon: <Sun size={17} />,
                  },
                ]}
              />
            </div>
            <div className="field-label">
              {l("رنگ برند", "Brand color")}
              <div className="brand-gold-preview">
                <span />
                <div>
                  <strong>{l("طلایی PIMX", "PIMX gold")}</strong>
                  <small>
                    {l(
                      "طلایی روشن در تم تیره، طلایی تیره در تم روشن",
                      "Light gold in dark mode, dark gold in light mode",
                    )}
                  </small>
                </div>
                <Fingerprint size={22} />
              </div>
            </div>
            <label className="toggle-row">
              <span>
                {l("انیمیشن‌ها", "Animations")}
                <small>
                  {l(
                    "تنظیم کاهش حرکت سیستم هم رعایت می‌شود.",
                    "System reduced-motion preferences are also respected.",
                  )}
                </small>
              </span>
              <input
                type="checkbox"
                checked={prefs.motion}
                onChange={(e) => update({ motion: e.target.checked })}
              />
            </label>
            <div className="field-label">
              {l("زبان", "Language")}
              <Select
                label={l("زبان", "Language")}
                value={prefs.lang}
                onChange={(value) => update({ lang: value as "fa" | "en" })}
                options={[
                  {
                    value: "fa",
                    label: "فارسی",
                    description: "راست به چپ",
                    icon: <Globe2 size={17} />,
                  },
                  {
                    value: "en",
                    label: "English",
                    description: "Left to right",
                    icon: <Globe2 size={17} />,
                  },
                ]}
              />
            </div>
          </section>
          <section id="privacy-controls" className="panel settings-card">
            <span className="settings-card-index">
              {l("قفل و آمار", "Locking and analytics")}
            </span>
            <h2>
              <EyeOff size={20} />
              {l("حریم خصوصی", "Privacy")}
            </h2>
            <div className="field-label">
              {l("قفل پس از بی‌کاری", "Lock after inactivity")}
              <Select
                label={l("قفل پس از بی‌کاری", "Lock after inactivity")}
                value={prefs.idle}
                onChange={(value) => update({ idle: Number(value) })}
                options={[1, 5, 15, 30].map((n) => ({
                  value: n,
                  label: `${n} ${l("دقیقه", "minutes")}`,
                  description:
                    n === 1
                      ? l("قفل سریع‌تر", "Lock sooner")
                      : n === 5
                        ? l("زمان پیشنهادی", "Suggested interval")
                        : l("زمان بیشتر برای کار", "More time to work"),
                  icon: <Clock size={17} />,
                }))}
              />
            </div>
            <label className="toggle-row">
              <span>
                {l("آمار اختیاری بازدید", "Optional visit analytics")}
                <small>
                  {l(
                    "زمان، کشور و نوع دستگاه؛ بدون متن، رمز و نشانی IP ذخیره‌شده.",
                    "Time, country and device type. No content, passwords or stored IP addresses.",
                  )}
                </small>
              </span>
              <input
                type="checkbox"
                checked={prefs.telemetry}
                onChange={(e) => update({ telemetry: e.target.checked })}
              />
            </label>
            <button className="btn secondary full" onClick={lock}>
              <LockKeyhole size={17} />
              {l("قفل و پاک‌کردن جلسه فعلی", "Lock & clear current session")}
            </button>
            <div className="shortcut-line">
              <kbd>Ctrl</kbd> + <kbd>K</kbd>
              <span>{l("فرمان‌های سریع", "Quick commands")}</span>
            </div>
            <div className="shortcut-line">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
              <span>{l("قفل سریع", "Quick lock")}</span>
            </div>
          </section>
          <section
            id="offline-controls"
            className="panel settings-card offline-settings-card"
          >
            <span className="settings-card-index">
              {l("دسترسی آفلاین", "Offline access")}
            </span>
            <h2>
              <Download size={20} />
              {l("نصب و استفاده آفلاین", "Install & go offline")}
            </h2>
            <p className="muted">
              {l(
                "نسخه انتشار را یک بار کامل آنلاین باز کنید. سپس از منوی مرورگر، نصب برنامه یا افزودن به صفحه اصلی را انتخاب کنید. رمزنگاری، رمزساز و گاوصندوق آفلاین کار می‌کنند.",
                "Open the production version fully online once, then choose Install app or Add to Home Screen from the browser menu. Encryption, password generation and vault tools work offline.",
              )}
            </p>
            <Ambient className="offline-device-art">
              <div className="device-monitor">
                <Fingerprint size={30} />
                <span>PIMX WIDE</span>
                <i />
              </div>
              <div className="device-phone">
                <LockKeyhole size={20} />
                <i />
              </div>
              <div className="device-orbit" />
              <WifiOff className="device-wifi" size={20} />
            </Ambient>
            <div className="subtle-note">
              <ShieldCheck size={18} />
              {l(
                "لینک‌های اشتراک و مدیریت به اتصال شبکه نیاز دارند.",
                "Share links and admin tools require a connection.",
              )}
            </div>
          </section>
          <section id="device-data" className="panel settings-card danger-zone">
            <span className="settings-card-index">
              {l("حذف داده‌ها", "Remove data")}
            </span>
            <h2>
              <Trash2 size={20} />
              {l("داده‌های این دستگاه", "Data on this device")}
            </h2>
            <p className="muted">
              {l(
                "گاوصندوق ذخیره‌شده و تنظیمات همین برنامه را پاک کنید. قبل از حذف، پشتیبان بگیرید. فایل‌هایی که دانلود کرده‌اید حذف نمی‌شوند.",
                "Remove this app’s saved vault and preferences. Back up first. Downloaded files are not removed.",
              )}
            </p>
            <button
              className="btn danger-btn"
              disabled={vault.busy}
              onClick={() => setWipe(true)}
            >
              <Trash2 size={16} />
              {l("پاک‌کردن داده‌های برنامه", "Clear app data")}
            </button>
          </section>
        </div>
      </div>
      {wipe && (
        <Modal
          title={l("داده‌های برنامه حذف شوند؟", "Remove app data?")}
          canClose={!busy}
          close={() => {
            if (!busy) setWipe(false);
          }}
        >
          <p className="muted">
            {l(
              "بدون پشتیبان، گاوصندوق محلی قابل بازیابی نیست.",
              "Without a backup, the local vault cannot be recovered.",
            )}
          </p>
          <button
            className="btn danger-btn full"
            disabled={busy || vault.busy}
            onClick={async () => {
              setBusy(true);
              try {
                await deleteVault();
                for (let i = localStorage.length - 1; i >= 0; i--) {
                  const k = localStorage.key(i)!;
                  if (k.startsWith("pimx:") || k.startsWith("pimx_v4_vault_"))
                    localStorage.removeItem(k);
                }
                sessionStorage.removeItem("pimx_admin_authed");
                update(defaultPreferences);
                setWipe(false);
                lock();
                toast(
                  l(
                    "گاوصندوق و داده‌های برنامه حذف شدند.",
                    "Vault and app data removed.",
                  ),
                );
              } catch {
                toast(
                  l(
                    "حذف انجام نشد؛ دسترسی ذخیره‌سازی را بررسی کنید.",
                    "Could not remove data. Check storage access.",
                  ),
                );
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy
              ? l("در حال حذف…", "Removing…")
              : l("حذف گاوصندوق و داده‌های برنامه", "Remove vault & app data")}
          </button>
        </Modal>
      )}
    </div>
  );
}
