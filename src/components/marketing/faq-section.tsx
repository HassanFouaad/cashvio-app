import { LedgerHeading } from './ledger-heading';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  subtitle?: string;
  /** Already-localized mono annotation, e.g. "NO. 05 — QUESTIONS" */
  eyebrow?: string;
  items: FaqItem[];
}

/**
 * FAQ as numbered ledger entries: mono index, dashed separators,
 * disclosure rows that unfold like receipt stubs.
 * Pairs with an FAQPage schema emitted by the page.
 */
export function FaqSection({ title, subtitle, eyebrow, items }: FaqSectionProps) {
  return (
    <section aria-label={title} className="section-padding-sm">
      <div className="container-wide">
        <LedgerHeading title={title} subtitle={subtitle} eyebrow={eyebrow} />
        <div className="max-w-3xl border-t border-dashed border-ledger-line">
          {items.map((item, index) => (
            <details
              key={item.question}
              className="group border-b border-dashed border-ledger-line"
            >
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden py-5 flex items-baseline gap-4">
                <span className="font-receipt text-sm text-primary shrink-0" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="flex-1 text-sm sm:text-base font-medium text-foreground">
                  {item.question}
                </h3>
                <span
                  className="font-receipt text-muted-foreground text-base leading-none select-none group-open:hidden"
                  aria-hidden="true"
                >
                  +
                </span>
                <span
                  className="font-receipt text-muted-foreground text-base leading-none select-none hidden group-open:inline"
                  aria-hidden="true"
                >
                  −
                </span>
              </summary>
              <div className="pb-5 ps-9">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
