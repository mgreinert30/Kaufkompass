"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BeratungsResultDashboard, type BeratungsResult } from "@/components/analyse/generic/beratungs-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Flower2, AlertCircle } from "lucide-react";
type PageState = "form" | "loading" | "result" | "error";
export default function BestattungCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<BeratungsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ bestattungsArt: "", anbieter: "", gesamtkosten: "", sterbegeldVorhanden: "false", leistungsUmfang: "", zusatzAngaben: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const lbl = "block text-sm font-medium text-[var(--foreground)] mb-1";
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = { bestattungsArt: form.bestattungsArt || undefined, anbieter: form.anbieter || undefined, gesamtkosten: form.gesamtkosten ? Number(form.gesamtkosten) : undefined, sterbegeldVorhanden: form.sterbegeldVorhanden === "true", leistungsUmfang: form.leistungsUmfang || undefined, zusatzAngaben: form.zusatzAngaben || undefined };
      const res = await fetch("/api/analyse/bestattung-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
            <Link href="/" className="hover:text-[var(--foreground)]">Start</Link><span>/</span><Link href="/kategorien" className="hover:text-[var(--foreground)]">Kategorien</Link><span>/</span><span className="text-[var(--foreground)]">Bestattungs-Check</span>
          </nav>
          <div className="flex items-start gap-4 mb-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow"><Flower2 className="h-6 w-6" /></div>
            <div><h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Bestattungs-Check</h1><p className="text-[var(--muted-foreground)] mt-1 text-sm">Bestattungsangebote einfühlsam und sachlich prüfen – faire Preise und Verbraucherrechte.</p></div>
          </div>
        </div>
      </section>
      <section className="section-padding"><div className="container-page"><div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 card-base p-6">
          {state === "loading" && <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /></div>}
          {state === "result" && result && (<><div className="flex items-center justify-between mb-5"><h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2><button onClick={() => setState("form")} className="text-xs text-[#16A34A] underline">Neue Analyse</button></div><BeratungsResultDashboard result={result} /></>)}
          {(state === "form" || state === "error") && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="font-semibold text-[var(--foreground)] mb-5">Bestattungsdaten</h2>
              {state === "error" && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}</div>}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div><label className={lbl}>Bestattungsart</label><input type="text" value={form.bestattungsArt} onChange={set("bestattungsArt")} placeholder="Erdbestattung, Feuerbestattung, Seebestattung…" className={cls} maxLength={100} /></div>
                <div><label className={lbl}>Bestattungsunternehmen</label><input type="text" value={form.anbieter} onChange={set("anbieter")} placeholder="Firmenname" className={cls} maxLength={100} /></div>
                <div><label className={lbl}>Gesamtkosten (€)</label><input type="number" value={form.gesamtkosten} onChange={set("gesamtkosten")} placeholder="5000" className={cls} /></div>
                <div><label className={lbl}>Sterbegeld vorhanden</label><select value={form.sterbegeldVorhanden} onChange={set("sterbegeldVorhanden")} className={cls}><option value="false">Nein / unbekannt</option><option value="true">Ja</option></select></div>
              </div>
              <div><label className={lbl}>Leistungsumfang</label><textarea value={form.leistungsUmfang} onChange={set("leistungsUmfang")} rows={3} placeholder="Überführung, Sarg/Urne, Aufbahrung, Trauerfeier…" className={cls} maxLength={300} /></div>
              <div><label className={lbl}>Weitere Angaben</label><textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Besondere Wünsche, weitere Fragen…" className={cls} maxLength={500} /></div>
              <Button type="submit" variant="primary" size="lg" className="w-full">Jetzt analysieren</Button>
            </form>
          )}
        </div>
        <div className="card-base p-5"><h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3><ul className="space-y-2 text-sm text-[var(--muted-foreground)]">{["Optional: Bestattungsart, Anbieter", "Optional: Gesamtkosten", "Optional: Leistungsumfang"].map((i) => <li key={i} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{i}</li>)}</ul></div>
      </div></div></section>
    </main><Footer /></>
  );
}
