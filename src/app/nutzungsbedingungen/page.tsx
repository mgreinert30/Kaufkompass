import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Nutzungsbedingungen – ${BRANDING.name}`,
};

const SECTIONS = [
  { title: "1. Geltungsbereich", text: "Diese Nutzungsbedingungen gelten für die Nutzung der Plattform KaufKompass AI unter kaufkompass.ai. Mit der Nutzung der Plattform stimmt der Nutzer diesen Bedingungen zu." },
  { title: "2. Leistungsbeschreibung", text: "KaufKompass AI bietet KI-gestützte Analysen für Kaufentscheidungen. Die Analysen dienen der Orientierung und ersetzen keine rechtliche, steuerliche oder fachliche Beratung." },
  { title: "3. Kein Rechtsrat", text: "Die auf der Plattform bereitgestellten Informationen und Analysen stellen keine Rechts-, Steuer-, Finanz- oder sonstige Fachberatung dar. Für verbindliche Auskünfte wende dich an einen zugelassenen Experten." },
  { title: "4. Haftungsausschluss", text: "KaufKompass AI haftet nicht für Entscheidungen, die auf Grundlage der Analysen getroffen werden. Die Plattform übernimmt keine Garantie für die Vollständigkeit oder Aktualität der verwendeten Vergleichsdaten." },
  { title: "5. Nutzerpflichten", text: "Der Nutzer verpflichtet sich, nur rechtmäßig beschaffte Dokumente hochzuladen und die Plattform nicht für rechtswidrige Zwecke zu nutzen. Missbrauch führt zum Ausschluss." },
  { title: "6. Bezahlung und Rückerstattung", text: "Kostenpflichtige Analysen werden sofort nach Bezahlung freigeschaltet. Eine Rückerstattung ist bei nachweislichen technischen Fehlern möglich. Anfragen an hallo@kaufkompass.ai." },
  { title: "7. Datenschutz", text: "Die Verarbeitung personenbezogener Daten richtet sich nach der Datenschutzerklärung unter /datenschutz." },
  { title: "8. Änderungen", text: "KaufKompass AI behält sich das Recht vor, diese Nutzungsbedingungen zu ändern. Nutzer werden über wesentliche Änderungen informiert." },
  { title: "9. Anwendbares Recht", text: "Es gilt deutsches Recht. Gerichtsstand ist [Ort eintragen], soweit gesetzlich zulässig." },
];

export default function NutzungsbedingungenPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Nutzungsbedingungen (AGB)</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Stand: November 2026 · Vorlage – noch nicht rechtsverbindlich geprüft</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-2xl">
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 mb-8 text-sm text-amber-800 dark:text-amber-200">
              ⚠ Hinweis: Diese AGB sind eine Vorlage und müssen vor dem Live-Betrieb durch einen Rechtsanwalt geprüft und vervollständigt werden.
            </div>

            <div className="space-y-6">
              {SECTIONS.map(({ title, text }) => (
                <div key={title}>
                  <h2 className="text-sm font-semibold text-[var(--foreground)] mb-1">{title}</h2>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{text}</p>
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
