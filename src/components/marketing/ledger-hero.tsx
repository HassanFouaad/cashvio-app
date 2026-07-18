import { type ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { ReceiptStamp } from './receipt-stamp';

interface LedgerHeroAction {
  label: string;
  href: string;
}

interface LedgerHeroProps {
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  /** Already-localized mono annotation, e.g. "PAGE 02 — FEATURES" */
  eyebrow?: string;
  primaryAction?: LedgerHeroAction;
  secondaryAction?: LedgerHeroAction;
  note?: string;
  /** Tilted stamp beside the actions, e.g. "FREE FOREVER" */
  stamp?: string;
  children?: ReactNode;
}

/**
 * Sub-page hero in the ledger voice: left-aligned on ruled ledger paper,
 * mono annotation with a rule to the edge, tear-off bottom border.
 */
export function LedgerHero({
  title,
  titleHighlight,
  subtitle,
  eyebrow,
  primaryAction,
  secondaryAction,
  note,
  stamp,
  children,
}: LedgerHeroProps) {
  return (
    <section aria-label={title} className="ledger-rules overflow-hidden">
      <div className="container-wide pt-14 sm:pt-16 md:pt-20 pb-12 sm:pb-14">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="animate-fade-up flex items-center gap-4 mb-5">
              <span className="mono-label text-primary shrink-0">{eyebrow}</span>
              <span className="tear-line flex-1" aria-hidden="true" />
            </div>
          )}
          <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.12]">
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span className="text-primary">{titleHighlight}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p className="animate-fade-up animate-delay-100 mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
          {(primaryAction || secondaryAction || stamp) && (
            <div className="animate-fade-up animate-delay-200 mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                {primaryAction && (
                  <ButtonLink size="lg" href={primaryAction.href} className="w-full sm:w-auto">
                    {primaryAction.label}
                  </ButtonLink>
                )}
                {secondaryAction && (
                  <ButtonLink
                    variant="outline"
                    size="lg"
                    href={secondaryAction.href}
                    className="w-full sm:w-auto"
                  >
                    {secondaryAction.label}
                  </ButtonLink>
                )}
              </div>
              {stamp && <ReceiptStamp className="self-center sm:ms-2">{stamp}</ReceiptStamp>}
            </div>
          )}
          {note && (
            <p className="animate-fade-up animate-delay-300 mt-5 font-receipt text-xs sm:text-sm text-muted-foreground">
              {note}
            </p>
          )}
          {children}
        </div>
      </div>
      <div className="tear-line" aria-hidden="true" />
    </section>
  );
}
