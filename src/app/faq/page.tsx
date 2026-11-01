import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FaqSection } from "@/components/homepage/faq-section";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `FAQ – ${BRANDING.name}`,
  description: "Häufig gestellte Fragen zu KaufKompass AI.",
};

const FAQ_GROUPS = [
  {
    title: "Allgemein",
    items: [
      { q: "Was ist KaufKompass AI?", a: "KaufKompass AI ist eine KI-gestützte Analyseplattform für Kaufentscheidungen. Du lädst ein Angebot hoch, gibst Daten ein und erhältst einen strukturierten Bericht mit Preisbewertung, Kostenaufstellung und Handlungsempfehlungen." },
      { q: "Für wen ist die Plattform geeignet?", a: "Für alle, die vor einer größeren Kaufentscheidung stehen – ob Immobilienkauf, Gebrauchtwagen, Wärmepumpe, Küche oder Versicherung. Die Plattform ist für Privatpersonen in Deutschland konzipiert." },
      { q: "Muss ich mich registrieren?", a: "Für Demo-Analysen ist keine Registrierung erforderlich. Für kostenpflichtige Analysen und den Zugang zu gespeicherten Berichten ist ein Konto notwendig." },
    ],
  },
  {
    title: "Analysen & Ergebnisse",
    items: [
      { q: "Wie genau sind die Analysen?", a: "Die Qualität hängt von den verfügbaren Daten ab. Berechnungen basieren auf deinen Eingaben und dokumentierten Referenzwerten. Wenn Daten fehlen oder unsicher sind, wird das im Bericht ausgewiesen." },
      { q: "Woher stammen die Vergleichspreise?", a: "Wir nutzen öffentlich zugängliche Quellen, Marktberichte und Referenzwerte. Jeder Datenpunkt ist mit Quelle und Datum versehen. Wenn keine verlässlichen Vergleichsdaten vorliegen, erfinden wir keine." },
      { q: "Kann ich mehrere Angebote vergleichen?", a: "Ja – mit dem Vergleichspaket kannst du bis zu drei Angebote derselben Kategorie gegenüberstellen. Unterschiede in Leistung, Preis und Risiken werden übersichtlich aufgezeigt." },
    ],
  },
  {
    title: "Dokumente & Datenschutz",
    items: [
      { q: "Was passiert mit meinen hochgeladenen Dokumenten?", a: "Dokumente werden nur für deine aktuelle Analyse verarbeitet. Sie werden nicht dauerhaft gespeichert und nicht für das Training von KI-Modellen verwendet." },
      { q: "Welche Dateiformate werden unterstützt?", a: "PDF, JPG, PNG und WEBP. Maximale Dateigröße: 10 MB pro Datei." },
      { q: "Sind meine Daten sicher?", a: "Alle Verbindungen sind verschlüsselt (HTTPS/TLS). Dokumente werden serverseitig verarbeitet und nicht im Browser gespeichert. Details zur Datenverarbeitung findest du in unserer Datenschutzerklärung." },
    ],
  },
  {
    title: "Preise & Zahlung",
    items: [
      { q: "Gibt es ein kostenloses Angebot?", a: "Ja. Der Schnellcheck ist dauerhaft kostenlos und zeigt eine vereinfachte Analyse ohne Detailbericht. Demo-Kategorien sind ebenfalls kostenlos zugänglich." },
      { q: "Gibt es ein Abonnement?", a: "Nein. Alle kostenpflichtigen Optionen werden einmalig abgerechnet. Kein Abo, keine automatische Verlängerung." },
      { q: "Was ist, wenn ich mit dem Ergebnis nicht zufrieden bin?", a: "Bei nachweislichen technischen Fehlern erstatten wir den Betrag. Wende dich an hallo@kaufkompass.ai mit einer kurzen Beschreibung." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-2xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] sm:text-4xl mb-3">Häufige Fragen</h1>
            <p className="text-[var(--muted-foreground)]">Antworten auf die wichtigsten Fragen zu KaufKompass AI.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-2xl space-y-10">
            {FAQ_GROUPS.map(({ title, items }) => (
              <div key={title}>
                <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">{title}</h2>
                <FaqSection items={items} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
