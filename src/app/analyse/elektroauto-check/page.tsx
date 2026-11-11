"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ElektroautoInputForm, type ElektroautoFormData } from "@/components/analyse/elektroauto/input-form";
import { ElektroautoResultDashboard, type ElektroautoResult } from "@/components/analyse/elektroauto/result-dashboard";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Zap, CheckCircle2, AlertCircle } from "lucide-react";

type PS = "form" | "loading" | "result" | "error";
const PP = ["TCO-Berechnung über 5 Jahre", "Ladekosten (Haushalt + öffentlich)", "Vergleich mit Verbrenner", "Ladeinfrastruktur-Kosten", "Förderhinweise 2024", "KI-Kaufempfehlung"];

export default function ElektroautoCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PS>("form");
  const [result, setResult] = useState<ElektroautoResult | null>(null);
  const [err, setErr] = useState("");

  async function handleSubmit(formData: ElektroautoFormData) {
    setState("loading"); setErr("");
    try {
      const payload = {
        kaufpreis: Number(formData.kaufpreis), reichweite: Number(formData.reichweite),
        akkuKapazitaet: Number(formData.akkuKapazitaet), jahresfahrleistung: Number(formData.jahresfahrleistung),
        strompreisHaushalt: Number(formData.strompreisHaushalt),
        strompreisOeffentlich: formData.strompreisOeffentlich ? Number(formData.strompreisOeffentlich) : undefined,
        ladeinfrastruktur: formData.ladeinfrastruktur, fahrzeugTyp: formData.fahrzeugTyp,
        vergleichsfahrzeugKraftstoff: formData.vergleichsfahrzeugKraftstoff ? Number(formData.vergleichsfahrzeugKraftstoff) : undefined,
        kraftstoffpreis: formData.kraftstoffpreis ? Number(formData.kraftstoffpreis) : undefined,
        fahrzeugModell: formData.fahrzeugModell || undefined, zusatzAngaben: formData.zusatzAngaben || undefined,
      };
      const res = await fetch("/api/analyse/elektroauto-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) { setErr(data.error ?? "Fehler"); setState("error"); return; }
      if (data.analysisId) { router.push(`/ergebnis/${data.analysisId}`); return; }
      setResult(data.result); setState("result");
    } catch { setErr("Netzwerkfehler"); setState("error"); }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-10">
          <div className="container-page">
            <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Start</Link><span>/</span>
              <Link href="/kategorien" className="hover:text-[var(--foreground)] transition-colors">Kategorien</Link><span>/</span>
              <span className="text-[var(--foreground)]">Elektroauto-Kostencheck</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow"><Zap className="h-6 w-6" /></div>
              <div><h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Elektroauto-Kostencheck</h1><p className="text-[var(--muted-foreground)] mt-1 text-sm">Berechne echte E-Auto-Kosten inkl. TCO und Verbrenner-Vergleich.</p></div>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">{PP.map(p => <div key={p} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />{p}</div>)}</div>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 card-base p-6">
                {state === "loading" && <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /><p className="text-sm text-center text-[var(--muted-foreground)] pt-4">TCO wird berechnet…</p></div>}
                {(state === "form" || state === "error") && (<>{state === "error" && <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{err}</div>}<ElektroautoInputForm onSubmit={handleSubmit} isLoading={false} /></>)}
                {state === "result" && result && (<><div className="flex items-center justify-between mb-5"><h2 className="font-semibold">Analyseergebnis</h2><button onClick={() => setState("form")} className="text-xs text-[#16A34A] hover:text-[#14532D] underline underline-offset-2">Neue Analyse</button></div><ElektroautoResultDashboard result={result} /></>)}
              </div>
              <div className="space-y-4">
                <div className="card-base p-5"><h3 className="font-semibold text-sm mb-3">Was du benötigst</h3><ul className="space-y-2 text-sm text-[var(--muted-foreground)]">{["Kaufpreis, Reichweite, Akkugröße", "Jahresfahrleistung", "Dein Stromtarif (ct/kWh)", "Optional: Verbrenner-Verbrauch zum Vergleich"].map(i => <li key={i} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{i}</li>)}</ul></div>
                <div className="rounded-lg border border-[var(--border)] p-4 text-xs text-[var(--muted-foreground)]"><p className="font-medium text-[var(--foreground)] mb-1">Transparenz</p><p>TCO-Berechnung nach ADAC-Methodik. Wartungskosten geschätzt. Steuerliche Aspekte nicht berücksichtigt.</p></div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
