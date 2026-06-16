// src/app/components/LanguageSwitcher.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt-BR', flag: '🇧🇷', label: 'PT' },
  { code: 'en',    flag: '🇺🇸', label: 'EN' },
  { code: 'ko',    flag: '🇰🇷', label: 'KR' },
  { code: 'ja',    flag: '🇯🇵', label: 'JP' },
  { code: 'es',    flag: '🇪🇸', label: 'ES' },
  { code: 'zh',    flag: '🇨🇳', label: 'ZH' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.code === i18n.language) ?? LANGUAGES[0];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg
                   text-white/70 hover:text-white hover:bg-white/10
                   transition-all text-sm font-medium"
        aria-label="Select language"
      >
        <Globe size={14} />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50
                          bg-black/90 backdrop-blur-xl border border-white/10
                          rounded-xl overflow-hidden shadow-2xl min-w-[130px]">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5
                            text-sm transition-all text-left
                            ${i18n.language === lang.code
                              ? 'bg-white/15 text-white font-semibold'
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {i18n.language === lang.code && (
                  <span className="ml-auto text-white/40 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
