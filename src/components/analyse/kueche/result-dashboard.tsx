"use client";

import { AlertTriangle, CheckCircle2, Info, TrendingUp, Euro, ChefHat, MessageSquare } from "lucide-react";
import type { Risikohinweis } from "@/types/analyse";

interface AngebotsBewertung {
  einschaetzung: "guenstig" | "marktgerecht" | "teuer" | "sehr_teuer" | null;
  abweichungProzent: number | null;
  hinweis: string;
}

interface KostenAufstellung {
  unterschraenke: { min: number; max: number };
  oberschraenke: { min: number; max: number };
  elektrogeraete: { min: number; max: number } | null;
  montage: { min: number; max: number } | null;
  arbeitsplatte: { min: number; max: number };
  anschlussarbeiten: { min: number; max: number };
  gesamtMitPuffer: { min: number; max: number };
}

interface KiAnalyse {
  zusammenfassung: string;
  angebotsBewertung: {
    einschaetzung: string;
    begruendung: string;
    fehlendePunkte: string[];
  };
  risikohinweise: Risikohinweis[];
  typischeExtras: string[];
  fragenFuerAnbieter: string[];
  einschraenkungen: string[];
  markenEinschaetzung?: string;
}

interface KuecheCalculations {
  angebotspreis: number;
  groesseLabel: string;
  typLabel: string;
  ausstattungLabel: string;
  referenzPreis: { min: number; mittel: number; max: number; quelle: string };
  angebotsBewertung: AngebotsBewertung;
  kostenAufstellung: KostenAufstellung;
  empfohlenerPuffer: number;
  pufferProzent: number;
  grundlagen: string[];
}

export interface KuecheResult {
  calculations: KuecheCalculations;
  ki_analyse: KiAnalyse | null;
  ki_verfuegbar: boolean;
}

