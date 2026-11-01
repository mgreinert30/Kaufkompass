import * as React from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: "default" | "highlight";
  className?: string;
}

function FeatureCard({
  icon,
  title,
  description,
  variant = "default",
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "card-base p-6",
        variant === "highlight" &&
          "border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50 dark:border-blue-800 dark:from-blue-900/20 dark:to-teal-900/20",
        className
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
          variant === "highlight"
            ? "bg-blue-600 text-white"
            : "bg-[var(--muted)] text-blue-700 dark:text-blue-400"
        )}
      >
        {icon}
      </div>

      <h3 className="mb-2 text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">{description}</p>
    </div>
  );
}

export { FeatureCard };
