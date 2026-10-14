import { readFile, writeFile, readdir } from "node:fs/promises";
import { extractMessages } from "./extract-messages.mjs";

const { messages, dynamic } = extractMessages();
if (dynamic.length)
  throw new Error(
    "UI messages must use named placeholders, not dynamic translation keys.",
  );
const catalogs = {
  fa: Object.fromEntries(messages),
  en: Object.fromEntries([...messages.keys()].map((en) => [en, en])),
};
for (const code of ["ru", "zh", "de", "fr", "ja", "ko"]) {
  catalogs[code] = JSON.parse(
    await readFile(`data/locales/${code}.json`, "utf8"),
  );
  for (const key of messages.keys()) {
    if (!catalogs[code][key]?.trim())
      throw new Error(`Missing ${code} translation: ${key}`);
    const placeholders = (text) =>
      (text.match(/\{\w+\}/g) || []).sort().join(",");
    if (placeholders(key) !== placeholders(catalogs[code][key]))
      throw new Error(`Changed ${code} placeholders: ${key}`);
  }
}
const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
for (const file of await readdir("public/illustrations")) {
  if (!file.endsWith(".svg") || /-(fa|ru|zh|de|fr|ja|ko)\.svg$/.test(file))
    continue;
  const svg = await readFile(`public/illustrations/${file}`, "utf8");
  for (const code of Object.keys(catalogs).filter((code) => code !== "en")) {
    const localized = svg.replace(
      /(<text\b[^>]*>)([\s\S]*?)(<\/text>)/g,
      (full, open, text, close) => {
        if (text === "AES 256") return full;
        if (!catalogs[code][text])
          throw new Error(`Untranslated illustration: ${text}`);
        return open + escape(catalogs[code][text]) + close;
      },
    );
    await writeFile(
      `dist/illustrations/${file.replace(".svg", `-${code}.svg`)}`,
      localized,
    );
    await writeFile(
      `public/illustrations/${file.replace(".svg", `-${code}.svg`)}`,
      localized,
    );
  }
}
const bootKeys = [
  "Preparing your workspace…",
  "Encryption on your device",
  "Loading is taking longer than usual.",
  "Reload page",
  "Local encryption tools",
  "Text and file encryption, a local vault and a password generator.",
];
const bootMessages = Object.fromEntries(
  Object.entries(catalogs).map(([code, catalog]) => [
    code,
    Object.fromEntries(bootKeys.map((key) => [key, catalog[key]])),
  ]),
);
const bootScript =
  "window.pimxBootMessages=" + JSON.stringify(bootMessages) + ";\n";
await writeFile("dist/boot-messages.js", bootScript);
await writeFile("public/boot-messages.js", bootScript);
const manifest = JSON.parse(
  await readFile("public/manifest.webmanifest", "utf8"),
);
for (const [code, catalog] of Object.entries(catalogs)) {
  const localized =
    JSON.stringify(
      {
        ...manifest,
        name: `PIMX WIDE | ${catalog["Local encryption tools"]}`,
        description:
          catalog[
            "Text and file encryption, a local vault and a password generator."
          ],
        lang: code === "zh" ? "zh-CN" : code,
        dir: code === "fa" ? "rtl" : "ltr",
      },
      null,
      2,
    ) + "\n";
  await writeFile(`dist/manifest-${code}.webmanifest`, localized);
  await writeFile(`public/manifest-${code}.webmanifest`, localized);
}
console.log(
  `Verified ${messages.size} messages in 8 languages, including artwork and startup copy.`,
);
