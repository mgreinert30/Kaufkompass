import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  family?: string;
  isNew?: boolean;
  isPopular?: boolean;
  className?: string;
}

function CategoryCard({
  title,
  description,
  href,
  icon,
  family,
  isNew,
  isPopular,
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group card-base card-hover block p-5 no-underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none",
        className
      )}
    >
      {/* Icon + Badges */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50">
          {icon}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {isNew && <StatusBadge variant="accent">Neu</StatusBadge>}
          {isPopular && <StatusBadge variant="warning">Beliebt</StatusBadge>}
        </div>
      </div>

      {/* Content */}
      <h3 className="mb-1.5 text-base font-semibold text-[var(--foreground)] group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
        {description}
      </p>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        {family && (
          <span className="text-xs text-[var(--muted-foreground)]">{family}</span>
        )}
        <ArrowRight
          className="ml-auto h-4 w-4 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-blue-600"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export { CategoryCard };
