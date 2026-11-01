"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  items: FaqItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)] overflow-hidden">
      {items.map(({ q, a }, i) => (
        <div key={i}>
          <button
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span>{q}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition-transform duration-200",
                open === i && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-[var(--muted-foreground)] leading-relaxed">
              {a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
