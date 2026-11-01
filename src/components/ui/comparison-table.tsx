import * as React from "react";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type CellValue = string | number | boolean | null | React.ReactNode;

interface ComparisonColumn {
  key: string;
  label: string;
  highlight?: boolean;
}

interface ComparisonRow {
  label: string;
  values: Record<string, CellValue>;
  isImportant?: boolean;
}

interface ComparisonTableProps {
  columns: ComparisonColumn[];
  rows: ComparisonRow[];
  className?: string;
}

function renderCell(value: CellValue) {
  if (value === true)  return <Check className="h-4 w-4 text-green-600 mx-auto" aria-label="Ja" />;
  if (value === false) return <X    className="h-4 w-4 text-red-500 mx-auto"   aria-label="Nein" />;
  if (value === null)  return <Minus className="h-4 w-4 text-[var(--muted-foreground)] mx-auto" aria-label="Keine Angabe" />;
  return value;
}

function ComparisonTable({ columns, rows, className }: ComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-[var(--border)]", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
            <th className="py-3 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Merkmal
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider",
                  col.highlight
                    ? "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-[var(--muted-foreground)]"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={cn(
                "border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--muted)]/50",
                row.isImportant && "font-medium"
              )}
            >
              <td className={cn(
                "py-3 pl-4 pr-3 text-[var(--foreground)]",
                row.isImportant ? "font-semibold" : "font-normal"
              )}>
                {row.label}
              </td>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-center text-[var(--foreground)] tabular-nums",
                    col.highlight && "bg-blue-50/50 dark:bg-blue-900/10"
                  )}
                >
                  {renderCell(row.values[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { ComparisonTable };
export type { ComparisonColumn, ComparisonRow };
