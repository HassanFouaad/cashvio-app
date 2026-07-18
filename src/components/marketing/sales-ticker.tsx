'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';

interface SalesTickerProps {
  className?: string;
}

/**
 * Slow endless feed of simulated shop activity in receipt mono — the
 * "live register" strip. Content is duplicated once for a seamless
 * loop; the global reduced-motion rule freezes it.
 */
export function SalesTicker({ className }: SalesTickerProps) {
  const t = useTranslations('home.ticker');
  const lines = t.raw('lines') as string[];
  const doubled = [...lines, ...lines];

  return (
    <div
      aria-hidden="true"
      dir="ltr"
      className={cn('overflow-hidden border-y border-border bg-card', className)}
    >
      <div className="flex w-max animate-ticker py-2.5">
        {doubled.map((line, index) => (
          <span
            key={index}
            className="font-receipt text-xs text-muted-foreground whitespace-nowrap pe-12"
          >
            <span className="text-primary pe-3">*</span>
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}
