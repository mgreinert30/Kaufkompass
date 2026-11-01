import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KategorienContent } from "./kategorien-content";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Alle Kategorien – ${BRANDING.name}`,
  description: "30 Kaufanalyse-Kategorien für fundierte Kaufentscheidungen. Von Immobilien bis Tierarztrechnungen.",
};

export default function KategorienPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page">
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-2">30 Kategorien</p>
            <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl mb-3">Alle Kaufchecks</h1>
            <p className="text-[var(--muted-foreground)] max-w-xl">
              Wähle eine Kategorie, lade dein Angebot hoch und erhalte in Minuten eine strukturierte KI-Analyse.
            </p>
          </div>
        </section>
        <KategorienContent />
      </main>
      <Footer />
    </>
  );
}
