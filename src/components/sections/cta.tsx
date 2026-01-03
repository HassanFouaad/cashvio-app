import { getTranslations } from 'next-intl/server';
import { type Locale } from '@/i18n/routing';
import { ctaLinks } from '@/config/navigation';
import { ButtonLink } from '@/components/ui/button';

interface CTAProps {
  locale: Locale;
}

export async function CTA({ locale }: CTAProps) {
  const t = await getTranslations({ locale, namespace: 'home.cta' });

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-12 lg:p-16 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[size:20px_20px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              {t('title')}
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">
              {t('subtitle')}
            </p>
            <ButtonLink
              size="xl"
              className="bg-background text-primary hover:bg-background/90"
              href={ctaLinks.getStarted}
            >
              {t('button')}
            </ButtonLink>
            <p className="mt-4 text-sm text-primary-foreground/70">
              {t('note')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
