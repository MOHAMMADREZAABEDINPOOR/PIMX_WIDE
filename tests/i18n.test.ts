import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { languages, catalogs, isLanguage, translate } from "../data/i18n";
import { extractMessages } from "../scripts/extract-messages.mjs";

test("all interface and static messages have complete translations and unchanged placeholders", () => {
  const { messages, dynamic } = extractMessages();
  assert.deepEqual(dynamic, []);
  assert.ok(messages.size >= 550);
  for (const [code, catalog] of Object.entries(catalogs)) {
    for (const key of messages.keys()) {
      assert.ok(catalog[key]?.trim(), `${code}: ${key}`);
      assert.deepEqual(
        catalog[key].match(/\{\w+\}/g) || [],
        key.match(/\{\w+\}/g) || [],
        `${code}: placeholders in ${key}`,
      );
      assert.doesNotMatch(
        catalog[key],
        /PIMX_\d+/,
        `${code}: translation separators leaked`,
      );
    }
  }
});

test("the eight language codes are validated and variables do not become translation keys", () => {
  assert.deepEqual(
    languages.map((language) => language.code),
    ["fa", "en", "ru", "zh", "de", "fr", "ja", "ko"],
  );
  for (const language of languages)
    assert.equal(isLanguage(language.code), true);
  for (const invalid of [null, undefined, "xx", "ar", "zh-CN", "<script>"])
    assert.equal(isLanguage(invalid), false);
  for (const language of languages) {
    const message = translate(
      language.code,
      "حداکثر ۱۰۰ فایل و {limit} در هر بسته.",
      "Up to 100 files and {limit} per package.",
      { limit: "48 MB" },
    );
    assert.ok(message.includes("48 MB"));
    assert.doesNotMatch(message, /\{limit\}/);
  }
});

test("production deployment does not contain the local placeholder database binding", () => {
  assert.doesNotMatch(
    readFileSync("wrangler.toml", "utf8"),
    /00000000-0000-0000-0000-000000000000/,
  );
  assert.match(
    readFileSync("wrangler.local.toml", "utf8"),
    /00000000-0000-0000-0000-000000000000/,
  );
});
