"use client";

import { TrendingDown, TrendingUp, Minus, CheckCircle2, Lightbulb, MessageSquare, AlertTriangle } from "lucide-react";

export interface GenericKiResult {
  calculations: Record<string, unknown>;
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: GenericKiResult; }

const PREIS_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  marktgerecht:  { label: "Marktgerecht",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  teuer:         { label: "Teuer",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:    { label: "Sehr teuer",    color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

function getStringField(obj: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    if (typeof obj[k] === "string") return obj[k] as string;
    if (typeof obj[k] === "object" && obj[k] !== null) {
      const sub = obj[k] as Record<string, unknown>;
      for (const sk of ["hinweis", "fazit", "begruendung", "einschaetzung"]) {
        if (typeof sub[sk] === "string") return sub[sk] as string;
      }
    }
  }
  return "";
}

function getArrayField(obj: Record<string, unknown>, ...keys: string[]): string[] {
  for (const k of keys) {
    if (Array.isArray(obj[k])) return (obj[k] as unknown[]).filter((x): x is string => typeof x === "string");
  }
  return [];
}

export function GenericKiResultDashboard({ result }: Props) {
  const c = result.calculations;
  const ki = result.ki_analyse;

  // Preiseinschätzung aus Berechnungen
  const einschaetzung = (c.preiseinschaetzung as string) ||
    (c.angebotsBewertung as Record<string, unknown> | undefined)?.einschaetzung as string || "marktgerecht";
  const preisHinweis = (c.preisHinweis as string) ||
    getStringField((c.angebotsBewertung as Record<string, unknown> | undefined) ?? {}, "hinweis");
  const bewertung = PREIS_CONFIG[einschaetzung] ?? PREIS_CONFIG.marktgerecht;
  const BewertungIcon = bewertung.Icon;

  // Referenzpreis
  const ref = c.referenzPreis as { min: number; max: number; mittel: number } | undefined;

  // Grundlagen
  const grundlagen = Array.isArray(c.grundlagen) ? (c.grundlagen as string[]) : [];

  // KI Daten
  const empfehlung = ki ? getStringField(ki, "empfehlung", "angebotsBewertung") : "";
  const fragenKeys = ["fragenVorKauf", "fragenVorAbschluss", "fragenFuerDienstleister", "fragenFuerZahnarzt", "fragenFuerTierarzt", "fragenFuerBestatter", "fragenVorBuchung", "fragenFuerZahnarzt"];
  const fragen = ki ? getArrayField(ki, ...fragenKeys) : [];
  const hinweise = ki ? getArrayField(ki, "sicherheitsCheck", "leistungsCheck", "alternativenHinweis") : [];
  const alternativenHinweis = ki ? (typeof ki.alternativenHinweis === "string" ? ki.alternativenHinweis : "") : "";

  return (
    <div className="space-y-6">
      {/* Preisbewertung */}
      <div className={`rounded-xl border p-5 ${bewertung.bg}`}>
        <div className="flex items-center gap-3 mb-2">
          <BewertungIcon className={`h-6 w-6 ${bewertung.color}`} />
          <span className={`text-lg font-bold ${bewertung.color}`}>{bewertung.label}</span>
        </div>
        {preisHinweis && <p className={`text-sm ${bewertung.color}`}>{preisHinweis}</p>}
      </div>

      {/* Referenzpreise */}
      {ref && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
            <div className="text-sm font-bold text-[var(--muted-foreground)]">{fmt(ref.min)}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">Mindestpreis</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
            <div className="text-sm font-bold text-[#14532D]">{fmt(ref.mittel)}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">Marktmittel</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-center">
            <div className="text-sm font-bold text-[var(--muted-foreground)]">{fmt(ref.max)}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-1">Höchstpreis</div>
          </div>
        </div>
      )}

      {/* Sicherheits- / Qualitätshinweis aus Berechnungen */}
      {typeof c.sicherheitsHinweis === "string" && c.sicherheitsHinweis && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-2 text-sm text-orange-700">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{c.sicherheitsHinweis as string}</span>
          </div>
        </div>
      )}

      {/* KI-Einschätzung */}
      {result.ki_verfuegbar && ki && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5 space-y-4">
          <h3 className="font-semibold text-[#14532D] flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> KI-Einschätzung
          </h3>

          {empfehlung && (
            <div>
              <p className="text-sm font-medium text-[#14532D] mb-1">Empfehlung</p>
              <p className="text-sm text-[#15803D]">{empfehlung}</p>
            </div>
          )}

          {alternativenHinweis && (
            <div>
              <p className="text-sm font-medium text-[#14532D] mb-1">Alternativen</p>
              <p className="text-sm text-[#15803D]">{alternativenHinweis}</p>
            </div>
          )}

          {fragen.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#14532D] mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Wichtige Fragen
              </p>
              <ul className="space-y-1">
                {fragen.map((f, i) => (
                  <li key={i} className="text-sm text-[#15803D] flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Grundlagen */}
      {grundlagen.length > 0 && (
        <div className="rounded-lg border border-[var(--border)] p-4 text-xs text-[var(--muted-foreground)]">
          <p className="font-medium text-[var(--foreground)] mb-1">Datengrundlagen</p>
          <ul className="space-y-0.5">{grundlagen.map((g, i) => <li key={i}>· {g}</li>)}</ul>
        </div>
      )}
    </div>
  );
}
