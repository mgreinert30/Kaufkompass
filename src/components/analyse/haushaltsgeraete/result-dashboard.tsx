"use client";

import { TrendingDown, TrendingUp, Minus, Zap, CheckCircle2, Lightbulb, MessageSquare } from "lucide-react";
import type { HaushaltsgeraeteErgebnis } from "@/lib/calculations/haushaltsgeraete";

export interface HaushaltsgeraeteResult {
  calculations: HaushaltsgeraeteErgebnis;
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: HaushaltsgeraeteResult; }

const BEWERTUNG_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  marktgerecht:  { label: "Marktgerecht",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  teuer:         { label: "Teuer",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:    { label: "Sehr teuer",    color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function HaushaltsgeraeteResultDashboard({ result }: Props) {
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
          <div className="text-2xl font-bold text-[var(--foreground)]">{fmt(c.betriebskosten10Jahre.strom)}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Stromkosten 10 J.</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-2xl font-bold text-[var(--foreground)]">{fmt(c.betriebskosten10Jahre.gesamt)}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">TCO 10 Jahre</div>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Zap className="h-4 w-4 shrink-0" />
          <span>{c.energieklasseHinweis}</span>
        </div>
      </div>

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
