import * as React from "react";
import Link from "next/link";
import { BRANDING } from "@/config/branding";

const footerLinks = {
  Plattform: [
    { href: "/kategorien",         label: "Alle Kategorien" },
    { href: "/so-funktioniert-es", label: "So funktioniert's" },
    { href: "/preise",             label: "Preise" },
    { href: "/faq",                label: "FAQ" },
  ],
  Unternehmen: [
    { href: "/ueber-uns",  label: "Über uns" },
    { href: "/kontakt",    label: "Kontakt" },
    { href: "/blog",       label: "Blog" },
  ],
  Rechtliches: [
    { href: "/datenschutz",         label: "Datenschutz" },
    { href: "/impressum",           label: "Impressum" },
    { href: "/nutzungsbedingungen", label: "AGB" },
  ],
};

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-base font-bold text-[var(--foreground)] no-underline hover:opacity-80 transition-opacity"
              aria-label={`${BRANDING.name} – Startseite`}
            >
              <span>
                {BRANDING.logo.text}
                <span className="text-blue-600 ml-0.5">{BRANDING.logo.highlight}</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {BRANDING.tagline}
              <br />
              KI-gestützte Kaufentscheidungen für Deutschland.
            </p>

            <p className="text-xs text-[var(--muted-foreground)]">
              <a
                href={`mailto:${BRANDING.email}`}
                className="hover:text-blue-600 transition-colors"
              >
                {BRANDING.email}
              </a>
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group} className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-[var(--muted-foreground)] no-underline hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {year} {BRANDING.name}. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            KI-Analysen ersetzen keine professionelle Beratung.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
