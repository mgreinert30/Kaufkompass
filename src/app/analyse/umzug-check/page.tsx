"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BeratungsResultDashboard, type BeratungsResult } from "@/components/analyse/generic/beratungs-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Package, AlertCircle } from "lucide-react";
type PageState = "form" | "loading" | "result" | "error";
export default function UmzugCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<BeratungsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ anbieter: "", angebotspreis: "", entfernungKm: "", wohnflaeche: "", etage: "", umzugsLeistungen: "", zusatzAngaben: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const lbl = "block text-sm font-medium text-[var(--foreground)] mb-1";
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = { anbieter: form.anbieter || undefined, angebotspreis: form.angebotspreis ? Number(form.angebotspreis) : undefined, entfernungKm: form.entfernungKm ? Number(form.entfernungKm) : undefined, wohnflaeche: form.wohnflaeche ? Number(form.wohnflaeche) : undefined, etage: form.etage ? Number(form.etage) : undefined, umzugsLeistungen: form.umzugsLeistungen || undefined, zusatzAngaben: form.zusatzAngaben || undefined };
      const res = await fetch("/api/analyse/umzug-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) { setErrorMsg(data.error ?? "Fehler"); setState("error"); return; }
      if (data.analysisId) { router.push(`/ergebnis/${data.analysisId}`); return; }
      setResult(data.result as BeratungsResult); setState("result");
    } catch { setErrorMsg("Netzwerkfehler"); setState("error"); }
  }
  return (
    <><Header />
    <main className="min-h-screen">
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-10">
        <div className="container-page">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
            <Link href="/" className="hover:text-[var(--foreground)]">Start</Link><span>/</span><Link href="/kategorien" className="hover:text-[var(--foreground)]">Kategorien</Link><span>/</span><span className="text-[var(--foreground)]">Umzugs-Check</span>
          </nav>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow"><Package className="h-6 w-6" /></div>
            <div><h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Umzugs-Check</h1><p className="text-[var(--muted-foreground)] mt-1 text-sm">Umzugsangebote prüfen – faire Preise und versteckte Kosten erkennen.</p></div>
          </div>
        </div>
      </section>
      <section className="section-padding"><div className="container-page"><div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 card-base p-6">
          {state === "loading" && <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /></div>}
          {state === "result" && result && (<><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2><button onClick={() => setState("form")} className="text-xs text-[#16A34A] underline">Neue Analyse</button></div><BeratungsResultDashboard result={result} /></>)}
          {(state === "form" || state === "error") && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-semibold text-[var(--foreground)] mb-5">Umzugsdaten</h2>
              {state === "error" && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}</div>}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div><label className={lbl}>Umzugsunternehmen</label><input type="text" value={form.anbieter} onChange={set("anbieter")} placeholder="Firmenname" className={cls} maxLength={100} /></div>
                <div><label className={lbl}>Angebotspreis (€) *</label><input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="1200" className={cls} required min={100} /></div>
                <div><label className={lbl}>Entfernung (km)</label><input type="number" value={form.entfernungKm} onChange={set("entfernungKm")} placeholder="50" className={cls} /></div>
                <div><label className={lbl}>Wohnfläche (m²)</label><input type="number" value={form.wohnflaeche} onChange={set("wohnflaeche")} placeholder="80" className={cls} /></div>
                <div><label className={lbl}>Etage (Auszug)</label><input type="number" value={form.etage} onChange={set("etage")} placeholder="3" className={cls} min={0} /></div>
              </div>
              <div><label className={lbl}>Enthaltene Leistungen</label><textarea value={form.umzugsLeistungen} onChange={set("umzugsLeistungen")} rows={2} placeholder="Transport, Auf-/Abbau, Verpackung…" className={cls} maxLength={300} /></div>
              <div><label className={lbl}>Weitere Angaben</label><textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Besonderheiten, Klauseldetails…" className={cls} maxLength={500} /></div>
              <Button type="submit" variant="primary" size="lg" className="w-full">Jetzt analysieren</Button>
            </form>
          )}
        </div>
        <div className="card-base p-5"><h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3><ul className="space-y-2 text-sm text-[var(--muted-foreground)]">{["Angebotspreis", "Optional: Entfernung, Wohnfläche, Etage", "Optional: Enthaltene Leistungen"].map((i) => <li key={i} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{i}</li>)}</ul></div>
      </div></div></section>
    </main><Footer /></>
  );
}
