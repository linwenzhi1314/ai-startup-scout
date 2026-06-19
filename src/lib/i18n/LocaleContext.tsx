'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Locale, locales, localeNames, translations, detectBrowserLocale } from './config';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  localeName: string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-Hans');

  useEffect(() => {
    // 从 localStorage 或浏览器检测语言
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      const detected = detectBrowserLocale();
      setLocaleState(detected);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || key;
  };

  const localeName = localeNames[locale];

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, localeName }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}