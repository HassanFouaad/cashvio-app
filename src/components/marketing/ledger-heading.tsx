import { cn } from '@/lib/utils/cn';

interface LedgerHeadingProps {
  title: string;
  /** Already-localized mono annotation, e.g. "NO. 02 — OPENING DAY" */
  eyebrow?: string;
  subtitle?: string;
  align?: 'start' | 'center';
  className?: string;
}

/**
 * Section heading in the ledger voice: a mono entry annotation with a
 * tear-line rule running to the edge, then the title. Left-aligned by
 * default — like an entry written into a day book.
 */
export function LedgerHeading({
  title,
  eyebrow,
  subtitle,
  align = 'start',
  className,
}: LedgerHeadingProps) {
  return (
    <div className={cn('mb-10 sm:mb-12', align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <div
          className={cn(
            'flex items-center gap-4 mb-4',
            align === 'center' && 'justify-center'
          )}
        >
          {align === 'center' && <span className="tear-line flex-1" aria-hidden="true" />}
          <span className="mono-label text-primary shrink-0">{eyebrow}</span>
          <span className="tear-line flex-1" aria-hidden="true" />
        </div>
      )}
      <h2
        className={cn(
          'text-2xl sm:text-3xl font-semibold tracking-tight text-foreground',
          align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-3 text-base sm:text-lg text-muted-foreground leading-relaxed',
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
