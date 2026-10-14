import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Fingerprint,
  ArrowUpRight,
  Shield,
  LockKeyhole,
  KeyRound,
  Settings2,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  EyeOff,
  Download,
  Globe2,
  CircleHelp,
  Command,
  Wifi,
  WifiOff,
  ChevronLeft,
} from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { useVault } from "../contexts/VaultContext";
import { Landing } from "../pages/Landing";
const Studio = lazy(() =>
  import("../pages/Studio").then((m) => ({ default: m.Studio })),
);
const VaultPage = lazy(() =>
  import("../pages/VaultPage").then((m) => ({ default: m.VaultPage })),
);
const PasswordPage = lazy(() =>
  import("../pages/PasswordPage").then((m) => ({ default: m.PasswordPage })),
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((m) => ({ default: m.SettingsPage })),
);
const InformationPage = lazy(() =>
  import("../pages/InformationPages").then((m) => ({
    default: m.InformationPage,
  })),
);
const AdminPage = lazy(() =>
  import("../pages/Admin").then((m) => ({ default: m.AdminPage })),
);
const ReceivePage = lazy(() =>
  import("../pages/ReceivePage").then((m) => ({ default: m.ReceivePage })),
);
import { Modal } from "./ui";
import { AnimatePresence, motion, ease, useMotionEnabled } from "./motion";
import { Toast } from "./Toast";
import { SiteFooter } from "./SiteFooter";
import { AppLoader } from "./AppLoader";
import { LanguageSelect } from "./LanguageSelect";
export type Route =
  | "home"
  | "studio"
  | "vault"
  | "passwords"
  | "settings"
  | "privacy"
  | "terms"
  | "about"
  | "sla"
  | "pimxwideadmin"
  | "share";
