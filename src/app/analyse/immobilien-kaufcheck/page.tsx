"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ImmobilienInputForm } from "@/components/analyse/immobilien/input-form";
import { ImmobilienResultDashboard, type AnalyseResult } from "@/components/analyse/immobilien/result-dashboard";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { House, CheckCircle2, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "result" | "error";

const PRUEFPUNKTE = [
  "Kaufnebenkosten je Bundesland (Grunderwerbsteuer, Notar, Makler)",
  "Fremdkapitalbedarf und Finanzierungsszenarien",
  "Monatsrate bei verschiedenen Zinssätzen",
  "Kaufpreis pro Quadratmeter",
  "KI-Interpretation und Risikohinweise",
  "Fragen für Besichtigung und Verhandlung",
];

export default function ImmobilienKaufcheckPage() {
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(formData: {
    bundesland: string;
    immobilientyp: string;
    wohnflaeche: string;
    baujahr: string;
    kaufpreis: string;
    eigenkapital: string;
    mitMakler: boolean;
    zusatzAngaben: string;
  }) {
    setState("loading");
    setErrorMsg("");

    try {
      const payload = {
        bundesland:    formData.bundesland,
        immobilientyp: formData.immobilientyp,
        kaufpreis:     Number(formData.kaufpreis),
        eigenkapital:  Number(formData.eigenkapital),
        mitMakler:     formData.mitMakler,
        wohnflaeche:   formData.wohnflaeche ? Number(formData.wohnflaeche) : undefined,
        baujahr:       formData.baujahr ? Number(formData.baujahr) : undefined,
        zusatzAngaben: formData.zusatzAngaben || undefined,
      };

      const res = await fetch("/api/analyse/immobilien-kaufcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error ?? "Unbekannter Fehler");
        setState("error");
        return;
      }

      setResult(data.result as AnalyseResult);
      setState("result");

      // Zum Ergebnis scrollen
      setTimeout(() => {
        document.getElementById("analyse-ergebnis")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setErrorMsg("Netzwerkfehler – bitte versuche es erneut.");
      setState("error");
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-10">
          <div className="container-page">
            <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Start</Link>
              <span>/</span>
              <Link href="/kategorien" className="hover:text-[var(--foreground)] transition-colors">Kategorien</Link>
              <span>/</span>
              <Link href="/kategorien/immobilien-kaufcheck" className="hover:text-[var(--foreground)] transition-colors">Immobilien-Kaufcheck</Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">Analyse</span>
            </nav>

            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white shadow">
                <House className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
                  KI-Immobilien-Kaufcheck
                </h1>
                <p className="text-[var(--muted-foreground)] mt-1 text-sm">
                  Prüfe, was dich eine Immobilie tatsächlich kosten kann – bevor du dich bindest.
                </p>
              </div>
            </div>

            {/* Was wird geprüft */}
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {PRUEFPUNKTE.map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  {p}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hauptbereich */}
        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Formular */}
              <div className="lg:col-span-2">
                <div className="card-base p-6">
                  {state !== "result" && (
                    <>
                      <h2 className="font-semibold text-[var(--foreground)] mb-5">
                        {state === "loading" ? "Analyse läuft…" : "Deine Angaben"}
                      </h2>
                      {state === "loading" && (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-24 w-full" />
                          <p className="text-sm text-center text-[var(--muted-foreground)] pt-4">
                            Kaufnebenkosten werden berechnet…
                          </p>
                        </div>
                      )}
                      {(state === "form" || state === "error") && (
                        <>
                          {state === "error" && (
                            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                              {errorMsg}
                            </div>
                          )}
                          <ImmobilienInputForm
                            onSubmit={handleSubmit}
                            isLoading={false}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* Ergebnis */}
                  {state === "result" && result && (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2>
                        <button
                          onClick={() => setState("form")}
                          className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
                        >
                          Neue Analyse
                        </button>
                      </div>
                      <ImmobilienResultDashboard result={result} />
                    </>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                <div className="card-base p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    {[
                      "Bundesland des Objekts",
                      "Angebotspreis",
                      "Dein verfügbares Eigenkapital",
                      "Optional: Wohnfläche und Baujahr",
                      "Optional: Besonderheiten aus dem Exposé",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card-base p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du bekommst</h3>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    {[
                      "Exakte Kaufnebenkosten je Bundesland",
                      "3 Finanzierungsszenarien",
                      "KI-Interpretation der Daten",
                      "Risiken und Fragen für die Besichtigung",
                      "Transparente Quellenangaben",
                      "Druckbaren Bericht",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-[var(--border)] p-4 text-xs text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)] mb-1">Transparenz</p>
                  <p>
                    Die Kaufnebenkosten werden mit amtlichen Steuersätzen berechnet.
                    Regionale Marktpreisvergleiche sind nicht verfügbar.
                    Diese Analyse ersetzt keine Rechts- oder Finanzberatung.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
