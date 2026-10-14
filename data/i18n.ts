import ru from "./locales/ru.json" with { type: "json" };
import zh from "./locales/zh.json" with { type: "json" };
import de from "./locales/de.json" with { type: "json" };
import fr from "./locales/fr.json" with { type: "json" };
import ja from "./locales/ja.json" with { type: "json" };
import ko from "./locales/ko.json" with { type: "json" };

export const languages = [
  {
    code: "fa",
    native: "فارسی",
    english: "Persian",
    flag: "🇮🇷",
    locale: "fa-IR",
  },
  {
    code: "en",
    native: "English",
    english: "English",
    flag: "🇺🇸",
    locale: "en-US",
  },
  {
    code: "ru",
    native: "Русский",
    english: "Russian",
    flag: "🇷🇺",
    locale: "ru-RU",
  },
  {
    code: "zh",
    native: "中文",
    english: "Chinese",
    flag: "🇨🇳",
    locale: "zh-CN",
  },
  {
    code: "de",
    native: "Deutsch",
    english: "German",
    flag: "🇩🇪",
    locale: "de-DE",
  },
  {
    code: "fr",
    native: "Français",
    english: "French",
    flag: "🇫🇷",
    locale: "fr-FR",
  },
  {
    code: "ja",
    native: "日本語",
    english: "Japanese",
    flag: "🇯🇵",
    locale: "ja-JP",
  },
  {
    code: "ko",
    native: "한국어",
    english: "Korean",
    flag: "🇰🇷",
    locale: "ko-KR",
  },
] as const;
export type Language = (typeof languages)[number]["code"];
export type Translator = (
  fa: string,
  en: string,
  values?: Record<string, string | number>,
) => string;
export const catalogs: Record<
  Exclude<Language, "fa" | "en">,
  Record<string, string>
> = { ru, zh, de, fr, ja, ko };
export const isLanguage = (value: unknown): value is Language =>
  languages.some((language) => language.code === value);
export const languageInfo = (code: Language) =>
  languages.find((language) => language.code === code)!;

export function translate(
  language: Language,
  fa: string,
  en: string,
  values: Record<string, string | number> = {},
) {
  const message =
    language === "fa"
      ? fa
      : language === "en"
        ? en
        : (catalogs[language][en] ?? en);
  return message.replace(/\{(\w+)\}/g, (token, name: string) =>
    name in values ? String(values[name]) : token,
  );
}
