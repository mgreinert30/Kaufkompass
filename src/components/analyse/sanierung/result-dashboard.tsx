"use client";

import { AlertTriangle, CheckCircle2, Info, Hammer, Printer } from "lucide-react";

interface AngebotsBewertung {
  einschaetzung: "guenstig" | "marktpreisnahe" | "teuer" | null;
  abweichungProzent?: number;
}

interface KiAnalyse {
  zusammenfassung: string;
  kostenBewertung: { einschaetzung: string; begruendung: string; einschraenkungen: string[] };
  risikohinweise: Array<{ schweregrad: "hoch" | "mittel" | "niedrig"; hinweis: string; empfehlung: string }>;
  foerderHinweise: string[];
  fragenFuerHandwerker: string[];
  einschraenkungen: string[];
}

export interface SanierungResult {
  calculations: {
    massnahmeLabel: string;
    referenzKostenMin: number;
    referenzKostenMax: number;
    referenzKostenMittel: number;
    foerderungBetrag: number;
    foerderungSatz: number;
    nettokostenNachFoerderung: number;
    puffer: number;
    gesamtkostenMitPuffer: number;
    angebotsBewertung?: AngebotsBewertung;
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

const BEWERTUNG_LABEL: Record<string, { label: string; color: string }> = {
  guenstig:        { label: "Günstig", color: "text-green-700" },
  marktpreisnahe:  { label: "Marktpreisnahe", color: "text-blue-700" },
  teuer:           { label: "Teuer", color: "text-red-700" },
};

export function SanierungResultDashboard({ result }: { result: SanierungResult }) {
  const { calculations: c, ki_analyse: ki } = result;
  const bewertung = c.angebotsBewertung?.einschaetzung
    ? BEWERTUNG_LABEL[c.angebotsBewertung.einschaetzung]
    : null;

  return (
    <div className="space-y-6" id="analyse-ergebnis">
      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Referenz (Mittel)" value={fmtEuro(c.referenzKostenMittel)} sub={`${fmtEuro(c.referenzKostenMin)} – ${fmtEuro(c.referenzKostenMax)}`} />
        <KpiCard label={`BAFA-Förderung (${(c.foerderungSatz * 100).toFixed(0)} %)`} value={`– ${fmtEuro(c.foerderungBetrag)}`} color="text-[#14532D]" />
        <KpiCard label="Nettokosten nach Förderung" value={fmtEuro(c.nettokostenNachFoerderung)} />
        <KpiCard label="Gesamtkosten mit Puffer" value={fmtEuro(c.gesamtkostenMitPuffer)} sub="inkl. 15 % Puffer" />
      </div>

      {/* Angebotsbewertung */}
      {c.angebotsBewertung && bewertung && (
        <div className="card-base p-4">
          <h3 className="font-semibold text-[var(--foreground)] mb-2 text-sm">Angebotsbewertung</h3>
          <div className="flex items-center gap-3">
            <span className={`font-bold text-lg ${bewertung.color}`}>{bewertung.label}</span>
            {c.angebotsBewertung.abweichungProzent !== undefined && (
              <span className="text-sm text-[var(--muted-foreground)]">
                {c.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}{c.angebotsBewertung.abweichungProzent} % gegenüber Referenzwert
              </span>
            )}
          </div>
        </div>
      )}

      {/* Kostentabelle */}
      <div className="card-base p-4">
        <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">{c.massnahmeLabel}</h3>
        <div className="space-y-2">
          {[
            { label: "Referenzkosten (Mittelwert)", value: fmtEuro(c.referenzKostenMittel), sub: `Spanne: ${fmtEuro(c.referenzKostenMin)} – ${fmtEuro(c.referenzKostenMax)}` },
            { label: `BAFA Förderung (${(c.foerderungSatz * 100).toFixed(0)} %)`, value: `– ${fmtEuro(c.foerderungBetrag)}`, color: "text-[#14532D]" },
            { label: "Nettokosten nach Förderung", value: fmtEuro(c.nettokostenNachFoerderung) },
            { label: "Puffer (15 %)", value: `+ ${fmtEuro(c.puffer)}`, color: "text-orange-600" },
            { label: "Gesamtkosten mit Puffer", value: fmtEuro(c.gesamtkostenMitPuffer), bold: true },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-baseline py-1 border-b border-[var(--border)] last:border-0 last:font-semibold">
              <span className={`text-sm ${row.bold ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>{row.label}</span>
              <span className={`text-sm font-mono ${row.color ?? (row.bold ? "font-bold text-[var(--foreground)]" : "text-[var(--foreground)]")}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* KI-Analyse */}
      {ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Hammer className="h-5 w-5 text-[#14532D] shrink-0 mt-0.5" />
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
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Förderhinweise (BAFA BEG EM)</h4>
              <ul className="space-y-1">
                {ki.foerderHinweise.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#166534]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A] shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki.fragenFuerHandwerker.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#14532D] uppercase tracking-wide mb-2">Fragen für den Handwerker</h4>
              <ol className="space-y-1 list-decimal list-inside">
                {ki.fragenFuerHandwerker.map((f, i) => <li key={i} className="text-sm text-[#166534]">{f}</li>)}
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
