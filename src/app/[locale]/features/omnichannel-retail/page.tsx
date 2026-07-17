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

const painPointIcons: Record<string, ReactNode> = {
  inventoryMismatch: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  doubleEntry: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.5a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>,
  blindCustomerView: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  scatteredReports: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  operationalDrain: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a9 9 0 01-9 9m0 0a9 9 0 01-9-9" /></svg>,
  pricingChaos: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const solutionIcons: Record<string, ReactNode> = {
  singleInventory: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  unifiedCustomer: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  singleDashboard: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" /></svg>,
  realTimeSync: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>,
};

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

      {/* Sales Channels */}
      <section aria-label={t('channels.title')} className="section-padding-sm">
        <div className="container-wide">
          <SectionHeader
            eyebrow={t('channels.badge')}
            title={t('channels.title')}
            subtitle={t('channels.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {channelKeys.map((key) => (
              <FeatureCard
                key={key}
                title={t(`channels.items.${key}.title`)}
                description={t(`channels.items.${key}.description`)}
                tags={[t(`channels.items.${key}.highlight`)]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Unified Inventory */}
      <section aria-label={t('inventory.title')} className="section-padding-sm bg-muted/40 border-y border-border">
        <div className="container-wide">
          <SectionHeader
            eyebrow={t('inventory.badge')}
            title={t('inventory.title')}
            subtitle={t('inventory.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {inventoryFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
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
          <SectionHeader
            eyebrow={t('orders.badge')}
            title={t('orders.title')}
            subtitle={t('orders.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {orderFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
                title={t(`orders.features.${key}.title`)}
                description={t(`orders.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Channel Analytics */}
      <section aria-label={t('analytics.title')} className="section-padding-sm bg-muted/40 border-y border-border">
        <div className="container-wide">
          <SectionHeader
            eyebrow={t('analytics.badge')}
            title={t('analytics.title')}
            subtitle={t('analytics.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {analyticsFeatureKeys.map((key) => (
              <FeatureCard
                key={key}
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
