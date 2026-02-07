import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';

interface PlatformPreviewProps {
  locale: Locale;
}

export function PlatformPreview({ locale }: PlatformPreviewProps) {
  const t = useTranslations('home.platformPreview');

  return (
    <section aria-label="Platform preview" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              {t('badge')}
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('title')}
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              {t('description')}
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-foreground font-medium">{t(key)}</p>
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

          {/* Dashboard Preview */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Background gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-3xl" />
              
              {/* Dashboard Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                <Image
                  src="/assets/portal.png"
                  alt={t('imageAlt')}
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                  priority
                  quality={85}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
              </div>

              {/* Floating stats cards */}
              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">{t('stat1Label')}</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{t('stat1Value')}</div>
              </div>

              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-card border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="text-xs sm:text-sm text-muted-foreground">{t('stat2Label')}</div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{t('stat2Value')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
