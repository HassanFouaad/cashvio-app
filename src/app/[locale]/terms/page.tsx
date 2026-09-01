import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { LegalArticle } from '@/components/sections/LegalArticle';
import { type Locale } from '@/i18n/routing';
import type { LegalSection } from '@/types';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  keywords,
  openGraphDefaults,
  xCardDefaults,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.terms' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('title')}`,
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/terms', typedLocale),
      languages: getAlternateUrls('/terms'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')}`,
      description: t('description'),
      url: getCanonicalUrl('/terms', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
    },
    twitter: {
      ...xCardDefaults,
      title: `${t('title')}`,
      description: t('description'),
    },
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

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'terms' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.terms' });

  // Schema.org structured data
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/terms' : `/ar/terms`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const articleSchema = schemaTemplates.article({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/terms' : `/ar/terms`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: metaT('title'), url: getCanonicalUrl('/terms', typedLocale) },
  ], typedLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />
      <LegalArticle
        title={t('title')}
        lastUpdated={t('lastUpdated')}
        intro={t('intro')}
        tocTitle={t('tableOfContents')}
        sections={t.raw('sections') as Record<string, LegalSection>}
      />
    </>
  );
}

