"use client";

import { AlertTriangle, CheckCircle2, Info, Zap, Printer } from "lucide-react";

interface KiAnalyse {
  zusammenfassung: string;
  wirtschaftlichkeit: { einschaetzung: string; begruendung: string; einschraenkungen: string[] };
  risikohinweise: Array<{ schweregrad: "hoch" | "mittel" | "niedrig"; hinweis: string; empfehlung: string }>;
  foerderHinweise: string[];
  fragenFuerInstallateur: string[];
  einschraenkungen: string[];
}

export interface WaermepumpeResult {
  calculations: {
    heizwaermebedarfKWh: number;
    stromverbrauchWPKWh: number;
    betriebskostenJaehrlich: number;
    vergleichGasJaehrlich: number;
    einsparungJaehrlich: number;
    foerderungBAFA: number;
    foerderungSatz: number;
    nettokostenNachFoerderung: number;
    amortisationJahre: number | null;
    grundlagen: Array<{ bezeichnung: string; wert: string; quelle: string }>;
    anmerkungen: string[];
  };
  ki_analyse: KiAnalyse | null;
  ki_verfuegbar: boolean;
}

function fmt(n: number) { return n.toLocaleString("de-DE", { maximumFractionDigits: 0 }); }
function fmtEuro(n: number) { return `${fmt(n)} €`; }

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="card-base p-4">
      <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono ${color ?? "text-[var(--foreground)]"}`}>{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  );
}

function SeverityIcon({ s }: { s: "hoch" | "mittel" | "niedrig" }) {
  if (s === "hoch") return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />;
  if (s === "mittel") return <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />;
  return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />;
}

export function WaermepumpeResultDashboard({ result }: { result: WaermepumpeResult }) {
  const { calculations: c, ki_analyse: ki } = result;

  return (
    <div className="space-y-6" id="analyse-ergebnis">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Betriebskosten WP/Jahr" value={fmtEuro(c.betriebskostenJaehrlich)} sub={`${fmt(c.stromverbrauchWPKWh)} kWh/Jahr`} />
        <KpiCard label="Vergleich Gasheizung" value={fmtEuro(c.vergleichGasJaehrlich)} />
        <KpiCard label="Jährl. Einsparung" value={fmtEuro(c.einsparungJaehrlich)} color={c.einsparungJaehrlich > 0 ? "text-[#14532D]" : "text-red-600"} />
        <KpiCard label="Amortisation" value={c.amortisationJahre ? `${c.amortisationJahre} Jahre` : "–"} sub="nach Förderung" />
      </div>

      {/* Förderung */}
      <div className="card-base p-4">
        <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">BAFA BEG WG Förderung 2024</h3>
        <div className="space-y-2">
          {[
            { label: "Angebotspreis", value: "", raw: true },
            { label: `BAFA Förderung (${(c.foerderungSatz * 100).toFixed(0)} %)`, value: `– ${fmtEuro(c.foerderungBAFA)}`, color: "text-[#14532D]" },
            { label: "Nettokosten nach Förderung", value: fmtEuro(c.nettokostenNachFoerderung), bold: true },
          ].map((row) => {
            if (row.raw) return null;
            return (
              <div key={row.label} className="flex justify-between items-baseline py-1 border-b border-[var(--border)] last:border-0">
                <span className={`text-sm ${row.bold ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>{row.label}</span>
                <span className={`text-sm font-mono ${row.color ?? (row.bold ? "font-bold text-[var(--foreground)]" : "text-[var(--foreground)]")}`}>{row.value}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">
          Fördersatz: {(c.foerderungSatz * 100).toFixed(0)} % · Max. Fördergrundlage: 30.000 € · Antrag VOR Auftragserteilung stellen
        </p>
      </div>

      {/* Heizwärmebedarf */}
      <div className="card-base p-4">
        <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Heizlast und Betrieb</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Heizwärmebedarf</p>
            <p className="font-bold text-[var(--foreground)] font-mono text-sm">{fmt(c.heizwaermebedarfKWh)} kWh/Jahr</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Strom WP</p>
            <p className="font-bold text-[var(--foreground)] font-mono text-sm">{fmt(c.stromverbrauchWPKWh)} kWh/Jahr</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">WP-Betriebskosten</p>
            <p className="font-bold text-[var(--foreground)] font-mono text-sm">{fmtEuro(c.betriebskostenJaehrlich)}/Jahr</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Gas-Referenz</p>
            <p className="font-bold text-[var(--muted-foreground)] font-mono text-sm">{fmtEuro(c.vergleichGasJaehrlich)}/Jahr</p>
          </div>
        </div>
      </div>

      {/* KI-Analyse */}
      {ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-[#14532D] shrink-0 mt-0.5" />
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
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Förderhinweise (BAFA BEG WG)</h4>
              <ul className="space-y-1">
                {ki.foerderHinweise.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#166534]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki.fragenFuerInstallateur.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Fragen für den Installateur</h4>
              <ol className="space-y-1 list-decimal list-inside">
                {ki.fragenFuerInstallateur.map((f, i) => <li key={i} className="text-sm text-[#166534]">{f}</li>)}
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

      {/* Datengrundlagen */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <h4 className="text-xs font-semibold text-[var(--foreground)] mb-2">Datengrundlagen</h4>
        <div className="space-y-1">
          {c.grundlagen.map((g) => (
            <div key={g.bezeichnung} className="text-xs text-[var(--muted-foreground)]">
              <span className="font-medium">{g.bezeichnung}:</span> {g.wert} · <span className="italic">{g.quelle}</span>
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
