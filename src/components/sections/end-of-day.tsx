import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { LedgerHeading, ReceiptStamp } from '@/components/marketing';

interface EndOfDayProps {
  locale: Locale;
}

const benefitKeys = [
  'freeForever',
  'multiLanguage',
  'onboarding',
  'notifications',
  'mobile',
  'support',
] as const;

// Product/platform names shown as stamped seals (proper nouns, not translated)
const seals = [
  'Facebook Pixel',
  'Google Tags',
  'Multi-Currency',
  'Multi-Language',
  'Web',
  'iOS',
  'Android',
  'PWA',
] as const;

/**
 * "End of day" — benefits tallied like a closing register count, with
 * the integrations/platforms stamped at the bottom of the slip.
 * Merges the old Benefits + Trust sections into one closing ledger.
 */
export async function EndOfDay({ locale }: EndOfDayProps) {
  const t = await getTranslations({ locale, namespace: 'home.benefits' });
  const tEnd = await getTranslations({ locale, namespace: 'home.endOfDay' });

  return (
    <section aria-label="End of day" className="section-padding-sm ledger-rules border-y border-border">
      <div className="container-wide">
        <LedgerHeading eyebrow={tEnd('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="receipt-edge bg-card max-w-3xl px-6 sm:px-10 py-8 sm:py-10">
          <div className="flex items-baseline justify-between gap-4">
            <span className="mono-label text-muted-foreground">{tEnd('slipTitle')}</span>
            <span className="font-receipt text-[11px] text-muted-foreground" aria-hidden="true">
              {tEnd('slipNumber')}
            </span>
          </div>
          <div className="tear-line my-4" aria-hidden="true" />

          {benefitKeys.map((key) => (
            <div key={key} className="py-3.5 border-b border-dashed border-ledger-line">
              <div className="flex items-baseline gap-3">
                <h3 className="text-sm sm:text-base font-semibold text-foreground shrink-0">
                  {t(`${key}.title`)}
                </h3>
                <span className="tear-line flex-1 self-center" aria-hidden="true" />
                <span className="font-receipt text-xs text-primary shrink-0">
                  ✓ {tEnd('includedLabel')}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed max-w-xl">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}

          <div className="flex items-baseline justify-between gap-4 mt-5 pt-4 font-semibold">
            <span className="uppercase tracking-wide text-foreground text-sm">
              {tEnd('totalLabel')}
            </span>
            <span className="font-receipt text-primary">{tEnd('totalValue')}</span>
          </div>

          <div className="tear-line my-6" aria-hidden="true" />

          <p className="mono-label text-muted-foreground mb-4">{tEnd('stampsLabel')}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-4">
            {seals.map((seal, index) => (
              <ReceiptStamp
                key={seal}
                tone="muted"
                className={index % 2 === 1 ? 'rotate-6' : undefined}
              >
                {seal}
              </ReceiptStamp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
