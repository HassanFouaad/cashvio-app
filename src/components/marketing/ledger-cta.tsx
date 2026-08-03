import { TrackedButtonLink } from '@/lib/analytics';
import { ReceiptStamp } from './receipt-stamp';

interface LedgerCtaAction {
  label: string;
  href: string;
  /** Override default track name (primary = get_started, secondary = view_pricing) */
  trackName?: string;
}

interface LedgerCtaLine {
  label: string;
  value: string;
}

interface LedgerCtaProps {
  title: string;
  subtitle?: string;
  primaryAction: LedgerCtaAction;
  secondaryAction?: LedgerCtaAction;
  /** Receipt summary lines with dotted leaders ("Setup fee ..... 0.00") */
  lines?: LedgerCtaLine[];
  /** Bold TOTAL row printed under the summary lines */
  total?: LedgerCtaLine;
  /** Tilted stamp in the corner of the receipt, e.g. "FREE FOREVER" */
  stamp?: string;
  note?: string;
  /** Analytics location, e.g. "home_cta", "features/free-pos" */
  trackLocation?: string;
}

/**
 * The single closing CTA of the ledger identity: an end-of-day receipt.
 * Perforated paper, dotted summary leaders, a TOTAL row, one primary
 * action ("print") and a barcode footer. Identical on every page.
 */
export function LedgerCta({
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  lines,
  total,
  stamp,
  note,
  trackLocation,
}: LedgerCtaProps) {
  return (
    <section aria-label={title} className="section-padding-sm bg-muted/40 border-t border-border">
      <div className="container-wide">
        <div className="receipt-edge bg-card relative max-w-xl mx-auto px-6 sm:px-10 py-10 sm:py-12">
          {stamp && (
            <ReceiptStamp className="absolute top-7 end-5 sm:end-7 rotate-6">
              {stamp}
            </ReceiptStamp>
          )}

          <p className="font-receipt text-xs text-muted-foreground text-center tracking-[0.3em] select-none" aria-hidden="true">
            * * * * * * * * * * * *
          </p>

          <h2 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground text-center">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base text-muted-foreground text-center leading-relaxed">
              {subtitle}
            </p>
          )}

          {lines && lines.length > 0 && (
            <dl className="mt-8 space-y-2.5">
              {Array.isArray(lines) && lines.map((line) => (
                <div key={line.label} className="flex items-baseline gap-3 text-sm">
                  <dt className="text-muted-foreground">{line.label}</dt>
                  <span className="tear-line flex-1 self-center" aria-hidden="true" />
                  <dd className="font-receipt text-foreground">{line.value}</dd>
                </div>
              ))}
              {total && (
                <div className="flex items-baseline gap-3 text-sm font-semibold border-t border-dashed border-ledger-line pt-3 mt-3">
                  <dt className="text-foreground uppercase tracking-wide">{total.label}</dt>
                  <span className="flex-1" />
                  <dd className="font-receipt text-primary text-base">{total.value}</dd>
                </div>
              )}
            </dl>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <TrackedButtonLink
              size="lg"
              href={primaryAction.href}
              className="w-full"
              trackName={primaryAction.trackName ?? 'get_started'}
              trackLocation={trackLocation}
            >
              {primaryAction.label}
            </TrackedButtonLink>
            {secondaryAction && (
              <TrackedButtonLink
                variant="outline"
                size="lg"
                href={secondaryAction.href}
                className="w-full"
                trackName={secondaryAction.trackName ?? 'view_pricing'}
                trackLocation={trackLocation}
              >
                {secondaryAction.label}
              </TrackedButtonLink>
            )}
          </div>

          {note && (
            <p className="mt-5 font-receipt text-xs text-muted-foreground text-center">
              {note}
            </p>
          )}

          <div className="barcode w-36 mx-auto mt-8 text-foreground/60" aria-hidden="true" />
          <p className="mono-label text-muted-foreground text-center mt-2" aria-hidden="true">
            cash-vio.com
          </p>
        </div>
      </div>
    </section>
  );
}
