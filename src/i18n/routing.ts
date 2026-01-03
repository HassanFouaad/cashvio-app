import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // English uses / (no prefix), Arabic uses /ar
  localePrefix: 'as-needed',
});

export const localeMetadata: Record<
  Locale,
  {
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    hrefLang: string;
    locale: string; // Full locale for og:locale
  }
> = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    hrefLang: 'en',
    locale: 'en_US',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    hrefLang: 'ar',
    locale: 'ar_EG',
  },
};
