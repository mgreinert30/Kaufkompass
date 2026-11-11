"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2,
  Clock, ChevronRight, Printer, Share2
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import type { GespeicherteAnalyse } from "@/lib/storage/analysis-store";

// Tool-spezifische Result-Dashboard-Imports
import { ImmobilienResultDashboard } from "@/components/analyse/immobilien/result-dashboard";
import { GebrauchtwagenResultDashboard } from "@/components/analyse/gebrauchtwagen/result-dashboard";
import { PhotovoltaikResultDashboard } from "@/components/analyse/photovoltaik/result-dashboard";
import { SanierungResultDashboard } from "@/components/analyse/sanierung/result-dashboard";
import { WaermepumpeResultDashboard } from "@/components/analyse/waermepumpe/result-dashboard";
import { KuecheResultDashboard } from "@/components/analyse/kueche/result-dashboard";
import { FensterDachResultDashboard } from "@/components/analyse/fenster-dach/result-dashboard";

type LoadState = "loading" | "found" | "expired" | "error";

export default function ErgebnisPage() {
  const params = useParams();
  const router = useRouter();
  const analysisId = params.analysisId as string;

  const [state, setState] = useState<LoadState>("loading");
  const [analyse, setAnalyse] = useState<GespeicherteAnalyse | null>(null);

  useEffect(() => {
    if (!analysisId) return;
    fetch(`/api/ergebnis/${analysisId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAnalyse(data.analyse);
          setState("found");
        } else {
          setState("expired");
        }
      })
      .catch(() => setState("error"));
  }, [analysisId]);

  const dateString = analyse
    ? new Date(analyse.erstelltAm).toLocaleString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "";

  const toolPath = analyse ? `/analyse/${analyse.toolSlug}` : "/kategorien";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--background)]">
        <div className="container-page py-8 md:py-12">

          {/* Ladeindikator */}
          {state === "loading" && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#E4E8E1] border-t-[#14532D]" />
              <p className="text-sm text-[var(--muted-foreground)]">Analyse wird geladen…</p>
            </div>
          )}

          {/* Abgelaufen oder nicht gefunden */}
          {(state === "expired" || state === "error") && (
            <div className="mx-auto max-w-md py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FEF9C3]">
                <Clock className="h-8 w-8 text-[#854D0E]" />
              </div>
              <h1
                className="mb-3 text-2xl text-[var(--foreground)]"
                style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
              >
                Analyse nicht mehr verfügbar
              </h1>
              <p className="mb-8 text-[var(--muted-foreground)] leading-relaxed">
                Analyseergebnisse werden für 2 Stunden gespeichert. Diese Analyse ist
                abgelaufen oder nicht mehr verfügbar. Bitte führe die Analyse erneut durch.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="primary" size="md" asChild>
                  <Link href="/kategorien">
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    Neue Analyse starten
                  </Link>
                </Button>
                <Button variant="outline" size="md" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Zurück
                </Button>
              </div>
            </div>
          )}

          {/* Ergebnis gefunden */}
          {state === "found" && analyse && (
            <>
              {/* Breadcrumb + Header */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Link href="/" className="hover:text-[#14532D] transition-colors no-underline">Start</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href="/kategorien" className="hover:text-[#14532D] transition-colors no-underline">Kategorien</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href={toolPath} className="hover:text-[#14532D] transition-colors no-underline">{analyse.toolTitle}</Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span>Ergebnis</span>
                  </div>
                  <h1
                    className="text-3xl text-[var(--foreground)]"
                    style={{ fontFamily: "var(--font-dm-serif), Georgia, serif" }}
                  >
                    {analyse.toolTitle} – Analyse
                  </h1>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Erstellt am {dateString}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    aria-label="Drucken"
                  >
                    <Printer className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1.5">Drucken</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link kopiert!");
                    }}
                    aria-label="Link teilen"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline ml-1.5">Teilen</span>
                  </Button>
                </div>
              </div>

              {/* KI-Status-Banner */}
              {!analyse.ki_verfuegbar && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#C2410C]" aria-hidden="true" />
                  <div className="text-sm">
                    <p className="font-semibold text-[#C2410C]">Berechnungen ohne KI-Interpretation</p>
                    <p className="mt-0.5 text-[#9A3412]">
                      Die deterministische Berechnung ist vollständig. Die KI-Analyse konnte nicht
                      durchgeführt werden (kein API-Key konfiguriert).
                    </p>
                  </div>
                </div>
              )}

              {analyse.ki_verfuegbar && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#16A34A]" aria-hidden="true" />
                  <p className="text-sm text-[#15803D]">
                    <strong>Vollständige Analyse:</strong> Deterministische Berechnungen + KI-Interpretation.
                  </p>
                </div>
              )}

              {/* Tool-spezifisches Dashboard */}
              <ToolDashboard analyse={analyse} />

              {/* Zurück-Button */}
              <div className="mt-10 flex flex-wrap gap-3">
                <Button variant="outline" size="md" asChild>
                  <Link href={toolPath}>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Neue Analyse starten
                  </Link>
                </Button>
                <Button variant="outline" size="md" asChild>
                  <Link href="/kategorien">Alle Kategorien</Link>
                </Button>
              </div>

              {/* Hinweis */}
              <p className="mt-6 text-xs text-[var(--muted-foreground)] text-center">
                Analyseergebnisse sind 2 Stunden verfügbar. Diese Analyse ersetzt keine
                Fach-, Rechts- oder Steuerberatung.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// Leitet an das richtige Result-Dashboard weiter
function ToolDashboard({ analyse }: { analyse: GespeicherteAnalyse }) {
  const result = {
    calculations: analyse.berechnungen,
    ki_analyse: analyse.ki_analyse,
    ki_verfuegbar: analyse.ki_verfuegbar,
  };

  switch (analyse.toolSlug) {
    case "immobilien-kaufcheck":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <ImmobilienResultDashboard result={result as any} />;
    case "gebrauchtwagen-check":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <GebrauchtwagenResultDashboard result={result as any} />;
    case "photovoltaik-check":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <PhotovoltaikResultDashboard result={result as any} />;
    case "sanierungskosten-check":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <SanierungResultDashboard result={result as any} />;
    case "waermepumpen-check":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <WaermepumpeResultDashboard result={result as any} />;
    case "kuechen-kaufcheck":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <KuecheResultDashboard result={result as any} />;
    case "fenster-dach-check":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <FensterDachResultDashboard result={result as any} />;
    default:
      return <UnbekanntesTool analyse={analyse} />;
  }
}

function UnbekanntesTool({ analyse }: { analyse: GespeicherteAnalyse }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h2 className="font-semibold text-[var(--foreground)] mb-4">{analyse.toolTitle}</h2>
      <pre className="text-xs text-[var(--muted-foreground)] overflow-auto">
        {JSON.stringify(analyse.berechnungen, null, 2)}
      </pre>
    </div>
  );
}
