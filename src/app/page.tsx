import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Shield, TrendingUp, Clock,
  Upload, BarChart3, FileDown, Star, ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CategoryCardHome } from "@/components/homepage/category-card-home";
import { FaqSection } from "@/components/homepage/faq-section";
import { BRANDING } from "@/config/branding";
import { CATEGORIES, CATEGORY_FAMILIES, getPopularCategories } from "@/config/categories";

export const metadata = {
  title: `${BRANDING.name} – ${BRANDING.tagline}`,
  description: BRANDING.description,
};

const HOW_IT_WORKS = [
  { step: "1", icon: Upload,    title: "Angebot hochladen",   desc: "PDF, Foto oder Text – einfach hochladen oder eingeben." },
  { step: "2", icon: BarChart3, title: "KI analysiert",        desc: "Unsere KI prüft Preise, Konditionen und Risiken." },
  { step: "3", icon: FileDown,  title: "Bericht erhalten",     desc: "Klarer Bericht mit konkreten Handlungsempfehlungen." },
];

const ADVANTAGES = [
  { icon: Shield,     title: "Unabhängig",       desc: "Keine Provisionen, keine Werbepartner. Nur dein Interesse zählt." },
  { icon: TrendingUp, title: "Datenbasiert",      desc: "Berechnungen auf Basis echter Marktdaten, nicht Meinungen." },
  { icon: Clock,      title: "In Minuten",        desc: "Kein Termin, kein Berater – sofort nutzbar." },
  { icon: CheckCircle2, title: "Transparent",     desc: "Jede Aussage mit Quelle und Vertrauenslevel versehen." },
];

const PRICE_PLANS = [
  {
    name: "Schnellcheck",
    price: "Kostenlos",
    priceNote: "für immer",
    features: ["1 einfache Analyse/Monat", "Basisbewertung", "Keine Registrierung nötig"],
    cta: "Jetzt starten",
    href: "/kategorien",
    highlight: false,
  },
  {
    name: "Einzelanalyse",
    price: "9,90 €",
    priceNote: "einmalig",
    features: ["Vollständige KI-Analyse", "PDF-Bericht", "Vergleichsdaten", "30 Tage Zugang"],
    cta: "Analyse kaufen",
    href: "/preise",
    highlight: true,
  },
  {
    name: "Vergleichspaket",
    price: "19,90 €",
    priceNote: "einmalig",
    features: ["Bis zu 3 Angebote vergleichen", "Detailbericht", "PDF-Export", "60 Tage Zugang"],
    cta: "Paket wählen",
    href: "/preise",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Wie funktioniert die KI-Analyse?",
    a: "Du lädst ein Angebot oder Dokument hoch – oder gibst die Daten ein. Unsere KI extrahiert die relevanten Informationen, prüft sie gegen Marktdaten und erstellt einen strukturierten Bericht mit Bewertung, Kostenaufstellung und Handlungsempfehlungen.",
  },
  {
    q: "Woher stammen die Vergleichspreise?",
    a: "Wir nutzen öffentlich zugängliche Daten, Marktberichte und dokumentierte Referenzwerte. Wenn für eine Kategorie keine verlässlichen Vergleichsdaten vorliegen, weisen wir das ausdrücklich aus – wir erfinden keine Marktwerte.",
  },
  {
    q: "Ist KaufKompass AI eine Rechtsberatung?",
    a: "Nein. KaufKompass AI ist ein Analyseportal für Kaufentscheidungen. Unsere Berichte ersetzen keine Rechts-, Steuer- oder Fachberatung. Für rechtlich verbindliche Einschätzungen wende dich an einen zugelassenen Experten.",
  },
  {
    q: "Welche Dokumente kann ich hochladen?",
    a: "PDF, JPG, PNG und WEBP werden unterstützt. Maximale Dateigröße: 10 MB pro Datei. Dokumente werden ausschließlich für deine Analyse verarbeitet und nicht dauerhaft gespeichert.",
  },
  {
    q: "Was bedeutet der Demo-Status bei manchen Kategorien?",
    a: "Demo-Kategorien zeigen den vollständigen Ablauf mit einem Beispieldatensatz. Die Ergebnisse basieren auf typischen Werten, nicht auf deinen eigenen Daten. Demo-Berichte sind klar als solche gekennzeichnet.",
  },
];

