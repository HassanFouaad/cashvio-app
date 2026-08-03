import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  FaqSection,
  AlsoFreeStrip,
  FeatureScreenshot,
} from '@/components/marketing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  getSpeakableSchema,
  openGraphDefaults,
  twitterDefaults,
  brand,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

const PAGE_PATH = '/features/sales-analytics';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.salesAnalytics' });
  const typedLocale = locale as Locale;

  const pageKeywords: Record<Locale, string[]> = {
    en: [
      'sales analytics dashboard',
      'retail sales reports',
      'sales reporting software',
      'profit margin reports',
      'business insights software',
      'POS sales reports',
      'best sellers report',
      'peak hours analysis',
      'staff performance reports',
      'customer analytics retail',
      'free sales reports',
      'sales by channel report',
      'Cashvio analytics',
      'Cashvio',
    ],
    ar: [
      'تقارير المبيعات',
      'تحليلات المبيعات',
      'لوحة تحليلات المبيعات',
      'تقارير الأرباح',
      'تقارير الكاشير',
      'الأكثر مبيعاً',
      'ساعات الذروة',
      'تقارير أداء الموظفين',
      'تحليلات العملاء',
      'تقارير مبيعات مجانية',
      'رؤى الأعمال',
      'كاشفيو',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: pageKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl(PAGE_PATH, typedLocale),
      languages: getAlternateUrls(PAGE_PATH),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl(PAGE_PATH, typedLocale),
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

const problemKeys = ['gutFeeling', 'unknownProfit', 'hiddenPatterns', 'staffBlind'] as const;
const tabKeys = ['overview', 'profit', 'customers', 'returns', 'staff', 'insights'] as const;
const featureKeys = ['trends', 'byHour', 'byStore', 'byChannel', 'byPayment', 'topProducts', 'storeVisits', 'csvExport'] as const;
const insightKeys = ['health', 'attention', 'opportunities', 'actions'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function SalesAnalyticsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'salesAnalytics' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.salesAnalytics' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const docsLink = typedLocale === 'en' ? '/docs/reports/analytics-reports' : '/ar/docs/reports/analytics-reports';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? PAGE_PATH : `/ar${PAGE_PATH}`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Sales Analytics', nameAr: 'تقارير المبيعات', url: getCanonicalUrl(PAGE_PATH, typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const speakableSchema = getSpeakableSchema({
    locale: typedLocale,
    path: typedLocale === 'en' ? PAGE_PATH : `/ar${PAGE_PATH}`,
    headline: metaT('title'),
    summary: metaT('description'),
  });

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Sales Analytics`,
    alternateName: ['كاشفيو تقارير المبيعات', 'Cashvio Reports & Insights'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Business Analytics',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Reporting built into every Cashvio plan' },
    featureList: [
      'Revenue, profit, orders, and average order value with period comparison',
      'Sales trends with peak and lowest points',
      'Sales by hour, store, channel, and payment method',
      'Top products by quantity and revenue',
      'Customer acquisition, repeat rate, and lifetime value',
      'Staff performance reports',
      'Returns analytics with reasons breakdown',
      'Plain-language business insights with recommended actions',
      'CSV export',
    ],
    inLanguage: ['ar', 'en'],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(softwareAppSchema) }} />

      <LedgerHero
        eyebrow={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        primaryAction={{ label: t('cta.getStarted'), href: registerLink }}
        secondaryAction={{ label: commonT('readDocs'), href: docsLink }}
        trackLocation={PAGE_PATH}
      />

      <FeatureScreenshot
        base="/assets/reports-profit"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
      />


      {/* Problem */}
      <section aria-label={t('problem.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01`}
            title={t('problem.title')}
            subtitle={t('problem.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {problemKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`problem.items.${key}.title`)}
                description={t(`problem.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Report Tabs */}
      <section aria-label={t('tabs.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02`}
            title={t('tabs.title')}
            subtitle={t('tabs.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tabKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`tabs.items.${key}.title`)}
                description={t(`tabs.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section aria-label={t('features.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03`}
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`features.items.${key}.name`)}
                description={t(`features.items.${key}.description`)}
                tags={t(`features.items.${key}.subs`).split(' • ')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Insights */}
      <section aria-label={t('insights.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04`}
            title={t('insights.title')}
            subtitle={t('insights.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {insightKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`insights.items.${key}.title`)}
                description={t(`insights.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section aria-label={t('howItWorks.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 05`}
            title={t('howItWorks.title')}
            subtitle={t('howItWorks.subtitle')}
          />
          <ol className="relative max-w-2xl border-s border-dashed border-ledger-line ms-1.5">
            {([1, 2, 3] as const).map((n) => (
              <li key={n} className="relative ps-8 sm:ps-10 pb-10 last:pb-0">
                <span
                  className="absolute -start-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <p className="mono-label text-primary mb-2">{String(n).padStart(2, '0')}</p>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                  {t(`howItWorks.step${n}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                  {t(`howItWorks.step${n}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FaqSection title={t('faq.title')} subtitle={t('faq.subtitle')} items={faqItems} />

      <AlsoFreeStrip locale={locale} />

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.description')}
        primaryAction={{ label: t('cta.getStarted'), href: registerLink }}
        secondaryAction={{ label: t('cta.viewPricing'), href: pricingLink }}
        note={t('cta.freeNote')}
        trackLocation={PAGE_PATH}
      />
    </>
  );
}
