"use client";
import { Zap, TrendingDown, Lightbulb, CheckCircle2, MessageSquare } from "lucide-react";
import type { ElektroautoErgebnis } from "@/lib/calculations/elektroauto";

export interface ElektroautoResult { calculations: ElektroautoErgebnis; ki_analyse: Record<string, unknown> | null; ki_verfuegbar: boolean; }
interface Props { result: ElektroautoResult; }
function fmt(n: number) { return n.toLocaleString("de-DE") + " €"; }

export function ElektroautoResultDashboard({ result }: Props) {
  const { calculations: c, ki_analyse, ki_verfuegbar } = result;
  const ki = ki_analyse as { wirtschaftlichkeit?: { fazit?: string; hauptkostentreiber?: string[]; einsparpotenziale?: string[] }; praktischeHinweise?: { reichweiteAlltag?: string; ladeempfehlung?: string; akkuPflege?: string }; empfehlung?: { action?: string; begruendung?: string; zeitpunkt?: string }; fragenVorKauf?: string[]; foerderHinweis?: string; } | null;

  const empfBg: Record<string, string> = { kaufen_empfohlen: "bg-green-50 border-green-200 text-green-700", abwarten: "bg-yellow-50 border-yellow-200 text-yellow-700", alternativen_pruefen: "bg-orange-50 border-orange-200 text-orange-700" };
  const empfLabel: Record<string, string> = { kaufen_empfohlen: "Kauf empfohlen", abwarten: "Abwarten empfohlen", alternativen_pruefen: "Alternativen prüfen" };

  return (
    <div className="space-y-5">
      {/* Ladekostenübersicht */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><Zap className="h-4 w-4 text-[#16A34A]" />Ladekosten</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Verbrauch", value: `${c.verbrauchPro100km} kWh/100km` },
            { label: "Kosten/km", value: `${(c.ladekostenProKm * 100).toFixed(1)} ct` },
            { label: "Ladekosten/Jahr", value: fmt(c.jahresLadekosten), highlight: true },
            { label: "Infrastruktur", value: fmt(c.ladeinfrastrukturKosten.einmalig) },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`rounded-lg p-3 text-center ${highlight ? "bg-[#F0FDF4] border border-[#BBF7D0]" : "bg-[var(--background)]"}`}>
              <p className="text-xs text-[var(--muted-foreground)] mb-1">{label}</p>
              <p className={`font-semibold text-sm ${highlight ? "text-[#15803D]" : "text-[var(--foreground)]"}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TCO 5 Jahre */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="font-semibold text-[var(--foreground)] mb-4 flex items-center gap-2"><TrendingDown className="h-4 w-4 text-[#16A34A]" />Total Cost of Ownership – 5 Jahre</h3>
        <div className="space-y-1.5">
          {[
            { label: "Kaufpreis", value: fmt(c.tco5Jahre.kaufpreis) },
            { label: "Ladekosten (5 J.)", value: fmt(c.tco5Jahre.ladekosten) },
            { label: "Ladeinfrastruktur", value: fmt(c.tco5Jahre.infrastruktur) },
            { label: "Wartung (5 J.)", value: fmt(c.tco5Jahre.wartung) },
            { label: "KfZ-Steuer (befreit)", value: "0 €" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">{label}</span>
              <span className="text-[var(--foreground)]">{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[var(--border)]">
            <span>TCO gesamt</span><span className="text-[#15803D]">{fmt(c.tco5Jahre.gesamtTCO)}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>Pro Jahr</span><span>{fmt(c.tco5Jahre.tcoProJahr)}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>Pro km</span><span>{c.tco5Jahre.tcoProKm} €</span>
          </div>
        </div>
      </div>

      {/* Verbrenner-Vergleich */}
      {c.vergleichVerbrenner.moeglich && c.vergleichVerbrenner.tco5JahreVerbrenner !== null && (
        <div className={`rounded-xl border p-5 ${c.vergleichVerbrenner.ersparnisBeiElektro! > 0 ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"}`}>
          <h3 className={`font-semibold mb-3 ${c.vergleichVerbrenner.ersparnisBeiElektro! > 0 ? "text-green-800" : "text-orange-800"}`}>Vergleich mit Verbrenner</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-xs text-[var(--muted-foreground)]">Verbrenner TCO (5 J.)</p><p className="font-semibold">{fmt(c.vergleichVerbrenner.tco5JahreVerbrenner)}</p></div>
            <div><p className="text-xs text-[var(--muted-foreground)]">E-Auto TCO (5 J.)</p><p className="font-semibold">{fmt(c.tco5Jahre.gesamtTCO)}</p></div>
          </div>
          {c.vergleichVerbrenner.ersparnisBeiElektro !== null && (
            <p className={`mt-3 text-sm font-medium ${c.vergleichVerbrenner.ersparnisBeiElektro > 0 ? "text-green-700" : "text-orange-700"}`}>
              {c.vergleichVerbrenner.ersparnisBeiElektro > 0 ? `E-Auto spart ${fmt(c.vergleichVerbrenner.ersparnisBeiElektro)} in 5 Jahren` : `Verbrenner günstiger um ${fmt(Math.abs(c.vergleichVerbrenner.ersparnisBeiElektro))}`}
            </p>
          )}
        </div>
      )}

      {/* Förderung */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-2 text-sm text-blue-800"><Lightbulb className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" /><p>{c.foerderungHinweis}</p></div>
      </div>

      {/* KI */}
      {ki_verfuegbar && ki && (
        <>
          {ki.empfehlung && (
            <div className={`rounded-xl border p-5 ${empfBg[ki.empfehlung.action ?? ""] ?? "bg-gray-50 border-gray-200"}`}>
              <p className="font-semibold">{empfLabel[ki.empfehlung.action ?? ""] ?? "Einschätzung"}</p>
              {ki.empfehlung.begruendung && <p className="text-sm mt-1">{ki.empfehlung.begruendung}</p>}
              {ki.empfehlung.zeitpunkt && <p className="text-xs mt-1 opacity-80">{ki.empfehlung.zeitpunkt}</p>}
            </div>
          )}
          {ki.wirtschaftlichkeit?.fazit && <p className="text-sm text-[var(--foreground)] bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">{ki.wirtschaftlichkeit.fazit}</p>}
          {ki.praktischeHinweise && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#16A34A]" />Praktische Hinweise</h3>
              {Object.entries(ki.praktischeHinweise).map(([k, v]) => v && (
                <p key={k} className="text-sm text-[var(--foreground)] mb-1"><strong>{k === "reichweiteAlltag" ? "Reichweite" : k === "ladeempfehlung" ? "Laden" : "Akku"}:</strong> {v as string}</p>
              ))}
            </div>
          )}
          {ki.fragenVorKauf && ki.fragenVorKauf.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
              <h3 className="font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-[#16A34A]" />Fragen vor dem Kauf</h3>
              <ul className="space-y-2">{ki.fragenVorKauf.map((f, i) => <li key={i} className="flex items-start gap-2.5 text-sm"><span className="shrink-0 w-5 h-5 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center text-xs font-bold">{i + 1}</span>{f}</li>)}</ul>
            </div>
          )}
        </>
      )}

      <div className="rounded-lg border border-[var(--border)] p-4"><p className="text-xs font-medium text-[var(--foreground)] mb-2">Datengrundlage</p><ul className="space-y-1">{c.grundlagen.map(g => <li key={g} className="text-xs text-[var(--muted-foreground)] flex gap-1.5"><span>·</span>{g}</li>)}</ul><p className="text-xs text-[var(--muted-foreground)] mt-1">{c.umweltHinweis}</p></div>
    </div>
  );
}
