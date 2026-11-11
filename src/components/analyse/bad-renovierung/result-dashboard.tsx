"use client";

import { AlertTriangle, CheckCircle2, Info, TrendingUp, Euro, Bath, MessageSquare } from "lucide-react";
import type { Risikohinweis } from "@/types/analyse";

interface AngebotsBewertung {
  einschaetzung: "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer" | null;
  abweichungProzent: number | null;
  hinweis: string;
}

interface KostenAufstellung {
  abbruchEntsorgung: { min: number; max: number };
  fliesen: { min: number; max: number };
  sanitaerObjekte: { min: number; max: number };
  installation: { min: number; max: number };
  elektro: { min: number; max: number };
  barrierefreiheit: { min: number; max: number } | null;
  heizung: { min: number; max: number } | null;
  sonstiges: { min: number; max: number };
}

interface KiAnalyse {
  zusammenfassung: string;
  kostenBewertung: { einschaetzung: string; begruendung: string; fehlendePunkte: string[] };
  risikohinweise: Risikohinweis[];
  foerderHinweise: string[];
  fragenFuerHandwerker: string[];
  einschraenkungen: string[];
}

interface BadCalculations {
  groesseLabel: string;
  ausstattungLabel: string;
  flaeche: number;
  referenzMin: number;
  referenzMittel: number;
  referenzMax: number;
  referenzQuelle: string;
  kostenAufstellung: KostenAufstellung;
  angebotsBewertung: AngebotsBewertung;
  puffer: number;
  pufferProzent: number;
  grundlagen: string[];
}

