import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { ButtonLink } from '@/components/ui/button';

interface HeroProps {
  locale: Locale;
}

export async function Hero({ locale }: HeroProps) {
  const t = await getTranslations({ locale, namespace: 'home.hero' });
  const featuresLink = locale === 'en' ? '/features' : '/ar/features';
  const registerLink = locale === 'en' ? '/register' : '/ar/register';

  return (
    <section aria-label="Hero" className="hero-wash border-b border-border overflow-hidden">
      <div className="container-wide pt-16 sm:pt-20 md:pt-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="animate-fade-up text-4xl sm:text-5xl md:text-[3.5rem] font-semibold tracking-tight text-foreground mb-5 leading-[1.1]">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
          </h1>

          <p className="animate-fade-up animate-delay-100 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="animate-fade-up animate-delay-200 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ButtonLink size="lg" href={registerLink} className="w-full sm:w-auto">
              {t('cta')}
            </ButtonLink>
            <ButtonLink
              variant="outline"
              size="lg"
              href={featuresLink}
              className="w-full sm:w-auto"
            >
              {t('secondaryCta')}
            </ButtonLink>
          </div>

          <p className="animate-fade-up animate-delay-300 mt-5 text-sm text-muted-foreground">
            {t('freeNote')}
          </p>
        </div>

        {/* Product screenshot — the real product is the hero visual */}
        <div className="animate-fade-up animate-delay-300 mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="rounded-t-2xl border border-b-0 border-border bg-card overflow-hidden">
            <Image
              src="/assets/portal.png"
              alt={t('imageAlt')}
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
