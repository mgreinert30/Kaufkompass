"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FensterDachInputForm } from "@/components/analyse/fenster-dach/input-form";
import { FensterDachResultDashboard, type FensterDachResult } from "@/components/analyse/fenster-dach/result-dashboard";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Building2, CheckCircle2, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "result" | "error";

const PRUEFPUNKTE = [
  "Referenzpreise je Maßnahme und Einheit",
  "Angebotsvergleich mit Marktdurchschnitt",
  "BAFA BEG EM Förderung (15 % + iSFP-Bonus)",
  "Nettokosten nach Förderung",
  "Typische fehlende Positionen",
  "KI-Fragen für den Handwerker",
];

export default function FensterDachCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<FensterDachResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(formData: {
    massnahme: string; anzahlFenster: string; fensterFlaeche: string;
    dachFlaeche: string; angebotspreis: string; baujahr: string;
    mitISFP: boolean; bundesland: string; zusatzAngaben: string;
  }) {
    setState("loading");
    setErrorMsg("");
    try {
      const payload = {
        massnahme:      formData.massnahme,
        anzahlFenster:  formData.anzahlFenster  ? Number(formData.anzahlFenster)  : undefined,
        fensterFlaeche: formData.fensterFlaeche ? Number(formData.fensterFlaeche) : undefined,
        dachFlaeche:    formData.dachFlaeche    ? Number(formData.dachFlaeche)    : undefined,
        angebotspreis:  formData.angebotspreis  ? Number(formData.angebotspreis)  : undefined,
        baujahr:        formData.baujahr        ? Number(formData.baujahr)        : undefined,
        mitISFP:        formData.mitISFP,
        bundesland:     formData.bundesland || undefined,
        zusatzAngaben:  formData.zusatzAngaben || undefined,
      };
      const res = await fetch("/api/analyse/fenster-dach-check", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setErrorMsg(data.error ?? "Fehler"); setState("error"); return; }
      if (data.analysisId) { router.push(`/ergebnis/${data.analysisId}`); return; }
      setResult(data.result as FensterDachResult);
      setState("result");
    } catch { setErrorMsg("Netzwerkfehler – bitte erneut versuchen."); setState("error"); }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-10">
          <div className="container-page">
            <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Start</Link>
              <span>/</span>
              <Link href="/kategorien" className="hover:text-[var(--foreground)] transition-colors">Kategorien</Link>
              <span>/</span>
              <span className="text-[var(--foreground)]">Fenster- und Dachcheck</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Fenster- und Dachcheck</h1>
                <p className="text-[var(--muted-foreground)] mt-1 text-sm">
                  Prüfe Modernisierungsangebote für Fenster und Dach – mit Förderung und Referenzpreisen.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {PRUEFPUNKTE.map((p) => (
                <div key={p} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{p}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="card-base p-6">
                  {state !== "result" && (
                    <>
                      <h2 className="font-semibold text-[var(--foreground)] mb-5">
                        {state === "loading" ? "Analyse läuft…" : "Maßnahme und Angaben"}
                      </h2>
                      {state === "loading" && (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-24 w-full" />
                          <p className="text-sm text-center text-[var(--muted-foreground)] pt-4">Referenzpreise und Förderung werden berechnet…</p>
                        </div>
                      )}
                      {(state === "form" || state === "error") && (
                        <>
                          {state === "error" && (
                            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}
                            </div>
                          )}
                          <FensterDachInputForm onSubmit={handleSubmit} isLoading={false} />
                        </>
                      )}
                    </>
                  )}
                  {state === "result" && result && (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2>
                        <button onClick={() => setState("form")} className="text-xs text-[#16A34A] hover:text-[#14532D] underline underline-offset-2">
                          Neue Analyse
                        </button>
                      </div>
                      <FensterDachResultDashboard result={result} />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="card-base p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    {["Maßnahmenart (Fenster/Dach)", "Optional: Anzahl/Fläche", "Optional: Vorliegendes Angebot", "Optional: Baujahr für Dämmklasse"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#16A34A] font-bold shrink-0">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-[var(--border)] p-4 text-xs text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)] mb-1">Transparenz</p>
                  <p>Referenzpreise aus Destatis Baupreisen und BHB Marktdaten. BAFA-Förderbedingungen ändern sich – immer direkt beim BAFA prüfen.</p>
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