function fmt(n: number): string {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function fmtRange(min: number, max: number): string {
  return `${fmt(min)} – ${fmt(max)} €`;
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

const SCHWEREGRAD_CONFIG: Record<Risikohinweis["schweregrad"], { label: string; icon: typeof AlertTriangle; colorClass: string }> = {
  hoch:    { label: "Hoch",    icon: AlertTriangle, colorClass: "text-red-600" },
  mittel:  { label: "Mittel",  icon: Info,          colorClass: "text-amber-500" },
  niedrig: { label: "Niedrig", icon: CheckCircle2,  colorClass: "text-green-600" },
};

export function KuecheResultDashboard({ result }: { result: KuecheResult }) {
  const { calculations: c, ki_analyse, ki_verfuegbar } = result;
  const bewertung = c.angebotsBewertung.einschaetzung
    ? BEWERTUNG_CONFIG[c.angebotsBewertung.einschaetzung]
    : null;

  return (
    <div className="space-y-6">

      {/* Kennzahlen-Header */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-[var(--muted)] p-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Angebotspreis</p>
          <p className="text-xl font-bold tabular-nums">{fmt(c.angebotspreis)} €</p>
        </div>
        <div className="rounded-xl bg-[var(--muted)] p-4 text-center">
          <p className="text-xs text-[var(--muted-foreground)] mb-1">Referenz (Mittel)</p>
          <p className="text-xl font-bold tabular-nums text-[#14532D]">{fmt(c.referenzPreis.mittel)} €</p>
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
        <div className="grid grid-cols-3 gap-3 text-center mb-3">
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Minimum</p>
            <p className="font-semibold tabular-nums">{fmt(c.referenzPreis.min)} €</p>
          </div>
          <div className="border-x border-[var(--border)]">
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Mittelwert</p>
            <p className="font-bold text-[#14532D] tabular-nums">{fmt(c.referenzPreis.mittel)} €</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted-foreground)] mb-0.5">Maximum</p>
            <p className="font-semibold tabular-nums">{fmt(c.referenzPreis.max)} €</p>
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">Quelle: {c.referenzPreis.quelle}</p>
      </div>

      {/* Kostenaufschlüsselung */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
          <h3 className="font-semibold text-[var(--foreground)] text-sm">Kostenaufschlüsselung (Orientierung)</h3>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "Unterschränke", range: c.kostenAufstellung.unterschraenke },
            { label: "Oberschränke",  range: c.kostenAufstellung.oberschraenke },
            { label: "Arbeitsplatte", range: c.kostenAufstellung.arbeitsplatte },
            ...(c.kostenAufstellung.elektrogeraete ? [{ label: "Elektrogeräte (Einbau)", range: c.kostenAufstellung.elektrogeraete }] : []),
            ...(c.kostenAufstellung.montage ? [{ label: "Montage", range: c.kostenAufstellung.montage }] : []),
            { label: "Anschlussarbeiten", range: c.kostenAufstellung.anschlussarbeiten },
          ].map(({ label, range }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">{label}</span>
              <span className="font-medium tabular-nums">{fmtRange(range.min, range.max)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm font-semibold border-t border-[var(--border)] pt-2.5 mt-1">
            <span>Gesamt (inkl. 10 % Puffer)</span>
            <span className="text-[#14532D] tabular-nums">{fmtRange(c.kostenAufstellung.gesamtMitPuffer.min, c.kostenAufstellung.gesamtMitPuffer.max)}</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--muted-foreground)]">
          Empfohlener Puffer: {fmt(c.empfohlenerPuffer)} € ({c.pufferProzent} %) für Nacharbeiten, Lieferabweichungen und Anpassungen.
        </p>
      </div>

      {/* KI-Analyse */}
      {ki_verfuegbar && ki_analyse && (
        <>
          {/* Zusammenfassung */}
          <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
              <h3 className="font-semibold text-[#14532D] text-sm">KI-Gesamteinschätzung</h3>
            </div>
            <p className="text-sm text-[#166534] leading-relaxed">{ki_analyse.zusammenfassung}</p>
            {ki_analyse.angebotsBewertung && (
              <p className="mt-2 text-sm text-[#166534]">{ki_analyse.angebotsBewertung.begruendung}</p>
            )}
          </div>

          {/* Fehlende Positionen */}
          {ki_analyse.angebotsBewertung?.fehlendePunkte && ki_analyse.angebotsBewertung.fehlendePunkte.length > 0 && (
            <div className="rounded-xl border border-[#FED7AA] bg-[#FFF7ED] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
                <h3 className="font-semibold text-[#C2410C] text-sm">Möglicherweise fehlende Positionen</h3>
              </div>
              <ul className="space-y-1.5">
                {ki_analyse.angebotsBewertung.fehlendePunkte.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#9A3412]">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C2410C]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Typische Extra-Kosten */}
          {ki_analyse.typischeExtras && ki_analyse.typischeExtras.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Typische Zusatzkosten</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ki_analyse.typischeExtras.map((e, i) => (
                  <span key={i} className="rounded-full bg-[var(--muted)] px-3 py-1 text-xs text-[var(--foreground)]">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Risikohinweise */}
          {ki_analyse.risikohinweise && ki_analyse.risikohinweise.length > 0 && (
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

          {/* Fragen für Anbieter */}
          {ki_analyse.fragenFuerAnbieter && ki_analyse.fragenFuerAnbieter.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-[#14532D]" aria-hidden="true" />
                <h3 className="font-semibold text-[var(--foreground)] text-sm">Fragen für das Küchenstudio</h3>
              </div>
              <ol className="space-y-1.5 list-decimal list-inside">
                {ki_analyse.fragenFuerAnbieter.map((f, i) => (
                  <li key={i} className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Marken-Einschätzung */}
          {ki_analyse.markenEinschaetzung && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">Marken-Einschätzung</p>
              <p className="text-sm text-[var(--foreground)]">{ki_analyse.markenEinschaetzung}</p>
            </div>
          )}

          {/* Einschränkungen */}
          {ki_analyse.einschraenkungen && ki_analyse.einschraenkungen.length > 0 && (
            <div className="rounded-lg border border-[var(--border)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">Einschränkungen</p>
              <ul className="space-y-1">
                {ki_analyse.einschraenkungen.map((e, i) => (
                  <li key={i} className="text-xs text-[var(--muted-foreground)] flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--muted-foreground)]" />
                    {e}
                  </li>
                ))}
              </ul>
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
