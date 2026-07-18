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
  AlsoFreeStrip,
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
  const t = await getTranslations({ locale, namespace: 'metadata.omnichannelRetail' });
  const typedLocale = locale as Locale;

  const omniKeywords: Record<Locale, string[]> = {
    en: [
      'omnichannel retail platform',
      'unified commerce',
      'one dashboard POS and online store',
      'multi-channel retail',
      'POS and e-commerce in one',
      'unified inventory management',
      'multi-store retail software',
      'sell online and in-store',
      'cross-channel retail',
      'unified order management',
      'omnichannel POS',
      'retail management platform',
      'physical and online store management',
      'Cashvio omnichannel',
      'Cashvio',
    ],
    ar: [
      'منصة بيع متعدد القنوات',
      'تجارة موحدة',
      'لوحة تحكم واحدة للمتجر',
      'إدارة مخزون موحد',
      'بيع أونلاين وفي المتجر',
      'نظام تجزئة متعدد القنوات',
      'نقاط بيع ومتجر إلكتروني',
      'كاشفيو',
      'برنامج إدارة المتاجر',
      'نظام طلبات موحد',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: omniKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features/omnichannel-retail', typedLocale),
      languages: getAlternateUrls('/features/omnichannel-retail'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/features/omnichannel-retail', typedLocale),
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

const painPointKeys = ['inventoryMismatch', 'doubleEntry', 'blindCustomerView', 'scatteredReports', 'operationalDrain', 'pricingChaos'] as const;
const solutionKeys = ['singleInventory', 'unifiedCustomer', 'singleDashboard', 'realTimeSync'] as const;
const channelKeys = ['physicalStore', 'onlineStorefront', 'socialCommerce', 'manualOrders'] as const;
const inventoryFeatureKeys = ['realTimeStock', 'multiStoreTransfers', 'lowStockAlerts', 'bulkOperations'] as const;
const orderFeatureKeys = ['singleQueue', 'flexibleFulfillment', 'splitPayments', 'returnsAndRefunds'] as const;
const analyticsFeatureKeys = ['channelComparison', 'unifiedProfitTracking', 'customerInsights', 'staffPerformance'] as const;
const comparisonRowKeys = ['inventory', 'customers', 'orders', 'analytics', 'pricing', 'returns', 'cost', 'setup'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function OmnichannelRetailPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'omnichannelRetail' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.omnichannelRetail' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features/omnichannel-retail' : '/ar/features/omnichannel-retail',
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Omnichannel Retail', nameAr: 'البيع متعدد القنوات', url: getCanonicalUrl('/features/omnichannel-retail', typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Omnichannel Retail`,
    alternateName: ['كاشفيو البيع متعدد القنوات', 'Cashvio Unified Commerce'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Omnichannel Retail Management',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free forever plan available' },
    featureList: [
      'Unified inventory across POS and online store',
      'Single order queue from all sales channels',
      'Cross-channel customer profiles',
      'Real-time stock synchronization',
      'Built-in online storefront',
      'Multi-store management',
      'Cross-channel returns and refunds',
      'Unified analytics and reporting',
    ],
    inLanguage: ['ar', 'en'],
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

      {/* Sales Channels */}
      <section aria-label={t('channels.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03 — ${t('channels.badge')}`}
            title={t('channels.title')}
            subtitle={t('channels.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {channelKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`channels.items.${key}.title`)}
                description={t(`channels.items.${key}.description`)}
                tags={[t(`channels.items.${key}.highlight`)]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Unified Inventory */}
      <section aria-label={t('inventory.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04 — ${t('inventory.badge')}`}
            title={t('inventory.title')}
            subtitle={t('inventory.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {inventoryFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`inventory.features.${key}.title`)}
                description={t(`inventory.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Unified Orders */}
      <section aria-label={t('orders.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 05 — ${t('orders.badge')}`}
            title={t('orders.title')}
            subtitle={t('orders.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {orderFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`orders.features.${key}.title`)}
                description={t(`orders.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Channel Analytics */}
      <section aria-label={t('analytics.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 06 — ${t('analytics.badge')}`}
            title={t('analytics.title')}
            subtitle={t('analytics.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {analyticsFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`analytics.features.${key}.title`)}
                description={t(`analytics.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section aria-label={t('comparison.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 07`}
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

      <AlsoFreeStrip locale={locale} />

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
