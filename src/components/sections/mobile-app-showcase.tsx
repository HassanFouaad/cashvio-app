'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils/cn';
import { buttonVariants } from '@/components/ui/button';

const views = [
  { id: 'pos', image: '/assets/mobile1.png' },
  { id: 'management', image: '/assets/mobile2.png' },
] as const;

const featureIcons = [
  <svg key="f1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>,
  <svg key="f2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>,
  <svg key="f3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>,
  <svg key="f4" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
];

export function MobileAppShowcase() {
  const [activeView, setActiveView] = useState(0);
  const tApp = useTranslations('home.mobileApp');
  const tApp2 = useTranslations('home.mobileApp2');

  const activeT = activeView === 0 ? tApp : tApp2;
  const currentView = views[activeView];

  return (
    <section aria-label="Mobile app" className="section-padding-sm bg-muted/40 border-y border-border">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
            {tApp('title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {tApp('description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
          {/* Phone screenshot with view toggle */}
          <div className="flex flex-col items-center gap-5 order-2 lg:order-1">
            <div className="max-w-[260px] sm:max-w-[300px] rounded-2xl overflow-hidden border border-border bg-card">
              <Image
                src={currentView.image}
                alt={activeT('imageAlt')}
                width={375}
                height={812}
                className="w-full h-auto"
                loading="lazy"
                quality={85}
                sizes="(max-width: 768px) 260px, 300px"
              />
            </div>

            <div className="inline-flex gap-1 p-1 rounded-lg bg-muted border border-border">
              {views.map((view, index) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(index)}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200',
                    activeView === index
                      ? 'bg-card text-foreground border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {index === 0 ? tApp('badge') : tApp2('badge')}
                </button>
              ))}
            </div>
          </div>

          {/* Features list */}
          <div className="order-1 lg:order-2">
            <div className="space-y-5 mb-8">
              {(['feature1', 'feature2', 'feature3', 'feature4'] as const).map((key, index) => (
                <div key={key} className="flex gap-4 items-start">
                  <span className="flex w-10 h-10 rounded-lg bg-primary/10 text-primary items-center justify-center flex-shrink-0">
                    {featureIcons[index]}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-0.5">
                      {activeT(`${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeT(`${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register" className={buttonVariants({ size: 'lg' })}>
              {activeT('cta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
