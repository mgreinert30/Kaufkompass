import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/kategorien",         label: "Alle Tools" },
  { href: "/so-funktioniert-es", label: "So funktioniert's" },
  { href: "/quellen",            label: "Quellen" },
  { href: "/ueber-uns",          label: "Über uns" },
] as const;

interface NavigationProps {
  className?: string;
}

function Navigation({ className }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center gap-1", className)}
      aria-label="Hauptnavigation"
    >
      {navLinks.map(({ href, label }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]",
              isActive
                ? "bg-[#DCFCE7] text-[#14532D] dark:bg-[#14532D]/30 dark:text-[#4ade80]"
                : "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-[#14532D]"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}

      <div className="ml-4 flex items-center gap-2">
        <Button variant="primary" size="sm" asChild>
          <Link href="/kategorien">Jetzt prüfen →</Link>
        </Button>
      </div>
    </nav>
  );
}

export { Navigation, navLinks };
