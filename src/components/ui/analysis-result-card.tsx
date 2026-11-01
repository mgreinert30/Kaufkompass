import * as React from "react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { ProgressIndicator } from "./progress-indicator";
import { PriceDisplay } from "./price-display";

type ScoreLevel = "excellent" | "good" | "fair" | "poor";

const scoreConfig: Record<ScoreLevel, {
  label: string;
  badgeVariant: "success" | "primary" | "warning" | "error";
  progressVariant: "success" | "default" | "warning" | "error";
  color: string;
}> = {
  excellent: { label: "Sehr gut",  badgeVariant: "success", progressVariant: "success", color: "text-green-600" },
  good:      { label: "Gut",       badgeVariant: "primary",  progressVariant: "default", color: "text-blue-600"  },
  fair:      { label: "Akzeptabel",badgeVariant: "warning",  progressVariant: "warning", color: "text-amber-600" },
  poor:      { label: "Kritisch",  badgeVariant: "error",    progressVariant: "error",   color: "text-red-600"   },
};

interface AnalysisResultCardProps {
  title: string;
  score: number;
  scoreLevel: ScoreLevel;
  marketPrice?: number;
  offerPrice?: number;
  summary: string;
  highlights?: string[];
  warnings?: string[];
  className?: string;
}

function AnalysisResultCard({
  title,
  score,
  scoreLevel,
  marketPrice,
  offerPrice,
  summary,
  highlights,
  warnings,
  className,
}: AnalysisResultCardProps) {
  const config = scoreConfig[scoreLevel];

  return (
    <div className={cn("card-base p-6 space-y-5", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
        <StatusBadge variant={config.badgeVariant} dot>
          {config.label}
        </StatusBadge>
      </div>

      {/* Score */}
      <ProgressIndicator
        value={score}
        label="Gesamtbewertung"
        showValue
        variant={config.progressVariant}
        size="lg"
      />

      {/* Prices */}
      {(marketPrice !== undefined || offerPrice !== undefined) && (
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-[var(--muted)] p-4">
          {offerPrice !== undefined && (
            <PriceDisplay
              label="Angebotspreis"
              amount={offerPrice}
              size="lg"
            />
          )}
          {marketPrice !== undefined && (
            <PriceDisplay
              label="Marktpreis"
              amount={marketPrice}
              size="lg"
            />
          )}
        </div>
      )}

      {/* Summary */}
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{summary}</p>

      {/* Highlights */}
      {highlights && highlights.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
            Positiv
          </p>
          <ul className="space-y-1">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Zu beachten
          </p>
          <ul className="space-y-1">
            {warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export { AnalysisResultCard };
