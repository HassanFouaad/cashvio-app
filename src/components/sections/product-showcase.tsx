'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ProductShowcaseProps {
  locale: string;
}

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
  );
}

function SimpleFeatureList({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <div className="space-y-4">
      {featureKeys.map((key) => (
        <div key={key} className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <CheckIcon />
          </div>
          <p className="text-foreground font-medium leading-relaxed">{t(key)}</p>
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
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
            <CheckIcon />
          </div>
          <div>
            <h4 className="text-base font-semibold text-foreground mb-0.5">
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

export function ProductShowcase({ locale }: ProductShowcaseProps) {
  const t = useTranslations('home.productShowcase');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex];

  return (
    <section
      aria-label="Product showcase"
      className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container-wide">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Pill tabs */}
        <div className="flex justify-center mb-10 sm:mb-14">
          <div className="inline-flex gap-1.5 p-1.5 rounded-full bg-muted/60 border border-border/40">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`
                  px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium
                  transition-all duration-300 ease-out whitespace-nowrap
                  ${
                    index === activeIndex
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                {t(`tabs.${tab.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content with crossfade */}
        <div className="relative">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`
                transition-opacity duration-500 ease-in-out
                ${index === activeIndex ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'}
              `}
              aria-hidden={index !== activeIndex}
            >
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                {/* Image */}
                <div className="order-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/15 to-purple-500/10 blur-3xl rounded-3xl" />
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Features */}
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
