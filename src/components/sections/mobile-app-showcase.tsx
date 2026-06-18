'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils/cn';

interface MobileAppShowcaseProps {
  locale: Locale;
}

const views = [
  { id: 'pos', image: '/assets/mobile1.png', namespace: 'home.mobileApp' },
  { id: 'management', image: '/assets/mobile2.png', namespace: 'home.mobileApp2' },
] as const;

const featureIcons = [
  <svg key="f1" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>,
  <svg key="f2" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg key="f3" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>,
  <svg key="f4" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
];

export function MobileAppShowcase({ locale }: MobileAppShowcaseProps) {
  const [activeView, setActiveView] = useState(0);
  const tApp = useTranslations('home.mobileApp');
  const tApp2 = useTranslations('home.mobileApp2');

  const activeT = activeView === 0 ? tApp : tApp2;
  const currentView = views[activeView];

  return (
    <section aria-label="Mobile app" className="section-padding bg-muted/20">
      <div className="container-wide">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            {tApp('title')}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            {tApp('description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center max-w-6xl mx-auto">
          {/* Phone mockup with view toggle */}
          <div className="flex flex-col items-center gap-6 order-2 lg:order-1">
            <div className="relative max-w-[280px] sm:max-w-[320px]">
              {/* Soft radial glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-teal-500/10 blur-3xl rounded-full scale-125" />

              {/* Phone frame with subtle perspective tilt */}
              <div className="relative" style={{ transform: 'perspective(1000px) rotateY(-3deg)' }}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-border/30 bg-card">
                  <div
                    className="transition-opacity duration-500"
                    style={{ opacity: 1 }}
                  >
                    <Image
                      src={currentView.image}
                      alt={activeT('imageAlt')}
                      width={375}
                      height={812}
                      className="w-full h-auto"
                      loading="lazy"
                      quality={85}
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* View toggle pills */}
            <div className="flex gap-2 p-1 rounded-full bg-muted/60 border border-border/40">
              {views.map((view, i) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(i)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200',
                    activeView === i
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {i === 0 ? tApp('badge') : tApp2('badge')}
                </button>
              ))}
            </div>
          </div>

          {/* Features list */}
          <div className="order-1 lg:order-2">
            <div className="space-y-5 mb-8">
              {['feature1', 'feature2', 'feature3', 'feature4'].map((key, index) => (
                <div key={key} className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {featureIcons[index]}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-0.5">
                      {activeT(`${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeT(`${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              {activeT('cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
