import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/kategorien",       label: "Kategorien" },
  { href: "/so-funktioniert-es", label: "So funktioniert's" },
  { href: "/preise",           label: "Preise" },
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
              "rounded-md px-3 py-2 text-sm font-medium transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                : "text-[var(--foreground)] hover:bg-[var(--muted)] hover:text-blue-700"
            )}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}

      <div className="ml-3 flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/login">Anmelden</Link>
        </Button>
        <Button variant="primary" size="sm" asChild>
          <Link href="/kategorien">Jetzt prüfen</Link>
        </Button>
      </div>
    </nav>
  );
}

export { Navigation, navLinks };
