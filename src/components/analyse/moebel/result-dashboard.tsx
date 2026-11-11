"use client";

import { CheckCircle2, AlertTriangle, TrendingDown, TrendingUp, Minus, Package, MessageSquare, Lightbulb, ShoppingCart } from "lucide-react";
import type { MoebelErgebnis } from "@/lib/calculations/moebel";

export interface MoebelResult {
  calculations: MoebelErgebnis;
  ki_analyse:   Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: MoebelResult; }

const BEWERTUNG_CONFIG = {
  sehr_guenstig:  { label: "Sehr günstig",   color: "text-blue-700",  bg: "bg-blue-50 border-blue-200",  Icon: TrendingDown },
  guenstig:       { label: "Günstig",         color: "text-green-700", bg: "bg-green-50 border-green-200", Icon: TrendingDown },
  marktgerecht:   { label: "Marktgerecht",    color: "text-gray-700",  bg: "bg-gray-50 border-gray-200",  Icon: Minus },
  teuer:          { label: "Teuer",           color: "text-orange-700",bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:     { label: "Sehr teuer",      color: "text-red-700",   bg: "bg-red-50 border-red-200",    Icon: TrendingUp },
};

const EMPFEHLUNG_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  kaufen:              { label: "Kaufen empfohlen",      color: "text-green-700", bg: "bg-green-50 border-green-200" },
  verhandeln:          { label: "Preis verhandeln",      color: "text-yellow-700",bg: "bg-yellow-50 border-yellow-200" },
  alternativen_pruefen:{ label: "Alternativen prüfen",   color: "text-orange-700",bg: "bg-orange-50 border-orange-200" },
  ablehnen:            { label: "Nicht empfohlen",       color: "text-red-700",   bg: "bg-red-50 border-red-200" },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function MoebelResultDashboard({ result }: Props) {
  const { calculations: c, ki_analyse, ki_verfuegbar } = result;
  const bewCfg = BEWERTUNG_CONFIG[c.angebotsBewertung.einschaetzung];
  const BewIcon = bewCfg.Icon;

  const ki = ki_analyse as {
    angebotsBewertung?: { fazit?: string; hauptrisiken?: string[]; staerken?: string[] };
    qualitaetsPruefung?: { woraufAchten?: string[]; typischeSchwachstellen?: string[]; garantieHinweis?: string };
    kaufEmpfehlung?: { empfehlung?: string; begruendung?: string; verhandlungstipp?: string };
    fragenFuerAnbieter?: string[];
    alternativenHinweis?: string;
  } | null;

  const empfKey = ki?.kaufEmpfehlung?.empfehlung ?? "";
  const empfCfg = EMPFEHLUNG_CONFIG[empfKey] ?? EMPFEHLUNG_CONFIG["alternativen_pruefen"];

  return (
    <div className="space-y-5">
      {/* Preisbewertung */}
      <div className={`rounded-xl border p-5 ${bewCfg.bg}`}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BewIcon className={`h-5 w-5 ${bewCfg.color}`} aria-hidden="true" />
            <span className={`font-semibold text-lg ${bewCfg.color}`}>{bewCfg.label}</span>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${bewCfg.bg} ${bewCfg.color}`}>
            {c.angebotsBewertung.abweichungProzent > 0 ? "+" : ""}{c.angebotsBewertung.abweichungProzent}% ggü. Referenz
          </span>
        </div>
        <p className="text-sm text-[var(--foreground)]">{c.angebotsBewertung.hinweis}</p>
      </div>

      {/* Preisvergleich */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Package className="h-4 w-4 text-[#16A34A]" />{c.kategorieLabel} – Preisübersicht
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Angebotspreis",  value: fmt(c.gesamtkosten.min === c.gesamtkosten.max ? c.gesamtkosten.min : c.gesamtkosten.min), highlight: true },
            { label: "Referenz Min",   value: fmt(c.referenzPreis.min) },
            { label: "Referenz Mittel",value: fmt(c.referenzPreis.mittel) },
            { label: "Referenz Max",   value: fmt(c.referenzPreis.max) },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`rounded-lg p-3 text-center ${highlight ? "bg-[#F0FDF4] border border-[#BBF7D0]" : "bg-[var(--background)]"}`}>
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{label}</p>
              <p className={`font-semibold text-sm ${highlight ? "text-[#15803D]" : "text-[var(--foreground)]"}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Zusatzkosten */}
        {(c.lieferungKosten || c.montageKosten) && (
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--muted-foreground)] mb-2">Geschätzte Zusatzkosten (nicht inklusive)</p>
            <div className="space-y-1">
              {c.lieferungKosten && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Lieferung</span>
                  <span className="text-[var(--foreground)]">{fmt(c.lieferungKosten.min)} – {fmt(c.lieferungKosten.max)}</span>
                </div>
              )}
              {c.montageKosten && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Montage / Aufbau</span>
                  <span className="text-[var(--foreground)]">{fmt(c.montageKosten.min)} – {fmt(c.montageKosten.max)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold pt-1 border-t border-[var(--border)]">
                <span className="text-[var(--foreground)]">Gesamtkosten</span>
                <span className="text-[var(--foreground)]">{fmt(c.gesamtkosten.min)} – {fmt(c.gesamtkosten.max)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Qualitätshinweise */}
      {c.qualitaetsHinweise.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />Qualitätshinweise für {c.qualitaetLabel}
          </h3>
          <ul className="space-y-2">
            {c.qualitaetsHinweise.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                <span className="text-[#16A34A] font-bold shrink-0 mt-0.5">·</span>{h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KI-Analyse */}
      {ki_verfuegbar && ki && (
        <>
          {/* KI-Kaufempfehlung */}
          {ki.kaufEmpfehlung && (
            <div className={`rounded-xl border p-5 ${empfCfg.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingCart className={`h-4 w-4 ${empfCfg.color}`} />
                <span className={`font-semibold ${empfCfg.color}`}>{empfCfg.label}</span>
              </div>
              {ki.kaufEmpfehlung.begruendung && (
                <p className="text-sm text-[var(--foreground)] mb-2">{ki.kaufEmpfehlung.begruendung}</p>
              )}
              {ki.kaufEmpfehlung.verhandlungstipp && (
                <div className="mt-2 flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <Lightbulb className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <span>{ki.kaufEmpfehlung.verhandlungstipp}</span>
                </div>
              )}
            </div>
          )}

          {/* KI-Bewertung */}
          {ki.angebotsBewertung && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">KI-Einschätzung</h3>
              {ki.angebotsBewertung.fazit && (
                <p className="text-sm text-[var(--foreground)] mb-3">{ki.angebotsBewertung.fazit}</p>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ki.angebotsBewertung.staerken && ki.angebotsBewertung.staerken.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1.5">Stärken</p>
                    <ul className="space-y-1">
                      {ki.angebotsBewertung.staerken.map((s) => (
                        <li key={s} className="flex items-start gap-1.5 text-xs text-[var(--foreground)]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {ki.angebotsBewertung.hauptrisiken && ki.angebotsBewertung.hauptrisiken.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1.5">Risiken</p>
                    <ul className="space-y-1">
                      {ki.angebotsBewertung.hauptrisiken.map((r) => (
                        <li key={r} className="flex items-start gap-1.5 text-xs text-[var(--foreground)]">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Qualitätsprüfung */}
          {ki.qualitaetsPruefung && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />Qualitätsprüfung
              </h3>
              {ki.qualitaetsPruefung.woraufAchten && ki.qualitaetsPruefung.woraufAchten.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Worauf achten</p>
                  <ul className="space-y-1.5">
                    {ki.qualitaetsPruefung.woraufAchten.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <span className="text-[#16A34A] font-bold shrink-0">·</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ki.qualitaetsPruefung.typischeSchwachstellen && ki.qualitaetsPruefung.typischeSchwachstellen.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-2">Typische Schwachstellen</p>
                  <ul className="space-y-1.5">
                    {ki.qualitaetsPruefung.typischeSchwachstellen.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ki.qualitaetsPruefung.garantieHinweis && (
                <p className="text-xs text-[var(--muted-foreground)] bg-[var(--background)] rounded p-2">
                  <strong>Garantie:</strong> {ki.qualitaetsPruefung.garantieHinweis}
                </p>
              )}
            </div>
          )}

          {/* Fragen für Anbieter */}
          {ki.fragenFuerAnbieter && ki.fragenFuerAnbieter.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#16A34A]" />Fragen vor dem Kauf
              </h3>
              <ul className="space-y-2">
                {ki.fragenFuerAnbieter.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternativen */}
          {ki.alternativenHinweis && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium">Alternativen: </span>
                  {ki.alternativenHinweis}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Datengrundlage */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <p className="text-xs font-medium text-[var(--foreground)] mb-2">Datengrundlage</p>
        <ul className="space-y-1">
          {c.grundlagen.map((g) => (
            <li key={g} className="text-xs text-[var(--muted-foreground)] flex items-start gap-1.5">
              <span className="shrink-0">·</span>{g}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
