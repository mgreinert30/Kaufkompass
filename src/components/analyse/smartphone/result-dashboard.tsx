"use client";

import { TrendingDown, TrendingUp, Minus, AlertTriangle, CheckCircle2, Lightbulb, MessageSquare, Smartphone } from "lucide-react";
import type { SmartphoneErgebnis } from "@/lib/calculations/smartphone";

export interface SmartphoneResult {
  calculations: SmartphoneErgebnis;
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: SmartphoneResult; }

const BEWERTUNG_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  marktgerecht:  { label: "Marktgerecht",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  teuer:         { label: "Teuer",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:    { label: "Sehr teuer",    color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function SmartphoneResultDashboard({ result }: Props) {
  const { calculations: c, ki_analyse: ki } = result;
  const bewertung = BEWERTUNG_CONFIG[c.angebotsBewertung.einschaetzung] ?? BEWERTUNG_CONFIG.marktgerecht;
  const BewertungIcon = bewertung.Icon;

  return (
    <div className="space-y-6">
      <div className={`rounded-xl border p-5 ${bewertung.bg}`}>
        <div className="flex items-center gap-3 mb-2">
          <BewertungIcon className={`h-6 w-6 ${bewertung.color}`} />
          <span className={`text-lg font-bold ${bewertung.color}`}>{bewertung.label}</span>
        </div>
        <p className={`text-sm ${bewertung.color}`}>{c.angebotsBewertung.hinweis}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-sm font-bold text-[#14532D]">{fmt(c.referenzPreis.min)}–{fmt(c.referenzPreis.max)}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Markspanne</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-sm font-bold text-[var(--foreground)]">{c.segmentLabel}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Segment</div>
        </div>
        {c.vertragKosten && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
            <div className="text-sm font-bold text-[var(--foreground)]">{fmt(c.vertragKosten.gesamtkosten)}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">Gesamtkosten Vertrag</div>
          </div>
        )}
      </div>

      {c.alterHinweis && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center gap-2 text-sm text-orange-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{c.alterHinweis}</span>
          </div>
        </div>
      )}

      {c.vertragKosten && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-[#16A34A]" /> Vertragskosten-Aufschlüsselung
          </h3>
          <div className="space-y-2">
            {[
              { label: "Geräteanteil", val: c.vertragKosten.geraetAnteil },
              { label: "Tarifanteil", val: c.vertragKosten.tarifAnteil },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">{label}</span>
                <span className="font-medium">{fmt(val)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-semibold border-t border-[var(--border)] pt-2 mt-2">
              <span>Gesamt (Laufzeit)</span><span className="text-[#14532D]">{fmt(c.vertragKosten.gesamtkosten)}</span>
            </div>
          </div>
        </div>
      )}

      {c.qualitaetsHinweise.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <h3 className="font-semibold text-[var(--foreground)] mb-2">Hinweise</h3>
          <ul className="space-y-1">
            {c.qualitaetsHinweise.map((h, i) => (
              <li key={i} className="text-sm text-[var(--muted-foreground)] flex items-start gap-2"><span>·</span>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {result.ki_verfuegbar && ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-3">
          <h3 className="font-semibold text-[#14532D] flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> KI-Einschätzung
          </h3>
          {ki.empfehlung && (
            <p className="text-sm text-[#15803D]">{String((ki.empfehlung as Record<string, unknown>).begruendung ?? "")}</p>
          )}
          {Array.isArray(ki.fragenVorKauf) && ki.fragenVorKauf.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#14532D] mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Fragen vor dem Kauf
              </p>
              <ul className="space-y-1">
                {(ki.fragenVorKauf as string[]).map((f, i) => (
                  <li key={i} className="text-sm text-[#15803D] flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-lg border border-[var(--border)] p-4 text-xs text-[var(--muted-foreground)]">
        <p className="font-medium text-[var(--foreground)] mb-1">Datengrundlagen</p>
        <ul className="space-y-0.5">{c.grundlagen.map((g, i) => <li key={i}>· {g}</li>)}</ul>
      </div>
    </div>
  );
}
