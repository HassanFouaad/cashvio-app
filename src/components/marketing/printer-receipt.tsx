import { ReceiptStamp } from './receipt-stamp';

export interface PrinterReceiptItem {
  name: string;
  value: string;
}

interface PrinterReceiptProps {
  title: string;
  number: string;
  items: PrinterReceiptItem[];
  totalLabel: string;
  totalValue: string;
  stamp: string;
  thanks: string;
  /** Decorative only; hide from assistive tech when the page already has a real heading */
  decorative?: boolean;
  className?: string;
}

/**
 * Counter-printer receipt: chassis slot + paper that animates out.
 * Same visual used on the homepage hero; industries pass vertical line items.
 */
export function PrinterReceipt({
  title,
  number,
  items,
  totalLabel,
  totalValue,
  stamp,
  thanks,
  decorative = true,
  className,
}: PrinterReceiptProps) {
  return (
    <div
      className={className ?? 'relative mx-auto w-full max-w-[340px]'}
      {...(decorative ? { 'aria-hidden': true as const } : {})}
    >
      <div className="relative z-10 h-7 rounded-lg bg-chassis flex items-center justify-center">
        <div className="w-3/4 h-1 rounded-full bg-background/50" />
      </div>
      <div className="overflow-hidden px-4">
        <div className="animate-print-out receipt-edge-bottom bg-card px-5 pt-6 pb-7 font-receipt text-[13px] leading-relaxed">
          <p className="text-center text-foreground font-semibold tracking-[0.18em] text-xs uppercase">
            {title}
          </p>
          <p className="text-center text-muted-foreground text-[11px] mt-1">{number}</p>

          <div className="tear-line my-4" />

          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.name} className="flex items-baseline gap-2">
                <span className="text-foreground">{item.name}</span>
                <span className="tear-line flex-1 self-center" />
                <span className="text-muted-foreground">{item.value}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-dashed border-ledger-line mt-4 pt-3 flex items-baseline justify-between font-semibold">
            <span className="uppercase tracking-wide text-foreground">{totalLabel}</span>
            <span className="text-primary">{totalValue}</span>
          </div>

          <div className="mt-5 flex justify-center">
            <ReceiptStamp>{stamp}</ReceiptStamp>
          </div>

          <p className="text-center text-[11px] text-muted-foreground mt-5">{thanks}</p>
          <div className="barcode w-32 mx-auto mt-4 text-foreground/60" />
        </div>
      </div>
    </div>
  );
}
