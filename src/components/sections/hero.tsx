import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { ctaLinks } from '@/config/navigation';
import { ButtonLink } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroProps {
  locale: Locale;
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });

  return (
    <section aria-label="Hero" className="relative overflow-hidden section-padding">
      {/* Organic gradient mesh background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-primary/[0.04] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-purple-500/[0.03] blur-[80px]" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[40%] rounded-full bg-amber-400/[0.03] blur-[90px]" />
      </div>

      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="max-w-2xl">
        

            {/* Title with mixed weight */}
            <h1 className="animate-fade-up animate-delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight text-foreground mb-5 sm:mb-6 leading-[1.15]">
              <span className="font-normal">{t('title')}</span>{' '}
              <span className="font-bold text-primary">{t('titleHighlight')}</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up animate-delay-200 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 max-w-xl">
              {t('subtitle')}
            </p>

            {/* CTA buttons */}
            <div className="animate-fade-up animate-delay-300 flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
              <ButtonLink
                size="xl"
                href={ctaLinks.getStarted}
                className="group w-full sm:w-auto text-sm sm:text-base rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('cta')}
              </ButtonLink>
              <ButtonLink
                variant="outline"
                size="xl"
                href={ctaLinks.demo}
                className="w-full sm:w-auto text-sm sm:text-base rounded-2xl"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                </svg>
                {t('secondaryCta')}
              </ButtonLink>
            </div>
          </div>

          {/* Decorative gradient orb (right side, desktop only) */}
          <div className="hidden lg:flex items-center justify-center" aria-hidden="true">
            <div className="relative w-72 xl:w-80 h-72 xl:h-80">
              <div className="animate-float absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-purple-400/15 to-amber-300/10 blur-2xl" />
              <div className="animate-float absolute inset-6 rounded-full bg-gradient-to-tr from-primary/25 via-sky-300/10 to-transparent blur-xl" style={{ animationDelay: '-1.5s' }} />
              <div className="absolute inset-12 rounded-full bg-gradient-to-b from-primary/10 to-transparent blur-lg" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
