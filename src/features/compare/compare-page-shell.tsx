import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  ComparisonTable,
  FaqSection,
} from '@/components/marketing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
} from '@/config/seo';

interface ComparePageShellProps {
  locale: Locale;
  /** Content namespace, e.g. "compareLoyverse" (metadata under metadata.<ns>) */
  namespace: string;
  /** Path without locale prefix, e.g. "/compare/loyverse" */
  path: string;
}

const rowKeys = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8'] as const;
const faqKeys = ['q1', 'q2', 'q3', 'q4'] as const;

/**
 * Shared layout for competitor comparison pages: hero, a side-by-side
 * ledger comparison, an honest "who should choose what" section, a
 * public-information disclaimer, FAQ (with schema), and the closing CTA.
 */
export async function ComparePageShell({ locale, namespace, path }: ComparePageShellProps) {
  const t = await getTranslations({ locale, namespace });
  const metaT = await getTranslations({ locale, namespace: `metadata.${namespace}` });
  const tCompare = await getTranslations({ locale, namespace: 'compare' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });

  const registerLink = locale === 'en' ? '/register' : '/ar/register';
  const pricingLink = locale === 'en' ? '/pricing' : '/ar/pricing';
  const localizedPath = locale === 'en' ? path : `/ar${path}`;

  const webPageSchema = schemaTemplates.webPage({
    locale,
    path: localizedPath,
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb(
    [
      { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', locale) },
      { name: metaT('title'), url: getCanonicalUrl(path, locale) },
    ],
    locale
  );

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  const cashvioPoints = t.raw('choose.cashvio.points') as string[];
  const competitorPoints = t.raw('choose.competitor.points') as string[];

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
        eyebrow={tCompare('badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        primaryAction={{ label: tCompare('heroCta'), href: registerLink }}
        secondaryAction={{ label: tCompare('heroSecondaryCta'), href: pricingLink }}
        note={tCompare('heroNote')}
      />

      {/* Side-by-side comparison */}
      <section aria-label={t('glance.title')} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 01 — ${tCompare('glanceBadge')}`}
            title={t('glance.title')}
            subtitle={t('glance.subtitle')}
          />
          <ComparisonTable
            headers={{
              feature: tCompare('headers.feature'),
              cashvio: tCompare('headers.cashvio'),
              others: t('competitorName'),
            }}
            rows={rowKeys.map((key) => ({
              feature: t(`rows.${key}.feature`),
              cashvio: t(`rows.${key}.cashvio`),
              others: t(`rows.${key}.competitor`),
            }))}
          />
          <p className="mt-6 max-w-4xl mx-auto font-receipt text-xs text-muted-foreground leading-relaxed">
            {tCompare('disclaimer')}
          </p>
        </div>
      </section>

      {/* Honest fit guidance */}
      <section aria-label={t('choose.title')} className="section-padding-sm ledger-rules border-y border-border">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger('no')} 02 — ${tCompare('chooseBadge')}`}
            title={t('choose.title')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            <ReceiptCard
              code={tCompare('headers.cashvio')}
              value="✓"
              title={t('choose.cashvio.title')}
              lines={cashvioPoints}
            />
            <ReceiptCard
              code={t('competitorName')}
              title={t('choose.competitor.title')}
              lines={competitorPoints}
            />
          </div>
        </div>
      </section>

      <FaqSection title={t('faq.title')} items={faqItems} />

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        primaryAction={{ label: tCompare('ctaButton'), href: registerLink }}
        secondaryAction={{ label: tCompare('ctaSecondaryButton'), href: pricingLink }}
        note={tCompare('ctaNote')}
        stamp={tCompare('freeStamp')}
      />
    </>
  );
}
