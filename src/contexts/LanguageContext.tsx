import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { Locale } from '../lib/i18n';
import { getNestedValue } from '../lib/i18n';
import { translations } from '../lib/translations';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

function getSavedLocale(): Locale {
  try {
    const saved = localStorage.getItem('locale');
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {}
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getSavedLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem('locale', l); } catch {}
  }, []);

  const t = useCallback(
    (key: string) => getNestedValue(translations[locale] as Record<string, unknown>, key),
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
