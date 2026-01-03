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
  const t = await getTranslations({ locale, namespace: 'register' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('meta.title')} | ${brand.name}`,
    description: t('meta.description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/register', typedLocale),
      languages: getAlternateUrls('/register'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t('meta.title')} | ${brand.name}`,
      description: t('meta.description'),
      url: getCanonicalUrl('/register', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
    },
    twitter: {
      ...twitterDefaults,
      title: `${t('meta.title')} | ${brand.name}`,
      description: t('meta.description'),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'register' });

  // Schema.org structured data
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/register' : `/ar/register`,
    title: t('meta.title'),
    description: t('meta.description'),
  });

  const softwareSchema = schemaTemplates.softwareApplication();

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', url: getCanonicalUrl('', typedLocale) },
    { name: t('meta.title'), url: getCanonicalUrl('/register', typedLocale) },
  ]);

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
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 md:py-24">
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
