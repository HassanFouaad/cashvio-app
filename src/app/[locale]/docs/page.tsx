import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  keywords,
  openGraphDefaults,
  twitterDefaults,
  brand,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.docs' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('title')} | ${brand.name}`,
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/docs', typedLocale),
      languages: getAlternateUrls('/docs'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')} | ${brand.name}`,
      description: t('description'),
      url: getCanonicalUrl('/docs', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    twitter: {
      ...twitterDefaults,
      title: `${t('title')} | ${brand.name}`,
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

const docCategories = [
  {
    key: 'getting-started',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      </svg>
    ),
    titleEn: 'Getting Started',
    titleAr: 'البدء',
    descEn: 'Learn the basics and get up and running quickly',
    descAr: 'تعلم الأساسيات وابدأ بسرعة',
  },
  {
    key: 'guides',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      </svg>
    ),
    titleEn: 'Guides',
    titleAr: 'الأدلة',
    descEn: 'Step-by-step tutorials for common tasks',
    descAr: 'دروس تعليمية خطوة بخطوة للمهام الشائعة',
  },
  {
    key: 'api-reference',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
    titleEn: 'API Reference',
    titleAr: 'مرجع API',
    descEn: 'Detailed API documentation for developers',
    descAr: 'توثيق API مفصل للمطورين',
  },
  {
    key: 'integrations',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m2 12 5 3 5-6 5 6 5-3" />
      </svg>
    ),
    titleEn: 'Integrations',
    titleAr: 'التكاملات',
    descEn: 'Connect Cashvio with your favorite tools',
    descAr: 'اربط كاشفيو بأدواتك المفضلة',
  },
];

export default async function DocsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'metadata.docs' });
  const isArabic = locale === 'ar';

  // Schema.org structured data
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/docs' : `/ar/docs`,
    title: t('title'),
    description: t('description'),
  });

  const collectionSchema = schemaTemplates.collectionPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/docs' : `/ar/docs`,
    title: t('title'),
    description: t('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: t('title'), url: getCanonicalUrl('/docs', typedLocale) },
  ], typedLocale);


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />
      <div className="py-16 md:py-24">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {docCategories.map((category) => (
              <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl">
                    {isArabic ? category.titleAr : category.titleEn}
                  </CardTitle>
                  <CardDescription>
                    {isArabic ? category.descAr : category.descEn}
                  </CardDescription>
                </CardHeader>
              </Card>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {isArabic ? 'التوثيق الكامل قادم قريباً' : 'Full documentation coming soon'}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

