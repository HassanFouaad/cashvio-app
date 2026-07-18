import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { LedgerHeading, PriceTag } from '@/components/marketing';

interface FeaturesProps {
  locale: Locale;
}

const featureKeys = [
  'orders',
  'inventory',
  'analytics',
  'pos',
  'products',
  'customers',
  'multistore',
  'team',
] as const;

export async function Features({ locale }: FeaturesProps) {
  const t = await getTranslations({ locale, namespace: 'home.features' });

  return (
    <section aria-label="Features" className="section-padding">
      <div className="container-wide">
        <LedgerHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        {/* The day book: numbered ledger rows, every line tallied at 0.00 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 border-t border-dashed border-ledger-line">
          {featureKeys.map((key, index) => (
            <div key={key} className="flex gap-4 py-6 border-b border-dashed border-ledger-line">
              <span
                className="font-receipt text-sm text-primary pt-0.5 shrink-0 w-7"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-base font-semibold text-foreground">
                    {t(`${key}.title`)}
                  </h3>
                  <span className="tear-line flex-1 self-center hidden sm:block" aria-hidden="true" />
                  <span
                    className="font-receipt text-xs text-muted-foreground hidden sm:block shrink-0"
                    aria-hidden="true"
                  >
                    {t('lineValue')}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {t(`${key}.description`)}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  <PriceTag>{t(`${key}.sub1`)}</PriceTag>
                  <PriceTag>{t(`${key}.sub2`)}</PriceTag>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
