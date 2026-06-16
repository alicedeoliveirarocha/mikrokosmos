// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from '../locales/pt-BR.json';
import en from '../locales/en.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';
import es from '../locales/es.json';
import zh from '../locales/zh.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'pt-BR', nativeLabel: 'Português', flag: '🇧🇷' },
  { code: 'en',    nativeLabel: 'English',   flag: '🇺🇸' },
  { code: 'ko',    nativeLabel: '한국어',      flag: '🇰🇷' },
  { code: 'ja',    nativeLabel: '日本語',      flag: '🇯🇵' },
  { code: 'es',    nativeLabel: 'Español',    flag: '🇪🇸' },
  { code: 'zh',    nativeLabel: '中文',        flag: '🇨🇳' },
] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      en:      { translation: en },
      ko:      { translation: ko },
      ja:      { translation: ja },
      es:      { translation: es },
      zh:      { translation: zh },
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mikrokosmos-lang',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
