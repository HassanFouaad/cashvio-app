import { SectionHeader } from './section-header';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  subtitle?: string;
  items: FaqItem[];
}

/**
 * Uniform FAQ block: flat bordered disclosure rows.
 * Pairs with an FAQPage schema emitted by the page.
 */
export function FaqSection({ title, subtitle, items }: FaqSectionProps) {
  return (
    <section aria-label={title} className="section-padding-sm">
      <div className="container-wide">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border bg-card"
            >
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden p-5 flex items-center justify-between gap-4">
                <h3 className="text-sm sm:text-base font-medium text-foreground">
                  {item.question}
                </h3>
                <svg
                  className="w-4 h-4 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </summary>
              <div className="px-5 pb-5 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
