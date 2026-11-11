"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BeratungsResultDashboard, type BeratungsResult } from "@/components/analyse/generic/beratungs-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Wifi, AlertCircle } from "lucide-react";
type PageState = "form" | "loading" | "result" | "error";
export default function InternetMobilCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<BeratungsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ tarifArt: "internet", anbieter: "", monatspreis: "", laufzeit: "24", downloadGescwindigkeit: "", datenvolumen: "", aktionspreisMonat: "", normalpreis: "", zusatzAngaben: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const lbl = "block text-sm font-medium text-[var(--foreground)] mb-1";
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = { tarifArt: form.tarifArt as "internet"|"mobil"|"kombitarif", anbieter: form.anbieter || undefined, monatspreis: form.monatspreis ? Number(form.monatspreis) : undefined, laufzeit: form.laufzeit ? Number(form.laufzeit) : undefined, downloadGescwindigkeit: form.downloadGescwindigkeit ? Number(form.downloadGescwindigkeit) : undefined, datenvolumen: form.datenvolumen || undefined, aktionspreisMonat: form.aktionspreisMonat ? Number(form.aktionspreisMonat) : undefined, normalpreis: form.normalpreis ? Number(form.normalpreis) : undefined, zusatzAngaben: form.zusatzAngaben || undefined };
      const res = await fetch("/api/analyse/internet-mobil-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
            <Link href="/" className="hover:text-[var(--foreground)]">Start</Link><span>/</span>
            <Link href="/kategorien" className="hover:text-[var(--foreground)]">Kategorien</Link><span>/</span>
            <span className="text-[var(--foreground)]">Internet & Mobil-Check</span>
          </nav>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow"><Wifi className="h-6 w-6" /></div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Internet- & Mobil-Check</h1>
              <p className="text-[var(--muted-foreground)] mt-1 text-sm">Internet- und Handytarife prüfen – Aktionspreisfallen erkennen.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 card-base p-6">
              {state === "loading" && <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /></div>}
              {state === "result" && result && (<><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2><button onClick={() => setState("form")} className="text-xs text-[#16A34A] underline">Neue Analyse</button></div><BeratungsResultDashboard result={result} /></>)}
              {(state === "form" || state === "error") && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-semibold text-[var(--foreground)] mb-5">Tarif-Daten</h2>
                  {state === "error" && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}</div>}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div><label className={lbl}>Tarifart *</label><select value={form.tarifArt} onChange={set("tarifArt")} className={cls} required><option value="internet">Internet (DSL/Kabel/Glasfaser)</option><option value="mobil">Mobilfunk</option><option value="kombitarif">Kombi-Tarif</option></select></div>
                    <div><label className={lbl}>Anbieter</label><input type="text" value={form.anbieter} onChange={set("anbieter")} placeholder="Telekom, Vodafone, O2…" className={cls} maxLength={100} /></div>
                    <div><label className={lbl}>Monatspreis (€)</label><input type="number" value={form.monatspreis} onChange={set("monatspreis")} placeholder="39.99" className={cls} step={0.01} /></div>
                    <div><label className={lbl}>Laufzeit (Monate)</label><input type="number" value={form.laufzeit} onChange={set("laufzeit")} placeholder="24" className={cls} min={1} max={36} /></div>
                    <div><label className={lbl}>Download (Mbit/s)</label><input type="number" value={form.downloadGescwindigkeit} onChange={set("downloadGescwindigkeit")} placeholder="250" className={cls} /></div>
                    <div><label className={lbl}>Datenvolumen</label><input type="text" value={form.datenvolumen} onChange={set("datenvolumen")} placeholder="Unbegrenzt, 20 GB…" className={cls} maxLength={50} /></div>
                    <div><label className={lbl}>Aktionspreis für X Monate</label><input type="number" value={form.aktionspreisMonat} onChange={set("aktionspreisMonat")} placeholder="12" className={cls} /></div>
                    <div><label className={lbl}>Normalpreis danach (€)</label><input type="number" value={form.normalpreis} onChange={set("normalpreis")} placeholder="59.99" className={cls} step={0.01} /></div>
                  </div>
                  <div><label className={lbl}>Weitere Angaben</label><textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Besonderheiten, Router…" className={cls} maxLength={500} /></div>
                  <Button type="submit" variant="primary" size="lg" className="w-full">Jetzt analysieren</Button>
                </form>
              )}
            </div>
            <div className="card-base p-5"><h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3><ul className="space-y-2 text-sm text-[var(--muted-foreground)]">{["Tarifart", "Optional: Monatspreis, Laufzeit", "Optional: Aktionspreis und Normalpreis"].map((i) => <li key={i} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{i}</li>)}</ul></div>
          </div>
        </div>
      </section>
    </main>
    <Footer /></>
  );
}
