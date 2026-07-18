import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  ComparisonTable,
  FaqSection,
} from '@/components/marketing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
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
  const t = await getTranslations({ locale, namespace: 'metadata.freePos' });
  const typedLocale = locale as Locale;

  const freePosKeywords: Record<Locale, string[]> = {
    en: [
      'free POS',
      'free POS system',
      'free POS software',
      'free cashier',
      'free cashier software',
      'free cashier program',
      'free point of sale',
      'free point of sale system',
      'free retail POS',
      'POS system no monthly fee',
      'free POS with inventory',
      'free POS Egypt',
      'free POS for small business',
      'free offline POS',
      'free Arabic POS',
      'free cash register software',
      'Cashvio free POS',
      'Cashvio',
    ],
    ar: [
      'كاشير مجاني',
      'برنامج كاشير مجاني',
      'نظام كاشير مجاني',
      'نقاط بيع مجانية',
      'نظام نقاط بيع مجاني',
      'برنامج نقاط بيع مجاني',
      'برنامج كاشير للمحلات مجاني',
      'كاشير مجاني للمحلات',
      'برنامج مبيعات مجاني',
      'كاشير بدون اشتراك',
      'برنامج كاشير يعمل بدون انترنت',
      'كاشير مجاني بالعربي',
      'برنامج كاشير مصر',
      'كاشفيو كاشير مجاني',
      'كاشفيو',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: freePosKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features/free-pos', typedLocale),
      languages: getAlternateUrls('/features/free-pos'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/features/free-pos', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: { appId: social.facebook.appId },
    twitter: { ...twitterDefaults, title: t('title'), description: t('description') },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
    },
  };
}

const painPointKeys = ['monthlyFees', 'payPerDevice', 'hiddenLimits', 'hardSetup', 'noArabic', 'internetOnly'] as const;
const solutionKeys = ['reallyFree', 'fastSetup', 'worksOffline', 'arabicEnglish'] as const;
const featureKeys = ['checkout', 'payments', 'register', 'receipts', 'inventory', 'reports'] as const;
const comparisonRowKeys = ['price', 'devices', 'offline', 'arabic', 'inventory', 'storefront', 'setup', 'support'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function FreePosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'freePos' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.freePos' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';
  const storeLink = typedLocale === 'en' ? '/features/free-online-store' : '/ar/features/free-online-store';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features/free-pos' : '/ar/features/free-pos',
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Free POS System', nameAr: 'كاشير مجاني', url: getCanonicalUrl('/features/free-pos', typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Free POS`,
    alternateName: ['كاشير كاشفيو المجاني', 'Cashvio Free Cashier Software'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Point of Sale Software',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EGP',
      description: 'Free forever plan — no trial, no credit card required',
    },
    isAccessibleForFree: true,
    featureList: [
      'Free cashier screen with barcode scanning',
      'Cash register and shift management',
      'Thermal and digital receipts in Arabic and English',
      'Live inventory synced with every sale',
      'Offline mode with automatic sync',
      'Daily sales and profit reports',
    ],
    inLanguage: ['ar', 'en'],
    availableLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(softwareAppSchema) }} />

      <LedgerHero
        eyebrow={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        primaryAction={{ label: t('hero.cta'), href: registerLink }}
        secondaryAction={{ label: t('hero.secondaryCta'), href: featuresLink }}
        note={t('hero.trust')}
      />

      {/* The Problem */}
      <section aria-label={t('problem.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01 — ${t('problem.badge')}`}
            title={t('problem.title')}
            subtitle={t('problem.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {painPointKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`problem.painPoints.${key}.title`)}
                description={t(`problem.painPoints.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section aria-label={t('solution.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02 — ${t('solution.badge')}`}
            title={t('solution.title')}
            subtitle={t('solution.subtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {solutionKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`solution.points.${key}.title`)}
                description={t(`solution.points.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Free */}
      <section aria-label={t('features.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03 — ${t('features.badge')}`}
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`features.items.${key}.title`)}
                description={t(`features.items.${key}.description`)}
              />
            ))}
          </div>
          <p className="mt-8">
            <a
              href={storeLink}
              className="inline-flex items-center gap-2 font-receipt text-sm text-primary hover:underline"
            >
              {t('features.storeLink')}
              <span aria-hidden="true" className="rtl:-scale-x-100">-&gt;</span>
            </a>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section aria-label={t('comparison.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04`}
            title={t('comparison.title')}
            subtitle={t('comparison.subtitle')}
          />
          <ComparisonTable
            headers={{
              feature: t('comparison.headers.feature'),
              cashvio: t('comparison.headers.cashvio'),
              others: t('comparison.headers.others'),
            }}
            rows={comparisonRowKeys.map((key) => ({
              feature: t(`comparison.rows.${key}.feature`),
              cashvio: t(`comparison.rows.${key}.cashvio`),
              others: t(`comparison.rows.${key}.others`),
            }))}
          />
        </div>
      </section>

      <FaqSection title={t('faq.title')} subtitle={t('faq.subtitle')} items={faqItems} />

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        primaryAction={{ label: t('cta.button'), href: registerLink }}
        secondaryAction={{ label: t('cta.secondaryButton'), href: pricingLink }}
        note={t('cta.note')}
      />
    </>
  );
}
