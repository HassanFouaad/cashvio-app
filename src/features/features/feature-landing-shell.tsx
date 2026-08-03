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

interface FeatureLandingShellProps {
  locale: Locale;
  /** Content namespace, e.g. "customerCredit" (metadata under metadata.<ns>) */
  namespace: string;
  /** Path without locale prefix, e.g. "/features/customer-credit" */
  path: string;
  /** English breadcrumb label for this page (Arabic uses meta title) */
  breadcrumbNameEn: string;
  breadcrumbNameAr: string;
}

const painKeys = ['p1', 'p2', 'p3'] as const;
const featureKeys = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'] as const;
const faqKeys = ['q1', 'q2', 'q3'] as const;

/**
 * Compact SEO feature landing: hero, pains, six shipped capabilities,
 * FAQ with schema, closing CTA. Same shape as IndustryPageShell so
 * bilingual content stays easy to author.
 */
export async function FeatureLandingShell({
  locale,
  namespace,
  path,
  breadcrumbNameEn,
  breadcrumbNameAr,
}: FeatureLandingShellProps) {
  const t = await getTranslations({ locale, namespace });
  const metaT = await getTranslations({ locale, namespace: `metadata.${namespace}` });
  const commonT = await getTranslations({ locale, namespace: 'common' });
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

  const breadcrumbSchema = schemaTemplates.breadcrumb(
    [
      { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', locale) },
      {
        name: 'Features',
        nameAr: 'المميزات',
        url: getCanonicalUrl('/features', locale),
      },
      {
        name: breadcrumbNameEn,
        nameAr: breadcrumbNameAr,
        url: getCanonicalUrl(path, locale),
      },
    ],
    locale
  );

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
        eyebrow={t('hero.badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        primaryAction={{ label: commonT('getStarted'), href: registerLink }}
        secondaryAction={{ label: commonT('viewPricing'), href: pricingLink }}
        note={t('hero.note')}
        stamp={t('hero.stamp')}
        trackLocation={path}
      />

      <section aria-label={t('pains.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01 · ${t('pains.badge')}`}
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

      <section
        aria-label={t('features.title')}
        className="section-padding-sm ledger-rules border-y border-border"
      >
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02 · ${t('features.badge')}`}
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
        primaryAction={{ label: commonT('getStarted'), href: registerLink }}
        secondaryAction={{ label: commonT('viewPricing'), href: pricingLink }}
        note={t('cta.note')}
        stamp={t('hero.stamp')}
        trackLocation={path}
      />
    </>
  );
}
