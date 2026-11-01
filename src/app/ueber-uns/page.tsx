import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Über uns – ${BRANDING.name}`,
  description: "KaufKompass AI – wer wir sind und warum wir diese Plattform gebaut haben.",
};

export default function UeberUnsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl mb-3">Über KaufKompass AI</h1>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              Eine unabhängige Plattform für fundierte Kaufentscheidungen.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-2xl prose prose-sm prose-neutral dark:prose-invert">
            <h2>Unsere Mission</h2>
            <p>
              Große Kaufentscheidungen sind oft mit Unsicherheit verbunden. Ist der Preis fair? Welche Folgekosten entstehen?
              Worauf muss ich achten? Diese Fragen zu beantworten – schnell, ehrlich und ohne Interessenkonflikt – ist der Kern von KaufKompass AI.
            </p>
            <p>
              Wir bauen eine Plattform, die KI-gestützte Analyse mit echter Fachlichkeit verbindet.
              Keine Werbung, keine Provisionen – nur strukturierte, nachvollziehbare Informationen.
            </p>

            <h2>Warum wir das machen</h2>
            <p>
              Verbraucherinnen und Verbraucher stehen bei Immobilien, Autos, Renovierungen oder Verträgen oft auf Informationen von Anbietern angewiesen,
              die ein eigenes Interesse am Abschluss haben. KaufKompass AI will eine unabhängige Gegenperspektive bieten.
            </p>

            <h2>Was wir nicht sind</h2>
            <p>
              KaufKompass AI ist kein rechtliches, steuerliches oder medizinisches Beratungsangebot. Unsere Analysen ersetzen keine
              Fachberatung durch zugelassene Experten. Für verbindliche Einschätzungen zu rechtlichen oder finanziellen Fragen empfehlen wir,
              einen entsprechenden Experten hinzuzuziehen.
            </p>

            <h2>Kontakt</h2>
            <p>
              Fragen, Feedback oder Kooperationsanfragen: <a href={`mailto:${BRANDING.email}`}>{BRANDING.email}</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
