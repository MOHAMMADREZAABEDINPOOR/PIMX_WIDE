import React, { createContext, useContext, useEffect, useState } from "react";
export interface Preferences {
  lang: "fa" | "en";
  theme: "dark" | "light";
  accent: "gold";
  motion: boolean;
  idle: number;
  telemetry: boolean;
}
export const defaultPreferences: Preferences = {
  lang: "fa",
  theme: "dark",
  accent: "gold",
  motion: true,
  idle: 5,
  telemetry: false,
};
const defaults = defaultPreferences;
const Context = createContext<{
  prefs: Preferences;
  update: (p: Partial<Preferences>) => void;
  l: (fa: string, en: string) => string;
}>(null!);
export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, set] = useState<Preferences>(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pimx:preferences") || "{}");
      return {
        lang: p.lang === "en" ? "en" : "fa",
        theme: p.theme === "light" ? "light" : "dark",
        accent: "gold",
        motion: typeof p.motion === "boolean" ? p.motion : true,
        idle: [1, 5, 15, 30].includes(p.idle) ? p.idle : 5,
        telemetry: p.telemetry === true,
      };
    } catch {
      return defaults;
    }
  });
  useEffect(() => {
    const root = document.documentElement;
    root.lang = prefs.lang;
    root.dir = prefs.lang === "fa" ? "rtl" : "ltr";
    root.dataset.theme = prefs.theme;
    root.dataset.accent = prefs.accent;
    root.dataset.motion = String(prefs.motion);
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (themeColor)
      themeColor.content = prefs.theme === "light" ? "#f5f3ed" : "#101112";
    try {
      localStorage.setItem("pimx:preferences", JSON.stringify(prefs));
    } catch {}
  }, [prefs]);
  return (
    <Context.Provider
      value={{
        prefs,
        update: (p) => set((prev) => ({ ...prev, ...p, accent: "gold" })),
        l: (fa, en) => (prefs.lang === "fa" ? fa : en),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const usePreferences = () => useContext(Context);
