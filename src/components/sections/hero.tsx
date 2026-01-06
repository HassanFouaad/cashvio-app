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
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-28 lg:py-36">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badges */}
          <div className="animate-fade-up flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="default">
              {t('badge')}
            </Badge>
            <Badge className="bg-success/15 text-success border border-success/30">
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {t('freeBadge')}
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-up animate-delay-100 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            {t('title')}{' '}
            <span className="text-primary">{t('titleHighlight')}</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up animate-delay-200 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="animate-fade-up animate-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ButtonLink size="xl" href={ctaLinks.getStarted} className="group">
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('cta')}
            </ButtonLink>
            <ButtonLink variant="outline" size="xl" href={ctaLinks.demo}>
              <svg
                className="w-5 h-5"
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
          <div className="animate-fade-up animate-delay-400 mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t('freeNote')}</span>
          </div>

          {/* Trust Badge */}
          <p className="animate-fade-up animate-delay-500 mt-4 text-sm text-muted-foreground">
            {t('trustedBy')}
          </p>
        </div>
      </div>
    </section>
  );
}
