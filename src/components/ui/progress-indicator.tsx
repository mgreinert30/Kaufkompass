import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const variantClasses = {
  default: "bg-blue-600",
  success: "bg-green-600",
  warning: "bg-amber-500",
  error:   "bg-red-600",
};

function ProgressIndicator({
  value,
  max = 100,
  label,
  showValue = false,
  size = "md",
  variant = "default",
  className,
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-[var(--muted-foreground)] tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-[var(--muted)]",
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export { ProgressIndicator };
