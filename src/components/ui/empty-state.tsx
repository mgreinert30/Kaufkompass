import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)]">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      )}

      {action && (
        <Button
          variant="outline"
          size="md"
          className="mt-6"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

export { EmptyState };
