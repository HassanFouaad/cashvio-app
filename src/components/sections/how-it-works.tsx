import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { SectionHeader } from '@/components/marketing';

interface HowItWorksProps {
  locale: Locale;
}

const steps = ['step1', 'step2', 'step3'] as const;

export async function HowItWorks({ locale }: HowItWorksProps) {
  const t = await getTranslations({ locale, namespace: 'home.howItWorks' });

  return (
    <section aria-label="How it works" className="section-padding-sm bg-muted/40 border-y border-border">
      <div className="container-wide">
        <SectionHeader title={t('title')} subtitle={t('subtitle')} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="rounded-xl border border-border bg-card p-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary text-base font-semibold mb-4">
                {index + 1}
              </span>
              <h3 className="text-base font-semibold text-foreground mb-1.5">
                {t(`${step}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`${step}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
