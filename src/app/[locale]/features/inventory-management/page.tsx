import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  PageHero,
  SectionHeader,
  FeatureCard,
  ComparisonTable,
  FaqSection,
  CtaSection,
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

const painPointIcons: Record<string, ReactNode> = {
  manualCounting: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg>,
  noVariantTracking: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  multiStoreBlind: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>,
  noAlerts: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  noAuditTrail: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>,
  disconnectedPurchasing: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
};

const solutionIcons: Record<string, ReactNode> = {
  perVariantTracking: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  automaticUpdates: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>,
  smartAlerts: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  fullAuditTrail: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
};

export default async function InventoryManagementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'inventoryManagement' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.inventoryManagement' });

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';

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

      <PageHero
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
          <SectionHeader
            eyebrow={t('problem.badge')}
            title={t('problem.title')}
            subtitle={t('problem.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {painPointKeys.map((key) => (
              <FeatureCard
                key={key}
                icon={painPointIcons[key]}
                title={t(`problem.painPoints.${key}.title`)}
                description={t(`problem.painPoints.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section aria-label={t('solution.title')} className="section-padding-sm bg-muted/40 border-y border-border">
        <div className="container-wide">
          <SectionHeader
            eyebrow={t('solution.badge')}
            title={t('solution.title')}
            subtitle={t('solution.subtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {solutionKeys.map((key) => (
              <FeatureCard
                key={key}
                layout="row"
                icon={solutionIcons[key]}
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
          <SectionHeader
            eyebrow={t('coreFeatures.badge')}
            title={t('coreFeatures.title')}
            subtitle={t('coreFeatures.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {coreFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
                title={t(`coreFeatures.features.${key}.title`)}
                description={t(`coreFeatures.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Automatic Stock Changes */}
      <section aria-label={t('automaticStock.title')} className="section-padding-sm bg-muted/40 border-y border-border">
        <div className="container-wide">
          <SectionHeader
            eyebrow={t('automaticStock.badge')}
            title={t('automaticStock.title')}
            subtitle={t('automaticStock.subtitle')}
          />
          <div className="max-w-3xl mx-auto overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-start p-4 font-semibold text-foreground w-[40%]">
                    {typedLocale === 'ar' ? 'العملية' : 'Action'}
                  </th>
                  <th className="text-start p-4 font-semibold text-foreground">
                    {typedLocale === 'ar' ? 'ماذا يحدث للمخزون' : 'Effect on Stock'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {autoStockKeys.map((key, index) => (
                  <tr key={key} className={index < autoStockKeys.length - 1 ? 'border-b border-border' : undefined}>
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
          <SectionHeader
            eyebrow={t('purchaseOrders.badge')}
            title={t('purchaseOrders.title')}
            subtitle={t('purchaseOrders.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {poFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
                title={t(`purchaseOrders.features.${key}.title`)}
                description={t(`purchaseOrders.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Multi-Store */}
      <section aria-label={t('multiStore.title')} className="section-padding-sm bg-muted/40 border-y border-border">
        <div className="container-wide">
          <SectionHeader
            eyebrow={t('multiStore.badge')}
            title={t('multiStore.title')}
            subtitle={t('multiStore.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {multiStoreFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
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
          <SectionHeader
            eyebrow={t('reporting.badge')}
            title={t('reporting.title')}
            subtitle={t('reporting.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {reportingFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
                title={t(`reporting.features.${key}.title`)}
                description={t(`reporting.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section aria-label={t('comparison.title')} className="section-padding-sm bg-muted/40 border-y border-border">
        <div className="container-wide">
          <SectionHeader
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

      <CtaSection
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        primaryAction={{ label: t('cta.button'), href: registerLink }}
        secondaryAction={{ label: t('cta.secondaryButton'), href: pricingLink }}
        note={t('cta.note')}
      />
    </>
  );
}
