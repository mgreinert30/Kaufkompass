import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({
  title = "Etwas ist schiefgelaufen",
  message = "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
      role="alert"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20">
        <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
      </div>

      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>

      <p className="mt-2 max-w-sm text-sm text-[var(--muted-foreground)]">{message}</p>

      {onRetry && (
        <Button
          variant="outline"
          size="md"
          className="mt-6 gap-2"
          onClick={onRetry}
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Erneut versuchen
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
