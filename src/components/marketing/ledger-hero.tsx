import { type ReactNode } from 'react';
import { TrackedButtonLink } from '@/lib/analytics';
import { ReceiptStamp } from './receipt-stamp';

interface LedgerHeroAction {
  label: string;
  href: string;
  /** Override default track name (primary = get_started, secondary = view_pricing) */
  trackName?: string;
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
  /** Optional right-column visual (e.g. industry printer receipt) */
  aside?: ReactNode;
  children?: ReactNode;
  /** Analytics location, e.g. "features/free-pos", "industries/cafe" */
  trackLocation?: string;
}

/**
 * Sub-page hero in the ledger voice: left-aligned on ruled ledger paper,
 * mono annotation with a rule to the edge, tear-off bottom border.
 * Pass `aside` for a homepage-style two-column layout with a printer receipt.
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
  aside,
  children,
  trackLocation,
}: LedgerHeroProps) {
  const copy = (
    <div className={aside ? undefined : 'max-w-3xl'}>
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
              <TrackedButtonLink
                size="lg"
                href={primaryAction.href}
                className="w-full sm:w-auto"
                trackName={primaryAction.trackName ?? 'get_started'}
                trackLocation={trackLocation}
              >
                {primaryAction.label}
              </TrackedButtonLink>
            )}
            {secondaryAction && (
              <TrackedButtonLink
                variant="outline"
                size="lg"
                href={secondaryAction.href}
                className="w-full sm:w-auto"
                trackName={secondaryAction.trackName ?? 'view_pricing'}
                trackLocation={trackLocation}
              >
                {secondaryAction.label}
              </TrackedButtonLink>
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
  );

  return (
    <section aria-label={title} className="ledger-rules overflow-hidden">
      <div className="container-wide pt-14 sm:pt-16 md:pt-20 pb-12 sm:pb-14">
        {aside ? (
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            {copy}
            <div className="animate-fade-up animate-delay-200">{aside}</div>
          </div>
        ) : (
          copy
        )}
      </div>
      <div className="tear-line" aria-hidden="true" />
    </section>
  );
}
