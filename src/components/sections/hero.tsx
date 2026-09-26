import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { ThemedShot } from '@/components/ui/themed-shot';
import { SalesTicker } from '@/components/marketing';
import { TrackedButtonLink } from '@/lib/analytics';

interface HeroProps {
  locale: Locale;
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const featuresLink = locale === 'en' ? '/features' : '/ar/features';
  const registerLink = locale === 'en' ? '/register' : '/ar/register';

  return (
    <section aria-labelledby="home-hero-title" className="overflow-hidden">
      <div className="ledger-rules">
        <div className="container-wide py-8 sm:py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="max-w-4xl">
              <div className="animate-fade-up flex items-center gap-4 mb-5">
                <span className="mono-label text-primary">{t('eyebrow')}</span>
                <span className="tear-line flex-1" aria-hidden="true" />
              </div>

              <h1 id="home-hero-title" className="animate-fade-up text-4xl sm:text-5xl md:text-[3.5rem] font-semibold tracking-tight text-foreground mb-5 leading-[1.08]">
                {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
              </h1>

              <p className="animate-fade-up animate-delay-100 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
                {t('subtitle')}
              </p>

              <div className="animate-fade-up animate-delay-200 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <TrackedButtonLink
                    size="lg"
                    href={registerLink}
                    className="w-full sm:w-auto"
                    trackName="get_started"
                    trackLocation="home_hero"
                  >
                    {t('cta')}
                  </TrackedButtonLink>
                  <TrackedButtonLink
                    variant="outline"
                    size="lg"
                    href={featuresLink}
                    className="w-full sm:w-auto"
                    trackName="explore_features"
                    trackLocation="home_hero"
                  >
                    {t('secondaryCta')}
                  </TrackedButtonLink>
                </div>
              </div>

              <p className="animate-fade-up animate-delay-300 mt-6 font-receipt text-xs sm:text-sm text-muted-foreground">
                {t('freeNote')}
              </p>
            </div>

            <div className="animate-fade-up animate-delay-300 max-w-5xl mx-auto">
              <div className="rounded-t-xl border border-b-0 border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-dashed border-ledger-line">
                  <span className="mono-label text-muted-foreground">{t('screenCaption')}</span>
                  <span className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="mono-label text-primary">{t('live')}</span>
                  </span>
                </div>
                <ThemedShot
                  base="/assets/dashboard"
                  locale={locale}
                  alt={t('imageAlt')}
                  width={2880}
                  height={1800}
                  priority
                  quality={92}
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <SalesTicker />
    </section>
  );
}
