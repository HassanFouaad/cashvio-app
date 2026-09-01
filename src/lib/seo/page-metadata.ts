/**
 * Shared metadata builder for marketing pages.
 *
 * Reproduces the exact per-page metadata pattern used across the site
 * (canonical + hreflang alternates, OG with locale alternates, X card via Metadata `twitter`,
 * robots directives, Facebook app id) so new pages stay consistent without
 * repeating ~40 lines each.
 */

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  openGraphDefaults,
  xCardDefaults,
  social,
} from '@/config/seo';

interface PageMetadataParams {
  locale: string;
  /** Path without locale prefix, e.g. "/tools/barcode-generator" */
  path: string;
  /** Namespace under `metadata.` holding title/description */
  namespace: string;
  /** Page-specific keywords per locale */
  keywords?: Record<Locale, string[]>;
}

export async function buildPageMetadata({
  locale,
  path,
  namespace,
  keywords,
}: PageMetadataParams): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${namespace}` });
  const typedLocale = locale as Locale;

  return {
    title: t('title'),
    description: t('description'),
    ...(keywords ? { keywords: keywords[typedLocale] } : {}),
    alternates: {
      canonical: getCanonicalUrl(path, typedLocale),
      languages: getAlternateUrls(path),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl(path, typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: { appId: social.facebook.appId },
    twitter: { ...xCardDefaults, title: t('title'), description: t('description') },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}
