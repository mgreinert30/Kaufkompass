import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--foreground)]"
          >
            {label}
            {props.required && (
              <span className="ml-1 text-red-500" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-[var(--muted-foreground)]">
              {leftIcon}
            </span>
          )}

          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-10 w-full rounded-md border bg-[var(--surface-raised)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
              "border-[var(--border)] transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 focus-visible:border-blue-500",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus-visible:ring-red-500",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            aria-invalid={error ? "true" : undefined}
            {...props}
          />

          {rightIcon && (
            <span className="pointer-events-none absolute right-3 text-[var(--muted-foreground)]">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-[var(--muted-foreground)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
InputComponent.displayName = "InputComponent";

export { InputComponent };
