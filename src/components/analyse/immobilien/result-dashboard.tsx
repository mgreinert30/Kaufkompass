"use client";

import { AlertTriangle, CheckCircle2, Info, TrendingUp, Euro, Home, AlertCircle, ExternalLink, Printer } from "lucide-react";
import type { Quelle, Risikohinweis } from "@/types/analyse";

interface KaufnebenkostenResult {
  grunderwerbsteuer: { betrag: number; satz: number; bundesland: string };
  notarUndGrundbuch: { betrag: number; richtwert: string };
  makler: { betrag: number; mitMakler: boolean };
  gesamt: number;
  prozentVomKaufpreis: number;
  positionen: { bezeichnung: string; betrag: number; berechnung?: string; quelle?: string }[];
}

interface FinanzierungsResult {
  fremdkapital: number;
  fremdkapitalquote: number;
  szenarien: Array<{ bezeichnung: string; zinssatz: number; monatlicheRate: number; gesamtRueckzahlung: number; gesamtZinsen: number }>;
  anmerkungen: string[];
}

interface KiAnalyse {
  zusammenfassung: string;
  bewertung: { einschaetzung: string; begruendung: string; einschraenkungen: string[] };
  risikohinweise: Risikohinweis[];
  fragenfuerBesichtigung: string[];
  fehlendeinformationen: string[];
  einschraenkungen: string[];
}

export interface AnalyseResult {
  calculations: {
    kaufpreis: number;
    kaufnebenkosten: KaufnebenkostenResult;
    gesamtinvestition: number;
    eigenkapital: number;
    finanzierung: FinanzierungsResult;
    preisProQm: number | null;
  };
  ki_analyse: KiAnalyse | null;
  ki_verfuegbar: boolean;
  quellen: Quelle[];
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtEuro(n: number): string {
  return `${fmt(n)} €`;
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card-base p-4">
      <p className="text-xs font-medium text-[var(--muted-foreground)] mb-1">{label}</p>
      <p className="text-xl font-bold text-[var(--foreground)] font-mono">{value}</p>
      {sub && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{sub}</p>}
    </div>
  );
}

function SeverityIcon({ s }: { s: string }) {
  if (s === "hoch") return <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />;
  if (s === "mittel") return <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />;
  return <Info className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />;
}

