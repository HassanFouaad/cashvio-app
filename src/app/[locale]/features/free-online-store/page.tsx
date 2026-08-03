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
  FeatureScreenshot,
} from '@/components/marketing';
import { ButtonLink } from '@/components/ui/button';
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
  const t = await getTranslations({ locale, namespace: 'metadata.freeOnlineStore' });
  const typedLocale = locale as Locale;

  const freeStoreKeywords: Record<Locale, string[]> = {
    en: [
      'free online store',
      'create free online store',
      'free online shop',
      'free ecommerce store',
      'free online store builder',
      'free online store no commission',
      'online store with POS',
      'free storefront',
      'free online store Egypt',
      'sell online for free',
      'free Arabic online store',
      'Cashvio free online store',
      'Cashvio',
    ],
    ar: [
      'متجر إلكتروني مجاني',
      'انشاء متجر الكتروني مجاني',
      'إنشاء متجر إلكتروني مجاني',
      'متجر الكتروني مجاني بدون عمولة',
      'عمل متجر الكتروني مجاني',
      'متجر أونلاين مجاني',
      'انشاء متجر الكتروني مجانا',
      'متجر إلكتروني عربي مجاني',
      'بيع أونلاين مجاناً',
      'متجر إلكتروني مع كاشير',
      'متجر الكتروني مصر مجاني',
      'كاشفيو متجر مجاني',
      'كاشفيو',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: freeStoreKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features/free-online-store', typedLocale),
      languages: getAlternateUrls('/features/free-online-store'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/features/free-online-store', typedLocale),
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

const painPointKeys = ['monthlyCost', 'commissions', 'separateStock', 'techSkills', 'weakArabic', 'deliveryChaos'] as const;
const solutionKeys = ['reallyFree', 'oneInventory', 'readyFast', 'arabicFirst'] as const;
const featureKeys = ['catalog', 'payments', 'delivery', 'coupons', 'seo', 'notifications'] as const;
const posLinkKeys = ['inventory', 'customers', 'orders', 'reports'] as const;
const comparisonRowKeys = ['price', 'commission', 'pos', 'inventory', 'arabic', 'setup'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function FreeOnlineStorePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'freeOnlineStore' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.freeOnlineStore' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';
  const posLink = typedLocale === 'en' ? '/features/free-pos' : '/ar/features/free-pos';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features/free-online-store' : '/ar/features/free-online-store',
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Free Online Store', nameAr: 'متجر إلكتروني مجاني', url: getCanonicalUrl('/features/free-online-store', typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Free Online Store`,
    alternateName: ['متجر كاشفيو الإلكتروني المجاني', 'Cashvio Free Storefront'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'E-commerce Storefront',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EGP',
      description: 'Free forever plan, no commission on sales, no credit card required',
    },
    isAccessibleForFree: true,
    featureList: [
      'Free online storefront with product catalog',
      'Zero commission on sales',
      'Inventory synced with the free POS',
      'Arabic and English storefront with RTL support',
      'Delivery zones and fees',
      'Coupons and discount codes',
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
        trackLocation="/features/free-online-store"
      />

      <FeatureScreenshot
        base="/assets/products"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
        companion={{
          base: '/assets/management',
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

      {/* What You Get Free */}
      <section aria-label={t('features.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03 · ${t('features.badge')}`}
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
        </div>
      </section>

      {/* Store + free POS together */}
      <section aria-label={t('posLink.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04 · ${t('posLink.badge')}`}
            title={t('posLink.title')}
            subtitle={t('posLink.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {posLinkKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`posLink.items.${key}.title`)}
                description={t(`posLink.items.${key}.description`)}
              />
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink variant="outline" href={posLink}>
              {t('posLink.cta')}
            </ButtonLink>
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

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        primaryAction={{ label: t('cta.button'), href: registerLink }}
        secondaryAction={{ label: t('cta.secondaryButton'), href: pricingLink }}
        note={t('cta.note')}
        trackLocation="/features/free-online-store"
      />
    </>
  );
}
