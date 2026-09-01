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
  FeatureScreenshot,
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
  const t = await getTranslations({ locale, namespace: 'metadata.inventoryManagement' });
  const typedLocale = locale as Locale;

  const invKeywords: Record<Locale, string[]> = {
    en: [
      'free inventory management software',
      'inventory tracking software',
      'stock management system',
      'free stock tracking',
      'inventory management app',
      'multi-store inventory',
      'low stock alerts',
      'purchase order software',
      'supplier management',
      'stock audit trail',
      'per-variant inventory tracking',
      'product variant stock',
      'inventory management for retail',
      'free POS inventory',
      'Cashvio inventory',
      'Cashvio',
    ],
    ar: [
      'برنامج إدارة مخزون مجاني',
      'تتبع المخزون',
      'نظام إدارة المخزون',
      'إدارة المنتجات والمخزون',
      'تنبيهات نقص المخزون',
      'أوامر الشراء',
      'إدارة الموردين',
      'جرد المخزون',
      'تحويل مخزون بين المتاجر',
      'كاشفيو',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: invKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features/inventory-management', typedLocale),
      languages: getAlternateUrls('/features/inventory-management'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/features/inventory-management', typedLocale),
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

const painPointKeys = ['manualCounting', 'noVariantTracking', 'multiStoreBlind', 'noAlerts', 'noAuditTrail', 'disconnectedPurchasing'] as const;
const solutionKeys = ['perVariantTracking', 'automaticUpdates', 'smartAlerts', 'fullAuditTrail'] as const;
const coreFeatureKeys = ['stockTracking', 'adjustments', 'transfers', 'lowStockAlerts', 'bulkOperations', 'optionalTracking'] as const;
const poFeatureKeys = ['createPO', 'trackStatus', 'receiveStock', 'supplierManagement'] as const;
const multiStoreFeatureKeys = ['independentStock', 'storeTransfers', 'storePricing', 'centralVisibility'] as const;
const autoStockKeys = ['orderCompleted', 'orderCancelled', 'returnApproved', 'purchaseReceived', 'manualAdjustment', 'stockTransfer', 'damagedConsumed'] as const;
const reportingFeatureKeys = ['profitMargins', 'salesTrends', 'supplierCosts', 'returnsAnalytics'] as const;
const comparisonRowKeys = ['variantTracking', 'multiStore', 'autoUpdates', 'alerts', 'auditTrail', 'purchaseOrders', 'reporting', 'cost'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function InventoryManagementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'inventoryManagement' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.inventoryManagement' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';
  const assistantLink = typedLocale === 'en' ? '/features/ai-assistant' : '/ar/features/ai-assistant';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features/inventory-management' : '/ar/features/inventory-management',
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Inventory Management', nameAr: 'إدارة المخزون', url: getCanonicalUrl('/features/inventory-management', typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Inventory Management`,
    alternateName: ['كاشفيو إدارة المخزون', 'Cashvio Free Inventory Software'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Inventory Management',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free forever plan with full inventory tracking' },
    featureList: [
      'Per-variant, per-store inventory tracking',
      'Low stock alerts with custom reorder points',
      'Stock adjustments with audit trail',
      'Store-to-store stock transfers',
      'Purchase order management',
      'Supplier database',
      'Automatic stock updates on sales and returns',
      'Multi-store inventory visibility',
      'Bulk stock operations',
      'Product profitability reporting',
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
        trackLocation="/features/inventory-management"
      />

      <FeatureScreenshot
        base="/assets/inventory"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
        companion={{
          base: '/assets/mobile-inventory',
          variant: 'mobile',
          alt: t('screenshot.companionAlt'),
          caption: t('screenshot.companionCaption'),
        }}
      />


      {/* The Problem */}
      <section aria-label={t('problem.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01 · ${t('problem.badge')}`}
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
            eyebrow={`${tLedger('no')} 02 · ${t('solution.badge')}`}
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

      {/* Core Features */}
      <section aria-label={t('coreFeatures.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03 · ${t('coreFeatures.badge')}`}
            title={t('coreFeatures.title')}
            subtitle={t('coreFeatures.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`coreFeatures.features.${key}.title`)}
                description={t(`coreFeatures.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Automatic Stock Changes */}
      <section aria-label={t('automaticStock.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04 · ${t('automaticStock.badge')}`}
            title={t('automaticStock.title')}
            subtitle={t('automaticStock.subtitle')}
          />
          <div className="max-w-3xl overflow-x-auto receipt-edge bg-card px-2 sm:px-4 py-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-dashed border-ledger-line">
                  <th className="text-start p-4 mono-label text-muted-foreground w-[40%]">
                    {typedLocale === 'ar' ? 'العملية' : 'Action'}
                  </th>
                  <th className="text-start p-4 mono-label text-muted-foreground">
                    {typedLocale === 'ar' ? 'ماذا يحدث للمخزون' : 'Effect on Stock'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {autoStockKeys.map((key, index) => (
                  <tr key={key} className={index < autoStockKeys.length - 1 ? 'border-b border-dashed border-ledger-line' : undefined}>
                    <td className="p-4 font-medium text-foreground">{t(`automaticStock.actions.${key}.action`)}</td>
                    <td className="p-4 text-muted-foreground">{t(`automaticStock.actions.${key}.effect`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Purchase Orders & Suppliers */}
      <section aria-label={t('purchaseOrders.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 05 · ${t('purchaseOrders.badge')}`}
            title={t('purchaseOrders.title')}
            subtitle={t('purchaseOrders.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {poFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`purchaseOrders.features.${key}.title`)}
                description={t(`purchaseOrders.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Store */}
      <section aria-label={t('multiStore.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 06 · ${t('multiStore.badge')}`}
            title={t('multiStore.title')}
            subtitle={t('multiStore.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {multiStoreFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`multiStore.features.${key}.title`)}
                description={t(`multiStore.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Reporting */}
      <section aria-label={t('reporting.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 07 · ${t('reporting.badge')}`}
            title={t('reporting.title')}
            subtitle={t('reporting.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {reportingFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`reporting.features.${key}.title`)}
                description={t(`reporting.features.${key}.description`)}
              />
            ))}
          </div>
          <p className="mt-8">
            <a
              href={assistantLink}
              className="inline-flex items-center gap-2 font-receipt text-sm text-primary hover:underline"
            >
              {t('reporting.assistantLink')}
              <span aria-hidden="true" className="rtl:-scale-x-100">-&gt;</span>
            </a>
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section aria-label={t('comparison.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 08`}
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
        trackLocation="/features/inventory-management"
      />
    </>
  );
}
