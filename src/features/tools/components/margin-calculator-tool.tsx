'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

type CalculatorMode = 'analyze' | 'price';

const MAX_MARGIN_PERCENT = 99.99;

function parsePositiveNumber(raw: string): number | null {
  if (!raw.trim()) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
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
 * Free profit-margin calculator with two modes:
 * - analyze: cost + selling price -> profit, margin %, markup %
 * - price:   cost + target margin -> required selling price
 *
 * Currency-agnostic — plain numbers, English digits (site-wide convention).
 */
export function MarginCalculatorTool() {
  const t = useTranslations('marginCalculator.tool');

  const [mode, setMode] = React.useState<CalculatorMode>('analyze');
  const [cost, setCost] = React.useState('100');
  const [price, setPrice] = React.useState('150');
  const [targetMargin, setTargetMargin] = React.useState('30');

  const costValue = parsePositiveNumber(cost);
  const priceValue = parsePositiveNumber(price);
  const marginValue = parsePositiveNumber(targetMargin);

  let results: ResultLine[] = [];
  let warning: string | null = null;

  if (mode === 'analyze' && costValue !== null && priceValue !== null) {
    const profit = priceValue - costValue;
    const margin = (profit / priceValue) * 100;
    const markup = (profit / costValue) * 100;

    if (profit < 0) warning = t('sellingBelowCost');

    results = [
      { key: 'profit', value: formatNumber(profit) },
      { key: 'margin', value: `${formatNumber(margin)}%` },
      { key: 'markup', value: `${formatNumber(markup)}%`, isTotal: true },
    ];
  }

  if (mode === 'price' && costValue !== null && marginValue !== null) {
    if (marginValue > MAX_MARGIN_PERCENT) {
      warning = t('marginTooHigh');
    } else {
      const requiredPrice = costValue / (1 - marginValue / 100);
      const profit = requiredPrice - costValue;

      results = [
        { key: 'profit', value: formatNumber(profit) },
        { key: 'markup', value: `${formatNumber((profit / costValue) * 100)}%` },
        { key: 'requiredPrice', value: formatNumber(requiredPrice), isTotal: true },
      ];
    }
  }

  return (
    <div className="receipt-edge bg-card px-6 py-8 sm:px-8 max-w-2xl mx-auto">
      {/* Mode switch */}
      <div className="grid grid-cols-2 gap-2 mb-6" role="tablist" aria-label={t('modeLabel')}>
        {(['analyze', 'price'] as const).map((option) => (
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
          <label htmlFor="calc-cost" className="block mono-label text-muted-foreground">
            {t('costLabel')}
          </label>
          <input
            id="calc-cost"
            type="text"
            inputMode="decimal"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="paper-input"
            placeholder="0.00"
            dir="ltr"
          />
        </div>

        {mode === 'analyze' ? (
          <div className="space-y-2">
            <label htmlFor="calc-price" className="block mono-label text-muted-foreground">
              {t('priceLabel')}
            </label>
            <input
              id="calc-price"
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="paper-input"
              placeholder="0.00"
              dir="ltr"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label htmlFor="calc-margin" className="block mono-label text-muted-foreground">
              {t('targetMarginLabel')}
            </label>
            <input
              id="calc-margin"
              type="text"
              inputMode="decimal"
              value={targetMargin}
              onChange={(e) => setTargetMargin(e.target.value)}
              className="paper-input"
              placeholder="30"
              dir="ltr"
            />
          </div>
        )}

        {warning && (
          <p className="font-receipt text-xs text-destructive" role="alert">
            {warning}
          </p>
        )}

        {/* Results printed as receipt summary lines */}
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
                  <dt className={line.isTotal ? 'text-foreground uppercase tracking-wide' : 'text-muted-foreground'}>
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
