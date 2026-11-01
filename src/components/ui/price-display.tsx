import * as React from "react";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number;
  currency?: string;
  locale?: string;
  size?: "sm" | "md" | "lg" | "xl";
  prefix?: string;
  suffix?: string;
  label?: string;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
  className?: string;
}

const sizeClasses = {
  sm: "text-base font-semibold",
  md: "text-xl font-bold",
  lg: "text-3xl font-bold",
  xl: "text-5xl font-bold",
};

function PriceDisplay({
  amount,
  currency = "EUR",
  locale = "de-DE",
  size = "md",
  prefix,
  suffix,
  label,
  trend,
  trendPercent,
  className,
}: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  const trendColor = {
    up:      "text-red-600",
    down:    "text-green-600",
    neutral: "text-[var(--muted-foreground)]",
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {label && (
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted-foreground)]">
          {label}
        </span>
      )}

      <div className="flex items-baseline gap-1.5">
        {prefix && (
          <span className="text-sm text-[var(--muted-foreground)]">{prefix}</span>
        )}
        <span className={cn("tabular-nums text-[var(--foreground)]", sizeClasses[size])}>
          {formatted}
        </span>
        {suffix && (
          <span className="text-sm text-[var(--muted-foreground)]">{suffix}</span>
        )}
      </div>

      {trend && trendPercent !== undefined && (
        <span className={cn("text-xs font-medium", trendColor[trend])}>
          {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"}{" "}
          {Math.abs(trendPercent)}%
        </span>
      )}
    </div>
  );
}

export { PriceDisplay };
