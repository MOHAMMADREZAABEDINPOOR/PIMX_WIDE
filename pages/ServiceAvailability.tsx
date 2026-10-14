import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowUpRight,
  Check,
  CircleHelp,
  Cloud,
  HardDrive,
  KeyRound,
  Link2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import "./availability.css";

const subscribe = (notify: () => void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

export function ServiceAvailability() {
  const { l } = usePreferences();
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  const [server, setServer] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const controller = useRef<AbortController | null>(null);
  useEffect(
    () => () => {
      controller.current?.abort();
      controller.current = null;
    },
    [],
  );
  useEffect(() => {
    controller.current?.abort();
    controller.current = null;
    setServer("idle");
  }, [online]);
  async function checkServer() {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setServer("checking");
    const timeout = setTimeout(() => request.abort(), 8000);
    try {
      const response = await fetch("/api/health", {
        cache: "no-store",
        signal: request.signal,
      });
      const result = (await response.json()) as { database?: boolean; sharing?: boolean } | null;
      if (controller.current === request)
        setServer(
          response.ok && result?.database === true && result?.sharing === true
            ? "available"
            : "unavailable",
        );
    } catch {
      if (controller.current === request) setServer("unavailable");
    } finally {
      clearTimeout(timeout);
    }
  }
  const tools = [
    [
      ShieldCheck,
      l("رمزنگاری و رمزگشایی", "Encryption and decryption"),
      l(
        "متن، فایل و پوشه در مرورگر پردازش می‌شوند.",
        "Text, files and folders are processed in your browser.",
      ),
      true,
      "/studio",
    ],
    [
      LockKeyhole,
      l("گاوصندوق محلی", "Local vault"),
      l(
        "بسته‌های ذخیره‌شده در همین مرورگر در دسترس‌اند.",
        "Saved packages stay available in this browser.",
      ),
      true,
      "/vault",
    ],
    [
      KeyRound,
      l("رمزساز", "Password generator"),
      l(
        "ساخت رمز و عبارت عبور به سرور نیاز ندارد.",
        "Passwords and passphrases are generated without a server.",
      ),
      true,
      "/passwords",
    ],
    [
      Link2,
      l("لینک اشتراک", "Share links"),
      l(
        "ساخت و دریافت لینک به اینترنت و سرور نیاز دارد.",
        "Creating and retrieving links requires internet and the server.",
      ),
      false,
      "/studio",
    ],
  ] as const;
  return (
    <div className="workspace wrap availability-page">
      <section className="availability-intro">
        <div>
          <span className="availability-context">
            <WifiOff size={17} />
            {l(
              "ابزارهای محلی و خدمات آنلاین",
              "Local tools and online services",
            )}
          </span>
          <h1>{l("دسترسی به سرویس", "Service availability")}</h1>
          <p>
            {l(
              "رمزنگاری به اتصال دائمی نیاز ندارد. بعد از بارگذاری کامل نسخه انتشار، ابزارهای محلی بدون اینترنت هم کار می‌کنند.",
              "Encryption does not need a constant connection. After the production app is fully loaded and cached, local tools also work offline.",
            )}
          </p>
          <a className="btn primary" href="/studio">
            <ShieldCheck size={18} />
            {l("بازکردن استودیو", "Open studio")}
          </a>
        </div>
        <div className="availability-diagram" aria-hidden="true">
          <div className="availability-device">
            <HardDrive size={42} strokeWidth={1.2} />
            <strong>{l("دستگاه شما", "Your device")}</strong>
            <span>
              {l(
                "متن، فایل، گاوصندوق و رمزساز",
                "Text, files, vault and passwords",
              )}
            </span>
            <i>
              <LockKeyhole size={15} />
              {l("پردازش محلی", "Local processing")}
            </i>
          </div>
          <div className="availability-wire">
            <span>{l("فقط برای اشتراک لینک", "For link sharing")}</span>
            <i />
          </div>
          <div className="availability-cloud">
            <Cloud size={35} strokeWidth={1.2} />
            <span>{l("بسته رمز‌شده", "Encrypted package")}</span>
          </div>
        </div>
      </section>
      <section
        className="availability-connection"
        aria-labelledby="connection-title"
      >
        <div className="connection-browser">
          <span className={`connection-icon ${online ? "online" : "offline"}`}>
            {online ? <Wifi size={21} /> : <WifiOff size={21} />}
          </span>
          <div>
            <h2 id="connection-title">
              {online
                ? l("مرورگر آنلاین است", "Your browser is online")
                : l("مرورگر آفلاین است", "Your browser is offline")}
            </h2>
            <p>
              {l(
                "این وضعیت اتصال مرورگر است؛ دسترسی سرور جداگانه بررسی می‌شود.",
                "This is your browser’s connection status. Server availability is checked separately.",
              )}
            </p>
          </div>
        </div>
        <div className="connection-server" aria-live="polite">
          <span>
            {server === "available"
              ? l("سرور اشتراک پاسخ می‌دهد", "The sharing server is responding")
              : server === "unavailable"
                ? l(
                    "سرور اشتراک در دسترس نیست",
                    "The sharing server is unavailable",
                  )
                : server === "checking"
                  ? l("در حال بررسی سرور…", "Checking the server…")
                  : l(
                      "سرور هنوز بررسی نشده",
                      "The server has not been checked",
                    )}
          </span>
          <button
            className="btn secondary"
            disabled={!online || server === "checking"}
            onClick={checkServer}
          >
            <RefreshCw
              size={16}
              className={server === "checking" ? "availability-checking" : ""}
            />
            {l("بررسی اتصال سرور", "Check server connection")}
          </button>
        </div>
      </section>
      <section
        className="availability-tools"
        aria-labelledby="availability-tools-title"
      >
        <div className="availability-heading">
          <h2 id="availability-tools-title">
            {l(
              "هر ابزار چه اتصالی نیاز دارد؟",
              "Which tools need a connection?",
            )}
          </h2>
          <p>
            {l(
              "دسترسی آفلاین به بارگذاری کامل و ذخیره‌شدن نسخه انتشار در مرورگر وابسته است.",
              "Offline access requires the production app to be fully loaded and cached in your browser.",
            )}
          </p>
        </div>
        <div className="availability-tool-list">
          {tools.map(([Icon, title, text, local, href]) => (
            <a key={href + title} href={href} className="availability-tool">
              <Icon size={25} strokeWidth={1.4} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
              <span
                className={
                  local ? "tool-connectivity local" : "tool-connectivity"
                }
              >
                {local ? <Check size={14} /> : <Wifi size={14} />}
                {local
                  ? l("آفلاین هم کار می‌کند", "Works offline too")
                  : l("نیازمند اینترنت", "Internet required")}
              </span>
              <ArrowUpRight size={17} />
            </a>
          ))}
        </div>
      </section>
      <section className="availability-help">
        <div>
          <CircleHelp size={24} />
          <h2>{l("برای استفاده آفلاین", "To use the app offline")}</h2>
          <ol>
            <li>
              {l(
                "نسخه انتشار را یک‌بار با اینترنت کامل باز کنید.",
                "Open the production app fully while online.",
              )}
            </li>
            <li>
              {l(
                "از منوی مرورگر، برنامه را نصب کنید یا به صفحه اصلی اضافه کنید. نصب اختیاری است.",
                "Optionally install the app or add it to your home screen from the browser menu.",
              )}
            </li>
            <li>
              {l(
                "اتصال را قطع کنید و بازکردن استودیو و گاوصندوق را امتحان کنید.",
                "Disconnect and try opening the studio and vault.",
              )}
            </li>
          </ol>
          <a className="text-link" href="/settings">
            {l("تنظیمات نصب و آفلاین", "Install and offline settings")}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <div>
          <Cloud size={24} />
          <h2>
            {l(
              "اگر سرویس آنلاین در دسترس نیست",
              "If online services are unavailable",
            )}
          </h2>
          <p>
            {l(
              "اتصال اینترنت را بررسی کنید و دوباره امتحان کنید. می‌توانید بسته را دانلود کنید و از مسیر دیگری برای گیرنده بفرستید؛ رمز عبور را جدا ارسال کنید.",
              "Check your internet connection and try again. You can download the package and send it through another channel. Send the password separately.",
            )}
          </p>
          <p className="availability-policy">
            {l(
              "برای این پروژه تضمین قراردادی آپ‌تایم ارائه نمی‌شود. آمار مدیریت به سرور نیاز دارد؛ محدودیت لینک، نسخه‌های قبلاً دریافت‌شده را حذف نمی‌کند.",
              "This project offers no contractual uptime guarantee. Admin analytics requires the server, and link limits cannot erase copies already received.",
            )}
          </p>
        </div>
      </section>
    </div>
  );
}
