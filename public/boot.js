// Apply saved preferences before the startup screen paints. No network calls.
(() => {
  const root = document.documentElement;
  const messages = window.pimxBootMessages || {};
  const text = (key) =>
    messages[root.lang === "zh-CN" ? "zh" : root.lang]?.[key] || key;
  try {
    const prefs = JSON.parse(localStorage.getItem("pimx:preferences") || "{}");
    root.lang = ["fa", "en", "ru", "zh", "de", "fr", "ja", "ko"].includes(
      prefs.lang,
    )
      ? prefs.lang === "zh"
        ? "zh-CN"
        : prefs.lang
      : "fa";
    root.dir = root.lang === "fa" ? "rtl" : "ltr";
    root.dataset.theme = prefs.theme === "light" ? "light" : "dark";
    root.dataset.motion = String(prefs.motion !== false);
  } catch {}
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor)
    themeColor.content = root.dataset.theme === "light" ? "#f5f3ed" : "#101112";
  let ready = false;
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      const message = document.getElementById("startup-message");
      if (message) message.textContent = text("Preparing your workspace…");
      const caption = document.getElementById("startup-caption");
      if (caption) caption.textContent = text("Encryption on your device");
      const retry = document.getElementById("startup-retry");
      if (retry) retry.textContent = text("Reload page");
      document.title = `PIMX WIDE | ${text("Local encryption tools")}`;
      const description = document.querySelector('meta[name="description"]');
      if (description)
        description.content = text(
          "Text and file encryption, a local vault and a password generator.",
        );
    },
    { once: true },
  );
  window.addEventListener(
    "pimx:ready",
    () => {
      ready = true;
    },
    { once: true },
  );
  setTimeout(() => {
    if (ready) return;
    const message = document.getElementById("startup-message");
    if (message)
      message.textContent = text("Loading is taking longer than usual.");
    const retry = document.getElementById("startup-retry");
    if (retry) retry.hidden = false;
  }, 15000);
})();
