import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  openGraphDefaults,
  twitterDefaults,
  urls,
} from '@/config/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.thankYou' });
  const typedLocale = locale as Locale;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: getCanonicalUrl('/thank-you', typedLocale),
      languages: getAlternateUrls('/thank-you'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/thank-you', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    twitter: {
      ...twitterDefaults,
      title: t('title'),
      description: t('description'),
    },
    // Don't index thank you pages - they're just for conversion tracking
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ThankYouPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const isRtl = typedLocale === 'ar';

  const t = await getTranslations({ locale, namespace: 'thankYou' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.thankYou' });

  // Schema.org structured data
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/thank-you' : `/ar/thank-you`,
    title: metaT('title'),
    description: metaT('description'),
  });

  // Get portal URL
  const portalUrl = urls.portal;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />

      {/* Main Content */}
      <section className="min-h-[70vh] flex items-center justify-center py-16 sm:py-20 md:py-24 bg-gradient-hero">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="p-8 md:p-12 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Success Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/15 mb-8">
                  <svg
                    className="w-14 h-14 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  {t('title')}
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-muted-foreground mb-6">
                  {t('subtitle')}
                </p>

                {/* Email Notice */}
                <div className="bg-muted/50 rounded-xl p-5 mb-8">
                  <div className="flex items-center justify-center gap-3 text-muted-foreground">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{t('emailNotice')}</span>
                  </div>
                </div>

                {/* What's Next Section */}
                {/* <div className="mb-10">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t('whatsNext.title')}
                  </h2>
                  <div className="grid gap-4 text-start">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('whatsNext.step1.title')}</p>
                        <p className="text-sm text-muted-foreground">{t('whatsNext.step1.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('whatsNext.step2.title')}</p>
                        <p className="text-sm text-muted-foreground">{t('whatsNext.step2.description')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-background border">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{t('whatsNext.step3.title')}</p>
                        <p className="text-sm text-muted-foreground">{t('whatsNext.step3.description')}</p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href={portalUrl}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-lg font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
                  >
                    {t('cta.goToDashboard')}
                    <svg
                      className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-lg font-medium text-foreground bg-muted hover:bg-muted/80 transition-all duration-200"
                  >
                    {t('cta.backToHome')}
                  </Link>
                </div>

                {/* Support Link */}
                <p className="mt-8 text-sm text-muted-foreground">
                  {t('support.text')}{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    {t('support.link')}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
