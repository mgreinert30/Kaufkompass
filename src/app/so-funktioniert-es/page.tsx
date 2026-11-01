import Link from "next/link";
import { Upload, Brain, BarChart3, FileDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `So funktioniert's – ${BRANDING.name}`,
  description: "Wie KaufKompass AI funktioniert: Dokument hochladen, KI analysiert, Bericht erhalten.",
};

const STEPS = [
  {
    number: "01",
    icon: Upload,
    title: "Kategorie wählen & Daten eingeben",
    desc: "Wähle den passenden Analysebereich aus 30 Kategorien. Lade dein Angebot als PDF, Foto oder Text hoch – oder gib die Daten manuell ein.",
    details: ["PDF, JPG, PNG, WEBP", "Bis zu 10 MB pro Datei", "Strukturierte Eingabefelder je Kategorie"],
  },
  {
    number: "02",
    icon: Brain,
    title: "KI extrahiert und prüft",
    desc: "Unsere KI liest das Dokument, extrahiert relevante Daten und prüft sie gegen aktuelle Marktdaten und fachliche Prüfregeln.",
    details: ["Automatische Texterkennung", "Kategorieabhängige Prüfregeln", "Quellen werden dokumentiert"],
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Berechnungen & Vergleiche",
    desc: "Deterministische Berechnungsmodule ermitteln Folgekosten, Finanzierungsszenarien und vergleichen mit verfügbaren Marktdaten.",
    details: ["Kaufnebenkosten", "Jährliche Betriebskosten", "5-Jahres-Szenarien"],
  },
  {
    number: "04",
    icon: FileDown,
    title: "Strukturierter Bericht",
    desc: "Du erhältst einen übersichtlichen Bericht mit Zusammenfassung, Kostenaufstellung, Auffälligkeiten und konkreten Handlungsempfehlungen.",
    details: ["PDF-Export", "Klar beschriftete Quellen", "Vertrauenslevel je Angabe"],
  },
];

const PRINCIPLES = [
  { icon: CheckCircle2, color: "text-green-600", title: "Keine erfundenen Preise", desc: "Wenn keine Vergleichsdaten vorliegen, wird das klar ausgewiesen. Wir erfinden keine Marktwerte." },
  { icon: CheckCircle2, color: "text-green-600", title: "Transparente Quellen", desc: "Jeder externe Datenpunkt wird mit Quelle und Abrufdatum versehen." },
  { icon: CheckCircle2, color: "text-green-600", title: "Demo ist Demo", desc: "Demo-Analysen sind immer als solche gekennzeichnet – nie als echte Analyse ausgegeben." },
  { icon: AlertTriangle, color: "text-amber-600", title: "Kein Rechtsrat", desc: "KaufKompass AI ist kein juristisches, steuerliches oder medizinisches Beratungsangebot." },
];

export default function SoFunktioniertEsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl mb-3">So funktioniert KaufKompass AI</h1>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Von der Eingabe bis zum fertigen Bericht – in vier Schritten zur fundierten Kaufentscheidung.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-3xl">
            <div className="space-y-10">
              {STEPS.map(({ number, icon: Icon, title, desc, details }) => (
                <div key={number} className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="w-px flex-1 bg-[var(--border)]" aria-hidden="true" />
                  </div>
                  <div className="pb-10 flex-1">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Schritt {number}</p>
                    <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h2>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-3">{desc}</p>
                    <ul className="flex flex-wrap gap-2">
                      {details.map((d) => (
                        <li key={d} className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" aria-hidden="true" /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page max-w-3xl">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Unsere Grundsätze</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {PRINCIPLES.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="card-base p-5 flex gap-4">
                  <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${color}`} aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-sm text-[var(--foreground)] mb-0.5">{title}</p>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-3">Bereit loszulegen?</h2>
            <p className="text-[var(--muted-foreground)] mb-6">Starte mit einer kostenlosen Demo-Analyse – keine Registrierung nötig.</p>
            <Button variant="primary" size="lg" asChild>
              <Link href="/kategorien">Kategorie wählen</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
