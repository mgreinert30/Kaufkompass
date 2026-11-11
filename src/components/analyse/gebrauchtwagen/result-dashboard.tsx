"use client";

import { AlertTriangle, CheckCircle2, Info, Car, Printer } from "lucide-react";

interface BetriebskostenPosition {
  bezeichnung: string;
  jahreskosten: number;
  fuenfJahresKosten: number;
  grundlage: string;
}

interface KiAnalyse {
  zusammenfassung: string;
  kostenBewertung: { einschaetzung: string; begruendung: string; einschraenkungen: string[] };
  risikohinweise: Array<{ schweregrad: "hoch" | "mittel" | "niedrig"; hinweis: string; empfehlung: string }>;
  fragenFuerKauf: string[];
  pruefpunkte: string[];
  einschraenkungen: string[];
}

export interface GebrauchtwagenResult {
  calculations: {
    fahrzeugalter: number;
    betriebskostenJaehrlich: number;
    betriebskosten5Jahre: number;
    positionen: BetriebskostenPosition[];
    gesamtkostenMitKauf: number;
    kostenProKm: number;
    geschaetzterRestwert: number;
    wertverlust5Jahre: number;
    anmerkungen: string[];
  };
  ki_analyse: KiAnalyse | null;
  ki_verfuegbar: boolean;
}

function fmt(n: number) { return n.toLocaleString("de-DE", { maximumFractionDigits: 0 }); }
function fmtEuro(n: number) { return `${fmt(n)} €`; }

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-base p-4">
      <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className="text-xl font-bold text-[var(--foreground)] font-mono">{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  );
}

function SeverityIcon({ s }: { s: "hoch" | "mittel" | "niedrig" }) {
  if (s === "hoch") return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />;
  if (s === "mittel") return <Info className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />;
  return <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />;
}

export function GebrauchtwagenResultDashboard({ result }: { result: GebrauchtwagenResult }) {
  const { calculations: c, ki_analyse: ki } = result;

  return (
    <div className="space-y-6" id="analyse-ergebnis">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Betriebskosten/Jahr" value={fmtEuro(c.betriebskostenJaehrlich)} />
        <KpiCard label="Betriebskosten 5 Jahre" value={fmtEuro(c.betriebskosten5Jahre)} />
        <KpiCard label="Kosten pro km" value={`${c.kostenProKm.toFixed(2)} €/km`} sub="inkl. Kaufpreis u. Wertverlust" />
        <KpiCard label="Gesamtkosten 5 J." value={fmtEuro(c.gesamtkostenMitKauf)} sub="Kauf + Betrieb" />
      </div>

      {/* Wertverlust */}
      <div className="card-base p-4">
        <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Wertverlust (5 Jahre)</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Geschätzter Restwert</p>
            <p className="font-bold text-[var(--foreground)] font-mono">{fmtEuro(c.geschaetzterRestwert)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">Wertverlust</p>
            <p className="font-bold text-red-600 font-mono">– {fmtEuro(c.wertverlust5Jahre)}</p>
          </div>
        </div>
      </div>

      {/* Kostenaufstellung */}
      <div className="card-base p-4">
        <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">Betriebskosten-Aufstellung</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-xs text-[var(--muted-foreground)] font-medium">Position</th>
                <th className="text-right py-2 text-xs text-[var(--muted-foreground)] font-medium">pro Jahr</th>
                <th className="text-right py-2 text-xs text-[var(--muted-foreground)] font-medium">5 Jahre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {c.positionen.map((p) => (
                <tr key={p.bezeichnung}>
                  <td className="py-2 text-[var(--foreground)] text-xs">{p.bezeichnung}</td>
                  <td className="py-2 text-right font-mono text-xs">{fmtEuro(p.jahreskosten)}</td>
                  <td className="py-2 text-right font-mono text-xs">{fmtEuro(p.fuenfJahresKosten)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-[var(--foreground)]">
                <td className="py-2 font-semibold text-[var(--foreground)] text-xs">Gesamt</td>
                <td className="py-2 text-right font-bold font-mono text-xs">{fmtEuro(c.betriebskostenJaehrlich)}</td>
                <td className="py-2 text-right font-bold font-mono text-xs">{fmtEuro(c.betriebskosten5Jahre)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* KI-Analyse */}
      {ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Car className="h-5 w-5 text-[#14532D] shrink-0 mt-0.5" />
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

          {ki.pruefpunkte.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Prüfpunkte vor dem Kauf</h4>
              <ul className="space-y-1">
                {ki.pruefpunkte.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#166534]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki.fragenFuerKauf.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Fragen für Verkäufer / Händler</h4>
              <ol className="space-y-1 list-decimal list-inside">
                {ki.fragenFuerKauf.map((f, i) => (
                  <li key={i} className="text-sm text-[#166534]">{f}</li>
                ))}
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

      {/* Hinweise */}
      {c.anmerkungen.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] p-4">
          <h4 className="text-xs font-semibold text-[var(--foreground)] mb-2">Hinweise zur Berechnung</h4>
          <ul className="space-y-1">
            {c.anmerkungen.map((a, i) => <li key={i} className="text-xs text-[var(--muted-foreground)]">· {a}</li>)}
          </ul>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
          <Printer className="h-3.5 w-3.5" /> Ergebnis drucken
        </button>
      </div>
    </div>
  );
}
