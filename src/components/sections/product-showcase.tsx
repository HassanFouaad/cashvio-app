'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

type FeatureStyle = 'simple' | 'detailed';

interface TabConfig {
  id: string;
  image: string;
  namespace: string;
  featureStyle: FeatureStyle;
}

const tabs: TabConfig[] = [
  { id: 'dashboard', image: '/assets/portal.png', namespace: 'home.platformPreview', featureStyle: 'simple' },
  { id: 'orders', image: '/assets/portal.png', namespace: 'home.ordersShowcase', featureStyle: 'detailed' },
  { id: 'analytics', image: '/assets/portal2.png', namespace: 'home.analyticsShowcase', featureStyle: 'detailed' },
  { id: 'customers', image: '/assets/portal2.png', namespace: 'home.customerManagement', featureStyle: 'simple' },
];

const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4'] as const;

function CheckIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-primary"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function SimpleFeatureList({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <div className="space-y-4">
      {featureKeys.map((key) => (
        <div key={key} className="flex items-start gap-3">
          <span className="flex w-6 h-6 rounded-full bg-primary/10 items-center justify-center flex-shrink-0 mt-0.5">
            <CheckIcon />
          </span>
          <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">{t(key)}</p>
        </div>
      ))}
    </div>
  );
}

function DetailedFeatureList({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <div className="space-y-5">
      {featureKeys.map((key) => (
        <div key={key} className="flex items-start gap-3">
          <span className="flex w-6 h-6 rounded-full bg-primary/10 items-center justify-center flex-shrink-0 mt-0.5">
            <CheckIcon />
          </span>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-0.5">
              {t(`${key}.title`)}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`${key}.description`)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductShowcase() {
  const t = useTranslations('home.productShowcase');
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section aria-label="Product showcase" className="section-padding">
      <div className="container-wide">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Segmented tab control */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-1 p-1 rounded-lg bg-muted border border-border overflow-x-auto max-w-full">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'px-4 sm:px-5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-200',
                  index === activeIndex
                    ? 'bg-card text-foreground border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {t(`tabs.${tab.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="relative">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={cn(
                'transition-opacity duration-300 ease-in-out',
                index === activeIndex
                  ? 'opacity-100 relative z-10'
                  : 'opacity-0 absolute inset-0 z-0 pointer-events-none'
              )}
              aria-hidden={index !== activeIndex}
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="order-1">
                  <div className="rounded-xl overflow-hidden border border-border bg-card">
                    <Image
                      src={tab.image}
                      alt={t(`tabs.${tab.id}`)}
                      width={1200}
                      height={800}
                      className="w-full h-auto"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      quality={85}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    />
                  </div>
                </div>

                <div className="order-2">
                  {tab.featureStyle === 'simple' ? (
                    <SimpleFeatureList namespace={tab.namespace} />
                  ) : (
                    <DetailedFeatureList namespace={tab.namespace} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
