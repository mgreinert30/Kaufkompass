import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BRANDING } from "@/config/branding";

export const metadata = {
  title: `Impressum – ${BRANDING.name}`,
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-12">
          <div className="container-page max-w-xl">
            <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Impressum</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Vorlage – noch nicht rechtsverbindlich geprüft</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page max-w-xl">
            <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 p-4 mb-8 text-sm text-amber-800 dark:text-amber-200">
              ⚠ Hinweis: Dieses Impressum ist eine Vorlage und muss vor dem Live-Betrieb mit den tatsächlichen Unternehmensdaten vervollständigt werden.
            </div>

            <div className="space-y-6 text-sm text-[var(--muted-foreground)]">
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Angaben gemäß § 5 TMG</p>
                <p>[Unternehmensname]<br />[Straße, Hausnummer]<br />[PLZ, Stadt]</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Vertreten durch</p>
                <p>[Name des Geschäftsführers]</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Kontakt</p>
                <p>E-Mail: {BRANDING.email}<br />Telefon: [Telefonnummer]</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Registereintrag</p>
                <p>[Handelsregister, Registernummer, Registergericht]</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Umsatzsteuer-Identifikationsnummer</p>
                <p>[gemäß § 27 a UStG: USt-IdNr.]</p>
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)] mb-1">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</p>
                <p>[Name, Anschrift]</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
