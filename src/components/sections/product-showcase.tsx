'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ThemedShot } from '@/components/ui/themed-shot';
import { cn } from '@/lib/utils/cn';

type FeatureStyle = 'simple' | 'detailed';

interface TabConfig {
  id: string;
  base: string;
  namespace: string;
  featureStyle: FeatureStyle;
}

const tabs: TabConfig[] = [
  { id: 'dashboard', base: '/assets/dashboard', namespace: 'home.platformPreview', featureStyle: 'simple' },
  { id: 'orders', base: '/assets/orders', namespace: 'home.ordersShowcase', featureStyle: 'detailed' },
  { id: 'analytics', base: '/assets/analytics', namespace: 'home.analyticsShowcase', featureStyle: 'detailed' },
  { id: 'customers', base: '/assets/customers', namespace: 'home.customerManagement', featureStyle: 'simple' },
  { id: 'aiAssistant', base: '/assets/dashboard', namespace: 'home.aiAssistantShowcase', featureStyle: 'detailed' },
];

const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4'] as const;

function SimpleFeatureList({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <ul className="space-y-4">
      {featureKeys.map((key) => (
        <li key={key} className="flex items-baseline gap-3">
          <span className="font-receipt text-sm text-primary shrink-0" aria-hidden="true">
            [✓]
          </span>
          <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
            {t(key)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function DetailedFeatureList({ namespace }: { namespace: string }) {
  const t = useTranslations(namespace);

  return (
    <ul className="space-y-5">
      {featureKeys.map((key) => (
        <li key={key} className="flex items-baseline gap-3">
          <span className="font-receipt text-sm text-primary shrink-0" aria-hidden="true">
            [✓]
          </span>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-foreground mb-0.5">
              {t(`${key}.title`)}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t(`${key}.description`)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProductShowcase() {
  const t = useTranslations('home.productShowcase');
  const locale = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section aria-label="Product showcase" className="section-padding">
      <div className="container-wide">
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="mono-label text-primary shrink-0">{t('eyebrow')}</span>
            <span className="tear-line flex-1" aria-hidden="true" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground max-w-2xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t('subtitle')}
          </p>
        </div>

        {/* Receipt stubs as tabs, torn off above a tear line */}
        <div className="flex gap-1.5 overflow-x-auto px-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'receipt-edge-top mono-label px-4 sm:px-5 pt-3.5 pb-2.5 whitespace-nowrap transition-colors duration-200',
                index === activeIndex
                  ? 'bg-card text-primary'
                  : 'bg-muted/70 text-muted-foreground hover:text-foreground'
              )}
            >
              {t(`tabs.${tab.id}`)}
            </button>
          ))}
        </div>
        <div className="tear-line mb-10" aria-hidden="true" />

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
                    <div className="flex items-center justify-between gap-4 px-4 py-2 border-b border-dashed border-ledger-line">
                      <span className="mono-label text-muted-foreground">
                        {t(`tabs.${tab.id}`)}
                      </span>
                      <span
                        className="font-receipt text-[11px] text-muted-foreground"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, '0')}/{String(tabs.length).padStart(2, '0')}
                      </span>
                    </div>
                    <ThemedShot
                      base={tab.base}
                      locale={locale}
                      alt={t(`tabs.${tab.id}`)}
                      width={2880}
                      height={1800}
                      priority={index === 0}
                      quality={95}
                      sizes="(max-width: 1024px) 100vw, 1200px"
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
