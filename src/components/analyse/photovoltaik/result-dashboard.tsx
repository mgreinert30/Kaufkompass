"use client";

import { AlertTriangle, CheckCircle2, Info, Sun, TrendingUp, Printer } from "lucide-react";

interface PVJahreBilanz {
  jahr: number;
  jahresertragKWh: number;
  einnahmenEuro: number;
  kumuliertEinnahmen: number;
  kumuliertKosten: number;
}

interface KiAnalyse {
  zusammenfassung: string;
  wirtschaftlichkeit: { einschaetzung: string; begruendung: string; einschraenkungen: string[] };
  risikohinweise: Array<{ schweregrad: "hoch" | "mittel" | "niedrig"; hinweis: string; empfehlung: string }>;
  fragenFuerAnbieter: string[];
  foerderHinweise: string[];
  einschraenkungen: string[];
}

export interface PhotovoltaikResult {
  calculations: {
    jahresertragKWh: number;
    eigenverbrauchKWh: number;
    einspeisungKWh: number;
    jahreseinnahmen: number;
    amortisationJahre: number | null;
    bilanz20Jahre: PVJahreBilanz[];
    annahmen: Array<{ bezeichnung: string; wert: string }>;
    anmerkungen: string[];
  };
  ki_analyse: KiAnalyse | null;
  ki_verfuegbar: boolean;
}

function fmt(n: number) { return n.toLocaleString("de-DE", { maximumFractionDigits: 0 }); }
function fmtEuro(n: number) { return `${fmt(n)} €`; }

function KpiCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`card-base p-4 ${highlight ? "border-[#14532D]" : ""}`}>
      <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${highlight ? "text-[#14532D]" : "text-[var(--foreground)]"}`}>{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  );
}

function SeverityIcon({ s }: { s: "hoch" | "mittel" | "niedrig" }) {
  if (s === "hoch") return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />;
  if (s === "mittel") return <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />;
  return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />;
}

export function PhotovoltaikResultDashboard({ result }: { result: PhotovoltaikResult }) {
  const { calculations: c, ki_analyse: ki } = result;

  // Amortisationsjahr finden
  const amortJahr = c.bilanz20Jahre.find((b) => b.kumuliertEinnahmen >= b.kumuliertKosten);

  return (
    <div className="space-y-6" id="analyse-ergebnis">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Jahresertrag" value={`${fmt(c.jahresertragKWh)} kWh`} />
        <KpiCard label="Eigenverbrauch" value={`${fmt(c.eigenverbrauchKWh)} kWh`} sub={`${Math.round(c.eigenverbrauchKWh / c.jahresertragKWh * 100)} % des Ertrags`} />
        <KpiCard label="Jährl. Einnahmen" value={fmtEuro(c.jahreseinnahmen)} sub="Einsparung + Einspeisung" highlight />
        <KpiCard
          label="Amortisation"
          value={c.amortisationJahre ? `${c.amortisationJahre} Jahre` : "–"}
          sub={amortJahr ? `nach ca. Jahr ${amortJahr.jahr}` : ""}
        />
      </div>

      {/* 20-Jahres-Bilanz (kompakt) */}
      <div className="card-base p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-[#16A34A]" />
          <h3 className="font-semibold text-[var(--foreground)] text-sm">20-Jahres-Bilanz (Auswahl)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-1.5 text-[var(--muted-foreground)] font-medium">Jahr</th>
                <th className="text-right py-1.5 text-[var(--muted-foreground)] font-medium">Ertrag kWh</th>
                <th className="text-right py-1.5 text-[var(--muted-foreground)] font-medium">Einnahmen</th>
                <th className="text-right py-1.5 text-[var(--muted-foreground)] font-medium">Kum. Einnahmen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {[1, 5, 10, 15, 20].map((yr) => {
                const row = c.bilanz20Jahre.find((b) => b.jahr === yr);
                if (!row) return null;
                const amortisiert = row.kumuliertEinnahmen >= row.kumuliertKosten;
                return (
                  <tr key={yr} className={amortisiert ? "bg-green-50 dark:bg-green-900/10" : ""}>
                    <td className="py-1.5 font-mono">{yr}</td>
                    <td className="py-1.5 text-right font-mono">{fmt(row.jahresertragKWh)}</td>
                    <td className="py-1.5 text-right font-mono">{fmtEuro(row.einnahmenEuro)}</td>
                    <td className={`py-1.5 text-right font-mono font-semibold ${amortisiert ? "text-[#14532D]" : ""}`}>
                      {fmtEuro(row.kumuliertEinnahmen)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          Anschaffungskosten: {fmtEuro(c.bilanz20Jahre[0]?.kumuliertKosten ?? 0)} · Degradation: 0,5 % p.a.
          {amortJahr ? ` · Amortisation in Jahr ${amortJahr.jahr}` : " · Keine Amortisation in 20 Jahren"}
        </p>
      </div>

      {/* KI-Analyse */}
      {ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Sun className="h-5 w-5 text-[#14532D] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[#14532D] mb-1 text-sm">KI-Analyse</h3>
              <p className="text-sm text-[#166534]">{ki.zusammenfassung}</p>
            </div>
          </div>

          {ki.risikohinweise.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Risikohinweise</h4>
              <div className="space-y-2">
                {ki.risikohinweise.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 bg-white/60 rounded-lg p-3">
                    <SeverityIcon s={r.schweregrad} />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">{r.hinweis}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{r.empfehlung}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ki.foerderHinweise.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Förderhinweise</h4>
              <ul className="space-y-1">
                {ki.foerderHinweise.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#166534]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki.fragenFuerAnbieter.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Fragen für den Anbieter</h4>
              <ol className="space-y-1 list-decimal list-inside">
                {ki.fragenFuerAnbieter.map((f, i) => <li key={i} className="text-sm text-[#166534]">{f}</li>)}
              </ol>
            </div>
          )}
        </div>
      )}

      {!result.ki_verfuegbar && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted-foreground)]">
          KI-Analyse nicht verfügbar – Berechnungen oben sind vollständig.
        </div>
      )}

      {/* Annahmen */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <h4 className="text-xs font-semibold text-[var(--foreground)] mb-2">Berechnungsannahmen</h4>
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {c.annahmen.map((a) => (
            <div key={a.bezeichnung} className="flex gap-2 text-xs text-[var(--muted-foreground)]">
              <span className="font-medium shrink-0">{a.bezeichnung}:</span>
              <span>{a.wert}</span>
            </div>
          ))}
        </div>
        <ul className="mt-2 space-y-0.5">
          {c.anmerkungen.map((a, i) => <li key={i} className="text-xs text-[var(--muted-foreground)]">· {a}</li>)}
        </ul>
      </div>

      <div className="flex justify-end">
        <button onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
          <Printer className="h-3.5 w-3.5" /> Ergebnis drucken
        </button>
      </div>
    </div>
  );
}
