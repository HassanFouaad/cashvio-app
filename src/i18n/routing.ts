import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const localeMetadata: Record<
  Locale,
  {
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
    hrefLang: string;
  }
> = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    hrefLang: 'en',
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    hrefLang: 'ar',
  },
};

