import { notFound } from "next/navigation";
import Link from "next/link";
import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { WarningCard } from "@/components/ui/warning-card";
import { CATEGORIES, getCategoryBySlug, STATUS_LABELS, STATUS_BADGE_VARIANT } from "@/config/categories";
import { BRANDING } from "@/config/branding";
import { CategoryCardHome } from "@/components/homepage/category-card-home";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: `${cat.title} – ${BRANDING.name}`,
    description: cat.description,
  };
}

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (Icons as any)[name] as React.FC<LucideProps> | undefined;
  if (!Icon) return <Icons.Tag {...props} />;
  return <Icon {...props} />;
}

export default async function KategoriePage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  const related = CATEGORIES.filter(
    (c) => c.family === cat.family && c.id !== cat.id
  ).slice(0, 4);

  const badgeVariant = STATUS_BADGE_VARIANT[cat.status] as
    | "success" | "primary" | "warning" | "outline";

  const isAvailable = cat.status === "available" || cat.status === "demo";

  return (
    <>
      <Header />
      <main>
        {/* Header */}
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page">
            <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-6">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Start</Link>
              <span>/</span>
              <Link href="/kategorien" className="hover:text-[var(--foreground)] transition-colors">Kategorien</Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">{cat.title}</span>
            </nav>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-md">
                <DynamicIcon name={cat.icon} className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <StatusBadge variant={badgeVariant} dot>
                    {STATUS_LABELS[cat.status]}
                  </StatusBadge>
                  <span className="text-xs text-[var(--muted-foreground)]">{cat.familyLabel}</span>
                </div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl mb-2">{cat.title}</h1>
                <p className="text-[var(--muted-foreground)] max-w-xl leading-relaxed">{cat.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left: Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card-base p-6">
                  <h2 className="font-semibold text-[var(--foreground)] mb-4">Was wird analysiert?</h2>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                    {cat.description}
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Inputs */}
                <div className="card-base p-6">
                  <h2 className="font-semibold text-[var(--foreground)] mb-4">Benötigte Eingaben</h2>
                  <div className="flex flex-wrap gap-2">
                    {cat.inputFields.map((field) => (
                      <span key={field} className="text-xs px-3 py-1.5 rounded-full bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)]">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Allowed docs */}
                <div className="card-base p-6">
                  <h2 className="font-semibold text-[var(--foreground)] mb-4">Akzeptierte Dokumente</h2>
                  <div className="flex flex-wrap gap-2">
                    {cat.allowedDocTypes.map((type) => (
                      <span key={type} className="text-xs font-mono px-3 py-1.5 rounded-md bg-[var(--muted)] text-[var(--muted-foreground)] uppercase">
                        .{type}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-3">Max. 10 MB pro Datei. Dateien werden nur für deine Analyse verarbeitet.</p>
                </div>

                {/* Status info */}
                {cat.status === "demo" && (
                  <WarningCard
                    level="info"
                    title="Demo-Analyse verfügbar"
                    description="Diese Kategorie zeigt den vollständigen Ablauf mit einem Beispieldatensatz. Demo-Ergebnisse sind klar als solche gekennzeichnet und basieren nicht auf deinen eigenen Daten."
                  />
                )}
                {cat.status === "planned" && (
                  <WarningCard
                    level="warning"
                    title="Kategorie in Planung"
                    description="Diese Kategorie befindet sich noch in Entwicklung. Trage dich in die Warteliste ein, um benachrichtigt zu werden, sobald sie verfügbar ist."
                  />
                )}
                {cat.status === "development" && (
                  <WarningCard
                    level="info"
                    title="In Entwicklung"
                    description="Diese Kategorie wird aktuell entwickelt. Die Demo-Version wird bald verfügbar sein."
                  />
                )}
              </div>

              {/* Right: CTA */}
              <div className="space-y-4">
                <div className="card-base p-6 sticky top-20">
                  <h3 className="font-semibold text-[var(--foreground)] mb-2">
                    {isAvailable ? "Analyse starten" : "Verfügbar machen"}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-5 leading-relaxed">
                    {isAvailable
                      ? "Lade dein Dokument hoch oder gib deine Daten ein – in Minuten erhältst du deinen Bericht."
                      : "Diese Kategorie ist noch nicht verfügbar. Melde dich für eine Benachrichtigung an."}
                  </p>

                  {isAvailable ? (
                    <>
                      <Button variant="primary" size="lg" className="w-full mb-3" asChild>
                        <Link href={`/analyse/${cat.slug}`}>
                          {cat.status === "demo" ? "Demo starten" : "Analyse starten"}
                        </Link>
                      </Button>
                      <p className="text-xs text-center text-[var(--muted-foreground)]">
                        {cat.status === "demo" ? "Kostenlos · Kein Login nötig" : "Ab 9,90 €"}
                      </p>
                    </>
                  ) : (
                    <Button variant="outline" size="lg" className="w-full" asChild>
                      <Link href="/kontakt">Benachrichtigung anfragen</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="section-padding bg-[var(--surface)]">
            <div className="container-page">
              <h2 className="font-semibold text-[var(--foreground)] mb-5">Weitere Kategorien in {cat.familyLabel}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((r) => (
                  <CategoryCardHome key={r.id} category={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
