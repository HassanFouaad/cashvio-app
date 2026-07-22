'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type CalculatorMode = 'percentOff' | 'findPercent';

function parsePositiveNumber(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function parseNonNegativeNumber(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

interface ResultLine {
  key: string;
  value: string;
  isTotal?: boolean;
}

/**
 * Free discount calculator with two modes:
 * - percentOff: original + % off -> final price and savings
 * - findPercent: original + sale price -> discount % and savings
 *
 * Currency-agnostic — plain numbers, English digits (site-wide convention).
 */
export function DiscountCalculatorTool() {
  const t = useTranslations('discountCalculator.tool');

  const [mode, setMode] = React.useState<CalculatorMode>('percentOff');
  const [original, setOriginal] = React.useState('100');
  const [percent, setPercent] = React.useState('20');
  const [salePrice, setSalePrice] = React.useState('80');

  const originalValue = parsePositiveNumber(original);
  const percentValue = parseNonNegativeNumber(percent);
  const saleValue = parsePositiveNumber(salePrice);

  let results: ResultLine[] = [];
  let warning: string | null = null;

  if (mode === 'percentOff' && originalValue !== null && percentValue !== null) {
    if (percentValue > 100) {
      warning = t('percentTooHigh');
    } else {
      const savings = originalValue * (percentValue / 100);
      const finalPrice = originalValue - savings;

      results = [
        { key: 'savings', value: formatNumber(savings) },
        { key: 'discountPercent', value: `${formatNumber(percentValue)}%` },
        { key: 'finalPrice', value: formatNumber(finalPrice), isTotal: true },
      ];
    }
  }

  if (mode === 'findPercent' && originalValue !== null && saleValue !== null) {
    if (saleValue > originalValue) {
      warning = t('saleAboveOriginal');
    } else {
      const savings = originalValue - saleValue;
      const discountPercent = (savings / originalValue) * 100;

      results = [
        { key: 'savings', value: formatNumber(savings) },
        { key: 'discountPercent', value: `${formatNumber(discountPercent)}%` },
        { key: 'finalPrice', value: formatNumber(saleValue), isTotal: true },
      ];
    }
  }

  return (
    <div className="receipt-edge bg-card px-6 py-8 sm:px-8 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-2 mb-6" role="tablist" aria-label={t('modeLabel')}>
        {(['percentOff', 'findPercent'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={mode === option}
            onClick={() => setMode(option)}
            className={cn(
              'h-11 px-3 rounded-lg text-sm font-medium transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary/30',
              mode === option
                ? 'bg-primary text-primary-foreground'
                : 'border border-dashed border-ledger-line text-muted-foreground hover:text-foreground'
            )}
          >
            {t(`modes.${option}`)}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="discount-original" className="block mono-label text-muted-foreground">
            {t('originalLabel')}
          </label>
          <input
            id="discount-original"
            type="text"
            inputMode="decimal"
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="paper-input"
            placeholder="0.00"
            dir="ltr"
          />
        </div>

        {mode === 'percentOff' ? (
          <div className="space-y-2">
            <label htmlFor="discount-percent" className="block mono-label text-muted-foreground">
              {t('percentLabel')}
            </label>
            <input
              id="discount-percent"
              type="text"
              inputMode="decimal"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="paper-input"
              placeholder="20"
              dir="ltr"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="discount-sale" className="block mono-label text-muted-foreground">
              {t('salePriceLabel')}
            </label>
            <input
              id="discount-sale"
              type="text"
              inputMode="decimal"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="paper-input"
              placeholder="0.00"
              dir="ltr"
            />
          </div>
        )}

        {warning && (
          <p className="font-receipt text-xs text-destructive" role="alert">
            {warning}
          </p>
        )}

        <div className="border-t border-dashed border-ledger-line pt-5">
          {results.length > 0 ? (
            <dl className="space-y-2.5">
              {results.map((line) => (
                <div
                  key={line.key}
                  className={cn(
                    'flex items-baseline gap-3 text-sm',
                    line.isTotal &&
                      'font-semibold border-t border-dashed border-ledger-line pt-3 mt-3'
                  )}
                >
                  <dt
                    className={
                      line.isTotal ? 'text-foreground uppercase tracking-wide' : 'text-muted-foreground'
                    }
                  >
                    {t(`results.${line.key}`)}
                  </dt>
                  <span className="tear-line flex-1 self-center" aria-hidden="true" />
                  <dd
                    className={cn(
                      'font-receipt',
                      line.isTotal ? 'text-primary text-base' : 'text-foreground'
                    )}
                    dir="ltr"
                  >
                    {line.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="font-receipt text-sm text-muted-foreground text-center">
              {t('emptyState')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
