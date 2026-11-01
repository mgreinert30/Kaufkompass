import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Button,
  StatusBadge,
  CategoryCard,
  FeatureCard,
  WarningCard,
  AnalysisResultCard,
  ComparisonTable,
  CardSkeleton,
  EmptyState,
  ErrorState,
  InputComponent,
  ProgressIndicator,
  PriceDisplay,
} from "@/components/ui";
import {
  Home,
  Car,
  Laptop,
  FileText,
  ShieldCheck,
  TrendingUp,
  Clock,
  Search,
} from "lucide-react";
import { BRANDING } from "@/config/branding";
import { ComponentShowcase } from "./component-showcase";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="gradient-brand section-padding">
          <div className="container-page text-center">
            <StatusBadge variant="accent" dot className="mb-4">
              KI-gestützte Kaufberatung
            </StatusBadge>
            <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-4">
              {BRANDING.tagline}
            </h1>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
              {BRANDING.description}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" size="lg">Jetzt Kauf prüfen</Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                So funktioniert&apos;s
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="section-padding">
          <div className="container-page">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
              Beliebte <span className="gradient-text">Kaufchecks</span>
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">30 Kategorien für fundierte Kaufentscheidungen</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <CategoryCard
                title="Immobilien-Kaufcheck"
                description="Preis, Zustand und Folgekosten einer Immobilie prüfen"
                href="/kategorien/immobilien-kaufcheck"
                icon={<Home className="h-5 w-5" />}
                family="Immobilien & Wohnen"
                isPopular
              />
              <CategoryCard
                title="Gebrauchtwagen-Check"
                description="Fahrzeugpreis, Marktvergleich und versteckte Kosten"
                href="/kategorien/gebrauchtwagen-check"
                icon={<Car className="h-5 w-5" />}
                family="Fahrzeuge & Mobilität"
              />
              <CategoryCard
                title="Laptop- und PC-Check"
                description="Preis-Leistung und Alternativen im Vergleich"
                href="/kategorien/laptop-pc-check"
                icon={<Laptop className="h-5 w-5" />}
                family="Technik & Alltag"
                isNew
              />
              <CategoryCard
                title="Versicherungscheck"
                description="Leistungen, Preise und Lücken in Versicherungsangeboten"
                href="/kategorien/versicherung-check"
                icon={<FileText className="h-5 w-5" />}
                family="Verträge & Dienste"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section-padding bg-[var(--surface)]">
          <div className="container-page">
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8">
              Warum KaufKompass AI?
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Unabhängige Analyse"
                description="Keine Provisionen, keine Werbung. Nur dein Interesse zählt."
                variant="highlight"
              />
              <FeatureCard
                icon={<TrendingUp className="h-6 w-6" />}
                title="Echte Marktpreise"
                description="Aktuelle Preisdaten aus öffentlichen Quellen und Marktdaten."
              />
              <FeatureCard
                icon={<Clock className="h-6 w-6" />}
                title="In 3 Minuten"
                description="Dokument hochladen, KI analysiert, Ergebnis direkt."
              />
            </div>
          </div>
        </section>

        {/* UI Showcase (Client Component für onClick-Handler) */}
        <section className="section-padding">
          <div className="container-page space-y-10">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">
              UI-Komponenten (Entwicklungsvorschau)
            </h2>

            {/* Static components inline */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primär</Button>
                <Button variant="secondary">Sekundär</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Löschen</Button>
                <Button variant="primary" disabled>Deaktiviert</Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Badges</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge variant="success" dot>Sehr gut</StatusBadge>
                <StatusBadge variant="primary" dot>Gut</StatusBadge>
                <StatusBadge variant="warning" dot>Prüfen</StatusBadge>
                <StatusBadge variant="error" dot>Kritisch</StatusBadge>
                <StatusBadge variant="accent">Neu</StatusBadge>
                <StatusBadge variant="outline">Standard</StatusBadge>
              </div>
            </div>

            <div className="space-y-3 max-w-md">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Eingabefelder</h3>
              <InputComponent
                label="Kaufpreis"
                placeholder="z.B. 350.000"
                helperText="Gib den angebotenen Kaufpreis ein"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            <div className="space-y-3 max-w-md">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Fortschrittsanzeige</h3>
              <ProgressIndicator value={82} label="Gesamtbewertung" showValue variant="success" size="lg" />
              <ProgressIndicator value={54} label="Preisvergleich" showValue variant="warning" />
              <ProgressIndicator value={23} label="Zustand" showValue variant="error" size="sm" />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Preisanzeige</h3>
              <div className="flex flex-wrap gap-8">
                <PriceDisplay amount={349000} label="Angebotspreis" size="xl" />
                <PriceDisplay amount={320000} label="Marktpreis" size="xl" trend="down" trendPercent={8.4} />
              </div>
            </div>

            <div className="space-y-3 max-w-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Hinweiskarten</h3>
              <WarningCard
                level="warning"
                title="Preis liegt 12% über Marktniveau"
                description="Der angebotene Preis ist deutlich höher als vergleichbare Objekte in der Region."
                items={["Vergleichsobjekte: €285.000–€310.000", "Lage-Abzug berücksichtigt"]}
              />
              <WarningCard level="success" title="Keine versteckten Mängel festgestellt" />
            </div>

            <div className="max-w-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Analyseergebnis</h3>
              <AnalysisResultCard
                title="Gebrauchtwagen BMW 3er 2019"
                score={74}
                scoreLevel="good"
                offerPrice={22500}
                marketPrice={21200}
                summary="Der Fahrzeugpreis liegt leicht über dem Marktniveau. Das Fahrzeug ist technisch in gutem Zustand. Verhandlungsspielraum von ca. 5–8% ist realistisch."
                highlights={["Vollständiges Serviceheft", "Unfallfrei laut DEKRA-Bericht"]}
                warnings={["Preis 6% über Durchschnitt", "Hohe Laufleistung für den Jahrgang"]}
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Vergleichstabelle</h3>
              <ComparisonTable
                columns={[
                  { key: "angebot", label: "Ihr Angebot", highlight: true },
                  { key: "markt",   label: "Marktdurchschnitt" },
                ]}
                rows={[
                  { label: "Preis",          values: { angebot: "22.500 €", markt: "21.200 €" }, isImportant: true },
                  { label: "Kilometerstand", values: { angebot: "87.000 km", markt: "72.000 km" } },
                  { label: "Unfallfrei",     values: { angebot: true, markt: null } },
                  { label: "Serviceheft",    values: { angebot: true, markt: false } },
                  { label: "Garantie",       values: { angebot: false, markt: false } },
                ]}
              />
            </div>

            <div className="max-w-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Lade-Skeleton</h3>
              <CardSkeleton />
            </div>

            {/* Interactive states need client component */}
            <ComponentShowcase />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
