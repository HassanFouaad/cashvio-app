import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
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

const PAGE_PATH = '/features/customer-management';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.customerManagement' });
  const typedLocale = locale as Locale;

  const pageKeywords: Record<Locale, string[]> = {
    en: [
      'customer management software',
      'free CRM for retail',
      'customer database for small business',
      'retail CRM software',
      'POS with customer management',
      'store credit management',
      'customer purchase history',
      'customer loyalty tracking',
      'customer profiles POS',
      'delivery address management',
      'free customer database',
      'CRM for shops',
      'Cashvio customers',
      'Cashvio',
    ],
    ar: [
      'برنامج إدارة العملاء',
      'قاعدة بيانات العملاء',
      'إدارة علاقات العملاء للمتاجر',
      'كاشير مع إدارة عملاء',
      'رصيد المتجر للعملاء',
      'سجل مشتريات العميل',
      'برنامج عملاء مجاني',
      'متابعة زيارات العملاء',
      'عناوين توصيل العملاء',
      'كاشفيو',
      'إدارة علاقات العملاء للمحلات',
      'رصيد المحل للعملاء',
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

const problemKeys = ['scatteredNotes', 'noHistory', 'creditChaos', 'addressHassle'] as const;
const featureKeys = ['quickProfiles', 'stats', 'storeCredit', 'addresses', 'orderHistory', 'notes', 'recordVisit', 'newOrder'] as const;
const creditKeys = ['refund', 'pay', 'automatic'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export default async function CustomerManagementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'customerManagement' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.customerManagement' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const docsLink = typedLocale === 'en' ? '/docs/customers/managing-customers' : '/ar/docs/customers/managing-customers';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? PAGE_PATH : `/ar${PAGE_PATH}`,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Customer Management', nameAr: 'إدارة العملاء', url: getCanonicalUrl(PAGE_PATH, typedLocale) },
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
    totalTime: 'PT1M',
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
    name: `${brand.name} Customer Management`,
    alternateName: ['كاشفيو إدارة العملاء', 'Cashvio Free Retail CRM'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Customer Relationship Management',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: 'Free forever plan with full customer management' },
    featureList: [
      'Customer profiles starting from a phone number',
      'Automatic visits, spending, and last-visit stats',
      'Store credit balance managed by orders and refunds',
      'Multiple delivery addresses with a default',
      'Full order history per customer',
      'Private staff notes',
      'Offline visit recording',
      'New order from the customer profile',
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
        trackLocation={PAGE_PATH}
        aside={
          <div className="mx-auto w-full max-w-lg">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Image
                src="/assets/c-design.jpg"
                alt={t('visual.alt')}
                width={1400}
                height={734}
                priority
                quality={85}
                sizes="(max-width: 1024px) 90vw, 512px"
                className="block w-full h-auto"
              />
            </div>
          </div>
        }
      />

      <FeatureScreenshot
        base="/assets/customers"
        locale={typedLocale}
        alt={t('screenshot.alt')}
        caption={t('screenshot.caption')}
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

      {/* Store Credit */}
      <section aria-label={t('storeCredit.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 04`}
            title={t('storeCredit.title')}
            subtitle={t('storeCredit.subtitle')}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {creditKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`storeCredit.${key}.title`)}
                description={t(`storeCredit.${key}.description`)}
              />
            ))}
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
        trackLocation={PAGE_PATH}
      />
    </>
  );
}
