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
  urls,
  social,
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
    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')}`,
      description: t('description'),
      url: getCanonicalUrl('/register', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
    },
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
      <section className="ledger-rules border-b border-border py-12 sm:py-16">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              {t('freeBadge')}
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">{t('subtitle')}</p>

            {/* Free benefits */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-5 text-sm text-muted-foreground">
              {[t('benefit1'), t('benefit2'), t('benefit3')].map((benefit) => (
                <span key={benefit} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </span>
              ))}
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
