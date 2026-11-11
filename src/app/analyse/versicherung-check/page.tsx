"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BeratungsResultDashboard, type BeratungsResult } from "@/components/analyse/generic/beratungs-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "result" | "error";

export default function VersicherungCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<BeratungsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [form, setForm] = useState({ versicherungsArt: "", anbieter: "", jahresBeitrag: "", laufzeit: "", selbstbehalt: "", deckungssumme: "", zusatzAngaben: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const cls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const lbl = "block text-sm font-medium text-[var(--foreground)] mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = { versicherungsArt: form.versicherungsArt, anbieter: form.anbieter || undefined, jahresBeitrag: form.jahresBeitrag ? Number(form.jahresBeitrag) : undefined, laufzeit: form.laufzeit || undefined, selbstbehalt: form.selbstbehalt ? Number(form.selbstbehalt) : undefined, deckungssumme: form.deckungssumme || undefined, zusatzAngaben: form.zusatzAngaben || undefined };
      const res = await fetch("/api/analyse/versicherung-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok || !data.success) { setErrorMsg(data.error ?? "Fehler"); setState("error"); return; }
      if (data.analysisId) { router.push(`/ergebnis/${data.analysisId}`); return; }
      setResult(data.result as BeratungsResult); setState("result");
    } catch { setErrorMsg("Netzwerkfehler – bitte erneut versuchen."); setState("error"); }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <section className="border-b border-[var(--border)] bg-[var(--surface)] py-10">
          <div className="container-page">
            <nav className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] mb-5">
              <Link href="/" className="hover:text-[var(--foreground)]">Start</Link><span>/</span>
              <Link href="/kategorien" className="hover:text-[var(--foreground)]">Kategorien</Link><span>/</span>
              <span className="text-[var(--foreground)]">Versicherungs-Check</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow"><Shield className="h-6 w-6" /></div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Versicherungs-Check</h1>
                <p className="text-[var(--muted-foreground)] mt-1 text-sm">Prüfe Konditionen, Deckungslücken und ob das Angebot fair ist.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="section-padding">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="card-base p-6">
                  {state === "loading" && <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /></div>}
                  {state === "result" && result && (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2>
                        <button onClick={() => setState("form")} className="text-xs text-[#16A34A] underline">Neue Analyse</button>
                      </div>
                      <BeratungsResultDashboard result={result} />
                    </>
                  )}
                  {(state === "form" || state === "error") && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <h2 className="font-semibold text-[var(--foreground)] mb-5">Versicherungsdaten</h2>
                      {state === "error" && <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}</div>}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <label className={lbl}>Versicherungsart *</label>
                          <input type="text" value={form.versicherungsArt} onChange={set("versicherungsArt")} placeholder="z.B. Kfz-Haftpflicht, Hausrat, Berufsunfähigkeit…" className={cls} required maxLength={100} />
                        </div>
                        <div><label className={lbl}>Anbieter</label><input type="text" value={form.anbieter} onChange={set("anbieter")} placeholder="Allianz, HUK, AON…" className={cls} maxLength={100} /></div>
                        <div><label className={lbl}>Jahresbeitrag (€)</label><input type="number" value={form.jahresBeitrag} onChange={set("jahresBeitrag")} placeholder="350" className={cls} min={1} max={100000} /></div>
                        <div><label className={lbl}>Laufzeit</label><input type="text" value={form.laufzeit} onChange={set("laufzeit")} placeholder="1 Jahr, 3 Jahre…" className={cls} maxLength={50} /></div>
                        <div><label className={lbl}>Selbstbehalt (€)</label><input type="number" value={form.selbstbehalt} onChange={set("selbstbehalt")} placeholder="500" className={cls} min={0} /></div>
                      </div>
                      <div><label className={lbl}>Weitere Angaben</label><textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Deckungssummen, Ausschlüsse, Besonderheiten…" className={cls} maxLength={500} /></div>
                      <Button type="submit" variant="primary" size="lg" className="w-full">Jetzt analysieren</Button>
                    </form>
                  )}
                </div>
              </div>
              <div className="card-base p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3>
                <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                  {["Versicherungsart", "Optional: Anbieter, Jahresbeitrag", "Optional: Laufzeit, Selbstbehalt"].map((i) => (
                    <li key={i} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
