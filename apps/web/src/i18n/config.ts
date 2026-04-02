// i18n yapilandirmasi — i18next 26.x
// Namespace yapisi: common, shell, auth, validation
// Locale resolution: persisted preference → system locale → fallback

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// TR locale dosyalari
import trCommon from './locales/tr/common.json';
import trAuth from './locales/tr/auth.json';
import trShell from './locales/tr/shell.json';
import trValidation from './locales/tr/validation.json';

// EN locale dosyalari
import enCommon from './locales/en/common.json';

export const defaultLocale = 'tr';
export const supportedLocales = ['tr', 'en'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const namespaces = ['common', 'shell', 'auth', 'validation'] as const;
export type Namespace = (typeof namespaces)[number];

i18n.use(initReactI18next).init({
  resources: {
    tr: {
      common: trCommon,
      auth: trAuth,
      shell: trShell,
      validation: trValidation,
    },
    en: {
      common: enCommon,
    },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  ns: [...namespaces],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
