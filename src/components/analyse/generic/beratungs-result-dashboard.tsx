"use client";

import { CheckCircle2, Lightbulb, MessageSquare, AlertTriangle, TrendingDown, TrendingUp, Minus } from "lucide-react";

export interface BeratungsResult {
  ki_analyse: Record<string, unknown> | null;
  ki_verfuegbar: boolean;
  eingabe?: Record<string, unknown>;
}

interface Props {
  result: BeratungsResult;
  empfehlungKey?: string;
  fragenKey?: string;
  alternativenKey?: string;
}

const ACTION_LABELS: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  abschliessen:          { label: "Empfohlen – abschließen",     color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  beauftragen:           { label: "Beauftragen empfohlen",        color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: CheckCircle2 },
  buchen:                { label: "Buchen empfohlen",             color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: CheckCircle2 },
  kaufen:                { label: "Kaufen empfohlen",             color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: CheckCircle2 },
  wechseln:              { label: "Wechseln empfohlen",           color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  planen_ok:             { label: "Planung OK",                   color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: CheckCircle2 },
  zustimmen:             { label: "Zustimmen empfohlen",          color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: CheckCircle2 },
  testen:                { label: "Testen empfohlen",             color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: Lightbulb },
  verhandeln:            { label: "Verhandeln empfohlen",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: Minus },
  vergleichen:           { label: "Vergleichen empfohlen",        color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: Minus },
  zweite_meinung:        { label: "2. Meinung einholen",          color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  zweites_angebot:       { label: "2. Angebot einholen",          color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  alternativen_pruefen:  { label: "Alternativen prüfen",          color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  ablehnen:              { label: "Ablehnen empfohlen",           color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
  budget_anpassen:       { label: "Budget anpassen",              color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  prioriataeten_setzen:  { label: "Prioritäten setzen",           color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: AlertTriangle },
  teilzustimmen:         { label: "Teilweise zustimmen",          color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: Minus },
  bleiben:               { label: "Beim Anbieter bleiben",        color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
};

function getStr(obj: Record<string, unknown>, key: string): string {
  const v = obj[key];
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null) {
    const sub = v as Record<string, unknown>;
    return typeof sub.begruendung === "string" ? sub.begruendung
         : typeof sub.fazit === "string" ? sub.fazit
         : typeof sub.hinweis === "string" ? sub.hinweis : "";
  }
  return "";
}

function getArr(obj: Record<string, unknown>, ...keys: string[]): string[] {
  for (const k of keys) {
    const v = obj[k];
    if (Array.isArray(v)) return (v as unknown[]).filter((x): x is string => typeof x === "string");
    if (typeof v === "object" && v !== null) {
      const sub = v as Record<string, unknown>;
      for (const sk of Object.keys(sub)) {
        if (Array.isArray(sub[sk])) return (sub[sk] as unknown[]).filter((x): x is string => typeof x === "string");
      }
    }
  }
  return [];
}

export function BeratungsResultDashboard({ result, empfehlungKey = "empfehlung", fragenKey, alternativenKey = "alternativenHinweis" }: Props) {
  const ki = result.ki_analyse;

  if (!result.ki_verfuegbar || !ki) {
    return (
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-orange-600 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-700">KI-Analyse nicht verfügbar</p>
            <p className="text-sm text-orange-600 mt-1">Kein API-Key konfiguriert. Die deterministische Auswertung ist vollständig.</p>
          </div>
        </div>
      </div>
    );
  }

  // Empfehlung
  const empfehlungObj = ki[empfehlungKey];
  const action = typeof empfehlungObj === "object" && empfehlungObj !== null
    ? String((empfehlungObj as Record<string, unknown>).action ?? "")
    : "";
  const begruendung = typeof empfehlungObj === "object" && empfehlungObj !== null
    ? getStr(empfehlungObj as Record<string, unknown>, "begruendung")
    : (typeof empfehlungObj === "string" ? empfehlungObj : "");
  const verhandlungsTipp = typeof empfehlungObj === "object" && empfehlungObj !== null
    ? getStr(empfehlungObj as Record<string, unknown>, "verhandlungsTipp")
    : "";

  const actionConfig = ACTION_LABELS[action] ?? { label: action, color: "text-gray-700", bg: "bg-gray-50 border-gray-200", Icon: Minus };
  const ActionIcon = actionConfig.Icon;

  // Fragen
  const fragenKeys = fragenKey
    ? [fragenKey]
    : ["fragenVorAbschluss", "fragenVorKauf", "fragenVorBuchung", "fragenFuerZahnarzt", "fragenFuerTierarzt", "fragenFuerBestatter", "fragenFuerDienstleister"];
  const fragen = getArr(ki, ...fragenKeys);

  // Alternativen
  const alternativenHinweis = typeof ki[alternativenKey] === "string" ? (ki[alternativenKey] as string) : "";

  // Weitere strukturierte Felder rendern
  const otherSections: Array<{ titel: string; items: string[] }> = [];
  for (const [k, v] of Object.entries(ki)) {
    if (k === empfehlungKey || k === alternativenKey || fragen.length > 0 && fragenKeys.includes(k)) continue;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      const sub = v as Record<string, unknown>;
      const items: string[] = [];
      for (const sv of Object.values(sub)) {
        if (typeof sv === "string" && sv.length > 5) items.push(sv);
        else if (Array.isArray(sv)) items.push(...(sv as unknown[]).filter((x): x is string => typeof x === "string"));
      }
      if (items.length > 0) otherSections.push({ titel: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()), items });
    } else if (Array.isArray(v) && v.length > 0) {
      const items = (v as unknown[]).filter((x): x is string => typeof x === "string");
      if (items.length > 0) otherSections.push({ titel: k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()), items });
    }
  }

  return (
    <div className="space-y-6">
      {/* Empfehlung-Badge */}
      {action && (
        <div className={`rounded-xl border p-5 ${actionConfig.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <ActionIcon className={`h-5 w-5 ${actionConfig.color}`} />
            <span className={`font-bold ${actionConfig.color}`}>{actionConfig.label}</span>
          </div>
          {begruendung && <p className={`text-sm ${actionConfig.color}`}>{begruendung}</p>}
        </div>
      )}

      {/* Verhandlungstipp */}
      {verhandlungsTipp && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-700 mb-1 flex items-center gap-1.5">
            <Lightbulb className="h-3.5 w-3.5" /> Verhandlungstipp
          </p>
          <p className="text-sm text-blue-700">{verhandlungsTipp}</p>
        </div>
      )}

      {/* Weitere strukturierte Felder */}
      {otherSections.slice(0, 3).map(({ titel, items }) => (
        <div key={titel} className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--foreground)] mb-3 text-sm">{titel}</h3>
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                <span className="text-[#16A34A] font-bold shrink-0 mt-0.5">·</span>{item}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Fragen */}
      {fragen.length > 0 && (
        <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-5">
          <h3 className="font-semibold text-[#14532D] mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Wichtige Fragen vor der Entscheidung
          </h3>
          <ul className="space-y-1">
            {fragen.map((f, i) => (
              <li key={i} className="text-sm text-[#15803D] flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />{f}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alternativen */}
      {alternativenHinweis && (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">Alternativen</p>
          <p className="text-sm text-[var(--muted-foreground)]">{alternativenHinweis}</p>
        </div>
      )}
    </div>
  );
}
