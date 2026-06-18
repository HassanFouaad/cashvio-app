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
    <section aria-label="Call to action" className="section-padding-sm">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-10 md:p-14 lg:p-20 text-center">
          {/* Decorative orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 max-w-2xl mx-auto">

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {t('title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
              {t('subtitle')}
            </p>

            <ButtonLink
              size="xl"
              className="bg-white text-emerald-700 hover:bg-white/90 shadow-glow-lg rounded-2xl text-sm sm:text-base font-semibold"
              href={ctaLinks.getStarted}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {t('button')}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
