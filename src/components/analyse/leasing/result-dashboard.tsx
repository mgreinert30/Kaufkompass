"use client";

import { TrendingDown, TrendingUp, Minus, AlertTriangle, CheckCircle2, Lightbulb, MessageSquare, Car } from "lucide-react";
import type { LeasingErgebnis } from "@/lib/calculations/leasing";

export interface LeasingResult {
  calculations: LeasingErgebnis;
  ki_analyse:   Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: LeasingResult; }

const RATEN_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingDown },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: TrendingDown },
  marktgerecht:  { label: "Marktgerecht",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  teuer:         { label: "Teuer",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:    { label: "Sehr teuer",    color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
};

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  leasing_empfohlen:  { label: "Leasing empfohlen",         color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  kaufen_besser:      { label: "Kauf wäre günstiger",       color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  konditionen_pruefen:{ label: "Konditionen prüfen",        color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  anderes_angebot:    { label: "Anderes Angebot einholen",  color: "text-red-700",    bg: "bg-red-50 border-red-200" },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }
function fmtM(n: number) { return n.toLocaleString("de-DE") + " €/Mon."; }

export function LeasingResultDashboard({ result }: Props) {
  const { calculations: c, ki_analyse, ki_verfuegbar } = result;
  const ratCfg = RATEN_CONFIG[c.ratenBewertung.einschaetzung] ?? RATEN_CONFIG["marktgerecht"];
  const RatIcon = ratCfg.Icon;

  const ki = ki_analyse as {
    angebotsBewertung?: { fazit?: string; hauptrisiken?: string[]; vorteile?: string[] };
    konditionenCheck?: { auffaelligkeiten?: string[]; versteckteKosten?: string[]; kilometerRisiko?: string };
    steuerHinweis?: string;
    empfehlung?: { action?: string; begruendung?: string; verhandlungsTipp?: string };
    fragenFuerHaendler?: string[];
    alternativenHinweis?: string;
  } | null;

  const actionKey = ki?.empfehlung?.action ?? "";
  const actionCfg = ACTION_CONFIG[actionKey] ?? ACTION_CONFIG["konditionen_pruefen"];

  return (
    <div className="space-y-5">
      {/* Raten-Bewertung */}
      <div className={`rounded-xl border p-5 ${ratCfg.bg}`}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
          <div className="flex items-center gap-2">
            <RatIcon className={`h-5 w-5 ${ratCfg.color}`} />
            <span className={`font-semibold text-lg ${ratCfg.color}`}>{ratCfg.label}</span>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full border ${ratCfg.bg} ${ratCfg.color}`}>
            {c.ratenBewertung.prozentVonListenpreis}% vom Listenpreis
          </span>
        </div>
        <p className="text-sm text-[var(--foreground)]">{c.ratenBewertung.hinweis}</p>
      </div>

      {/* Kostenübersicht */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-[#16A34A]" />Kostenübersicht
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-4">
          {[
            { label: "Summe Raten", value: fmt(c.kostenuebersicht.summeRaten) },
            { label: "Anzahlung",   value: fmt(c.kostenuebersicht.anzahlung) },
            { label: "Gesamtkosten Leasing", value: fmt(c.gesamteLeasingkosten), highlight: true },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`rounded-lg p-3 text-center ${highlight ? "bg-[#F0FDF4] border border-[#BBF7D0]" : "bg-[var(--background)]"}`}>
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{label}</p>
              <p className={`font-semibold text-sm ${highlight ? "text-[#15803D]" : "text-[var(--foreground)]"}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Effektiver Monatsaufwand */}
        <div className="flex items-center justify-between p-3 bg-[var(--background)] rounded-lg mb-3">
          <span className="text-sm text-[var(--muted-foreground)]">Effektiver Monatsaufwand (inkl. Anzahlung)</span>
          <span className="font-semibold text-[var(--foreground)]">{fmtM(c.effektiverMonatsaufwand)}</span>
        </div>

        {/* TCO wenn Versicherung/Wartung angegeben */}
        {c.kostenuebersicht.gesamtTCO !== c.gesamteLeasingkosten && (
          <div className="space-y-1.5 pt-3 border-t border-[var(--border)]">
            <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-2">Total Cost of Ownership</p>
            {c.kostenuebersicht.versicherung !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Versicherung gesamt</span>
                <span>{fmt(c.kostenuebersicht.versicherung)}</span>
              </div>
            )}
            {c.kostenuebersicht.wartung !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Wartung/Service gesamt</span>
                <span>{fmt(c.kostenuebersicht.wartung)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-1 border-t border-[var(--border)]">
              <span>TCO gesamt</span>
              <span>{fmt(c.kostenuebersicht.gesamtTCO)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Leasing vs. Kauf */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4">Leasing vs. Kauf – Vergleich</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-[var(--background)] p-3">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">Leasingkosten gesamt</p>
            <p className="font-semibold text-[var(--foreground)]">{fmt(c.gesamteLeasingkosten)}</p>
          </div>
          <div className="rounded-lg bg-[var(--background)] p-3">
            <p className="text-xs text-[var(--muted-foreground)] mb-1">Kaufpreis-Wertverlust</p>
            <p className="font-semibold text-[var(--foreground)]">{fmt(c.kapitalverlust)}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Restwert nach Laufzeit: {fmt(c.verbleibenderRestwert)}</p>
          </div>
        </div>
        <div className={`mt-3 rounded-lg p-3 ${c.leasingVsKaufVergleich.empfehlung === "leasing_guenstiger" ? "bg-green-50 border border-green-200" : c.leasingVsKaufVergleich.empfehlung === "kauf_guenstiger" ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
          <p className="text-sm font-medium text-[var(--foreground)]">
            {c.leasingVsKaufVergleich.empfehlung === "leasing_guenstiger" && "Leasing günstiger als Kauf"}
            {c.leasingVsKaufVergleich.empfehlung === "kauf_guenstiger" && "Kauf günstiger als Leasing"}
            {c.leasingVsKaufVergleich.empfehlung === "aehnlich" && "Leasing und Kauf etwa gleichwertig"}
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
            Differenz: {c.leasingVsKaufVergleich.differenz > 0 ? "+" : ""}{fmt(c.leasingVsKaufVergleich.differenz)} (Leasing vs. Kauf-Wertverlust)
          </p>
        </div>

        {/* Kilometer-Hinweis */}
        <div className="mt-3 rounded-lg border border-[var(--border)] p-3">
          <p className="text-xs text-[var(--muted-foreground)]">{c.kilometerHinweis}</p>
        </div>
      </div>

      {/* KI-Analyse */}
      {ki_verfuegbar && ki && (
        <>
          {ki.empfehlung && (
            <div className={`rounded-xl border p-5 ${actionCfg.bg}`}>
              <span className={`font-semibold ${actionCfg.color}`}>{actionCfg.label}</span>
              {ki.empfehlung.begruendung && (
                <p className="text-sm text-[var(--foreground)] mt-2">{ki.empfehlung.begruendung}</p>
              )}
              {ki.empfehlung.verhandlungsTipp && (
                <div className="mt-2 flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <Lightbulb className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <span>{ki.empfehlung.verhandlungsTipp}</span>
                </div>
              )}
            </div>
          )}

          {ki.angebotsBewertung && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">KI-Einschätzung</h3>
              {ki.angebotsBewertung.fazit && <p className="text-sm text-[var(--foreground)] mb-3">{ki.angebotsBewertung.fazit}</p>}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ki.angebotsBewertung.vorteile && ki.angebotsBewertung.vorteile.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1.5">Vorteile</p>
                    <ul className="space-y-1">
                      {ki.angebotsBewertung.vorteile.map((v) => (
                        <li key={v} className="flex items-start gap-1.5 text-xs text-[var(--foreground)]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />{v}
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

          {ki.konditionenCheck && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">Konditionencheck</h3>
              {ki.konditionenCheck.auffaelligkeiten && ki.konditionenCheck.auffaelligkeiten.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1.5">Auffälligkeiten</p>
                  <ul className="space-y-1">
                    {ki.konditionenCheck.auffaelligkeiten.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ki.konditionenCheck.versteckteKosten && ki.konditionenCheck.versteckteKosten.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1.5">Mögliche versteckte Kosten</p>
                  <ul className="space-y-1">
                    {ki.konditionenCheck.versteckteKosten.map((k) => (
                      <li key={k} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <span className="text-red-500 font-bold shrink-0">·</span>{k}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ki.konditionenCheck.kilometerRisiko && (
                <p className="text-sm text-[var(--muted-foreground)] bg-[var(--background)] rounded p-2">
                  <strong>Kilometerrisiko:</strong> {ki.konditionenCheck.kilometerRisiko}
                </p>
              )}
            </div>
          )}

          {ki.steuerHinweis && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div><span className="font-medium">Steuerhinweis: </span>{ki.steuerHinweis}</div>
              </div>
            </div>
          )}

          {ki.fragenFuerHaendler && ki.fragenFuerHaendler.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#16A34A]" />Fragen vor Vertragsunterzeichnung
              </h3>
              <ul className="space-y-2">
                {ki.fragenFuerHaendler.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ki.alternativenHinweis && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-2 text-sm text-blue-800">
                <Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div><span className="font-medium">Alternativen: </span>{ki.alternativenHinweis}</div>
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
