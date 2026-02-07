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
    <section aria-label="Hero" className="relative overflow-hidden bg-gradient-hero py-12 sm:py-16 md:py-20 lg:py-28">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center px-2">
          {/* Badges */}
          <div className="animate-fade-up flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6">
            <Badge variant="default" className="text-xs sm:text-sm">
              {t('badge')}
            </Badge>
            <Badge className="bg-success/15 text-success border border-success/30 text-xs sm:text-sm">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t('freeBadge')}
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up animate-delay-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6 leading-[1.1]">
            {t('title')}{' '}
            <span className="text-primary relative">
              {t('titleHighlight')}
              <svg className="absolute -bottom-1 left-0 w-full h-2 text-primary/30" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 7 Q 50 0, 100 7" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up animate-delay-200 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="animate-fade-up animate-delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <ButtonLink 
              size="xl" 
              href={ctaLinks.getStarted} 
              className="group w-full sm:w-auto text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300"
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
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
              {t('secondaryCta')}
            </ButtonLink>
          </div>

          {/* Free Forever Note */}
          <div className="animate-fade-up animate-delay-400 mt-5 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('freeNote')}</span>
          </div>

          {/* Trust Badge */}
          {t('trustedBy') && (
            <p className="animate-fade-up animate-delay-500 mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              {t('trustedBy')}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
