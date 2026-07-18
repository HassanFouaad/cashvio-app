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
 * Comparison as a ledger spread: two receipt columns tallied side by
 * side. Mono checks for Cashvio, mono dashes for the alternatives,
 * dashed rules between entries.
 */
export function ComparisonTable({ headers, rows }: ComparisonTableProps) {
  return (
    <div className="max-w-4xl mx-auto overflow-x-auto receipt-edge bg-card px-2 sm:px-4 py-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-dashed border-ledger-line">
            <th className="text-start p-4 mono-label text-muted-foreground w-[34%]">
              {headers.feature}
            </th>
            <th className="text-start p-4 mono-label text-primary w-[33%]">
              {headers.cashvio}
            </th>
            <th className="text-start p-4 mono-label text-muted-foreground w-[33%]">
              {headers.others}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.feature}
              className={index < rows.length - 1 ? 'border-b border-dashed border-ledger-line' : undefined}
            >
              <td className="p-4 font-medium text-foreground align-top">{row.feature}</td>
              <td className="p-4 text-foreground align-top">
                <div className="flex items-start gap-2.5">
                  <span className="font-receipt text-primary shrink-0" aria-hidden="true">
                    [✓]
                  </span>
                  <span>{row.cashvio}</span>
                </div>
              </td>
              <td className="p-4 text-muted-foreground align-top">
                <div className="flex items-start gap-2.5">
                  <span className="font-receipt text-muted-foreground/60 shrink-0" aria-hidden="true">
                    [—]
                  </span>
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
