import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { RegistrationForm } from '@/components/forms/registration-form';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';
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
  urls,
} from '@/config/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.register' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('title')}`,
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/register', typedLocale),
      languages: getAlternateUrls('/register'),
    },
 /*    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')}`,
      description: t('description'),
      url: getCanonicalUrl('/register', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    }, */
    twitter: {
      ...twitterDefaults,
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

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'register' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.register' });

  // Schema.org structured data
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/register' : `/ar/register`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const softwareSchema = schemaTemplates.softwareApplication();

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: metaT('title'), url: getCanonicalUrl('/register', typedLocale) },
  ], typedLocale);

  // Get portal login URL
  const portalLoginUrl = `${urls.portal}/login`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      {/* Header */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-hero">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            {/* Free Forever Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-success/15 text-success text-xs sm:text-sm font-medium mb-4 sm:mb-5 border border-success/30">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t('freeBadge')}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('subtitle')}</p>
            
            {/* Free benefits */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-5 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('benefit1')}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('benefit2')}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t('benefit3')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-wide">
          <div className="max-w-xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <RegistrationForm />
              </CardContent>
            </Card>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <p className="text-muted-foreground">
                {t('alreadyHaveAccount')}{' '}
                <a
                  href={portalLoginUrl}
                  className="text-primary hover:underline font-medium"
                >
                  {t('signIn')}
                </a>
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {t('backToHome')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
