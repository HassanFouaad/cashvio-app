import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { LedgerHeading } from '@/components/marketing';

interface HowItWorksProps {
  locale: Locale;
}

const steps = ['step1', 'step2', 'step3'] as const;

export async function HowItWorks({ locale }: HowItWorksProps) {
  const t = await getTranslations({ locale, namespace: 'home.howItWorks' });

  return (
    <section aria-label="How it works" className="section-padding-sm ledger-rules border-y border-border">
      <div className="container-wide">
        <LedgerHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        {/* Journal timeline: timestamped entries down a dashed spine */}
        <ol className="relative max-w-2xl border-s border-dashed border-ledger-line ms-1.5">
          {steps.map((step) => (
            <li key={step} className="relative ps-8 sm:ps-10 pb-10 last:pb-0">
              <span
                className="absolute -start-[5.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              <p className="mono-label text-primary mb-2">{t(`${step}.time`)}</p>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                {t(`${step}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                {t(`${step}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
