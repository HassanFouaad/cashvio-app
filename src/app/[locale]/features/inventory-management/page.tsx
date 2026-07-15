import type { Metadata } from 'next';
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

const painPointIcons: Record<string, React.ReactNode> = {
  manualCounting: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" /></svg>,
  noVariantTracking: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  multiStoreBlind: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" /></svg>,
  noAlerts: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  noAuditTrail: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>,
  disconnectedPurchasing: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>,
};

const solutionIcons: Record<string, React.ReactNode> = {
  perVariantTracking: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  automaticUpdates: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>,
  smartAlerts: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  fullAuditTrail: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
};

const coreAccents = [
  'border-l-emerald-500 hover:shadow-emerald-500/10',
  'border-l-teal-500 hover:shadow-teal-500/10',
  'border-l-cyan-500 hover:shadow-cyan-500/10',
  'border-l-sky-500 hover:shadow-sky-500/10',
  'border-l-violet-500 hover:shadow-violet-500/10',
  'border-l-amber-500 hover:shadow-amber-500/10',
];

const gridAccents = [
  'border-l-teal-500 hover:shadow-teal-500/10',
  'border-l-cyan-500 hover:shadow-cyan-500/10',
  'border-l-emerald-400 hover:shadow-emerald-400/10',
  'border-l-sky-400 hover:shadow-sky-400/10',
];

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

  const faqSchema = schemaTemplates.faqPage(
    faqKeys.map((key) => ({
      question: t(`faq.${key}.question`),
      answer: t(`faq.${key}.answer`),
    }))
  );

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

      {/* ===== HERO ===== */}
      <section aria-label="Hero" className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-emerald-500/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-teal-500/[0.03] blur-[80px]" />
        </div>
        <div className="container-wide">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('hero.badge')}
            </Badge>
            <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight text-foreground mb-5 sm:mb-6 leading-[1.15]">
              <span className="font-normal">{t('hero.title')}</span>{' '}
              <span className="font-bold text-primary">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="animate-fade-up animate-delay-100 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="animate-fade-up animate-delay-200 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <ButtonLink size="xl" href={registerLink} className="group w-full sm:w-auto text-sm sm:text-base rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {t('hero.cta')}
              </ButtonLink>
              <ButtonLink variant="outline" size="xl" href={featuresLink} className="w-full sm:w-auto text-sm sm:text-base rounded-2xl">
                {t('hero.secondaryCta')}
              </ButtonLink>
            </div>
            <p className="animate-fade-up animate-delay-300 mt-6 text-xs sm:text-sm text-muted-foreground">{t('hero.trust')}</p>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section aria-label="The Problem" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge variant="destructive" className="mb-4 sm:mb-5 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('problem.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('problem.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('problem.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {painPointKeys.map((key) => (
              <div key={key} className="group relative rounded-2xl bg-card border border-destructive/20 p-5 sm:p-6 hover:shadow-lg hover:border-destructive/40 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">{painPointIcons[key]}</div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`problem.painPoints.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`problem.painPoints.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION ===== */}
      <section aria-label="Our Solution" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('solution.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('solution.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('solution.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {solutionKeys.map((key) => (
              <div key={key} className="group flex items-start gap-4 p-6 sm:p-8 rounded-2xl bg-card border border-primary/20 hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">{solutionIcons[key]}</div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{t(`solution.points.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`solution.points.${key}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CORE FEATURES ===== */}
      <section aria-label="Core Features" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('coreFeatures.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('coreFeatures.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('coreFeatures.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
            {coreFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', coreAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`coreFeatures.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`coreFeatures.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AUTOMATIC STOCK CHANGES ===== */}
      <section aria-label="Automatic Stock Changes" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('automaticStock.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('automaticStock.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('automaticStock.subtitle')}</p>
          </div>
          <div className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground w-[35%]">{typedLocale === 'ar' ? 'العملية' : 'Action'}</th>
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground">{typedLocale === 'ar' ? 'التأثير على المخزون' : 'Effect on Stock'}</th>
                </tr>
              </thead>
              <tbody>
                {autoStockKeys.map((key, i) => (
                  <tr key={key} className={cn('border-b border-border/50', i % 2 === 0 && 'bg-card/50')}>
                    <td className="p-3 sm:p-4 text-sm font-medium text-foreground">{t(`automaticStock.actions.${key}.action`)}</td>
                    <td className="p-3 sm:p-4 text-sm text-muted-foreground">{t(`automaticStock.actions.${key}.effect`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== PURCHASE ORDERS & SUPPLIERS ===== */}
      <section aria-label="Purchase Orders" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('purchaseOrders.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('purchaseOrders.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('purchaseOrders.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {poFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', gridAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`purchaseOrders.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`purchaseOrders.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MULTI-STORE ===== */}
      <section aria-label="Multi-Store Inventory" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('multiStore.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('multiStore.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('multiStore.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {multiStoreFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', gridAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`multiStore.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`multiStore.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REPORTING ===== */}
      <section aria-label="Inventory Analytics" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('reporting.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('reporting.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('reporting.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {reportingFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', gridAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`reporting.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`reporting.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section aria-label="Comparison" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('comparison.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('comparison.subtitle')}</p>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground w-[35%]">{t('comparison.headers.feature')}</th>
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-primary w-[35%]">{t('comparison.headers.cashvio')}</th>
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground w-[30%]">{t('comparison.headers.others')}</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRowKeys.map((key, i) => (
                  <tr key={key} className={cn('border-b border-border/50', i % 2 === 0 && 'bg-card/50')}>
                    <td className="p-3 sm:p-4 text-sm font-medium text-foreground">{t(`comparison.rows.${key}.feature`)}</td>
                    <td className="p-3 sm:p-4 text-sm text-foreground">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t(`comparison.rows.${key}.cashvio`)}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-destructive/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {t(`comparison.rows.${key}.others`)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section aria-label="FAQ" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('faq.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('faq.subtitle')}</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqKeys.map((key) => (
              <details key={key} className="group rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-colors duration-200">
                <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">{t(`faq.${key}.question`)}</h3>
                  <svg className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`faq.${key}.answer`)}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section aria-label="Call to action" className="section-padding-sm">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-10 md:p-14 lg:p-20 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{t('cta.title')}</h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <ButtonLink size="xl" className="bg-white text-emerald-700 hover:bg-white/90 shadow-glow-lg rounded-2xl text-sm sm:text-base font-semibold" href={registerLink}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  {t('cta.button')}
                </ButtonLink>
                <ButtonLink variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 rounded-2xl font-semibold" href={pricingLink}>
                  {t('cta.secondaryButton')}
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-white/60">{t('cta.note')}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
