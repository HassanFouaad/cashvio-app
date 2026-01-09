import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Benefits } from '@/components/sections/benefits';
import { Trust } from '@/components/sections/trust';
import { CTA } from '@/components/sections/cta';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  urls,
  brand,
  keywords,
  openGraphDefaults,
  twitterDefaults,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  const typedLocale = locale as Locale;

  return {
    title: t('title'),
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('', typedLocale),
      languages: getAlternateUrls(''),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    twitter: {
      ...twitterDefaults,
      title: t('title'),
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

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'metadata.home' });

  // Schema.org structured data
  const organizationSchema = schemaTemplates.organization();
  const websiteSchema = schemaTemplates.website(typedLocale);
  const softwareSchema = schemaTemplates.softwareApplication();
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '' : `/${typedLocale}`,
    title: t('title'),
    description: t('description'),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />

      <Hero locale={typedLocale} />
      <Features locale={typedLocale} />
      
      <Benefits locale={typedLocale} />
     
      
      <CTA locale={typedLocale} />
    </>
  );
}