export interface BadRenovierungResult {
  calculations: BadCalculations;
  ki_analyse: KiAnalyse | null;
  ki_verfuegbar: boolean;
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtRange(a: number, b: number): string {
  return `${fmt(a)} – ${fmt(b)} €`;
}

const BEWERTUNG_CONFIG: Record<
  NonNullable<AngebotsBewertung["einschaetzung"]>,
  { label: string; colorClass: string; bgClass: string; borderClass: string }
> = {
  guenstig:   { label: "Günstig",        colorClass: "text-[#166534]", bgClass: "bg-[#DCFCE7]", borderClass: "border-[#BBF7D0]" },
  marktgerecht: { label: "Marktgerecht", colorClass: "text-[#1D4ED8]", bgClass: "bg-[#DBEAFE]", borderClass: "border-[#BFDBFE]" },
  teuer:      { label: "Teuer",          colorClass: "text-[#854D0E]", bgClass: "bg-[#FEF9C3]", borderClass: "border-[#FDE68A]" },
  sehr_teuer: { label: "Sehr teuer",     colorClass: "text-[#991B1B]", bgClass: "bg-[#FEE2E2]", borderClass: "border-[#FECACA]" },
};

const SCHWEREGRAD_CONFIG: Record<Risikohinweis["schweregrad"], { icon: typeof AlertTriangle; colorClass: string }> = {
  hoch:    { icon: AlertTriangle, colorClass: "text-red-600" },
  mittel:  { icon: Info,          colorClass: "text-amber-500" },
  niedrig: { icon: CheckCircle2,  colorClass: "text-green-600" },
};

export function BadRenovierungResultDashboard({ result }: { result: BadRenovierungResult }) {
  const { calculations: c, ki_analyse, ki_verfuegbar } = result;
  const bewertung = c.angebotsBewertung.einschaetzung
    ? BEWERTUNG_CONFIG[c.angebotsBewertung.einschaetzung]
    : null;

  const aufstellungItems = [
    { label: "Abbruch & Entsorgung", range: c.kostenAufstellung.abbruchEntsorgung },
    { label: "Fliesen (Wand + Boden)", range: c.kostenAufstellung.fliesen },
    { label: "Sanitärobjekte (WC, Waschbecken, Dusche/Wanne)", range: c.kostenAufstellung.sanitaerObjekte },
    { label: "Installation (Sanitär)", range: c.kostenAufstellung.installation },
    { label: "Elektro (Licht, Steckdosen)", range: c.kostenAufstellung.elektro },
    ...(c.kostenAufstellung.barrierefreiheit ? [{ label: "Barrierefreier Umbau", range: c.kostenAufstellung.barrierefreiheit }] : []),
    ...(c.kostenAufstellung.heizung ? [{ label: "Fußbodenheizung", range: c.kostenAufstellung.heizung }] : []),
    { label: "Sonstiges / Reserve", range: c.kostenAufstellung.sonstiges },
  ];

  return (
    <div className="space-y-6">

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-[var(--muted)] p-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Referenz (Mittel)</p>
          <p className="text-xl font-bold tabular-nums text-[#14532D]">{fmt(c.referenzMittel)} €</p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] p-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Fläche</p>
          <p className="text-xl font-bold tabular-nums">{c.flaeche} m²</p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] p-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Größe</p>
          <p className="text-sm font-semibold leading-snug">{c.groesseLabel}</p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] p-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Ausstattung</p>
          <p className="text-sm font-semibold">{c.ausstattungLabel}</p>
        </div>
      </div>

      {/* Angebotseinschätzung */}
      {bewertung && (
        <div className={`rounded-xl border p-4 ${bewertung.bgClass} ${bewertung.borderClass}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`h-4 w-4 ${bewertung.colorClass}`} aria-hidden="true" />
            <span className={`text-sm font-semibold ${bewertung.colorClass}`}>
              Angebotseinschätzung: {bewertung.label}
            </span>
            {c.angebotsBewertung.abweichungProzent !== null && (
              <span className={`ml-auto text-xs font-mono font-semibold ${bewertung.colorClass}`}>
                {c.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}{c.angebotsBewertung.abweichungProzent} %
              </span>
            )}
          </div>
          <p className={`text-sm ${bewertung.colorClass}`}>{c.angebotsBewertung.hinweis}</p>
        </div>
      )}

      {/* Referenzpreise */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Euro className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
          <h3 className="font-semibold text-[var(--foreground)] text-sm">Marktpreise Referenz</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Min</p>
            <p className="font-semibold tabular-nums">{fmt(c.referenzMin)} €</p>
          </div>
          <div className="border-x border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Mittel</p>
            <p className="font-bold text-[#14532D] tabular-nums">{fmt(c.referenzMittel)} €</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Max</p>
            <p className="font-semibold tabular-nums">{fmt(c.referenzMax)} €</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted-foreground)]">Quelle: {c.referenzQuelle}</p>
      </div>

      {/* Kostenaufstellung */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bath className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
          <h3 className="font-semibold text-[var(--foreground)] text-sm">Kostenaufschlüsselung (Orientierung)</h3>
        </div>
        <div className="space-y-2.5">
          {aufstellungItems.map(({ label, range }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">{label}</span>
              <span className="font-medium tabular-nums">{fmtRange(range.min, range.max)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-[var(--muted-foreground)]">
          Empfohlener Puffer: {fmt(c.puffer)} € ({c.pufferProzent} %) für Leitungen, Schimmel, Besonderheiten.
        </p>
      </div>

      {/* KI-Analyse */}
      {ki_verfuegbar && ki_analyse && (
        <>
          <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
              <h3 className="font-semibold text-[#14532D] text-sm">KI-Gesamteinschätzung</h3>
            </div>
            <p className="text-sm text-[#166534] leading-relaxed">{ki_analyse.zusammenfassung}</p>
            {ki_analyse.kostenBewertung?.begruendung && (
              <p className="mt-2 text-sm text-[#166534]">{ki_analyse.kostenBewertung.begruendung}</p>
            )}
          </div>

          {ki_analyse.kostenBewertung?.fehlendePunkte?.length > 0 && (
            <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
                <h3 className="font-semibold text-[#C2410C] text-sm">Möglicherweise fehlende Positionen</h3>
              </div>
              <ul className="space-y-1.5">
                {ki_analyse.kostenBewertung.fehlendePunkte.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#9A3412]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C2410C]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki_analyse.risikohinweise?.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] text-sm mb-3">Risikohinweise</h3>
              <div className="space-y-3">
                {ki_analyse.risikohinweise.map((r, i) => {
                  const cfg = SCHWEREGRAD_CONFIG[r.schweregrad];
                  const Icon = cfg.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.colorClass}`} aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{r.hinweis}</p>
                        <p className="text-sm text-[var(--muted-foreground)] mt-0.5">{r.empfehlung}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {ki_analyse.foerderHinweise?.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Förderhinweise</h3>
              </div>
              <ul className="space-y-1.5">
                {ki_analyse.foerderHinweise.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki_analyse.fragenFuerHandwerker?.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Fragen für den Handwerker</h3>
              </div>
              <ol className="space-y-1.5 list-decimal list-inside">
                {ki_analyse.fragenFuerHandwerker.map((f, i) => (
                  <li key={i} className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}

      {/* Grundlagen */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Berechnungsgrundlagen</p>
        <ul className="space-y-1">
          {c.grundlagen.map((g, i) => (
            <li key={i} className="text-xs text-[var(--muted-foreground)] flex items-start gap-1.5">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--muted-foreground)]" />
              {g}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
