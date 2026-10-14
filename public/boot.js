// Apply saved preferences before the startup screen paints. No network calls.
(() => {
  const root = document.documentElement;
  try {
    const prefs = JSON.parse(localStorage.getItem("pimx:preferences") || "{}");
    root.lang = prefs.lang === "en" ? "en" : "fa";
    root.dir = root.lang === "fa" ? "rtl" : "ltr";
    root.dataset.theme = prefs.theme === "light" ? "light" : "dark";
    root.dataset.motion = String(prefs.motion !== false);
  } catch {}
  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor)
    themeColor.content = root.dataset.theme === "light" ? "#f5f3ed" : "#101112";
  let ready = false;
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
      message.textContent =
        root.lang === "en"
          ? "Loading is taking longer than usual."
          : "بارگذاری بیشتر از معمول طول کشیده است.";
    const retry = document.getElementById("startup-retry");
    if (retry) retry.hidden = false;
  }, 15000);
})();
