"use client";

import { TrendingDown, TrendingUp, Minus, CheckCircle2, XCircle, Lightbulb, MessageSquare } from "lucide-react";
import type { LaptopErgebnis } from "@/lib/calculations/laptop";

export interface LaptopResult {
  calculations: LaptopErgebnis;
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: LaptopResult; }

const BEWERTUNG_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  marktgerecht:  { label: "Marktgerecht",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  teuer:         { label: "Teuer",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:    { label: "Sehr teuer",    color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function LaptopResultDashboard({ result }: Props) {
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
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Marktspanne</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-sm font-bold text-[var(--foreground)]">{c.typLabel}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Gerätetyp</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
          <div className="text-sm font-bold text-[var(--foreground)]">{c.zweckLabel}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Verwendung</div>
        </div>
      </div>

      {/* Anforderungscheck */}
      {(c.anforderungsCheck.erfuellt.length > 0 || c.anforderungsCheck.fehlend.length > 0) && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--foreground)] mb-3">Anforderungs-Check</h3>
          {c.anforderungsCheck.erfuellt.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-green-700 mb-1">
              <CheckCircle2 className="h-4 w-4 shrink-0" />{item}
            </div>
          ))}
          {c.anforderungsCheck.fehlend.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-red-700 mb-1">
              <XCircle className="h-4 w-4 shrink-0" />{item}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-[#E4E8E1] bg-[#F8F7F2] p-4">
        <p className="text-sm font-medium text-[var(--foreground)] mb-1">Empfehlung</p>
        <p className="text-sm text-[var(--muted-foreground)]">{c.empfehlung}</p>
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
