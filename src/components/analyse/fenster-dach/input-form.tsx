"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface FensterDachFormData {
  massnahme: string;
  anzahlFenster: string;
  fensterFlaeche: string;
  dachFlaeche: string;
  angebotspreis: string;
  baujahr: string;
  mitISFP: boolean;
  bundesland: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: FensterDachFormData) => void;
  isLoading: boolean;
}

const MASSNAHMEN = [
  { value: "fenster_austausch",        label: "Fenstertausch (komplett, inkl. Montage)" },
  { value: "fenster_verglasung",       label: "Nur Verglasung tauschen" },
  { value: "dach_eindeckung",          label: "Dacheindeckung erneuern" },
  { value: "dach_daemmung_innen",      label: "Dachschrägen-Innendämmung" },
  { value: "dach_daemmung_aussen",     label: "Aufsparrendämmung (Außendämmung Dach)" },
  { value: "dach_daemmung_flach",      label: "Flachdach-Dämmung" },
  { value: "dach_sanierung_komplett",  label: "Dachsanierung komplett (Eindeckung + Dämmung)" },
];

const BUNDESLAENDER = [
  "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
  "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
  "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
  "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen",
];

export function FensterDachInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FensterDachFormData>({
    massnahme: "fenster_austausch",
    anzahlFenster: "",
    fensterFlaeche: "",
    dachFlaeche: "",
    angebotspreis: "",
    baujahr: "",
    mitISFP: false,
    bundesland: "",
    zusatzAngaben: "",
  });

  const set = (field: keyof FensterDachFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const isFenster = ["fenster_austausch", "fenster_verglasung"].includes(form.massnahme);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Maßnahme */}
      <div>
        <label htmlFor="fd-massnahme" className={labelCls}>Maßnahme *</label>
        <select id="fd-massnahme" value={form.massnahme} onChange={set("massnahme")} className={inputCls}>
          {MASSNAHMEN.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Mengenangaben */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {isFenster ? (
          <>
            <div>
              <label htmlFor="fd-anzahl" className={labelCls}>
                Anzahl Fenster <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
              </label>
              <input
                id="fd-anzahl" type="number" min="1" max="200"
                value={form.anzahlFenster} onChange={set("anzahlFenster")}
                placeholder="z.B. 12"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="fd-flaeche-fenster" className={labelCls}>
                Fensterfläche gesamt <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
              </label>
              <div className="relative">
                <input
                  id="fd-flaeche-fenster" type="number" min="1" max="2000" step="0.5"
                  value={form.fensterFlaeche} onChange={set("fensterFlaeche")}
                  placeholder="z.B. 18"
                  className={inputCls + " pr-10"}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">m²</span>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label htmlFor="fd-dachflaeche" className={labelCls}>
              Dachfläche <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="fd-dachflaeche" type="number" min="10" max="5000" step="5"
                value={form.dachFlaeche} onChange={set("dachFlaeche")}
                placeholder="z.B. 120"
                className={inputCls + " pr-10"}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">m²</span>
            </div>
          </div>
        )}
        <div>
          <label htmlFor="fd-angebot" className={labelCls}>
            Angebotspreis <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="fd-angebot" type="number" min="100" max="500000"
              value={form.angebotspreis} onChange={set("angebotspreis")}
              placeholder="z.B. 15000"
              className={inputCls + " pr-10"}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">€</span>
          </div>
        </div>
      </div>

      {/* Gebäude */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fd-baujahr" className={labelCls}>
            Baujahr Gebäude <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <input
            id="fd-baujahr" type="number" min="1850" max="2030"
            value={form.baujahr} onChange={set("baujahr")}
            placeholder="z.B. 1975"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="fd-bundesland" className={labelCls}>
            Bundesland <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <select id="fd-bundesland" value={form.bundesland} onChange={set("bundesland")} className={inputCls}>
            <option value="">Bundesland wählen…</option>
            {BUNDESLAENDER.map((bl) => <option key={bl} value={bl}>{bl}</option>)}
          </select>
        </div>
      </div>

      {/* iSFP */}
      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={form.mitISFP}
          onChange={(e) => setForm((f) => ({ ...f, mitISFP: e.target.checked }))}
          className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[#14532D]"
        />
        <div>
          <span className="text-sm font-medium text-[var(--foreground)]">Individueller Sanierungsfahrplan (iSFP) vorhanden</span>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">+5 % BAFA-Bonus auf die Förderung</p>
        </div>
      </label>

      {/* Zusatzangaben */}
      <div>
        <label htmlFor="fd-zusatz" className={labelCls}>
          Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </label>
        <textarea
          id="fd-zusatz" rows={3}
          value={form.zusatzAngaben} onChange={set("zusatzAngaben")}
          maxLength={2000}
          placeholder="z.B. besondere Anforderungen, Fragen, offene Punkte…"
          className={inputCls + " resize-none"}
        />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        <Building2 className="h-4 w-4" aria-hidden="true" />
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
