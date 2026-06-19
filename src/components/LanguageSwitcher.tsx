'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import { Locale, locales, localeNames } from '@/lib/i18n/config';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  const handleSwitch = () => {
    const nextLocale = locale === 'zh-Hans' ? 'en' : 'zh-Hans';
    setLocale(nextLocale);
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
      aria-label="Switch language"
    >
      {locale === 'zh-Hans' ? (
        <span>EN</span>
      ) : (
        <span>中文</span>
      )}
    </button>
  );
}

// 带下拉菜单的语言切换器
export function LanguageSwitcherDropdown() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
      >
        <span>{localeNames[locale]}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="absolute right-0 mt-2 w-32 rounded-md bg-slate-800 border border-slate-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
              locale === l
                ? 'text-indigo-400 bg-slate-700/50'
                : 'text-slate-300 hover:bg-slate-700/30'
            }`}
          >
            {localeNames[l]}
          </button>
        ))}
      </div>
    </div>
  );
}