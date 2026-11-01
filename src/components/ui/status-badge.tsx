import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:   "bg-[var(--muted)] text-[var(--foreground)]",
        primary:   "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        success:   "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        warning:   "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        error:     "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        accent:    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
        outline:   "border border-[var(--border)] text-[var(--muted-foreground)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function StatusBadge({ className, variant, dot, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}

export { StatusBadge, badgeVariants };
