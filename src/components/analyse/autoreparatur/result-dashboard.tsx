"use client";

import { CheckCircle2, AlertTriangle, Wrench, MessageSquare, Lightbulb, Shield, TrendingUp, Minus } from "lucide-react";
import type { AutoreparaturErgebnis } from "@/lib/calculations/autoreparatur";

export interface AutoreparaturResult {
  calculations: AutoreparaturErgebnis;
  ki_analyse:   Record<string, unknown> | null;
  ki_verfuegbar: boolean;
}

interface Props { result: AutoreparaturResult; }

const BEWERTUNG_CONFIG: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{className?: string}> }> = {
  sehr_guenstig: { label: "Sehr günstig",  color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   Icon: TrendingUp },
  guenstig:      { label: "Günstig",       color: "text-green-700",  bg: "bg-green-50 border-green-200",  Icon: Minus },
  marktgerecht:  { label: "Marktgerecht",  color: "text-gray-700",   bg: "bg-gray-50 border-gray-200",   Icon: Minus },
  teuer:         { label: "Teuer",         color: "text-orange-700", bg: "bg-orange-50 border-orange-200", Icon: TrendingUp },
  sehr_teuer:    { label: "Sehr teuer",    color: "text-red-700",    bg: "bg-red-50 border-red-200",     Icon: TrendingUp },
  unbekannt:     { label: "Nicht bewertbar",color: "text-gray-600",  bg: "bg-gray-50 border-gray-200",   Icon: Minus },
};

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  annehmen:          { label: "Annehmen empfohlen",   color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  verhandeln:        { label: "Preis verhandeln",     color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  zweites_angebot:   { label: "Zweites Angebot einholen", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  ablehnen:          { label: "Nicht empfohlen",      color: "text-red-700",    bg: "bg-red-50 border-red-200" },
};

function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function AutoreparaturResultDashboard({ result }: Props) {
  const { calculations: c, ki_analyse, ki_verfuegbar } = result;
  const bewCfg = BEWERTUNG_CONFIG[c.angebotsBewertung.einschaetzung] ?? BEWERTUNG_CONFIG["unbekannt"];
  const BewIcon = bewCfg.Icon;

  const ki = ki_analyse as {
    angebotsBewertung?: { fazit?: string; hauptrisiken?: string[]; positivePunkte?: string[] };
    positionenCheck?: { auffaelligkeiten?: string[]; typischeZusatzkosten?: string[]; fehlendePflichtangaben?: string[] };
    empfehlung?: { action?: string; begruendung?: string; verhandlungsTipp?: string };
    fragenFuerWerkstatt?: string[];
    alternativenHinweis?: string;
  } | null;

  const actionKey = ki?.empfehlung?.action ?? "";
  const actionCfg = ACTION_CONFIG[actionKey] ?? ACTION_CONFIG["zweites_angebot"];

  return (
    <div className="space-y-5">
      {/* Transparenz-Score */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
          <h3 className="font-semibold text-[var(--foreground)] flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#16A34A]" />Angebotstransparenz
          </h3>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`h-3 w-8 rounded-full ${i < c.transparenzScore ? "bg-[#16A34A]" : "bg-[var(--border)]"}`} />
            ))}
            <span className="ml-1 text-sm font-medium text-[var(--foreground)]">{c.transparenzScore}/3</span>
          </div>
        </div>
        {c.transparenzHinweise.length > 0 && (
          <ul className="space-y-1">
            {c.transparenzHinweise.map((h) => (
              <li key={h} className="flex items-start gap-2 text-sm text-orange-700">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" />{h}
              </li>
            ))}
          </ul>
        )}
        {c.transparenzScore === 3 && (
          <p className="text-sm text-green-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />Vollständiges Angebot mit Stundensatz, Arbeitszeit und Teilepreisen.
          </p>
        )}
      </div>

      {/* Stundensatz-Vergleich */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2">
          <Wrench className="h-4 w-4 text-[#16A34A]" />Stundensatz-Referenz: {c.werkstattLabel}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Markt Min", value: fmt(c.stundensatzReferenz.min) },
            { label: "Markt Mittel", value: fmt(c.stundensatzReferenz.marktMittel) },
            { label: "Markt Max", value: fmt(c.stundensatzReferenz.max) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-[var(--background)] p-3 text-center">
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{label}</p>
              <p className="font-semibold text-sm text-[var(--foreground)]">{value}</p>
            </div>
          ))}
        </div>

        {c.stundensatzBewertung && (
          <div className={`mt-4 rounded-lg border p-3 ${BEWERTUNG_CONFIG[c.stundensatzBewertung.einschaetzung]?.bg ?? "bg-gray-50 border-gray-200"}`}>
            <p className={`text-sm font-medium ${BEWERTUNG_CONFIG[c.stundensatzBewertung.einschaetzung]?.color ?? "text-gray-700"}`}>
              Stundensatz: {BEWERTUNG_CONFIG[c.stundensatzBewertung.einschaetzung]?.label}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{c.stundensatzBewertung.hinweis}</p>
          </div>
        )}
      </div>

      {/* Kostenaufschlüsselung */}
      <div className={`rounded-xl border p-5 ${bewCfg.bg}`}>
        <div className="flex items-center gap-2 mb-3">
          <BewIcon className={`h-5 w-5 ${bewCfg.color}`} />
          <span className={`font-semibold ${bewCfg.color}`}>Gesamtpreis: {bewCfg.label}</span>
        </div>
        <p className="text-sm text-[var(--foreground)] mb-3">{c.angebotsBewertung.hinweis}</p>

        {(c.kostenaufschluesselung.arbeitskosten !== null || c.kostenaufschluesselung.teilekosten !== null) && (
          <div className="space-y-1.5">
            {c.kostenaufschluesselung.arbeitskosten !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Arbeitskosten (kalkuliert)</span>
                <span className="font-medium text-[var(--foreground)]">{fmt(c.kostenaufschluesselung.arbeitskosten)}</span>
              </div>
            )}
            {c.kostenaufschluesselung.teilekosten !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Teilekosten</span>
                <span className="font-medium text-[var(--foreground)]">{fmt(c.kostenaufschluesselung.teilekosten)}</span>
              </div>
            )}
            {c.kostenaufschluesselung.sonstige !== null && c.kostenaufschluesselung.sonstige > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Nicht erklärter Rest</span>
                <span className="font-medium text-orange-700">{fmt(c.kostenaufschluesselung.sonstige)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-1.5 border-t border-[var(--border)]">
              <span>Gesamtpreis</span>
              <span>{fmt(c.kostenaufschluesselung.gesamt)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Risikohinweise */}
      {c.risikoHinweise.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">
          <h3 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />Risikohinweise
          </h3>
          <ul className="space-y-2">
            {c.risikoHinweise.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-orange-800">
                <span className="shrink-0 font-bold">·</span>{r}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* KI-Analyse */}
      {ki_verfuegbar && ki && (
        <>
          {/* KI-Empfehlung */}
          {ki.empfehlung && (
            <div className={`rounded-xl border p-5 ${actionCfg.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-semibold ${actionCfg.color}`}>{actionCfg.label}</span>
              </div>
              {ki.empfehlung.begruendung && (
                <p className="text-sm text-[var(--foreground)] mb-2">{ki.empfehlung.begruendung}</p>
              )}
              {ki.empfehlung.verhandlungsTipp && (
                <div className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                  <Lightbulb className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                  <span>{ki.empfehlung.verhandlungsTipp}</span>
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
                {ki.angebotsBewertung.positivePunkte && ki.angebotsBewertung.positivePunkte.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1.5">Positive Aspekte</p>
                    <ul className="space-y-1">
                      {ki.angebotsBewertung.positivePunkte.map((p) => (
                        <li key={p} className="flex items-start gap-1.5 text-xs text-[var(--foreground)]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />{p}
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

          {/* Positionencheck */}
          {ki.positionenCheck && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-[#16A34A]" />Positionencheck
              </h3>
              {ki.positionenCheck.fehlendePflichtangaben && ki.positionenCheck.fehlendePflichtangaben.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-red-600 uppercase tracking-wide mb-1.5">Fehlende Pflichtangaben</p>
                  <ul className="space-y-1">
                    {ki.positionenCheck.fehlendePflichtangaben.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ki.positionenCheck.auffaelligkeiten && ki.positionenCheck.auffaelligkeiten.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-orange-600 uppercase tracking-wide mb-1.5">Auffälligkeiten</p>
                  <ul className="space-y-1">
                    {ki.positionenCheck.auffaelligkeiten.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <span className="text-orange-500 font-bold shrink-0">·</span>{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {ki.positionenCheck.typischeZusatzkosten && ki.positionenCheck.typischeZusatzkosten.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-1.5">Mögliche Zusatzkosten</p>
                  <ul className="space-y-1">
                    {ki.positionenCheck.typischeZusatzkosten.map((z) => (
                      <li key={z} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <span className="text-[var(--muted-foreground)] shrink-0">·</span>{z}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Fragen für Werkstatt */}
          {ki.fragenFuerWerkstatt && ki.fragenFuerWerkstatt.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#16A34A]" />Fragen vor der Auftragserteilung
              </h3>
              <ul className="space-y-2">
                {ki.fragenFuerWerkstatt.map((f, i) => (
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
