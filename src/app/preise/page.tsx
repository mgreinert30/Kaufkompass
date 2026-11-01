import Link from "next/link";
import { CheckCircle2, Star } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Preise – ${BRANDING.name}`,
  description: "Transparente Preise ohne Abo. Bezahle nur, was du nutzt.",
};

const PLANS = [
  {
    name: "Schnellcheck",
    price: "Kostenlos",
    sub: "für immer",
    features: [
      "1 vereinfachte Analyse/Monat",
      "Basisbewertung ohne Details",
      "Keine Registrierung nötig",
      "Kein PDF-Export",
    ],
    cta: "Jetzt starten",
    href: "/kategorien",
    highlight: false,
  },
  {
    name: "Einzelanalyse",
    price: "9,90 €",
    sub: "einmalig · inkl. MwSt.",
    features: [
      "Vollständige KI-Analyse",
      "Alle Berechnungsmodule",
      "PDF-Bericht mit Quellen",
      "30 Tage Zugang zum Bericht",
      "Dokument-Upload",
    ],
    cta: "Analyse kaufen",
    href: "/kategorien",
    highlight: true,
    badge: "Beliebteste Wahl",
  },
  {
    name: "Vergleichspaket",
    price: "19,90 €",
    sub: "einmalig · inkl. MwSt.",
    features: [
      "Bis zu 3 Angebote vergleichen",
      "Detaillierter Vergleichsbericht",
      "PDF-Export mit Tabellen",
      "60 Tage Zugang",
      "Dokument-Upload",
    ],
    cta: "Paket wählen",
    href: "/kategorien",
    highlight: false,
  },
];

const FAQS = [
  { q: "Gibt es ein Abo?", a: "Nein. Du bezahlst einmalig für eine Analyse. Kein wiederkehrender Beitrag, keine automatische Verlängerung." },
  { q: "Was passiert nach 30/60 Tagen?", a: "Dein Bericht bleibt innerhalb des gebuchten Zeitraums abrufbar. Danach wird er aus unserem System gelöscht. Du kannst ihn jederzeit vorher als PDF speichern." },
  { q: "Welche Zahlungsmethoden gibt es?", a: "Kreditkarte, SEPA-Lastschrift und PayPal (folgt bald). Zahlungen werden über Stripe abgewickelt." },
  { q: "Gibt es eine Erstattung?", a: "Wenn die Analyse technisch fehlerhaft war oder du das Ergebnis aus nachvollziehbaren Gründen nicht nutzen konntest, erstatten wir den Betrag. Wende dich an hallo@kaufkompass.ai." },
];

export default function PreisePage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12 text-center">
          <div className="container-page">
            <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl mb-3">Transparente Preise</h1>
            <p className="text-[var(--muted-foreground)] max-w-lg mx-auto">
              Kein Abo, keine Überraschungen. Bezahle nur, was du wirklich nutzt.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`card-base p-6 flex flex-col ${plan.highlight ? "border-blue-500 shadow-lg ring-1 ring-blue-500" : ""}`}>
                  {plan.highlight && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mb-3">
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                      {plan.badge}
                    </div>
                  )}
                  <h2 className="font-semibold text-[var(--foreground)] mb-1">{plan.name}</h2>
                  <div className="mb-5">
                    <span className="text-3xl font-bold tabular-nums">{plan.price}</span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-1 block">{plan.sub}</span>
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" aria-hidden="true" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.highlight ? "primary" : "outline"} size="md" className="w-full" asChild>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
              Alle Preise inkl. MwSt. · Kein Abo · Sofortiger Zugang nach Bezahlung
            </p>
          </div>
        </section>

        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page max-w-2xl">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Häufige Fragen zu den Preisen</h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="card-base p-5">
                  <p className="font-semibold text-sm text-[var(--foreground)] mb-1">{q}</p>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
