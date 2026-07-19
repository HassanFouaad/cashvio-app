import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { LedgerHeading, ReceiptCard } from '@/components/marketing';

interface TestimonialsProps {
  locale: Locale;
}

const testimonialKeys = ['t1', 't2', 't3'] as const;

/**
 * Social-proof strip: merchant quotes printed as receipt slips.
 *
 * Quotes live in i18n (home.testimonials) and are attributed to merchant
 * segments, not named individuals — replace with real named merchant quotes
 * as they are collected.
 */
export async function Testimonials({ locale }: TestimonialsProps) {
  const t = await getTranslations({ locale, namespace: 'home.testimonials' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });

  return (
    <section aria-label={t('title')} className="section-padding-sm ledger-rules border-y border-border">
      <div className="container-wide">
        <LedgerHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonialKeys.map((key, index) => (
            <ReceiptCard
              key={key}
              code={`${tLedger('item')} ${String(index + 1).padStart(2, '0')}`}
              title={t(`items.${key}.quote`)}
              footer={
                <p className="font-receipt text-xs text-muted-foreground">
                  — {t(`items.${key}.author`)}
                </p>
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
