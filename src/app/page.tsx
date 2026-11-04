import Link from "next/link";
import {
  ArrowRight, CheckCircle2, Shield, TrendingUp, Clock,
  Upload, BarChart3, FileDown, ChevronRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { CategoryCardHome } from "@/components/homepage/category-card-home";
import { FaqSection } from "@/components/homepage/faq-section";
import { BRANDING } from "@/config/branding";
import { CATEGORIES, CATEGORY_FAMILIES, getPopularCategories } from "@/config/categories";

export const metadata = {
  title: `${BRANDING.name} – Besser entscheiden. Cleverer kaufen.`,
  description: BRANDING.description,
};

const HOW_IT_WORKS = [
  { icon: Upload,    title: "Daten eingeben",    desc: "Angaben zum Angebot – Preis, Konditionen, Bundesland – in wenigen Feldern." },
  { icon: BarChart3, title: "KI analysiert",      desc: "Deterministische Berechnungen + KI-Einschätzung mit transparent zitierten Quellen." },
  { icon: FileDown,  title: "Bericht nutzen",     desc: "Klare Zahlen, Risikohinweise und Fragen für die Verhandlung." },
];

const ADVANTAGES = [
  { icon: Shield,       title: "Unabhängig",   desc: "Keine Provisionen, keine Werbepartner. Nur dein Interesse zählt." },
  { icon: TrendingUp,   title: "Datenbasiert", desc: "Berechnungen auf Basis amtlicher Quellen, nicht Meinungen." },
  { icon: Clock,        title: "In Minuten",   desc: "Kein Termin, kein Berater – sofort nutzbar, keine Registrierung." },
  { icon: CheckCircle2, title: "Transparent",  desc: "Jede Zahl mit Quelle belegt. Einschränkungen werden offen kommuniziert." },
];

const FAQS = [
  {
    q: "Wie funktioniert die KI-Analyse?",
    a: "Du gibst die Daten zum Angebot ein. Deterministische Berechnungen laufen immer – Kaufnebenkosten, Finanzierung, Folgekosten. Wenn ein KI-Key konfiguriert ist, kommt eine KI-Interpretation mit Risikohinweisen dazu. Jede Zahl hat eine Quellenangabe.",
  },
  {
    q: "Woher stammen die Vergleichsdaten?",
    a: "Wir nutzen amtliche Quellen: Grunderwerbsteuergesetze der Länder, Bundesnetzagentur, BAFA-Förderdaten. Wo keine verlässlichen Daten verfügbar sind, weisen wir das explizit aus – keine erfundenen Marktwerte.",
  },
  {
    q: "Ist KaufKompass AI eine Rechtsberatung?",
    a: "Nein. KaufKompass AI ist ein Analyseportal. Die Berichte ersetzen keine Rechts-, Steuer- oder Fachberatung. Für rechtlich verbindliche Einschätzungen wende dich an einen zugelassenen Experten.",
  },
  {
    q: "Was bedeutet der Demo-Status bei manchen Kategorien?",
    a: "Demo-Kategorien zeigen den Ablauf – die vollständige KI-Analyse ist noch in Entwicklung. Berechnungen laufen bereits determinisch; die KI-Interpretation wird schrittweise freigeschaltet.",
  },
];

export default function HomePage() {
  const popular = getPopularCategories(8);

  return (
    <>
      <Header />
      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[var(--background)] border-b border-[var(--border)]">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-8 py-16 md:py-24 lg:grid-cols-2 lg:items-center lg:gap-16">

              {/* Left — Headline + CTA */}
              <div className="max-w-xl">
                {/* Eyebrow */}
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCFCE7] bg-[#F0FDF4] px-3.5 py-1.5 text-xs font-semibold text-[#14532D]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                  KI-Kaufberatung für Deutschland
                </div>

                {/* Headline — DM Serif Display */}
                <h1
                  className="font-serif text-5xl leading-[1.1] text-[#111827] sm:text-6xl"
                  style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
                >
                  Besser entscheiden.{" "}
                  <span className="underline-accent text-[#14532D]">Cleverer</span>{" "}
                  kaufen.
                </h1>

                <p className="mt-5 text-lg leading-relaxed text-[#647067]">
                  KI-gestützte Analysetools für Immobilien, Fahrzeuge, Energie und mehr –
                  mit transparenten Quellen und echten Berechnungen.
                </p>

                {/* CTA row */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="lg" asChild>
                    <Link href="/kategorien">
                      Alle Kaufchecks <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/so-funktioniert-es">So funktioniert's</Link>
                  </Button>
                </div>

                {/* Trust strip */}
                <div className="mt-8 flex flex-wrap gap-5 text-sm text-[#647067]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                    30 Analysekategorien
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                    Amtliche Quellen
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
                    Keine Provision
                  </span>
                </div>
              </div>

              {/* Right — Kategorie-Schaufenster */}
              <div className="relative hidden lg:block">
                <div className="relative overflow-hidden rounded-3xl bg-[#F4F6F1] p-8">
                  {/* Decorative circles */}
                  <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[#DCFCE7] opacity-50" />
                  <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#BBF7D0] opacity-30" />

                  <p className="relative mb-5 text-xs font-semibold uppercase tracking-widest text-[#647067]">
                    Beliebte Checks
                  </p>

                  <div className="relative grid grid-cols-2 gap-3">
                    {[
                      { emoji: "🏠", label: "Immobilien-Kaufcheck",  sub: "Kaufnebenkosten + Finanzierung" },
                      { emoji: "🚗", label: "Gebrauchtwagen-Check",  sub: "Betriebskosten 5 Jahre" },
                      { emoji: "☀️", label: "Photovoltaik-Check",    sub: "Ertrag & Amortisation" },
                      { emoji: "🔧", label: "Sanierungskosten-Check", sub: "BAFA-Förderung eingerechnet" },
                    ].map(({ emoji, label, sub }) => (
                      <div
                        key={label}
                        className="rounded-2xl bg-white p-4 shadow-sm border border-[#E4E8E1]"
                      >
                        <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCFCE7] text-lg">
                          {emoji}
                        </div>
                        <p className="text-xs font-semibold text-[#111827] leading-snug">{label}</p>
                        <p className="mt-0.5 text-[10px] text-[#647067]">{sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-[#E4E8E1]">
                    <span className="text-xs text-[#647067]">+ 26 weitere Kategorien</span>
                    <Link href="/kategorien" className="text-xs font-semibold text-[#14532D] hover:underline flex items-center gap-1">
                      Alle ansehen <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BELIEBTE KAUFCHECKS ──────────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Beliebte Checks</p>
                <h2
                  className="text-3xl text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
                >
                  Womit möchtest du beginnen?
                </h2>
              </div>
              <Link
                href="/kategorien"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#16A34A] hover:text-[#14532D] transition-colors no-underline"
              >
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

        {/* ── THEMENFAMILIEN ───────────────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Alle Themenbereiche</p>
              <h2
                className="text-3xl text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
              >
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
                        <Link
                          key={c.id}
                          href={`/kategorien/${c.slug}`}
                          className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[#DCFCE7] hover:text-[#14532D] transition-colors no-underline"
                        >
                          {c.title}
                        </Link>
                      ))}
                      {cats.length > 5 && (
                        <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                          +{cats.length - 5} weitere
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/kategorien?familie=${family}`}
                      className="text-sm font-medium text-[#16A34A] hover:text-[#14532D] transition-colors flex items-center gap-1 no-underline"
                    >
                      {available} verfügbar <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SO FUNKTIONIERT ES ───────────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Einfacher Ablauf</p>
              <h2
                className="text-3xl text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
              >
                So funktioniert die Plattform
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {HOW_IT_WORKS.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#14532D] text-white shadow-lg">
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A] text-xs font-bold text-white">
                      {i + 1}
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

        {/* ── VORTEILE ─────────────────────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-page">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Warum KaufKompass AI</p>
              <h2
                className="text-3xl text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
              >
                Vorteile der KI-Kaufprüfung
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {ADVANTAGES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-base p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#14532D] mb-4">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1.5">{title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BEISPIELANALYSE ──────────────────────────────────────────────── */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Livebeispiel</p>
              <h2
                className="text-3xl text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
              >
                Was eine Analyse aufdeckt
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
              <div className="card-base p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--foreground)]">Immobilie München – Beispiel</h3>
                  <span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-xs font-semibold text-[#14532D]">Demo</span>
                </div>
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-[var(--muted)] p-4">
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Kaufpreis</p>
                    <p className="text-2xl font-bold font-[var(--font-geist-mono)] tabular-nums">550.000 €</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Kaufnebenkosten</p>
                    <p className="text-2xl font-bold tabular-nums text-[#14532D]">54.350 €</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Kaufnebenkosten Bayern</p>
                  {[
                    ["Grunderwerbsteuer (3,5 %)", "19.250 €"],
                    ["Notar & Grundbuch (ca. 2 %)", "11.000 €"],
                    ["Makler (3,57 % inkl. MwSt.)", "19.635 €"],
                    ["Sonstiges (Puffer 1 %)", "5.500 €"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-[var(--muted-foreground)]">{label}</span>
                      <span className="font-medium tabular-nums">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between text-sm font-bold border-t border-[var(--border)] pt-2 mt-2">
                    <span>Gesamtinvestition</span>
                    <span className="tabular-nums">604.350 €</span>
                  </div>
                </div>
                <div className="rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] p-3 text-sm text-[#14532D]">
                  Monatsrate bei 4 % Zins: ca. 2.388 € · Eigenkapitalquote 20 %
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { emoji: "🧮", title: "Kaufnebenkosten je Bundesland", desc: "Exakte Grunderwerbsteuer, Notar & Grundbuch, Makler – aus amtlichen Steuersätzen berechnet." },
                  { emoji: "📊", title: "3 Finanzierungsszenarien", desc: "Annuitätendarlehen bei 3,5 %, 4,0 % und 4,5 % – Monatsrate und Gesamtzinsen auf 30 Jahre." },
                  { emoji: "🤖", title: "KI-Einschätzung", desc: "KI identifiziert Risiken, formuliert Fragen für die Besichtigung und benennt fehlende Informationen." },
                  { emoji: "📋", title: "Transparente Quellen", desc: "Jede Zahl mit Quellenangabe: Gesetz, amtlicher Steuersatz oder mathematische Formel." },
                ].map(({ emoji, title, desc }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)]">
                    <span className="text-2xl shrink-0">{emoji}</span>
                    <div>
                      <p className="font-semibold text-sm text-[var(--foreground)] mb-0.5">{title}</p>
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
                <Button variant="primary" size="md" asChild className="w-full">
                  <Link href="/analyse/immobilien-kaufcheck">
                    Immobilien-Kaufcheck starten <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="section-padding">
          <div className="container-page max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-1">Häufige Fragen</p>
              <h2
                className="text-3xl text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
              >
                FAQ
              </h2>
            </div>
            <FaqSection items={FAQS} />
            <div className="mt-6 text-center">
              <Link href="/faq" className="text-sm text-[#16A34A] hover:text-[#14532D] transition-colors">
                Alle Fragen ansehen →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA-BANNER ───────────────────────────────────────────────────── */}
        <section className="section-padding bg-[#14532D]">
          <div className="container-page text-center">
            <h2
              className="text-3xl text-white mb-4 sm:text-4xl"
              style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
            >
              Dein nächster Kauf. Fundiert entschieden.
            </h2>
            <p className="text-[#BBF7D0] max-w-lg mx-auto mb-8 leading-relaxed">
              Starte jetzt mit dem Immobilien-Kaufcheck – komplett kostenlos, ohne Registrierung.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="bg-white text-[#14532D] hover:bg-[#F0FDF4]"
              >
                <Link href="/analyse/immobilien-kaufcheck">
                  Jetzt Kaufcheck starten <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/kategorien">Alle 30 Kategorien</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
