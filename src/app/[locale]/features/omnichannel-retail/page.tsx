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

const painPointIcons: Record<string, React.ReactNode> = {
  inventoryMismatch: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  doubleEntry: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>,
  blindCustomerView: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  scatteredReports: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  operationalDrain: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a9 9 0 01-9 9m0 0a9 9 0 01-9-9" /></svg>,
  pricingChaos: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const solutionIcons: Record<string, React.ReactNode> = {
  singleInventory: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  unifiedCustomer: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  singleDashboard: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>,
  realTimeSync: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>,
};

const channelAccents = [
  'border-l-emerald-500 hover:shadow-emerald-500/10',
  'border-l-sky-500 hover:shadow-sky-500/10',
  'border-l-purple-500 hover:shadow-purple-500/10',
  'border-l-amber-500 hover:shadow-amber-500/10',
];

const featureGridAccents = [
  'border-l-teal-500 hover:shadow-teal-500/10',
  'border-l-cyan-500 hover:shadow-cyan-500/10',
  'border-l-emerald-400 hover:shadow-emerald-400/10',
  'border-l-sky-400 hover:shadow-sky-400/10',
];

export default async function OmnichannelRetailPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'omnichannelRetail' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.omnichannelRetail' });

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

  const faqSchema = schemaTemplates.faqPage(
    faqKeys.map((key) => ({
      question: t(`faq.${key}.question`),
      answer: t(`faq.${key}.answer`),
    }))
  );

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

      {/* ===== HERO ===== */}
      <section aria-label="Hero" className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-sky-500/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-emerald-500/[0.03] blur-[80px]" />
          <div className="absolute top-[30%] left-[40%] w-[30%] h-[40%] rounded-full bg-purple-400/[0.03] blur-[90px]" />
        </div>
        <div className="container-wide">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
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

      {/* ===== THE PROBLEM ===== */}
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

      {/* ===== THE SOLUTION ===== */}
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

      {/* ===== SALES CHANNELS ===== */}
      <section aria-label="Sales Channels" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('channels.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('channels.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('channels.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {channelKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', channelAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`channels.items.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t(`channels.items.${key}.description`)}</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-muted/60 text-[11px] sm:text-xs text-muted-foreground font-medium">{t(`channels.items.${key}.highlight`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UNIFIED INVENTORY ===== */}
      <section aria-label="Unified Inventory" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('inventory.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('inventory.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('inventory.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {inventoryFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', featureGridAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`inventory.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`inventory.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UNIFIED ORDERS ===== */}
      <section aria-label="Unified Orders" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('orders.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('orders.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('orders.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {orderFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', featureGridAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`orders.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`orders.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CROSS-CHANNEL ANALYTICS ===== */}
      <section aria-label="Cross-Channel Analytics" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">{t('analytics.badge')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('analytics.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('analytics.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {analyticsFeatureKeys.map((key, i) => (
              <div key={key} className={cn('group rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300', featureGridAccents[i])}>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">{t(`analytics.features.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`analytics.features.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section aria-label="Comparison" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">{t('comparison.title')}</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t('comparison.subtitle')}</p>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground w-[40%]">{t('comparison.headers.feature')}</th>
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-primary w-[30%]">{t('comparison.headers.cashvio')}</th>
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
      <section aria-label="FAQ" className="section-padding">
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-emerald-600 to-teal-700 p-8 sm:p-10 md:p-14 lg:p-20 text-center">
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
