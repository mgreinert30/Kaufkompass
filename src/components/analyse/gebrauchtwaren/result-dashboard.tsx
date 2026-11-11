"use client";

import { TrendingDown, TrendingUp, Minus, AlertTriangle, CheckCircle2, Lightbulb, MessageSquare, ShoppingBag } from "lucide-react";
import type { GebrauchtwarenErgebnis } from "@/lib/calculations/gebrauchtwaren";

export interface GebrauchtwarenResult {
  calculations: GebrauchtwarenErgebnis;
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: GebrauchtwarenResult; }

const BEWERTUNG_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  fair:          { label: "Fairer Preis",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  etwas_teuer:   { label: "Etwas teuer",   color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  zu_teuer:      { label: "Zu teuer",      color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function GebrauchtwarenResultDashboard({ result }: Props) {
  const { calculations: c, ki_analyse: ki } = result;
  const bewertung = c.angebotsBewertung
    ? (BEWERTUNG_CONFIG[c.angebotsBewertung.einschaetzung] ?? BEWERTUNG_CONFIG.fair)
    : BEWERTUNG_CONFIG.fair;
  const BewertungIcon = bewertung.Icon;

  return (
    <div className="space-y-6">
      {/* Bewertung */}
      {c.angebotsBewertung && (
        <div className={`rounded-xl border p-5 ${bewertung.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <BewertungIcon className={`h-6 w-6 ${bewertung.color}`} />
            <span className={`text-lg font-bold ${bewertung.color}`}>{bewertung.label}</span>
          </div>
          <p className={`text-sm ${bewertung.color}`}>{c.angebotsBewertung.hinweis}</p>
        </div>
      )}

      {/* Kennzahlen */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-sm font-bold text-[var(--foreground)]">{c.kategorieLabel}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Kategorie</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-sm font-bold text-[var(--foreground)]">{c.zustandLabel}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Zustand</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-2xl font-bold text-[#14532D]">{c.wertabschlag}%</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Wertabschlag typisch</div>
        </div>
      </div>

      {/* Empfohlener Preiskorridor */}
      {c.empfohlenerPreis && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-[#16A34A]" /> Empfohlener Preiskorridor
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-[var(--muted-foreground)]">Minimum: </span>
              <span className="font-semibold">{fmt(c.empfohlenerPreis.min)}</span>
            </div>
            <div className="text-[var(--muted-foreground)]">–</div>
            <div>
              <span className="text-[var(--muted-foreground)]">Maximum: </span>
              <span className="font-semibold">{fmt(c.empfohlenerPreis.max)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Risikohinweise */}
      {c.risikoHinweise.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Risikohinweise beim Gebrauchtkauf
          </h3>
          <ul className="space-y-1">
            {c.risikoHinweise.map((h, i) => (
              <li key={i} className="text-sm text-orange-700 flex items-start gap-2"><span className="shrink-0">·</span>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* KI-Einschätzung */}
      {result.ki_verfuegbar && ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-3">
          <h3 className="font-semibold text-[#14532D] flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> KI-Einschätzung
          </h3>
          {ki.empfehlung && (
            <p className="text-sm text-[#15803D]">{String((ki.empfehlung as Record<string, unknown>).begruendung ?? "")}</p>
          )}
          {typeof ki.alternativenHinweis === "string" && ki.alternativenHinweis && (
            <p className="text-sm text-[#15803D]"><strong>Alternativen:</strong> {ki.alternativenHinweis}</p>
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
