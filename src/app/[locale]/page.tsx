import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { PlatformPreview } from '@/components/sections/platform-preview';
import { MobileAppShowcase } from '@/components/sections/mobile-app-showcase';
import { MobileAppShowcase2 } from '@/components/sections/mobile-app-showcase-2';
import { CustomerManagementShowcase } from '@/components/sections/customer-management-showcase';
import { Benefits } from '@/components/sections/benefits';
import { Trust } from '@/components/sections/trust';
import { CTA } from '@/components/sections/cta';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  getCompleteGraphSchema,
  getSiteNavigationSchema,
  getSpeakableSchema,
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

  // Schema.org structured data - Using comprehensive graph for SEO 2026
  // This single @graph links all entities: Organization, Brand, Website, Software, Service
  const completeGraphSchema = getCompleteGraphSchema(typedLocale);
  
  // WebPage schema for this specific page
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '' : `/${typedLocale}`,
    title: t('title'),
    description: t('description'),
  });

  // Breadcrumb schema
  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: brand.name, nameAr: 'كاشفيو', url: getCanonicalUrl('', typedLocale) },
  ], typedLocale);

  // HowTo schema for featured snippets
  const howToSchema = schemaTemplates.howTo(typedLocale);

  // Site navigation schema
  const navigationSchema = getSiteNavigationSchema();

  // Speakable schema for voice search optimization
  const speakableSchema = getSpeakableSchema({
    locale: typedLocale,
    path: typedLocale === 'en' ? '' : `/${typedLocale}`,
    headline: t('title'),
    summary: t('description'),
  });

  return (
    <>
      {/* Complete Graph Schema - Links Organization, Brand, Website, Software, Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(completeGraphSchema) }}
      />
      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />
      {/* HowTo Schema - For featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(howToSchema) }}
      />
      {/* Site Navigation Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(navigationSchema) }}
      />
      {/* Speakable Schema - Voice Search Optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(speakableSchema) }}
      />

      <Hero locale={typedLocale} />
      <Features locale={typedLocale} />
      <PlatformPreview locale={typedLocale} />
      <MobileAppShowcase locale={typedLocale} />
      <MobileAppShowcase2 locale={typedLocale} />
      <CustomerManagementShowcase locale={typedLocale} />
      <Benefits locale={typedLocale} />
      <CTA locale={typedLocale} />
    </>
  );
}

