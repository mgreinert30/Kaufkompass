"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GenericKiResultDashboard, type GenericKiResult } from "@/components/analyse/generic/ki-result-dashboard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/loading-skeleton";
import { BedDouble, CheckCircle2, AlertCircle } from "lucide-react";

type PageState = "form" | "loading" | "result" | "error";

interface FormData {
  matratzenTyp: string; haertegrad: string; angebotspreis: string;
  hersteller: string; modell: string; koerpergewicht: string;
  schlaflage: string; garantieJahre: string; mitProbeliegen: string; zusatzAngaben: string;
}

export default function MatratzenCheckPage() {
  const router = useRouter();
  const [state, setState] = useState<PageState>("form");
  const [result, setResult] = useState<GenericKiResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [form, setForm] = useState<FormData>({
    matratzenTyp: "taschenfederkern", haertegrad: "H3", angebotspreis: "",
    hersteller: "", modell: "", koerpergewicht: "", schlaflage: "seite",
    garantieJahre: "2", mitProbeliegen: "false", zusatzAngaben: "",
  });

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setState("loading"); setErrorMsg("");
    try {
      const payload = {
        matratzenTyp: form.matratzenTyp, haertegrad: form.haertegrad,
        angebotspreis: Number(form.angebotspreis),
        hersteller: form.hersteller || undefined, modell: form.modell || undefined,
        koerpergewicht: form.koerpergewicht ? Number(form.koerpergewicht) : undefined,
        schlaflage: form.schlaflage || undefined,
        garantieJahre: form.garantieJahre ? Number(form.garantieJahre) : undefined,
        mitProbeliegen: form.mitProbeliegen === "true",
        zusatzAngaben: form.zusatzAngaben || undefined,
      };
      const res = await fetch("/api/analyse/matratzen-check", {
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
              <span className="text-[var(--foreground)]">Matratzen-Check</span>
            </nav>
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#14532D] text-white shadow">
                <BedDouble className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">KI-Matratzen-Check</h1>
                <p className="text-[var(--muted-foreground)] mt-1 text-sm">Preis- und Qualitätscheck für Matratzen – mit KI-Schlafberatung.</p>
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
                        {state === "loading" ? "Analyse läuft…" : "Matratzen-Daten"}
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
                              <label className={labelCls}>Matratzentyp *</label>
                              <select value={form.matratzenTyp} onChange={set("matratzenTyp")} className={inputCls} required>
                                <option value="kaltschaum">Kaltschaum</option>
                                <option value="taschenfederkern">Taschenfederkern</option>
                                <option value="latex">Latex</option>
                                <option value="visco">Visco / Memory Foam</option>
                                <option value="gel">Gel</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="wasserbett">Wasserbett</option>
                                <option value="sonstiges">Sonstiges</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Härtegrad</label>
                              <select value={form.haertegrad} onChange={set("haertegrad")} className={inputCls}>
                                <option value="H1">H1 (sehr weich)</option>
                                <option value="H2">H2 (weich)</option>
                                <option value="H3">H3 (mittel)</option>
                                <option value="H4">H4 (fest)</option>
                                <option value="H5">H5 (sehr fest)</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Angebotspreis (€) *</label>
                              <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="399" className={inputCls} required min={30} max={10000} />
                            </div>
                            <div>
                              <label className={labelCls}>Körpergewicht (kg)</label>
                              <input type="number" value={form.koerpergewicht} onChange={set("koerpergewicht")} placeholder="75" className={inputCls} min={30} max={300} />
                            </div>
                            <div>
                              <label className={labelCls}>Schlaflage</label>
                              <select value={form.schlaflage} onChange={set("schlaflage")} className={inputCls}>
                                <option value="seite">Seitenschläfer</option>
                                <option value="ruecken">Rückenschläfer</option>
                                <option value="bauch">Bauchschläfer</option>
                                <option value="wechsel">Wechselschläfer</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelCls}>Hersteller / Marke</label>
                              <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Emma, Casper, Ikea…" className={inputCls} maxLength={100} />
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>Weitere Angaben</label>
                            <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Größe, Allergien, besondere Anforderungen…" className={inputCls} maxLength={500} />
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
                  {["Matratzentyp", "Angebotspreis", "Optional: Körpergewicht, Schlaflage", "Optional: Hersteller, Garantie"].map((item) => (
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
