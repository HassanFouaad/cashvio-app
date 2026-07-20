import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  FaqSection,
} from '@/components/marketing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
} from '@/config/seo';

interface IndustryPageShellProps {
  locale: Locale;
  /** Content namespace, e.g. "industryCafe" (metadata under metadata.<ns>) */
  namespace: string;
  /** Path without locale prefix, e.g. "/industries/cafe" */
  path: string;
}

const painKeys = ['p1', 'p2', 'p3'] as const;
const featureKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'] as const;
const faqKeys = ['q1', 'q2', 'q3'] as const;

/**
 * Shared layout for industry landing pages: hero, the pains of running
 * that business on paper, what Cashvio gives the vertical (honest,
 * shipped features only), FAQ (with schema), and the closing CTA.
 */
export async function IndustryPageShell({ locale, namespace, path }: IndustryPageShellProps) {
  const t = await getTranslations({ locale, namespace });
  const metaT = await getTranslations({ locale, namespace: `metadata.${namespace}` });
  const tIndustries = await getTranslations({ locale, namespace: 'industries' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });

  const registerLink = locale === 'en' ? '/register' : '/ar/register';
  const pricingLink = locale === 'en' ? '/pricing' : '/ar/pricing';
  const localizedPath = locale === 'en' ? path : `/ar${path}`;
  const itemCode = (index: number): string =>
    `${tLedger('item')} ${String(index + 1).padStart(2, '0')}`;

  const webPageSchema = schemaTemplates.webPage({
    locale,
    path: localizedPath,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbItems =
    path.startsWith('/industries')
      ? [
          { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', locale) },
          {
            name: 'POS by Business Type',
            nameAr: 'كاشير حسب النشاط',
            url: getCanonicalUrl('/industries', locale),
          },
          { name: metaT('title'), url: getCanonicalUrl(path, locale) },
        ]
      : path === '/free-pos-egypt'
        ? [
            { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', locale) },
            {
              name: 'Free POS System',
              nameAr: 'كاشير مجاني',
              url: getCanonicalUrl('/features/free-pos', locale),
            },
            { name: metaT('title'), url: getCanonicalUrl(path, locale) },
          ]
        : [
            { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', locale) },
            { name: metaT('title'), url: getCanonicalUrl(path, locale) },
          ];

  const breadcrumbSchema = schemaTemplates.breadcrumb(breadcrumbItems, locale);

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }}
      />

      <LedgerHero
        eyebrow={tIndustries('badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        primaryAction={{ label: tIndustries('heroCta'), href: registerLink }}
        secondaryAction={{ label: tIndustries('heroSecondaryCta'), href: pricingLink }}
        note={tIndustries('heroNote')}
        stamp={tIndustries('freeStamp')}
      />

      {/* The pains */}
      <section aria-label={t('pains.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01 · ${tIndustries('painsBadge')}`}
            title={t('pains.title')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {painKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`pains.${key}.title`)}
                description={t(`pains.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* What Cashvio gives this vertical */}
      <section aria-label={t('features.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02 · ${tIndustries('featuresBadge')}`}
            title={t('features.title')}
            subtitle={t('features.subtitle')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`features.${key}.title`)}
                description={t(`features.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      <FaqSection title={t('faq.title')} items={faqItems} />

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
