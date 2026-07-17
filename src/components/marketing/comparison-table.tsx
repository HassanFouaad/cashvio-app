interface ComparisonRow {
  feature: string;
  cashvio: string;
  others: string;
}

interface ComparisonTableProps {
  headers: {
    feature: string;
    cashvio: string;
    others: string;
  };
  rows: ComparisonRow[];
}

/**
 * Uniform comparison table: flat bordered container, muted header row,
 * primary check for Cashvio, neutral dash for alternatives.
 */
export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="max-w-4xl mx-auto overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-start p-4 font-semibold text-foreground w-[34%]">
              {headers.feature}
            </th>
            <th className="text-start p-4 font-semibold text-primary w-[33%]">
              {headers.cashvio}
            </th>
            <th className="text-start p-4 font-semibold text-muted-foreground w-[33%]">
              {headers.others}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.feature}
              className={index < rows.length - 1 ? 'border-b border-border' : undefined}
            >
              <td className="p-4 font-medium text-foreground align-top">{row.feature}</td>
              <td className="p-4 text-foreground align-top">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-primary flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{row.cashvio}</span>
                </div>
              </td>
              <td className="p-4 text-muted-foreground align-top">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-muted-foreground/60 flex-shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                  </svg>
                  <span>{row.others}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
