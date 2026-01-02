import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { type Locale } from '@/i18n/routing';
import { ctaLinks } from '@/config/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.pricing' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/pricing`,
    },
  };
}

const planKeys = ['starter', 'professional', 'enterprise'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4'] as const;

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'pricing' });

  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'PriceSpecification',
    priceCurrency: 'USD',
    eligibleRegion: {
      '@type': 'Country',
      name: 'Worldwide',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqKeys.map((key) => ({
      '@type': 'Question',
      name: t(`faq.${key}.question`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`faq.${key}.answer`),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Header Section */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 -mt-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {planKeys.map((plan) => {
              const isPro = plan === 'professional';
              const features = t.raw(`${plan}.features`) as string[];

              return (
                <Card
                  key={plan}
                  className={cn(
                    'relative flex flex-col',
                    isPro && 'border-primary shadow-lg scale-105 z-10'
                  )}
                >
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        {t('popular')}
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-xl">{t(`${plan}.name`)}</CardTitle>
                    <CardDescription>{t(`${plan}.description`)}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="mb-6">
                      {plan === 'enterprise' ? (
                        <span className="text-4xl font-bold text-foreground">
                          {t(`${plan}.price`)}
                        </span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-foreground">
                            ${t(`${plan}.price`)}
                          </span>
                          <span className="text-muted-foreground">
                            {t('perMonth')}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-foreground">
                        {t('features')}
                      </p>
                      <ul className="space-y-2">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <svg
                              className="w-5 h-5 text-primary shrink-0 mt-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <ButtonLink
                      variant={isPro ? 'primary' : 'outline'}
                      className="w-full justify-center"
                      href={plan === 'enterprise' ? `/${locale}/contact` : ctaLinks.getStarted}
                    >
                      {plan === 'enterprise' ? t('contactSales') : t('getStarted')}
                    </ButtonLink>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-12 bg-muted/30">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                {t('guarantee.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('guarantee.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              {t('faq.title')}
            </h2>

            <div className="space-y-4">
              {faqKeys.map((key) => (
                <details
                  key={key}
                  className="group rounded-lg border border-border bg-card p-4"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                    {t(`faq.${key}.question`)}
                    <svg
                      className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    {t(`faq.${key}.answer`)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
