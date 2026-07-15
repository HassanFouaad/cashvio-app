import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  getSpeakableSchema,
  keywords,
  openGraphDefaults,
  twitterDefaults,
  brand,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.couponsAndDiscounts' });
  const typedLocale = locale as Locale;
  const pagePath = '/features/coupons-and-discounts';

  return {
    title: t('title'),
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl(pagePath, typedLocale),
      languages: getAlternateUrls(pagePath),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl(pagePath, typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
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

const featureKeys = [
  'discountTypes',
  'usageLimits',
  'scheduling',
  'storeSpecific',
  'realTimeValidation',
  'minimumCart',
  'statusControl',
  'codeManagement',
] as const;

const featureIcons: Record<string, ReactNode> = {
  discountTypes: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  usageLimits: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  scheduling: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  storeSpecific: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  realTimeValidation: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  minimumCart: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.21-1.879L21 5.227M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ),
  statusControl: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
    </svg>
  ),
  codeManagement: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  ),
};

const featureAccents = [
  'border-l-emerald-500 hover:shadow-emerald-500/10',
  'border-l-teal-500 hover:shadow-teal-500/10',
  'border-l-cyan-500 hover:shadow-cyan-500/10',
  'border-l-sky-500 hover:shadow-sky-500/10',
  'border-l-emerald-400 hover:shadow-emerald-400/10',
  'border-l-teal-400 hover:shadow-teal-400/10',
  'border-l-cyan-400 hover:shadow-cyan-400/10',
  'border-l-sky-400 hover:shadow-sky-400/10',
];

const problemIcons: Record<string, ReactNode> = {
  noTracking: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
  abuse: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  noScheduling: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  fragmented: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.856-2.07a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.798" />
    </svg>
  ),
};

const strategyKeys = ['newCustomer', 'flashSale', 'aovBoost', 'seasonal', 'loyalty', 'clearance'] as const;

const channelIcons: Record<string, ReactNode> = {
  pos: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  storefront: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  portal: (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  ),
};

export default async function CouponsAndDiscountsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'couponsAndDiscounts' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.couponsAndDiscounts' });

  const pagePath = '/features/coupons-and-discounts';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? pagePath : `/ar${pagePath}`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: metaT('title'), url: getCanonicalUrl(pagePath, typedLocale) },
  ], typedLocale);

  const faqItems = Array.from({ length: 10 }, (_, i) => ({
    question: t(`faq.items.q${i + 1}.question`),
    answer: t(`faq.items.q${i + 1}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const speakableSchema = getSpeakableSchema({
    locale: typedLocale,
    path: typedLocale === 'en' ? pagePath : `/ar${pagePath}`,
    headline: metaT('title'),
    summary: metaT('description'),
  });

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howItWorks.title'),
    description: t('howItWorks.subtitle'),
    totalTime: 'PT1M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    step: [1, 2, 3].map((n) => ({
      '@type': 'HowToStep',
      position: n,
      name: t(`howItWorks.step${n}.title`),
      text: t(`howItWorks.step${n}.description`),
    })),
  };

  const commonT = await getTranslations({ locale, namespace: 'common' });

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const docsLink = typedLocale === 'en' ? '/docs/marketing/coupons' : '/ar/docs/marketing/coupons';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(howToSchema) }} />

      {/* Hero */}
      <section className="relative overflow-hidden section-padding-sm">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[45%] h-[60%] rounded-full bg-primary/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[45%] rounded-full bg-purple-500/[0.03] blur-[80px]" />
        </div>
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 sm:mb-5 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('hero.badge')}
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-tight">
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <ButtonLink
                href={registerLink}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-dark shadow-glow-lg rounded-xl font-semibold"
              >
                {t('cta.getStarted')}
              </ButtonLink>
              <ButtonLink
                href={docsLink}
                variant="outline"
                size="lg"
                className="rounded-xl font-semibold"
              >
                {commonT('readDocs')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding-sm bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('problem.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('problem.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {(['noTracking', 'abuse', 'noScheduling', 'fragmented'] as const).map((key) => (
              <div key={key} className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-card border border-border/60">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
                  {problemIcons[key]}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                    {t(`problem.items.${key}.title`)}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {t(`problem.items.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="section-padding-sm">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('features.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featureKeys.map((key, i) => (
              <div
                key={key}
                className={cn(
                  'group relative rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6',
                  'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
                  featureAccents[i]
                )}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {featureIcons[key]}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                  {t(`features.items.${key}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {t(`features.items.${key}.description`)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t(`features.items.${key}.subs`).split(' • ').map((sub: string) => (
                    <span key={sub} className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted/60 text-[11px] text-muted-foreground font-medium">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding-sm bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('howItWorks.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="relative text-center p-6 sm:p-8 rounded-2xl bg-card border border-border/60">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {t(`howItWorks.step${n}.number`)}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {t(`howItWorks.step${n}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`howItWorks.step${n}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Omnichannel */}
      <section className="section-padding-sm">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('omnichannel.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('omnichannel.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {(['pos', 'storefront', 'portal'] as const).map((key) => (
              <div key={key} className="group p-6 sm:p-8 rounded-2xl bg-card border border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300">
                  {channelIcons[key]}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                  {t(`omnichannel.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`omnichannel.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies */}
      <section className="section-padding-sm bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('strategies.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('strategies.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto">
            {strategyKeys.map((key) => (
              <div key={key} className="group rounded-2xl bg-card border border-border/60 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground">
                      {t(`strategies.items.${key}.title`)}
                    </h3>
                    <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono">
                      {t(`strategies.items.${key}.code`)}
                    </code>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                    {t(`strategies.items.${key}.description`)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {t(`strategies.items.${key}.config`).split(' • ').map((tag: string) => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/5 text-[11px] text-primary font-medium border border-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding-sm">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t('faq.title')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('faq.subtitle')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {Array.from({ length: 10 }, (_, i) => (
              <details key={i} className="group rounded-2xl bg-card border border-border/60 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 sm:p-6 text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors list-none [&::-webkit-details-marker]:hidden">
                  {t(`faq.items.q${i + 1}.question`)}
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ms-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {t(`faq.items.q${i + 1}.answer`)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-10 md:p-14 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/80 mb-2">
                {t('cta.description')}
              </p>
              <p className="text-xs sm:text-sm text-white/60 mb-6 sm:mb-8">
                {t('cta.freeNote')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <ButtonLink
                  href={registerLink}
                  size="lg"
                  className="bg-white text-emerald-700 hover:bg-white/90 shadow-glow-lg rounded-xl font-semibold"
                >
                  {t('cta.getStarted')}
                </ButtonLink>
                <ButtonLink
                  href={pricingLink}
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl font-semibold"
                >
                  {t('cta.viewPricing')}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
