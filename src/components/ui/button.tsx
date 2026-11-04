import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#14532D] text-white hover:bg-[#0F3D22] shadow-md hover:shadow-lg active:scale-[0.98]",
        secondary:
          "bg-[#16A34A] text-white hover:bg-[#15803d] shadow-sm hover:shadow-md active:scale-[0.98]",
        outline:
          "border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[#14532D]",
        ghost:
          "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[#14532D]",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm rounded-full",
        link:
          "text-[#16A34A] underline-offset-4 hover:underline p-0 h-auto rounded-none",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 py-2",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-lg",
        icon: "h-10 w-10 p-0 rounded-full",
        "icon-sm": "h-8 w-8 p-0 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
