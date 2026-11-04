"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Navigation } from "./navigation";
import { MobileNav } from "./mobile-nav";
import { BRANDING } from "@/config/branding";

interface HeaderProps {
  className?: string;
}

function Header({ className }: HeaderProps) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md shadow-sm"
          : "bg-[var(--background)]",
        className
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-[var(--foreground)] no-underline hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] rounded-md"
          aria-label={`${BRANDING.name} – Startseite`}
        >
          <KompassIcon className="h-8 w-8 shrink-0" />
          <span className="text-lg tracking-tight">
            {BRANDING.logo.text}
            <span className="text-[#16A34A] ml-0.5">{BRANDING.logo.highlight}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <Navigation className="hidden md:flex" />

        {/* Mobile Nav */}
        <MobileNav className="md:hidden" />
      </div>
    </header>
  );
}

function KompassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="14" fill="#14532D" />
      <circle cx="16" cy="16" r="11" fill="#16A34A" />
      <path d="M16 6 L19.5 16 L16 13.5 L12.5 16 Z" fill="white" />
      <path d="M16 26 L19.5 16 L16 18.5 L12.5 16 Z" fill="#bbf7d0" />
      <circle cx="16" cy="16" r="2" fill="white" />
    </svg>
  );
}

export { Header };
