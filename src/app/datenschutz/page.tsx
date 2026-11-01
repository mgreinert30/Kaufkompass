import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Datenschutzerklärung – ${BRANDING.name}`,
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Datenschutzerklärung</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Stand: November 2026 · Vorlage – noch nicht rechtsverbindlich geprüft</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-2xl">
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 mb-8 text-sm text-amber-800 dark:text-amber-200">
              ⚠ Hinweis: Diese Datenschutzerklärung ist eine rechtlich noch nicht geprüfte Vorlage. Sie muss vor dem Live-Betrieb durch einen qualifizierten Datenschutzbeauftragten oder Rechtsanwalt geprüft und angepasst werden.
            </div>

            <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none space-y-6 text-[var(--foreground)]">
              <section>
                <h2 className="text-base font-semibold mb-2">1. Verantwortlicher</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{BRANDING.name} · {BRANDING.email} · [Adresse eintragen]</p>
              </section>
              <section>
                <h2 className="text-base font-semibold mb-2">2. Erhobene Daten</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Beim Besuch der Website werden serverseitig technische Zugriffsdaten (IP-Adresse, Zeitstempel, Browser) protokolliert. Bei der Nutzung der Analysefunktion werden die hochgeladenen Dokumente und eingegebenen Daten nur für die jeweilige Analyse verarbeitet.</p>
              </section>
              <section>
                <h2 className="text-base font-semibold mb-2">3. Zweck der Verarbeitung</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Die Verarbeitung personenbezogener Daten erfolgt ausschließlich zum Zweck der Bereitstellung und Verbesserung des Dienstes sowie zur Erfüllung gesetzlicher Pflichten.</p>
              </section>
              <section>
                <h2 className="text-base font-semibold mb-2">4. Speicherdauer</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Hochgeladene Dokumente werden nach Abschluss der Analyse gelöscht. Analyseergebnisse werden für den gebuchten Zeitraum (30 oder 60 Tage) gespeichert und danach automatisch gelöscht.</p>
              </section>
              <section>
                <h2 className="text-base font-semibold mb-2">5. Betroffenenrechte</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wende dich dazu an {BRANDING.email}.</p>
              </section>
              <section>
                <h2 className="text-base font-semibold mb-2">6. Dritte Dienste</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Die Plattform nutzt externe Dienste (Hosting: Vercel, Zahlungsabwicklung: Stripe, KI-Verarbeitung: [Provider eintragen]). Die jeweiligen Datenschutzbestimmungen dieser Anbieter gelten ergänzend.</p>
              </section>
              <section>
                <h2 className="text-base font-semibold mb-2">7. Kontakt</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Bei Fragen zum Datenschutz: {BRANDING.email}</p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
