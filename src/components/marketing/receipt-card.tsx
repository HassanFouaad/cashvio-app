import { type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';
import { PriceTag } from './price-tag';

interface ReceiptCardProps {
  title: string;
  /** Mono annotation printed at the top of the slip, e.g. "ITEM 03" */
  code?: string;
  description?: string;
  /** Receipt line items listed under the description */
  lines?: string[];
  /** Rendered as price tags at the bottom of the slip */
  tags?: string[];
  /** Mono value printed opposite the code, e.g. "0.00" or "✓" */
  value?: string;
  footer?: ReactNode;
  className?: string;
}

/**
 * The single card treatment of the ledger identity: a slip of receipt
 * paper with perforated top/bottom edges, a mono header row and a
 * tear-line separator. No borders, no shadows — paper on the counter.
 */
export function ReceiptCard({
  title,
  code,
  description,
  lines,
  tags,
  value,
  footer,
  className,
}: ReceiptCardProps) {
  return (
    <article className={cn('receipt-edge bg-card px-5 py-6 sm:px-6', className)}>
      {(code || value) && (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="mono-label text-muted-foreground">{code}</span>
            {value && <span className="font-receipt text-xs text-primary">{value}</span>}
          </div>
          <div className="tear-line my-3" aria-hidden="true" />
        </>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {lines && lines.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {Array.isArray(lines) && lines.map((line) => (
            <li
              key={line}
              className="flex items-baseline gap-2 text-[13px] text-muted-foreground"
            >
              <span className="font-receipt text-primary" aria-hidden="true">
                +
              </span>
              <span className="flex-1 leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {tags.map((tag) => (
            <PriceTag key={tag}>{tag}</PriceTag>
          ))}
        </div>
      )}
      {footer && <div className="mt-5">{footer}</div>}
    </article>
  );
}