export default function HomePage() {
  const popular = getPopularCategories(8);

  return (
    <>
      <Header />
      <main>
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden gradient-brand">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" aria-hidden="true" />
          <div className="container-page relative py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <StatusBadge variant="accent" dot className="mb-5 text-teal-100 bg-white/10">
                KI-gestützte Kaufberatung für Deutschland
              </StatusBadge>
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-5 leading-tight">
                Prüfe, bevor<br className="hidden sm:block" /> du kaufst.
              </h1>
              <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8 leading-relaxed">
                Lass Kaufpreise, Angebote und Folgekosten intelligent analysieren –<br className="hidden md:block" />
                damit du fundierte Entscheidungen treffen kannst.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/kategorien">
                    Angebot prüfen <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-white/25 text-white hover:bg-white/10 hover:text-white">
                  <Link href="/kategorien">Kategorien entdecken</Link>
                </Button>
              </div>
              {/* Trust bar */}
              <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-blue-200">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-400" aria-hidden="true" />30 Analysekategorien</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-400" aria-hidden="true" />Keine Provision</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-400" aria-hidden="true" />Keine Registrierung für Demo</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── BELIEBTE KAUFCHECKS ───────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Beliebte Checks</p>
                <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                  Womit möchtest du <span className="gradient-text">beginnen?</span>
                </h2>
              </div>
              <Link href="/kategorien" className="hidden sm:flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Alle 30 Kategorien <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((cat) => (
                <CategoryCardHome key={cat.id} category={cat} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button variant="outline" size="md" asChild>
                <Link href="/kategorien">Alle 30 Kategorien anzeigen</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── ALLE THEMENBEREICHE ───────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Alle Themenbereiche</p>
              <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                4 Themenfamilien, 30 Kategorien
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {(["A", "B", "C", "D"] as const).map((family) => {
                const info = CATEGORY_FAMILIES[family];
                const cats = CATEGORIES.filter((c) => c.family === family);
                const available = cats.filter((c) => c.status === "available" || c.status === "demo").length;
                return (
                  <div key={family} className="card-base p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-0.5">Familie {family}</p>
                        <h3 className="font-semibold text-[var(--foreground)]">{info.label}</h3>
                      </div>
                      <span className="text-xs font-medium text-[var(--muted-foreground)] bg-[var(--muted)] px-2 py-1 rounded-full whitespace-nowrap">
                        {cats.length} Checks
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">{info.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cats.slice(0, 5).map((c) => (
                        <Link key={c.id} href={`/kategorien/${c.slug}`} className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-blue-50 hover:text-blue-700 transition-colors no-underline">
                          {c.title}
                        </Link>
                      ))}
                      {cats.length > 5 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                          +{cats.length - 5} weitere
                        </span>
                      )}
                    </div>
                    <Link href={`/kategorien?familie=${family}`} className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1 no-underline">
                      {available} verfügbar <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SO FUNKTIONIERT ES ────────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Einfacher Ablauf</p>
              <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">So funktioniert die Plattform</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
                <div key={step} className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-lg">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white">
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)] mb-1">{title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button variant="primary" size="lg" asChild>
                <Link href="/so-funktioniert-es">Mehr erfahren <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── KOSTENBEISPIEL ────────────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Beispielanalyse</p>
              <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Was eine Analyse aufdeckt</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
              <div className="card-base p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--foreground)]">Gebrauchtwagen BMW 3er 2019</h3>
                  <StatusBadge variant="primary" dot>Demo</StatusBadge>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-[var(--muted)] p-4">
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Angebotspreis</p>
                    <p className="text-2xl font-bold tabular-nums">22.500 €</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Marktpreis (Ø)</p>
                    <p className="text-2xl font-bold tabular-nums text-green-600">21.200 €</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Jährliche Folgekosten</p>
                  {[
                    ["Versicherung (Haftpflicht + Kasko)", "1.980 €"],
                    ["Kraftstoff (15.000 km, Ø 7,5 l)", "1.575 €"],
                    ["Wartung & Service", "800 €"],
                    ["KFZ-Steuer", "180 €"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">{label}</span>
                      <span className="font-medium tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm font-bold border-t border-[var(--border)] pt-2 mt-2">
                    <span>Gesamt/Jahr</span>
                    <span className="tabular-nums">4.535 €</span>
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-200">
                  ⚠ Preis liegt 6 % über Marktdurchschnitt – Verhandlungsspielraum vorhanden.
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "🔍", title: "Dokumentenanalyse", desc: "KI extrahiert Fahrzeugdaten, Kilometerstand, Ausstattung und Besonderheiten aus dem Inserat." },
                  { icon: "📊", title: "Preisvergleich", desc: "Angebotspreis wird mit aktuellen Marktdaten für vergleichbare Fahrzeuge verglichen." },
                  { icon: "💰", title: "Kostenberechnung", desc: "Alle Folgekosten für 5 Jahre: Versicherung, Kraftstoff, Wartung, Wertverlust." },
                  { icon: "⚠️", title: "Risikohinweise", desc: "Offene Fragen, fehlende Informationen und typische Risiken werden transparent ausgewiesen." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-lg border border-[var(--border)]">
                    <span className="text-2xl shrink-0">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-[var(--foreground)] mb-0.5">{title}</p>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="md" asChild className="w-full">
                  <Link href="/kategorien/gebrauchtwagen-check">Demo-Analyse starten</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── VORTEILE ──────────────────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Warum KaufKompass AI</p>
              <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Vorteile der KI-Kaufprüfung</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ADVANTAGES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-base p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1.5">{title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PREISÜBERSICHT ────────────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-page">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Transparente Preise</p>
              <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">Preisübersicht</h2>
              <p className="text-[var(--muted-foreground)] mt-2 text-sm">Bezahle nur, was du nutzt. Kein Abo, keine versteckten Kosten.</p>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 max-w-3xl mx-auto">
              {PRICE_PLANS.map((plan) => (
                <div key={plan.name} className={`card-base p-6 flex flex-col ${plan.highlight ? "border-blue-500 shadow-lg ring-1 ring-blue-500" : ""}`}>
                  {plan.highlight && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mb-3">
                      <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" /> Beliebteste Wahl
                    </div>
                  )}
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold tabular-nums">{plan.price}</span>
                    <span className="text-sm text-[var(--muted-foreground)] ml-1">{plan.priceNote}</span>
                  </div>
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.highlight ? "primary" : "outline"} size="md" asChild className="w-full">
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
              Alle Preise inkl. MwSt. · Kein Abo · Jederzeit kündbar
            </p>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Häufige Fragen</p>
              <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">FAQ</h2>
            </div>
            <FaqSection items={FAQS} />
            <div className="mt-6 text-center">
              <Link href="/faq" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                Alle Fragen ansehen →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
