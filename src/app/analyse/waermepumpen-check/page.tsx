"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WaermepumpeInputForm } from "@/components/analyse/waermepumpe/input-form";
import { WaermepumpeResultDashboard, type WaermepumpeResult } from "@/components/analyse/waermepumpe/result-dashboard";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "result" | "error";

const PRUEFPUNKTE = [
  "Heizwärmebedarf nach Gebäudetyp",
  "Betriebskosten im Vergleich zu Gas",
  "BAFA BEG WG Förderung 2024",
  "iSFP- und Einkommensbonus",
  "Amortisationszeit nach Förderung",
  "KI-Risikoanalyse und Fragen für Installateure",
];

export default function WaermepumpenCheckPage() {
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<WaermepumpeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(formData: {
    wohnflaeche: string; gebaeudetyp: string; wpTyp: string; angebotspreis: string;
    heizwaermebedarf: string; strompreisWP: string; gaspreisAktuell: string;
    mitISFP: boolean; einkommensbonus: boolean; zusatzAngaben: string;
  }) {
    setState("loading");
    setErrorMsg("");
    try {
      const payload = {
        wohnflaeche:      Number(formData.wohnflaeche),
        gebaeudetyp:      formData.gebaeudetyp,
        wpTyp:            formData.wpTyp,
        angebotspreis:    Number(formData.angebotspreis),
        heizwaermebedarf: formData.heizwaermebedarf ? Number(formData.heizwaermebedarf) : undefined,
        strompreisWP:     formData.strompreisWP ? Number(formData.strompreisWP) : undefined,
        gaspreisAktuell:  formData.gaspreisAktuell ? Number(formData.gaspreisAktuell) : undefined,
        mitISFP:          formData.mitISFP,
        einkommensbonus:  formData.einkommensbonus,
        zusatzAngaben:    formData.zusatzAngaben || undefined,
      };
      const res = await fetch("/api/analyse/waermepumpen-check", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setErrorMsg(data.error ?? "Fehler"); setState("error"); return; }
      setResult(data.result as WaermepumpeResult);
      setState("result");
      setTimeout(() => document.getElementById("analyse-ergebnis")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
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
              <span className="text-[var(--foreground)]">Wärmepumpen-Check</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Wärmepumpen-Check</h1>
                <p className="text-[var(--muted-foreground)] mt-1 text-sm">
                  Lohnt sich eine Wärmepumpe? Betriebskosten, BAFA-Förderung und Amortisation auf einen Blick.
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
                        {state === "loading" ? "Analyse läuft…" : "Gebäude & Anlage"}
                      </h2>
                      {state === "loading" && (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-24 w-full" />
                          <p className="text-sm text-center text-[var(--muted-foreground)] pt-4">Betriebskosten und Förderung werden berechnet…</p>
                        </div>
                      )}
                      {(state === "form" || state === "error") && (
                        <>
                          {state === "error" && (
                            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}
                            </div>
                          )}
                          <WaermepumpeInputForm onSubmit={handleSubmit} isLoading={false} />
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
                      <WaermepumpeResultDashboard result={result} />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="card-base p-5">
                  <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    {["Wohnfläche des Gebäudes", "Gebäudetyp (Dämmstandard)", "Wärmepumpentyp (Luft/Erde/Wasser)", "Angebotspreis inkl. Installation", "Optional: Heizwärmebedarf aus Energieausweis"].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-[#16A34A] font-bold shrink-0">·</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-[var(--border)] p-4 text-xs text-[var(--muted-foreground)]">
                  <p className="font-medium text-[var(--foreground)] mb-1">Wichtig</p>
                  <p>BAFA-Antrag muss VOR Auftragserteilung gestellt werden. BAFA-Höchstbetrag 30.000 € je Wohneinheit EFH.</p>
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
