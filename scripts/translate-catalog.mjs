// One-time drafting tool for public interface copy only. Never used by the app
// or production build. Reviewed translations are committed under data/locales.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extractMessages } from "./extract-messages.mjs";

const languages = ["ru", "zh-CN", "de", "fr", "ja", "ko"];
const { messages } = extractMessages();
const sources = [...messages.keys()];
await mkdir("data/locales", { recursive: true });
async function translate(text, language) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.search = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: language,
    dt: "t",
    q: text,
  });
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);
  const result = await response.json();
  return result[0].map((segment) => segment[0] || "").join("");
}
await Promise.all(
  languages.map(async (language) => {
    const code = language === "zh-CN" ? "zh" : language;
    const path = `data/locales/${code}.json`;
    let catalog = {};
    try {
      catalog = JSON.parse(await readFile(path, "utf8"));
    } catch {}
    const missing = sources.filter((source) => !catalog[source]);
    for (let index = 0; index < missing.length; index += 12) {
      const batch = missing.slice(index, index + 12);
      const text = batch
        .map((source, i) => `[PIMX_${i}]\n${source}`)
        .join("\n\n");
      let done = false;
      for (let attempt = 0; attempt < 3 && !done; attempt++) {
        try {
          const output = await translate(text, language);
          const segments = [
            ...output.matchAll(
              /\[PIMX_(\d+)\]\s*([\s\S]*?)(?=\[PIMX_\d+\]|$)/g,
            ),
          ];
          if (segments.length !== batch.length)
            throw new Error("Message separators changed");
          for (const segment of segments)
            catalog[batch[Number(segment[1])]] = segment[2].trim();
          await writeFile(path, JSON.stringify(catalog, null, 2) + "\n");
          done = true;
        } catch (error) {
          if (attempt === 2) throw error;
          await new Promise((resolve) =>
            setTimeout(resolve, 1500 * (attempt + 1)),
          );
        }
      }
      if (index % 60 === 0)
        console.log(
          `${code}: ${Object.keys(catalog).length}/${sources.length}`,
        );
    }
    console.log(`${code}: complete (${sources.length} messages)`);
  }),
);
