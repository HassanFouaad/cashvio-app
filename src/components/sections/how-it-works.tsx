import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { ctaLinks } from '@/config/navigation';
import { ButtonLink } from '@/components/ui/button';

interface HowItWorksProps {
  locale: Locale;
}

const stepIcons = [
  // Step 1: Create Account
  <svg key="s1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>,
  // Step 2: Set Up Store
  <svg key="s2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>,
  // Step 3: Start Selling
  <svg key="s3" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>,
];

export async function HowItWorks({ locale }: HowItWorksProps) {
  const t = await getTranslations({ locale, namespace: 'home.howItWorks' });

  const steps = ['step1', 'step2', 'step3'] as const;

  return (
    <section aria-label="How it works" className="py-12 sm:py-16 md:py-20 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            {t('title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="relative text-center group">
              {/* Connector Line (hidden on mobile, shown between steps on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/30 to-primary/10" />
              )}

              {/* Step Number Circle */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 text-primary mb-4 sm:mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                <span className="text-2xl sm:text-3xl font-bold">{t(`${step}.number`)}</span>
              </div>

              {/* Content */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground mb-2">
                {t(`${step}.title`)}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xs mx-auto">
                {t(`${step}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
