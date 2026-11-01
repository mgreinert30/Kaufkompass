"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navLinks } from "./navigation";

interface MobileNavProps {
  className?: string;
}

function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  // Close on route change
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={className}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--foreground)] hover:bg-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      {/* Drawer */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Panel */}
          <nav
            id="mobile-menu"
            className="fixed inset-x-0 top-16 z-50 border-b border-[var(--border)] bg-[var(--background)] px-4 pb-6 pt-4 shadow-xl"
            aria-label="Mobile Navigation"
          >
            <ul className="space-y-1">
              {navLinks.map(({ href, label }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "block rounded-md px-4 py-3 text-base font-medium transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-[var(--foreground)] hover:bg-[var(--muted)]"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex flex-col gap-2.5">
              <Button variant="outline" size="lg" asChild className="w-full">
                <Link href="/login">Anmelden</Link>
              </Button>
              <Button variant="primary" size="lg" asChild className="w-full">
                <Link href="/kategorien">Jetzt prüfen</Link>
              </Button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

export { MobileNav };
