
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, LanguageDefinition } from '../types';
import { LANGUAGES, getTranslation } from '../data/languages';

interface LanguageContextType {
  currentLang: LanguageDefinition;
  setLanguage: (code: LanguageCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<LanguageDefinition>(LANGUAGES[0]); // Default Persian

  const setLanguage = (code: LanguageCode) => {
    const lang = LANGUAGES.find(l => l.code === code);
    if (lang) {
      setCurrentLangState(lang);
      // Update document direction
      document.documentElement.dir = lang.dir;
      document.documentElement.lang = lang.code;
    }
  };

  const t = (key: string) => {
    return getTranslation(currentLang.code, key);
  };

  // Initialize
  useEffect(() => {
    document.documentElement.dir = currentLang.dir;
    document.documentElement.lang = currentLang.code;
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
