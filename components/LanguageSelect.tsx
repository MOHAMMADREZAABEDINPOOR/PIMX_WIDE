import React from "react";
import { usePreferences } from "../contexts/Preferences";
import { languages, Language } from "../data/i18n";
import { Select } from "./Select";

export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { prefs, update, l } = usePreferences();
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
      }))}
    />
  );
}
