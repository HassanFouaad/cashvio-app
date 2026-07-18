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

const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4'] as const;

export function MobileAppShowcase() {
  const [activeView, setActiveView] = useState(0);
  const tApp = useTranslations('home.mobileApp');
  const tApp2 = useTranslations('home.mobileApp2');

  const activeT = activeView === 0 ? tApp : tApp2;
  const currentView = views[activeView];

  return (
    <section aria-label="Mobile app" className="section-padding-sm ledger-rules border-y border-border">
      <div className="container-wide">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="mono-label text-primary shrink-0">{tApp('eyebrow')}</span>
            <span className="tear-line flex-1" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground max-w-2xl">
            {tApp('title')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {tApp('description')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
          {/* Handheld terminal with view toggle */}
          <div className="flex flex-col items-center gap-5 order-2 lg:order-1">
            <div className="rounded-[2rem] bg-chassis p-2.5 w-full max-w-[270px] sm:max-w-[300px]">
              <div className="rounded-[1.4rem] overflow-hidden bg-card">
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
              <div className="w-16 h-1 rounded-full bg-background/40 mx-auto mt-2" aria-hidden="true" />
            </div>

            <div className="flex gap-2">
              {views.map((view, index) => (
                <button
                  key={view.id}
                  type="button"
                  onClick={() => setActiveView(index)}
                  className={cn(
                    'mono-label px-4 py-2 border border-dashed transition-colors duration-200',
                    activeView === index
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-ledger-line text-muted-foreground hover:text-foreground'
                  )}
                >
                  {index === 0 ? tApp('badge') : tApp2('badge')}
                </button>
              ))}
            </div>
          </div>

          {/* Ledger entries */}
          <div className="order-1 lg:order-2">
            <div className="border-t border-dashed border-ledger-line mb-8">
              {featureKeys.map((key, index) => (
                <div key={key} className="flex gap-4 py-4 border-b border-dashed border-ledger-line">
                  <span
                    className="font-receipt text-sm text-primary pt-0.5 shrink-0 w-7"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
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
