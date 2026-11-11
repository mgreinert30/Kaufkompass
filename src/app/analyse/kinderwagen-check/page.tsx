"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GenericKiResultDashboard, type GenericKiResult } from "@/components/analyse/generic/ki-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { Baby, CheckCircle2, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "result" | "error";

interface FormData {
  typ: string; angebotspreis: string; hersteller: string; modell: string;
  gewichtKg: string; faltbar: string; nutzungszeitraum: string; zusatzAngaben: string;
}

export default function KinderwagenCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<GenericKiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [form, setForm] = useState<FormData>({
    typ: "kombikinderwagen", angebotspreis: "", hersteller: "", modell: "",
    gewichtKg: "", faltbar: "true", nutzungszeitraum: "neugeboren", zusatzAngaben: "",
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = {
        typ: form.typ, angebotspreis: Number(form.angebotspreis),
        hersteller: form.hersteller || undefined, modell: form.modell || undefined,
        gewichtKg: form.gewichtKg ? Number(form.gewichtKg) : undefined,
        faltbar: form.faltbar === "true",
        nutzungszeitraum: form.nutzungszeitraum || undefined,
        zusatzAngaben: form.zusatzAngaben || undefined,
      };
      const res = await fetch("/api/analyse/kinderwagen-check", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setErrorMsg(data.error ?? "Fehler"); setState("error"); return; }
      if (data.analysisId) { router.push(`/ergebnis/${data.analysisId}`); return; }
      setResult(data.result as GenericKiResult); setState("result");
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
              <span className="text-[var(--foreground)]">Kinderwagen-Check</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow">
                <Baby className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Kinderwagen-Check</h1>
                <p className="text-[var(--muted-foreground)] mt-1 text-sm">Preis- und Sicherheitscheck für Kinderwagen – mit KI-Kaufberatung.</p>
              </div>
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
                        {state === "loading" ? "Analyse läuft…" : "Kinderwagen-Daten"}
                      </h2>
                      {state === "loading" && (
                        <div className="space-y-4">
                          <Skeleton className="h-8 w-3/4" /><Skeleton className="h-8 w-1/2" /><Skeleton className="h-24 w-full" />
                        </div>
                      )}
                      {(state === "form" || state === "error") && (
                        <form onSubmit={handleSubmit} className="space-y-5">
                          {state === "error" && (
                            <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />{errorMsg}
                            </div>
                          )}
                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                              <label className={labelCls}>Kinderwagen-Typ *</label>
                              <select value={form.typ} onChange={set("typ")} className={inputCls} required>
                                <option value="kombikinderwagen">Kombikinderwagen</option>
                                <option value="buggy">Buggy / Leichtkinderwagen</option>
                                <option value="joggingkinderwagen">Joggingkinderwagen</option>
                                <option value="reisebuggy">Reisebuggy</option>
                                <option value="geschwisterwagen">Geschwisterwagen</option>
                                <option value="tragetasche">Tragetasche / Tragehilfe</option>
                                <option value="sonstiges">Sonstiges</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Angebotspreis (€) *</label>
                              <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="599" className={inputCls} required min={20} max={5000} />
                            </div>
                            <div>
                              <label className={labelCls}>Hersteller</label>
                              <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Bugaboo, Stokke, Cybex…" className={inputCls} maxLength={100} />
                            </div>
                            <div>
                              <label className={labelCls}>Modell</label>
                              <input type="text" value={form.modell} onChange={set("modell")} placeholder="Modellbezeichnung…" className={inputCls} maxLength={100} />
                            </div>
                            <div>
                              <label className={labelCls}>Eigengewicht (kg)</label>
                              <input type="number" value={form.gewichtKg} onChange={set("gewichtKg")} placeholder="8" className={inputCls} min={1} max={30} />
                            </div>
                            <div>
                              <label className={labelCls}>Nutzungsbeginn</label>
                              <select value={form.nutzungszeitraum} onChange={set("nutzungszeitraum")} className={inputCls}>
                                <option value="neugeboren">Ab Geburt</option>
                                <option value="ab_6monate">Ab 6 Monate</option>
                                <option value="ab_1jahr">Ab 1 Jahr</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>Weitere Angaben</label>
                            <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Besonderheiten, Zubehör, Verwendungszweck…" className={inputCls} maxLength={500} />
                          </div>
                          <Button type="submit" variant="primary" size="lg" className="w-full">Jetzt analysieren</Button>
                        </form>
                      )}
                    </>
                  )}
                  {state === "result" && result && (
                    <>
                      <div className="flex items-center justify-between mb-5">
                        <h2 className="font-semibold text-[var(--foreground)]">Analyseergebnis</h2>
                        <button onClick={() => setState("form")} className="text-xs text-[#16A34A] hover:text-[#14532D] underline underline-offset-2">Neue Analyse</button>
                      </div>
                      <GenericKiResultDashboard result={result} />
                    </>
                  )}
                </div>
              </div>
              <div className="card-base p-5">
                <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Was du benötigst</h3>
                <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                  {["Kinderwagen-Typ", "Angebotspreis", "Optional: Hersteller, Modell, Gewicht"].map((item) => (
                    <li key={item} className="flex items-start gap-2"><span className="text-[#16A34A] font-bold shrink-0">·</span>{item}</li>
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
