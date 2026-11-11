"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BeratungsResultDashboard, type BeratungsResult } from "@/components/analyse/generic/beratungs-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Heart, AlertCircle } from "lucide-react";
type PageState = "form" | "loading" | "result" | "error";
export default function HochzeitCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<BeratungsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ budget: "", gaestezahl: "", location: "", locationPreis: "", catering: "", cateringPreis: "", fotograf: "", musik: "", blumen: "", kleidung: "", zusatzAngaben: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const lbl = "block text-sm font-medium text-[var(--foreground)] mb-1";
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = { budget: form.budget ? Number(form.budget) : undefined, gaestezahl: form.gaestezahl ? Number(form.gaestezahl) : undefined, location: form.location || undefined, locationPreis: form.locationPreis ? Number(form.locationPreis) : undefined, catering: form.catering || undefined, cateringPreis: form.cateringPreis ? Number(form.cateringPreis) : undefined, fotograf: form.fotograf ? Number(form.fotograf) : undefined, musik: form.musik ? Number(form.musik) : undefined, blumen: form.blumen ? Number(form.blumen) : undefined, kleidung: form.kleidung ? Number(form.kleidung) : undefined, zusatzAngaben: form.zusatzAngaben || undefined };
      const res = await fetch("/api/analyse/hochzeit-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
            <Link href="/" className="hover:text-[var(--foreground)]">Start</Link><span>/</span><Link href="/kategorien" className="hover:text-[var(--foreground)]">Kategorien</Link><span>/</span><span className="text-[var(--foreground)]">Hochzeits-Check</span>
          </nav>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow"><Heart className="h-6 w-6" /></div>
            <div><h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Hochzeits-Check</h1><p className="text-[var(--muted-foreground)] mt-1 text-sm">Hochzeitsbudget prüfen – Einsparpotenziale und vergessene Positionen erkennen.</p></div>
          </div>
        </div>
      </section>
      <section className="section-padding"><div className="container-page"><div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 card-base p-6">
          {state === "loading" && <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /></div>}
          {state === "result" && result && (<><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2><button onClick={() => setState("form")} className="text-xs text-[#16A34A] underline">Neue Analyse</button></div><BeratungsResultDashboard result={result} /></>)}
          {(state === "form" || state === "error") && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-semibold text-[var(--foreground)] mb-5">Hochzeits-Budget</h2>
              {state === "error" && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}</div>}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div><label className={lbl}>Gesamtbudget (€)</label><input type="number" value={form.budget} onChange={set("budget")} placeholder="20000" className={cls} /></div>
                <div><label className={lbl}>Gästezahl</label><input type="number" value={form.gaestezahl} onChange={set("gaestezahl")} placeholder="80" className={cls} /></div>
                <div><label className={lbl}>Location (Bezeichnung)</label><input type="text" value={form.location} onChange={set("location")} placeholder="Schloss, Restaurant, Eventlocation…" className={cls} maxLength={200} /></div>
                <div><label className={lbl}>Location (€)</label><input type="number" value={form.locationPreis} onChange={set("locationPreis")} placeholder="3000" className={cls} /></div>
                <div><label className={lbl}>Catering (€)</label><input type="number" value={form.cateringPreis} onChange={set("cateringPreis")} placeholder="8000" className={cls} /></div>
                <div><label className={lbl}>Fotograf (€)</label><input type="number" value={form.fotograf} onChange={set("fotograf")} placeholder="2000" className={cls} /></div>
                <div><label className={lbl}>Musik/DJ (€)</label><input type="number" value={form.musik} onChange={set("musik")} placeholder="1500" className={cls} /></div>
                <div><label className={lbl}>Kleidung (€)</label><input type="number" value={form.kleidung} onChange={set("kleidung")} placeholder="2500" className={cls} /></div>
              </div>
              <div><label className={lbl}>Weitere Angaben</label><textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Besondere Wünsche, Vertragsklauseln…" className={cls} maxLength={500} /></div>
              <Button type="submit" variant="primary" size="lg" className="w-full">Jetzt analysieren</Button>
            </form>
          )}
        </div>
        <div className="card-base p-5"><h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3><ul className="space-y-2 text-sm text-[var(--muted-foreground)]">{["Optional: Gesamtbudget, Gästezahl", "Optional: Location, Catering, Fotograf", "Optional: Musik, Kleidung"].map((i) => <li key={i} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{i}</li>)}</ul></div>
      </div></div></section>
    </main><Footer /></>
  );
}