export function ImmobilienResultDashboard({ result }: { result: AnalyseResult }) {
  const { calculations: c, ki_analyse, ki_verfuegbar, quellen } = result;
  const mittlereRate = c.finanzierung.szenarien[1]?.monatlicheRate ?? 0;

  return (
    <div className="space-y-6" id="analyse-ergebnis">
      {/* KI-Analyse-Banner */}
      {!ki_verfuegbar && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            KI-Interpretation nicht verfügbar – ANTHROPIC_API_KEY nicht konfiguriert.
            Die Berechnungen unten sind davon unabhängig korrekt.
          </span>
        </div>
      )}

      {/* KI-Zusammenfassung */}
      {ki_analyse && (
        <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] dark:bg-[#14532D]/20 p-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[#14532D] dark:text-[#4ade80] mb-1">KI-Einschätzung</p>
              <p className="text-sm text-[#15803d] dark:text-[#86efac] leading-relaxed">
                {ki_analyse.zusammenfassung}
              </p>
              {ki_analyse.bewertung.einschaetzung && ki_analyse.bewertung.einschaetzung !== "nicht beurteilbar" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-medium text-[#14532D] dark:text-[#4ade80]">Preis:</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#DCFCE7] dark:bg-[#14532D] text-[#14532D] dark:text-[#4ade80]">
                    {ki_analyse.bewertung.einschaetzung}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* KPI-Karten */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Kaufpreisübersicht</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiCard label="Angebotspreis" value={fmtEuro(c.kaufpreis)} />
          <KpiCard label="+ Kaufnebenkosten" value={fmtEuro(c.kaufnebenkosten.gesamt)} sub={`${c.kaufnebenkosten.prozentVomKaufpreis.toFixed(1)} % des Kaufpreises`} />
          <KpiCard label="= Gesamtinvestition" value={fmtEuro(c.gesamtinvestition)} />
          {c.preisProQm && <KpiCard label="Preis pro m²" value={fmtEuro(c.preisProQm)} />}
        </div>
      </div>

      {/* Kaufnebenkosten Detail */}
      <div className="card-base p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Euro className="h-4 w-4 text-[var(--muted-foreground)]" />
          Kaufnebenkosten im Detail
        </h2>
        <div className="space-y-2">
          {c.kaufnebenkosten.positionen.map((p, i) => (
            <div key={i} className="flex items-start justify-between gap-4 py-2 border-b border-[var(--border)] last:border-0">
              <div>
                <p className="text-sm text-[var(--foreground)]">{p.bezeichnung}</p>
                {p.berechnung && <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Berechnung: {p.berechnung}</p>}
                {p.quelle && <p className="text-xs text-[var(--muted-foreground)]">Quelle: {p.quelle}</p>}
              </div>
              <span className="text-sm font-mono font-semibold text-[var(--foreground)] shrink-0">
                {fmtEuro(p.betrag)}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2 font-semibold">
            <span className="text-sm text-[var(--foreground)]">Gesamt Kaufnebenkosten</span>
            <span className="text-sm font-mono text-[var(--foreground)]">{fmtEuro(c.kaufnebenkosten.gesamt)}</span>
          </div>
        </div>
      </div>

      {/* Finanzierung */}
      <div className="card-base p-5">
        <h2 className="text-sm font-semibold text-[var(--foreground)] mb-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[var(--muted-foreground)]" />
          Finanzierungsszenarien
        </h2>
        <p className="text-xs text-[var(--muted-foreground)] mb-4">
          Annuitätendarlehen, 30 Jahre Laufzeit · Fremdkapital: {fmtEuro(c.finanzierung.fremdkapital)} ({c.finanzierung.fremdkapitalquote.toFixed(1)} % des Kaufpreises)
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left">
                <th className="pb-2 text-xs font-medium text-[var(--muted-foreground)]">Zinssatz</th>
                <th className="pb-2 text-xs font-medium text-[var(--muted-foreground)] text-right">Monatsrate</th>
                <th className="pb-2 text-xs font-medium text-[var(--muted-foreground)] text-right">Gesamtzinsen</th>
                <th className="pb-2 text-xs font-medium text-[var(--muted-foreground)] text-right">Gesamtzahlung</th>
              </tr>
            </thead>
            <tbody>
              {c.finanzierung.szenarien.map((s, i) => (
                <tr key={i} className={`border-b border-[var(--border)] last:border-0 ${i === 1 ? "bg-[#F0FDF4] dark:bg-[#14532D]/20" : ""}`}>
                  <td className="py-2.5 text-[var(--foreground)]">
                    {s.bezeichnung}
                    {i === 1 && <span className="ml-2 text-xs text-[#16A34A]">(Basis)</span>}
                  </td>
                  <td className="py-2.5 font-mono font-semibold text-right">{fmtEuro(s.monatlicheRate)}</td>
                  <td className="py-2.5 font-mono text-right text-[var(--muted-foreground)]">{fmtEuro(s.gesamtZinsen)}</td>
                  <td className="py-2.5 font-mono text-right">{fmtEuro(s.gesamtRueckzahlung)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 space-y-1">
          {c.finanzierung.anmerkungen.map((a, i) => (
            <p key={i} className="text-xs text-[var(--muted-foreground)] flex items-start gap-1.5">
              <Info className="h-3 w-3 shrink-0 mt-0.5" />
              {a}
            </p>
          ))}
        </div>
      </div>

      {/* KI-Risikohinweise */}
      {ki_analyse && ki_analyse.risikohinweise.length > 0 && (
        <div className="card-base p-5">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[var(--muted-foreground)]" />
            Hinweise und erkannte Risiken
          </h2>
          <div className="space-y-3">
            {ki_analyse.risikohinweise.map((r, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-[var(--surface)]">
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

      {/* Fragen für Besichtigung */}
      {ki_analyse && ki_analyse.fragenfuerBesichtigung.length > 0 && (
        <div className="card-base p-5">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
            <Home className="h-4 w-4 text-[var(--muted-foreground)]" />
            Fragen für Besichtigung und Verhandlung
          </h2>
          <ul className="space-y-2">
            {ki_analyse.fragenfuerBesichtigung.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                <span className="text-[#16A34A] font-semibold shrink-0">{i + 1}.</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grenzen der Analyse */}
      {ki_analyse && (
        <div className="rounded-lg border border-[var(--border)] p-4">
          <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
            Grenzen dieser Analyse
          </h2>
          <ul className="space-y-1.5">
            {[
              ...ki_analyse.einschraenkungen,
              "Keine regionalen Marktpreisdaten verfügbar – Kaufpreis kann nicht objektiv bewertet werden.",
              "Keine technische Prüfung des Gebäudes – versteckte Mängel können nicht erkannt werden.",
              "Kein Ersatz für Rechts-, Steuer- oder Finanzberatung.",
            ].map((e, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--muted-foreground)]">
                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                {e}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quellen */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <h2 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">
          Verwendete Quellen
        </h2>
        <div className="space-y-2">
          {quellen.map((q, i) => (
            <div key={i} className="text-xs text-[var(--muted-foreground)]">
              <span className="font-medium text-[var(--foreground)]">{q.name}</span>
              {" · "}{q.datenstand}
              {q.url && (
                <a href={q.url} target="_blank" rel="noopener noreferrer"
                   className="ml-1 inline-flex items-center gap-0.5 text-[#16A34A] hover:underline">
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <span className="block text-[var(--muted-foreground)]">{q.beschreibung}</span>
            </div>
          ))}
          <p className="text-xs text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
            Berechnungen: Annuitätenformel (mathematisch determiniert) · Kaufnebenkosten: Nutzereingabe + amtliche Steuersätze
          </p>
        </div>
      </div>

      {/* PDF Export */}
      <div className="flex justify-end">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] rounded-lg px-4 py-2 transition-colors"
        >
          <Printer className="h-4 w-4" />
          Bericht drucken / als PDF speichern
        </button>
      </div>
    </div>
  );
}
