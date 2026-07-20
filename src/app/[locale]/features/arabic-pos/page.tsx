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
  const t = await getTranslations({ locale, namespace: 'metadata.arabicPos' });
  const typedLocale = locale as Locale;

  const arabicPosKeywords: Record<Locale, string[]> = {
    en: [
      'Arabic POS system',
      'Arabic point of sale',
      'RTL POS software',
      'best POS for Arabic',
      'bilingual POS system',
      'Arabic storefront',
      'MENA POS system',
      'ZATCA compliant POS',
      'Arabic e-invoicing',
      'Middle East POS',
      'Saudi Arabia POS',
      'UAE POS system',
      'Egypt POS system',
      'Kuwait POS system',
      'Arabic online store',
      'right to left POS',
      'Arabic retail software',
      'Mada payment POS',
      'KNET payment POS',
      'Arabic receipt printing',
      'bilingual receipt POS',
      'GCC POS system',
      'Arabic inventory management',
      'Cashvio Arabic POS',
      'Cashvio',
    ],
    ar: [
      'نظام نقاط بيع عربي',
      'نقاط البيع بالعربي',
      'أفضل نظام POS عربي',
      'كاشفيو',
      'كاشفيو نقاط البيع',
      'نظام نقاط بيع السعودية',
      'نظام نقاط بيع الإمارات',
      'نظام نقاط بيع مصر',
      'فوترة إلكترونية زاتكا',
      'متجر إلكتروني عربي',
      'نظام كاشير عربي',
      'برنامج نقاط بيع عربي',
      'نظام بيع من اليمين لليسار',
      'واجهة عربية RTL',
      'إيصالات عربية',
      'نظام بيع ثنائي اللغة',
      'نظام بيع الشرق الأوسط',
      'كاشير للتجار العرب',
      'دفع مدى',
      'نظام بيع كي نت',
      'متجر الكتروني RTL',
      'برنامج كاشير للمتاجر',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: arabicPosKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features/arabic-pos', typedLocale),
      languages: getAlternateUrls('/features/arabic-pos'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/features/arabic-pos', typedLocale),
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

const painPointKeys = ['brokenLayouts', 'wrongDirection', 'poorTypography', 'receiptsInvoices', 'noLocalPayments', 'seoBlindSpot'] as const;
const solutionKeys = ['mirroredInterface', 'mixedContent', 'arabicTypography', 'instantSwitch'] as const;
const posFeatureKeys = ['checkout', 'receipts', 'shifts', 'offline', 'hardware'] as const;
const storefrontFeatureKeys = ['rtlShopping', 'arabicSeo', 'bilingualCatalog', 'arabicNotifications', 'digitalReceipts'] as const;
const comparisonRowKeys = ['rtlInterface', 'bilingualReceipts', 'arabicSeo', 'arabicTypography', 'languageSwitching', 'arabicReports'] as const;
const faqKeys = ['q1', 'q2', 'q4', 'q5', 'q6', 'q8', 'q9', 'q10'] as const;

export default async function ArabicPosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'arabicPos' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.arabicPos' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features/arabic-pos' : '/ar/features/arabic-pos',
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Arabic POS & Storefront', nameAr: 'نقاط البيع العربية', url: getCanonicalUrl('/features/arabic-pos', typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Arabic POS`,
    alternateName: ['كاشفيو نقاط البيع العربية', 'Cashvio Arabic Point of Sale'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Point of Sale Software',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free forever plan available',
    },
    featureList: [
      'Native Arabic RTL interface',
      'Bilingual Arabic-English receipts',
      'Per-user language preference',
      'Arabic storefront with SEO',
      'Offline POS capability',
      'Arabic thermal receipt printing',
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
      />

      <FeatureScreenshot
        base="/assets/pos"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
        companion={{
          base: '/assets/mobile-pos',
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

      {/* POS Features */}
      <section aria-label={t('pos.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03 · ${t('pos.badge')}`}
            title={t('pos.title')}
            subtitle={t('pos.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`pos.features.${key}.title`)}
                description={t(`pos.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Storefront Features */}
      <section aria-label={t('storefront.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04 · ${t('storefront.badge')}`}
            title={t('storefront.title')}
            subtitle={t('storefront.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {storefrontFeatureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`storefront.features.${key}.title`)}
                description={t(`storefront.features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section aria-label={t('comparison.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 05`}
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
