import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  FeatureScreenshot,
} from '@/components/marketing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  keywords,
  openGraphDefaults,
  xCardDefaults,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.features' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('title')}`,
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features', typedLocale),
      languages: getAlternateUrls('/features'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')}`,
      description: t('description'),
      url: getCanonicalUrl('/features', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
    },
    twitter: {
      ...xCardDefaults,
      title: `${t('title')}`,
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

const moduleKeys = [
  'products',
  'inventory',
  'orders',
  'customers',
  'suppliers',
  'analytics',
  'pos',
  'roles',
] as const;

const operationsKeys = [
  'returns',
  'refunds',
  'purchaseOrders',
  'posDevices',
  'notifications',
  'storefront',
  'deliveryZones',
  'digitalReceipts',
] as const;

const functionalKeys = [
  'advancedAnalytics',
  'advancedInventory',
  'customReports',
  'multiLanguage',
] as const;

const capacityKeys = ['maxStores', 'maxUsers', 'maxPosDevices', 'maxCustomers'] as const;

/** Varied marketing shots shown before each features-hub section (deterministic, not Math.random). */
const sectionShots = [
  {
    key: 'modules' as const,
    base: '/assets/products',
    variant: 'desktop' as const,
  },
  {
    key: 'solutions' as const,
    base: '/assets/pos',
    variant: 'desktop' as const,
    companion: {
      base: '/assets/mobile-pos',
      variant: 'mobile' as const,
    },
  },
  {
    key: 'operations' as const,
    base: '/assets/inventory',
    variant: 'desktop' as const,
    companion: {
      base: '/assets/mobile-inventory',
      variant: 'mobile' as const,
    },
  },
  {
    key: 'functional' as const,
    base: '/assets/analytics',
    variant: 'desktop' as const,
  },
  {
    key: 'capacity' as const,
    base: '/assets/stores',
    variant: 'desktop' as const,
  },
] as const;

const solutionLinks = [
  { key: 'freePos', href: '/features/free-pos' },
  { key: 'freeOnlineStore', href: '/features/free-online-store' },
  { key: 'arabicPos', href: '/features/arabic-pos' },
  { key: 'omnichannelRetail', href: '/features/omnichannel-retail' },
  { key: 'inventoryManagement', href: '/features/inventory-management' },
  { key: 'couponsAndDiscounts', href: '/features/coupons-and-discounts' },
  { key: 'orderManagement', href: '/features/order-management' },
  { key: 'customerManagement', href: '/features/customer-management' },
  { key: 'customerCredit', href: '/features/customer-credit' },
  { key: 'whatsappCommerce', href: '/features/whatsapp-commerce' },
  { key: 'barcodePos', href: '/features/barcode-pos' },
  { key: 'salesAnalytics', href: '/features/sales-analytics' },
  { key: 'aiAssistant', href: '/features/ai-assistant' },
  { key: 'purchaseOrders', href: '/features/purchase-orders' },
  { key: 'returnsAndRefunds', href: '/features/returns-and-refunds' },
  { key: 'multiStoreManagement', href: '/features/multi-store-management' },
  { key: 'teamManagement', href: '/features/team-management' },
] as const;

export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'features' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.features' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features' : `/ar/features`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const featuresSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('title'),
    description: t('subtitle'),
    itemListElement: moduleKeys.map((key, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: t(`modules.${key}.name`),
      description: t(`modules.${key}.description`),
    })),
  };

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: metaT('title'), url: getCanonicalUrl('/features', typedLocale) },
  ], typedLocale);

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(featuresSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />

      <LedgerHero
        eyebrow={t('badge')}
        title={t('title')}
        subtitle={t('subtitle')}
        trackLocation="/features"
      />

      <FeatureScreenshot
        base="/assets/dashboard"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
      />

      {/* Core Modules — ledger chapter no. 01 */}
      <FeatureScreenshot
        base={sectionShots[0].base}
        locale={typedLocale}
        variant={sectionShots[0].variant}
        alt={t(`sectionShots.${sectionShots[0].key}.alt`)}
        caption={t(`sectionShots.${sectionShots[0].key}.caption`)}
      />
      <section aria-label={t('categories.modules.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01`}
            title={t('categories.modules.title')}
            subtitle={t('categories.modules.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moduleKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`modules.${key}.name`)}
                description={t(`modules.${key}.description`)}
                tags={t(`modules.${key}.subs`).split(' • ')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <FeatureScreenshot
        base={sectionShots[1].base}
        locale={typedLocale}
        variant={sectionShots[1].variant}
        alt={t(`sectionShots.${sectionShots[1].key}.alt`)}
        caption={t(`sectionShots.${sectionShots[1].key}.caption`)}
        companion={{
          base: sectionShots[1].companion.base,
          variant: sectionShots[1].companion.variant,
          alt: t(`sectionShots.${sectionShots[1].key}.companionAlt`),
          caption: t(`sectionShots.${sectionShots[1].key}.companionCaption`),
        }}
      />
      <section aria-label={t('solutions.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02`}
            title={t('solutions.title')}
            subtitle={t('solutions.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {solutionLinks.map((solution, index) => (
              <a
                key={solution.key}
                href={typedLocale === 'en' ? solution.href : `/ar${solution.href}`}
                className="group receipt-edge bg-card p-5 sm:p-6 transition-colors duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="mono-label text-muted-foreground">{itemCode(index)}</span>
                  <span
                    className="font-receipt text-sm text-primary group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform duration-200 rtl:-scale-x-100"
                    aria-hidden="true"
                  >
                    -&gt;
                  </span>
                </div>
                <div className="tear-line my-3" aria-hidden="true" />
                <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
                  {t(`solutions.${solution.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t(`solutions.${solution.key}.description`)}
                </p>
                <span className="inline-flex items-center gap-1.5 font-receipt text-sm text-primary">
                  {t(`solutions.${solution.key}.cta`)}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Operations & Workflow */}
      <FeatureScreenshot
        base={sectionShots[2].base}
        locale={typedLocale}
        variant={sectionShots[2].variant}
        alt={t(`sectionShots.${sectionShots[2].key}.alt`)}
        caption={t(`sectionShots.${sectionShots[2].key}.caption`)}
        companion={{
          base: sectionShots[2].companion.base,
          variant: sectionShots[2].companion.variant,
          alt: t(`sectionShots.${sectionShots[2].key}.companionAlt`),
          caption: t(`sectionShots.${sectionShots[2].key}.companionCaption`),
        }}
      />
      <section aria-label={t('categories.operations.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03`}
            title={t('categories.operations.title')}
            subtitle={t('categories.operations.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {operationsKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`operations.${key}.name`)}
                description={t(`operations.${key}.description`)}
                tags={t(`operations.${key}.subs`).split(' • ')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <FeatureScreenshot
        base={sectionShots[3].base}
        locale={typedLocale}
        variant={sectionShots[3].variant}
        alt={t(`sectionShots.${sectionShots[3].key}.alt`)}
        caption={t(`sectionShots.${sectionShots[3].key}.caption`)}
      />
      <section aria-label={t('categories.functional.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04`}
            title={t('categories.functional.title')}
            subtitle={t('categories.functional.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {functionalKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`functional.${key}.name`)}
                description={t(`functional.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Scalable Limits */}
      <FeatureScreenshot
        base={sectionShots[4].base}
        locale={typedLocale}
        variant={sectionShots[4].variant}
        alt={t(`sectionShots.${sectionShots[4].key}.alt`)}
        caption={t(`sectionShots.${sectionShots[4].key}.caption`)}
      />
      <section aria-label={t('categories.capacity.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 05`}
            title={t('categories.capacity.title')}
            subtitle={t('categories.capacity.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {capacityKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`capacity.${key}.name`)}
                description={t(`capacity.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.description')}
        primaryAction={{ label: t('cta.getStarted'), href: registerLink }}
        secondaryAction={{ label: t('cta.viewPricing'), href: pricingLink }}
        trackLocation="/features"
      />
    </>
  );
}
