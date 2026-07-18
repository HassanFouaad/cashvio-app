import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  FaqSection,
  AlsoFreeStrip,
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

const PAGE_PATH = '/features/purchase-orders';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.purchaseOrders' });
  const typedLocale = locale as Locale;

  const pageKeywords: Record<Locale, string[]> = {
    en: [
      'purchase order software',
      'purchase order system',
      'supplier management software',
      'PO management for retail',
      'restocking software',
      'receive stock software',
      'vendor management for small business',
      'purchase order tracking',
      'inventory purchasing software',
      'free purchase order software',
      'supplier database',
      'Cashvio purchase orders',
      'Cashvio',
    ],
    ar: [
      'برنامج أوامر الشراء',
      'نظام أوامر الشراء',
      'إدارة الموردين',
      'برنامج مشتريات للمحلات',
      'إعادة تخزين البضاعة',
      'استلام البضاعة',
      'متابعة طلبات الموردين',
      'برنامج موردين مجاني',
      'مشتريات المخزون',
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

const problemKeys = ['noRecord', 'costsUntracked', 'uncheckedDeliveries', 'partialLost'] as const;
const featureKeys = ['wizard', 'statuses', 'approval', 'receiving', 'autoInventory', 'suppliers', 'history', 'filters'] as const;
const effectKeys = ['created', 'received', 'cancelled'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function PurchaseOrdersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'purchaseOrders' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.purchaseOrders' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const docsLink = typedLocale === 'en' ? '/docs/suppliers/purchase-orders' : '/ar/docs/suppliers/purchase-orders';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? PAGE_PATH : `/ar${PAGE_PATH}`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Purchase Orders', nameAr: 'أوامر الشراء', url: getCanonicalUrl(PAGE_PATH, typedLocale) },
  ], typedLocale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const speakableSchema = getSpeakableSchema({
    locale: typedLocale,
    path: typedLocale === 'en' ? PAGE_PATH : `/ar${PAGE_PATH}`,
    headline: metaT('title'),
    summary: metaT('description'),
  });

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howItWorks.title'),
    description: t('howItWorks.subtitle'),
    totalTime: 'PT2M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    step: [1, 2, 3].map((n) => ({
      '@type': 'HowToStep',
      position: n,
      name: t(`howItWorks.step${n}.title`),
      text: t(`howItWorks.step${n}.description`),
    })),
  };

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Purchase Orders & Suppliers`,
    alternateName: ['كاشفيو أوامر الشراء', 'Cashvio Purchase Order Software'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Purchase Order Management',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Purchase orders included with the Cashvio inventory module' },
    featureList: [
      'Two-step purchase order creation with unit costs',
      'Draft, approved, partially received, completed, and cancelled statuses',
      'Type-to-confirm approval and cancellation',
      'Partial stock receiving with ordered/received/remaining tracking',
      'Automatic inventory updates on receipt',
      'Supplier database with contacts',
      'Full purchase order history per supplier',
      'Search and filters by number, store, supplier, status, and date',
    ],
    inLanguage: ['ar', 'en'],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(speakableSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(softwareAppSchema) }} />

      <LedgerHero
        eyebrow={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        primaryAction={{ label: t('cta.getStarted'), href: registerLink }}
        secondaryAction={{ label: commonT('readDocs'), href: docsLink }}
      />

      {/* Problem */}
      <section aria-label={t('problem.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01`}
            title={t('problem.title')}
            subtitle={t('problem.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl">
            {problemKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`problem.items.${key}.title`)}
                description={t(`problem.items.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section aria-label={t('features.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02`}
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`features.items.${key}.name`)}
                description={t(`features.items.${key}.description`)}
                tags={t(`features.items.${key}.subs`).split(' • ')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section aria-label={t('howItWorks.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 03`}
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

      {/* Inventory Effects */}
      <section aria-label={t('effects.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04`}
            title={t('effects.title')}
            subtitle={t('effects.subtitle')}
          />
          <div className="max-w-3xl overflow-x-auto receipt-edge bg-card px-2 sm:px-4 py-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-dashed border-ledger-line">
                  <th className="text-start p-4 mono-label text-muted-foreground w-[40%]">
                    {t('effects.headers.action')}
                  </th>
                  <th className="text-start p-4 mono-label text-muted-foreground">
                    {t('effects.headers.effect')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {effectKeys.map((key, index) => (
                  <tr key={key} className={index < effectKeys.length - 1 ? 'border-b border-dashed border-ledger-line' : undefined}>
                    <td className="p-4 font-medium text-foreground">{t(`effects.items.${key}.action`)}</td>
                    <td className="p-4 text-muted-foreground">{t(`effects.items.${key}.effect`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FaqSection title={t('faq.title')} subtitle={t('faq.subtitle')} items={faqItems} />

      <AlsoFreeStrip locale={locale} />

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.description')}
        primaryAction={{ label: t('cta.getStarted'), href: registerLink }}
        secondaryAction={{ label: t('cta.viewPricing'), href: pricingLink }}
        note={t('cta.freeNote')}
      />
    </>
  );
}
