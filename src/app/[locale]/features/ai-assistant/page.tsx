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
  getSpeakableSchema,
  openGraphDefaults,
  twitterDefaults,
  brand,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

const PAGE_PATH = '/features/ai-assistant';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.aiAssistant' });
  const typedLocale = locale as Locale;

  const pageKeywords: Record<Locale, string[]> = {
    en: [
      'AI assistant for retail',
      'POS chat assistant',
      'retail inventory questions',
      'shop management AI',
      'Cashvio assistant',
      'Arabic POS assistant',
      'store analytics chat',
      'retail AI assistant',
      'conversational POS',
      'cashier AI assistant',
      'store management chat',
      'Cashvio',
    ],
    ar: [
      'مساعد ذكي للمحلات',
      'ذكاء اصطناعي POS',
      'أسئلة المخزون',
      'مساعد كاشفيو',
      'تحليلات المبيعات بالذكاء الاصطناعي',
      'مساعد عربي للتجارة',
      'مساعد كاشير ذكي',
      'مساعد إدارة المتاجر',
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

const painPointKeys = [
  'tooManyMenus',
  'staffHesitation',
  'delayedReports',
  'genericAIFails',
  'uncontrolledChanges',
  'disconnectedChannels',
] as const;

const capabilityKeys = [
  'plainLanguage',
  'liveSearch',
  'profitAnalytics',
  'humanApproval',
  'conversationHistory',
  'dailyTokenMeter',
] as const;

const safetyKeys = ['preview', 'oneTap', 'permissions', 'receipts'] as const;
const queryKeys = ['dailyPulse', 'lowStock', 'deadStock', 'stockTransfer'] as const;
const comparisonRowKeys = ['liveData', 'safeActions', 'arabicRetail', 'analytics', 'visualCards', 'tokenLimits'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export default async function AiAssistantPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'aiAssistant' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.aiAssistant' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? PAGE_PATH : `/ar${PAGE_PATH}`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'AI Assistant', nameAr: 'المساعد الذكي', url: getCanonicalUrl(PAGE_PATH, typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
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
    name: `${brand.name} AI Assistant`,
    alternateName: ['كاشفيو المساعد الذكي', 'Cashvio Retail AI Assistant'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Retail Store Assistant',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'AI assistant available on eligible plans with daily token allowances',
    },
    featureList: [
      'Conversational sales overview and profit summaries',
      'Real-time inventory lookup and low stock alerts',
      'Customer profile and purchase history queries',
      'Human-in-the-loop confirmation cards for stock transfers and adjustments',
      'Arabic and English natural retail language understanding',
      'Thread history and search',
      'Role-based permission gating',
      'Transparent daily token usage meter',
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
        primaryAction={{ label: t('hero.cta'), href: registerLink }}
        secondaryAction={{ label: t('hero.secondaryCta'), href: featuresLink }}
        note={t('hero.trust')}
        stamp={t('hero.stamp')}
        trackLocation={PAGE_PATH}
      />

      <FeatureScreenshot
        base="/assets/dashboard"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
      />

      {/* 01. The Problem */}
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

      {/* 02. Core Capabilities */}
      <section aria-label={t('capabilities.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02 · ${t('capabilities.badge')}`}
            title={t('capabilities.title')}
            subtitle={t('capabilities.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilityKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`capabilities.items.${key}.title`)}
                description={t(`capabilities.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 03. Safety & Human Approval */}
      <section aria-label={t('safety.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03 · ${t('safety.badge')}`}
            title={t('safety.title')}
            subtitle={t('safety.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {safetyKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`safety.items.${key}.title`)}
                description={t(`safety.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 04. Practical Queries */}
      <section aria-label={t('sampleQueries.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04 · ${t('sampleQueries.badge')}`}
            title={t('sampleQueries.title')}
            subtitle={t('sampleQueries.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {queryKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`sampleQueries.items.${key}.title`)}
                description={t(`sampleQueries.items.${key}.description`)}
                tags={[t(`sampleQueries.items.${key}.prompt`)]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 05. How It Works */}
      <section aria-label={t('howItWorks.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 05 · ${t('howItWorks.badge')}`}
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

      {/* 06. Comparison Table */}
      <section aria-label={t('comparison.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 06 · ${t('comparison.badge')}`}
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
        trackLocation={PAGE_PATH}
      />
    </>
  );
}
