interface PlanMatrixCell {
  /** true = included (✓), false = not included (—), string = printed as-is */
  value: boolean | string;
}

interface PlanMatrixRow {
  feature: string;
  free: PlanMatrixCell['value'];
  paid: PlanMatrixCell['value'];
}

interface PlanMatrixProps {
  headers: {
    feature: string;
    free: string;
    paid: string;
  };
  rows: PlanMatrixRow[];
}

function MatrixCell({ value }: PlanMatrixCell) {
  if (value === true) {
    return (
      <span className="font-receipt text-primary" aria-label="included">
        [✓]
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="font-receipt text-muted-foreground/60" aria-label="not included">
        [—]
      </span>
    );
  }
  return <span className="text-foreground">{value}</span>;
}

/**
 * Free-vs-paid plan comparison in the ledger voice: same receipt-spread
 * treatment as ComparisonTable but with neutral columns (both are Cashvio),
 * so paid tiers read as "everything in free, plus room to grow".
 */
export function PlanMatrix({ headers, rows }: PlanMatrixProps) {
  return (
    <div className="max-w-4xl mx-auto overflow-x-auto receipt-edge bg-card px-2 sm:px-4 py-4">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-dashed border-ledger-line">
            <th className="text-start p-4 mono-label text-muted-foreground w-[40%]">
              {headers.feature}
            </th>
            <th className="text-start p-4 mono-label text-primary w-[30%]">{headers.free}</th>
            <th className="text-start p-4 mono-label text-foreground w-[30%]">{headers.paid}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.feature}
              className={
                index < rows.length - 1
                  ? 'border-b border-dashed border-ledger-line'
                  : undefined
              }
            >
              <td className="p-4 font-medium text-foreground align-top">{row.feature}</td>
              <td className="p-4 align-top">
                <MatrixCell value={row.free} />
              </td>
              <td className="p-4 align-top">
                <MatrixCell value={row.paid} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
