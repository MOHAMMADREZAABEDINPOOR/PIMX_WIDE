import React from "react";
import { usePreferences } from "../contexts/Preferences";
import { languages, Language } from "../data/i18n";
import { Select } from "./Select";

export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { prefs, update, l } = usePreferences();
  const flags: Record<Language, string> = {
    fa: "ir",
    en: "us",
    ru: "ru",
    zh: "cn",
    de: "de",
    fr: "fr",
    ja: "jp",
    ko: "kr",
  };
  return (
    <Select
      compact={compact}
      label={l("زبان", "Language")}
      value={prefs.lang}
      onChange={(value) => update({ lang: value as Language })}
      options={languages.map((language) => ({
        value: language.code,
        label: language.native,
        description:
          language.native === language.english ? undefined : language.english,
        icon: (
          <img
            className="language-flag"
            src={`/flags/${flags[language.code]}.svg`}
            width="20"
            height="15"
            alt=""
            aria-hidden="true"
          />
        ),
      }))}
    />
  );
}
