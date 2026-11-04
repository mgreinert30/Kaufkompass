import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/ui/category-icon";
import { StatusBadge } from "@/components/ui/status-badge";
import type { CategoryConfig } from "@/config/categories";
import { STATUS_LABELS, STATUS_BADGE_VARIANT } from "@/config/categories";

interface CategoryCardHomeProps {
  category: CategoryConfig;
  className?: string;
}

export function CategoryCardHome({ category, className }: CategoryCardHomeProps) {
  const badgeVariant = STATUS_BADGE_VARIANT[category.status] as
    | "success" | "primary" | "warning" | "outline" | "error" | "accent" | "default";

  return (
    <Link
      href={`/kategorien/${category.slug}`}
      className={cn(
        "group card-base card-hover block p-5 no-underline",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <CategoryIcon
          name={category.icon}
          size="md"
          variant="default"
          className="transition-colors group-hover:bg-[#DCFCE7]"
        />
        <StatusBadge variant={badgeVariant}>
          {STATUS_LABELS[category.status]}
        </StatusBadge>
      </div>

      <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)] group-hover:text-[#14532D] dark:group-hover:text-[#4ade80] transition-colors leading-snug">
        {category.title}
      </h3>
      <p className="text-xs leading-relaxed text-[var(--muted-foreground)] line-clamp-2">
        {category.subtitle}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-[var(--muted-foreground)]">{category.familyLabel}</span>
        <ArrowRight className="h-3.5 w-3.5 text-[var(--muted-foreground)] transition-transform group-hover:translate-x-1 group-hover:text-[#16A34A]" aria-hidden="true" />
      </div>
    </Link>
  );
}
