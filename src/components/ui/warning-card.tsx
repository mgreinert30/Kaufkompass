import * as React from "react";
import { AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type WarningLevel = "info" | "warning" | "error" | "success";

interface WarningCardProps {
  level?: WarningLevel;
  title: string;
  description?: string;
  items?: string[];
  className?: string;
}

const levelConfig: Record<WarningLevel, {
  icon: React.ElementType;
  containerClass: string;
  iconClass: string;
  titleClass: string;
}> = {
  info: {
    icon: Info,
    containerClass: "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20",
    iconClass: "text-blue-600",
    titleClass: "text-blue-900 dark:text-blue-200",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20",
    iconClass: "text-amber-600",
    titleClass: "text-amber-900 dark:text-amber-200",
  },
  error: {
    icon: AlertCircle,
    containerClass: "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
    iconClass: "text-red-600",
    titleClass: "text-red-900 dark:text-red-200",
  },
  success: {
    icon: CheckCircle,
    containerClass: "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20",
    iconClass: "text-green-600",
    titleClass: "text-green-900 dark:text-green-200",
  },
};

function WarningCard({
  level = "warning",
  title,
  description,
  items,
  className,
}: WarningCardProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        config.containerClass,
        className
      )}
      role={level === "error" ? "alert" : "status"}
    >
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconClass)} aria-hidden="true" />

        <div className="flex-1 space-y-1">
          <p className={cn("text-sm font-semibold", config.titleClass)}>{title}</p>

          {description && (
            <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
          )}

          {items && items.length > 0 && (
            <ul className="mt-2 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-current" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export { WarningCard };
