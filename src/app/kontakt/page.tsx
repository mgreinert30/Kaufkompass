import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Kontakt – ${BRANDING.name}`,
  description: "Kontaktiere das KaufKompass AI Team.",
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-3">Kontakt</h1>
            <p className="text-[var(--muted-foreground)]">Wir freuen uns über Fragen, Feedback und Kooperationsanfragen.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-10">
              {[
                { label: "Allgemeine Anfragen", value: BRANDING.email, href: `mailto:${BRANDING.email}` },
                { label: "Support", value: BRANDING.email, href: `mailto:${BRANDING.email}` },
              ].map(({ label, value, href }) => (
                <div key={label} className="card-base p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">{label}</p>
                  <a href={href} className="text-blue-600 hover:text-blue-700 text-sm transition-colors">{value}</a>
                </div>
              ))}
            </div>

            <div className="card-base p-6">
              <h2 className="font-semibold text-[var(--foreground)] mb-1">Antwortzeit</h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Wir antworten in der Regel innerhalb von 1–2 Werktagen. Für technische Supportfragen bitte die Kategorie und eine kurze Beschreibung des Problems angeben.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
