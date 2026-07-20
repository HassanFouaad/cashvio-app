import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { LedgerHero, LedgerCta, LedgerHeading, ReceiptCard } from '@/components/marketing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

const industriesKeywords: Record<Locale, string[]> = {
  en: [
    'POS by business type',
    'free POS for small business',
    'cafe POS system',
    'clothing store POS',
    'minimarket POS',
    'retail POS Egypt',
    'Cashvio',
  ],
  ar: [
    'كاشير حسب النشاط',
    'كاشير مجاني للمحلات',
    'كاشير كافيه',
    'كاشير محل ملابس',
    'كاشير ميني ماركت',
    'برنامج كاشير مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries',
    namespace: 'industriesHub',
    keywords: industriesKeywords,
  });
}

const industryKeys = ['cafe', 'clothing', 'minimarket'] as const;

const industryLinks: Record<(typeof industryKeys)[number], string> = {
  cafe: '/industries/cafe',
  clothing: '/industries/clothing',
  minimarket: '/industries/minimarket',
};

export default async function IndustriesHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'industriesHub' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.industriesHub' });
  const tIndustries = await getTranslations({ locale, namespace: 'industries' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/industries' : '/ar/industries',
    title: metaT('title'),
    description: metaT('description'),
    type: 'CollectionPage',
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb(
    [
      { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
      {
        name: 'POS by Business Type',
        nameAr: 'كاشير حسب النشاط',
        url: getCanonicalUrl('/industries', typedLocale),
      },
    ],
    typedLocale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      <LedgerHero
        eyebrow={tIndustries('badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        stamp={tIndustries('freeStamp')}
      />

      <section aria-label={t('hero.title')} className="section-padding-sm">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {industryKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={`${tLedger('item')} ${String(index + 1).padStart(2, '0')}`}
                value="0.00"
                title={t(`items.${key}.title`)}
                description={t(`items.${key}.description`)}
                footer={
                  <Link
                    href={industryLinks[key]}
                    className="inline-flex items-center gap-2 font-receipt text-sm text-primary hover:underline"
                  >
                    {t(`items.${key}.cta`)}
                    <span aria-hidden="true" className="rtl:-scale-x-100">-&gt;</span>
                  </Link>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <section aria-label={t('more.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading title={t('more.title')} subtitle={t('more.subtitle')} />
        </div>
      </section>

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        primaryAction={{ label: tIndustries('ctaButton'), href: registerLink }}
        secondaryAction={{ label: tIndustries('ctaSecondaryButton'), href: pricingLink }}
        note={tIndustries('ctaNote')}
        stamp={tIndustries('freeStamp')}
      />
    </>
  );
}
