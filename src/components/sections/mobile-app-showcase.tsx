import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';

interface MobileAppShowcaseProps {
  locale: Locale;
}

export function MobileAppShowcase({ locale }: MobileAppShowcaseProps) {
  const t = useTranslations('home.mobileApp');

  return (
    <section aria-label="Mobile app" className="py-16 sm:py-20 md:py-24 bg-muted/30">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            {t('badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Mobile App Display */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Phone Mockup */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative max-w-[320px] sm:max-w-[360px]">
              {/* Gradient glow effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl" />
              
              {/* Simple Phone Frame */}
              <div className="relative">
                {/* Minimal border frame */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                  {/* App Screenshot */}
                  <Image
                    src="/assets/mobile1.png"
                    alt={t('imageAlt')}
                    width={375}
                    height={812}
                    className="w-full h-auto"
                    loading="lazy"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6 mb-8">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((key, index) => (
              <div
                key={key}
                className="flex gap-4 items-start group"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {index === 0 && (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