function readRoute(): Route {
  const p = location.pathname.split("/")[1];
  return p === "encrypt" || p === "decrypt"
    ? "studio"
    : [
          "studio",
          "vault",
          "passwords",
          "settings",
          "privacy",
          "terms",
          "about",
          "sla",
          "pimxwideadmin",
          "share",
        ].includes(p)
      ? (p as Route)
      : "home";
}
export function Experience() {
  const { prefs, update, l } = usePreferences(),
    vault = useVault();
  const animated = useMotionEnabled();
  const [noticeId, setNoticeId] = useState(0);
  const [route, setRoute] = useState<Route>(readRoute),
    [menu, setMenu] = useState(false),
    [commands, setCommands] = useState(false),
    [query, setQuery] = useState(""),
    [hidden, setHidden] = useState(false),
    [epoch, setEpoch] = useState(0),
    [online, setOnline] = useState(navigator.onLine),
    [install, setInstall] = useState<any>(null),
    [notice, setNotice] = useState("");
  const [pending, setPending] = useState("");
  const last = useRef(Date.now());
  const tracked = useRef(false);
  const notify = useCallback((message: string) => {
    setNotice(message);
    setNoticeId((n) => n + 1);
  }, []);
  const nav = useCallback((r: Route) => {
    history.pushState(null, "", r === "home" ? "/" : `/${r}`);
    setRoute(r);
    setMenu(false);
    setCommands(false);
    setQuery("");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  const lock = useCallback(() => {
    window.dispatchEvent(new Event("pimx:lock"));
    setCommands(false);
    setMenu(false);
    setPending("");
    setEpoch((x) => x + 1);
    setHidden(true);
  }, []);
  useEffect(() => {
    const pop = () => {
        setRoute(readRoute());
        setMenu(false);
        setCommands(false);
        setPending("");
      },
      change = () => setOnline(navigator.onLine),
      before = (e: Event) => {
        e.preventDefault();
        setInstall(e);
      },
      key = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMenu(false);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          setCommands((x) => !x);
        }
        if (
          (e.ctrlKey || e.metaKey) &&
          e.shiftKey &&
          e.key.toLowerCase() === "l"
        ) {
          e.preventDefault();
          lock();
        }
      };
    window.addEventListener("popstate", pop);
    window.addEventListener("online", change);
    window.addEventListener("offline", change);
    window.addEventListener("beforeinstallprompt", before);
    window.addEventListener("keydown", key);
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .catch(() =>
          notify(
            l(
              "نصب آفلاین انجام نشد؛ دوباره آنلاین باز کنید.",
              "Offline setup failed. Reopen online.",
            ),
          ),
        );
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("online", change);
      window.removeEventListener("offline", change);
      window.removeEventListener("beforeinstallprompt", before);
      window.removeEventListener("keydown", key);
    };
  }, [lock]);
  useEffect(() => {
    const activity = () => {
      last.current = Date.now();
    };
    const tick = setInterval(() => {
      if (!hidden && Date.now() - last.current > prefs.idle * 60000) lock();
    }, 10000);
    ["pointerdown", "keydown", "touchstart"].forEach((n) =>
      window.addEventListener(n, activity),
    );
    return () => {
      clearInterval(tick);
      ["pointerdown", "keydown", "touchstart"].forEach((n) =>
        window.removeEventListener(n, activity),
      );
    };
  }, [prefs.idle, hidden, lock]);
  useEffect(() => {
    if (prefs.telemetry && !tracked.current) {
      tracked.current = true;
      fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      }).catch(() => {});
    }
  }, [prefs.telemetry]);
  const routes: { id: Route; name: string; icon: any }[] = [
    { id: "home", name: l("خانه", "Overview"), icon: Fingerprint },
    {
      id: "studio",
      name: l("استودیوی رمزنگاری", "Cipher studio"),
      icon: Shield,
    },
    { id: "vault", name: l("گاوصندوق من", "My vault"), icon: LockKeyhole },
    { id: "passwords", name: l("رمزساز", "Password lab"), icon: KeyRound },
    { id: "settings", name: l("تنظیمات", "Preferences"), icon: Settings2 },
  ];
  async function promptInstall() {
    if (!install) {
      notify(
        l(
          "در منوی مرورگر «نصب برنامه» یا «افزودن به صفحه اصلی» را انتخاب کنید.",
          "Choose “Install app” or “Add to Home Screen” in your browser menu.",
        ),
      );
      return;
    }
    await install.prompt();
    setInstall(null);
  }
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => nav("home")}
            aria-label={l("خانه PIMX WIDE", "PIMX WIDE home")}
          >
            <span className="brand-symbol">
              <Fingerprint size={25} />
            </span>
            <span>
              PIMX<span className="brand-wide">WIDE</span>
              <small
                title={l("ابزارهای رمزنگاری محلی", "Local encryption tools")}
              >
                {l("ابزارهای رمزنگاری محلی", "Local encryption tools")}
              </small>
            </span>
          </button>
          <nav
            id="main-navigation"
            className={menu ? "main-nav open" : "main-nav"}
            aria-label={l("منوی اصلی", "Main navigation")}
          >
            {routes.slice(0, 4).map((r) => (
              <button
                key={r.id}
                className={route === r.id ? "active" : ""}
                onClick={() => nav(r.id)}
              >
                <r.icon size={18} className="mobile-nav-icon" />
                {r.name}
                {route === r.id && <i />}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn command-trigger"
              onClick={() => setCommands(true)}
              aria-label={l("فرمان‌های سریع", "Quick commands")}
            >
              <Command size={18} />
            </button>
            <div className="header-language">
              <LanguageSelect compact />
            </div>
            <button
              className="icon-btn"
              onClick={() =>
                update({ theme: prefs.theme === "dark" ? "light" : "dark" })
              }
              aria-label={l("تغییر تم", "Toggle theme")}
            >
              {prefs.theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span className="header-divider" />
            <button
              className="privacy-button"
              aria-label={l("قفل سریع", "Quick lock")}
              onClick={lock}
            >
              <EyeOff size={16} />
              <span>{l("قفل سریع", "Quick lock")}</span>
            </button>
            <button
              className="icon-btn mobile-toggle"
              aria-label={l("بازکردن منو", "Toggle menu")}
              aria-expanded={menu}
              aria-controls="main-navigation"
              onClick={() => setMenu((x) => !x)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <button
        className={`mobile-menu-scrim ${menu ? "open" : ""}`}
        onClick={() => setMenu(false)}
        tabIndex={-1}
        aria-label={l("بستن منو", "Close menu")}
      />
      <div className="utility-bar">
        <span>
          <i className="live-dot" />
          {l("رمزنگاری روی دستگاه شما", "Encryption on your device")}
        </span>
        <div>
          <span className="desktop-only">AES–256 GCM</span>
          <span>
            {online ? <Wifi size={12} /> : <WifiOff size={12} />}{" "}
            {online ? l("آنلاین", "Online") : l("حالت آفلاین", "Offline mode")}
          </span>
          <button onClick={promptInstall}>
            <Download size={12} />
            {l("نصب اپلیکیشن", "Install app")}
          </button>
        </div>
      </div>
      <main
        key={epoch}
        className={hidden ? "private-content" : ""}
        {...(hidden ? { inert: "" } : {})}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={route}
            className="route-stage"
            initial={animated ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: animated ? -10 : 0,
              transition: { duration: animated ? 0.12 : 0 },
            }}
            transition={{ duration: animated ? 0.4 : 0, ease }}
          >
            <Suspense fallback={<AppLoader />}>
              {route === "home" && <Landing nav={nav} lock={lock} />}
              {route === "studio" && (
                <Studio
                  initialPayload={pending}
                  clearPayload={() => setPending("")}
                  toast={notify}
                />
              )}
              {route === "vault" && (
                <VaultPage
                  toast={notify}
                  usePayload={(p) => {
                    setPending(p);
                    nav("studio");
                  }}
                />
              )}
              {route === "passwords" && <PasswordPage toast={notify} />}
              {route === "settings" && (
                <SettingsPage toast={notify} lock={lock} />
              )}
              {route === "pimxwideadmin" && <AdminPage />}
              {route === "share" && (
                <ReceivePage
                  usePayload={(p) => {
                    setPending(p);
                    nav("studio");
                  }}
                />
              )}
              {["privacy", "terms", "about", "sla"].includes(route) && (
                <InformationPage page={route} />
              )}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <SiteFooter nav={nav} />
      <Toast message={notice} id={noticeId} dismiss={() => setNotice("")} />
      {commands && (
        <Modal
          title={l("کجا می‌خوای بری؟", "Where would you like to go?")}
          close={() => setCommands(false)}
        >
          <div className="search-field">
            <Search size={18} />
            <input
              autoFocus
              placeholder={l("جست‌وجوی ابزارها…", "Search tools…")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>ESC</kbd>
          </div>
          <div className="commands">
            {routes
              .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
              .map((r) => (
                <button key={r.id} onClick={() => nav(r.id)}>
                  <r.icon size={20} />
                  <span>{r.name}</span>
                  <ArrowUpRight size={16} />
                </button>
              ))}
            <button
              onClick={() => {
                setCommands(false);
                lock();
              }}
            >
              <EyeOff size={20} />
              <span>{l("قفل همه ابزارها", "Lock all tools")}</span>
              <kbd>Ctrl ⇧ L</kbd>
            </button>
          </div>
        </Modal>
      )}
      {hidden && (
        <div className="privacy-overlay">
          <span className="brand-symbol large">
            <Fingerprint size={40} />
          </span>
          <div className="eyebrow">{l("جلسه قفل شد", "Session locked")}</div>
          <h1>{l("فضای شما قفل شد.", "Your space is locked.")}</h1>
          <p>
            {l(
              "ورودی‌ها و خروجی‌های جلسه پاک شدند. گاوصندوق ذخیره‌شده رمز‌شده باقی می‌ماند.",
              "Session inputs and outputs have been cleared. Your saved vault stays encrypted.",
            )}
          </p>
          <button
            className="btn primary"
            onClick={() => {
              last.current = Date.now();
              setHidden(false);
              nav("home");
            }}
          >
            {l("شروع جلسه جدید", "Start a new session")}
            <ChevronLeft size={18} />
          </button>
          <a className="text-link" href="about:blank">
            {l("خروج سریع", "Quick exit")}
          </a>
        </div>
      )}
    </div>
  );
}
