import React, { useEffect } from "react";
import { Fingerprint, LockKeyhole } from "lucide-react";
import { usePreferences } from "../contexts/Preferences";
import { createPortal } from "react-dom";

export function AppLoader() {
  const { l } = usePreferences();
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    root.dataset.routeLoading = "true";
    root.setAttribute("inert", "");
    return () => {
      delete root.dataset.routeLoading;
      const startup = document.getElementById("startup-loader");
      if (!startup || startup.classList.contains("loader-complete"))
        root.removeAttribute("inert");
    };
  }, []);
  return createPortal(
    <div
      className="app-loader route-loader"
      role="status"
      aria-live="polite"
      aria-label={l("در حال بارگذاری", "Loading")}
    >
      <div className="loader-content">
        <div className="loader-mechanism" aria-hidden="true">
          <div className="loader-orbit" />
          <div className="loader-orbit inner" />
          <div className="loader-core">
            <Fingerprint size={66} strokeWidth={1} />
            <LockKeyhole size={18} />
          </div>
          <i className="loader-satellite" />
        </div>
        <div className="loader-brand">
          PIMX <span>WIDE</span>
        </div>
        <p>{l("در حال آماده‌کردن فضای کار…", "Preparing your workspace…")}</p>
        <div className="loader-track" aria-hidden="true">
          <i />
        </div>
        <small>
          {l("رمزنگاری روی دستگاه شما", "Encryption on your device")}
        </small>
      </div>
    </div>,
    document.body,
  );
}

/** Dismiss the HTML startup screen when React and local fonts are ready. */
export function StartupReady() {
  useEffect(() => {
    const loader = document.getElementById("startup-loader");
    if (!loader) return;
    let cancelled = false;
    let frame = 0;
    let removal: ReturnType<typeof setTimeout>;
    let timeout: ReturnType<typeof setTimeout>;
    const ready = new Promise<void>((resolve) => {
      timeout = setTimeout(resolve, 2000);
    });
    Promise.race([document.fonts.ready, ready]).then(() => {
      if (cancelled) return;
      clearTimeout(timeout);
      frame = requestAnimationFrame(() => {
        const root = document.getElementById("root");
        if (root && root.dataset.routeLoading !== "true")
          root.removeAttribute("inert");
        loader.classList.add("loader-complete");
        loader.setAttribute("aria-hidden", "true");
        window.dispatchEvent(new Event("pimx:ready"));
        removal = setTimeout(() => loader.remove(), 380);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      clearTimeout(removal);
    };
  }, []);
  return null;
}
