"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const BEISPIEL_DATEN = {
  wohnflaeche: "140",
  gebaeudetyp: "altbau_teilsaniert",
  wpTyp: "luft",
  angebotspreis: "22000",
  heizwaermebedarf: "",
  strompreisWP: "",
  gaspreisAktuell: "",
  mitISFP: false,
  einkommensbonus: false,
  zusatzAngaben: "Altbau aus den 1970ern, Fenster und Dach bereits saniert.",
};

interface FormData {
  wohnflaeche: string;
  gebaeudetyp: string;
  wpTyp: string;
  angebotspreis: string;
  heizwaermebedarf: string;
  strompreisWP: string;
  gaspreisAktuell: string;
  mitISFP: boolean;
  einkommensbonus: boolean;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function WaermepumpeInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormData>({
    wohnflaeche: "", gebaeudetyp: "", wpTyp: "luft", angebotspreis: "",
    heizwaermebedarf: "", strompreisWP: "", gaspreisAktuell: "",
    mitISFP: false, einkommensbonus: false, zusatzAngaben: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.wohnflaeche || Number(form.wohnflaeche) <= 0) e.wohnflaeche = "Wohnfläche erforderlich";
    if (!form.gebaeudetyp) e.gebaeudetyp = "Gebäudetyp erforderlich";
    if (!form.wpTyp) e.wpTyp = "WP-Typ erforderlich";
    if (!form.angebotspreis || Number(form.angebotspreis) <= 0) e.angebotspreis = "Angebotspreis erforderlich";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  const inputClass = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#14532D] focus:border-transparent transition-colors";
  const labelClass = "block text-sm font-medium text-[var(--foreground)] mb-1.5";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">Pflichtfelder sind mit * markiert.</p>
        <button type="button" onClick={() => { setForm(BEISPIEL_DATEN); setErrors({}); }}
          className="text-xs text-[#16A34A] hover:text-[#14532D] underline underline-offset-2">
          Beispieldaten laden
        </button>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Gebäude & Anlage</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="wohnflaeche" className={labelClass}>Wohnfläche (m²) *</label>
            <input id="wohnflaeche" type="number" min={20} max={2000} placeholder="z.B. 140"
              value={form.wohnflaeche} onChange={(e) => set("wohnflaeche", e.target.value)} className={inputClass} />
            {errors.wohnflaeche && <p className={errorClass}>{errors.wohnflaeche}</p>}
          </div>
          <div>
            <label htmlFor="gebaeudetyp" className={labelClass}>Gebäudetyp *</label>
            <select id="gebaeudetyp" value={form.gebaeudetyp} onChange={(e) => set("gebaeudetyp", e.target.value)} className={inputClass}>
              <option value="">Bitte wählen</option>
              <option value="altbau_unsaniert">Altbau (unsaniert, vor 1979)</option>
              <option value="altbau_teilsaniert">Altbau (teilsaniert)</option>
              <option value="baujahr80">EFH ca. 1980–2000</option>
              <option value="neubau_kfw55">Neubau / KfW 55</option>
              <option value="neubau_kfw40">Neubau / KfW 40 (GEG 2023)</option>
            </select>
            {errors.gebaeudetyp && <p className={errorClass}>{errors.gebaeudetyp}</p>}
          </div>
          <div>
            <label htmlFor="wpTyp" className={labelClass}>Wärmepumpentyp *</label>
            <select id="wpTyp" value={form.wpTyp} onChange={(e) => set("wpTyp", e.target.value)} className={inputClass}>
              <option value="luft">Luft-Wasser (JAZ ≈ 3,0)</option>
              <option value="sole">Sole-Wasser / Erdwärme (JAZ ≈ 4,0)</option>
              <option value="wasser">Wasser-Wasser (JAZ ≈ 4,5)</option>
            </select>
            {errors.wpTyp && <p className={errorClass}>{errors.wpTyp}</p>}
          </div>
          <div>
            <label htmlFor="angebotspreis" className={labelClass}>Angebotspreis inkl. Installation (€) *</label>
            <input id="angebotspreis" type="number" min={5000} max={200000} placeholder="z.B. 22000"
              value={form.angebotspreis} onChange={(e) => set("angebotspreis", e.target.value)} className={inputClass} />
            {errors.angebotspreis && <p className={errorClass}>{errors.angebotspreis}</p>}
          </div>
          <div>
            <label htmlFor="heizwaermebedarf" className={labelClass}>Heizwärmebedarf (kWh/Jahr)</label>
            <input id="heizwaermebedarf" type="number" min={1000} max={500000} placeholder="Leer = wird berechnet"
              value={form.heizwaermebedarf} onChange={(e) => set("heizwaermebedarf", e.target.value)} className={inputClass} />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Optional – aus Energieausweis oder Gasrechnung</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Förderung</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <input id="mitISFP" type="checkbox" checked={form.mitISFP}
              onChange={(e) => set("mitISFP", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#14532D] focus:ring-[#14532D]" />
            <label htmlFor="mitISFP" className="text-sm text-[var(--foreground)]">
              Individueller Sanierungsfahrplan (iSFP) vorhanden – <span className="text-[#16A34A] font-medium">+5 % Bonus</span>
            </label>
          </div>
          <div className="flex items-start gap-3">
            <input id="einkommensbonus" type="checkbox" checked={form.einkommensbonus}
              onChange={(e) => set("einkommensbonus", e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#14532D] focus:ring-[#14532D]" />
            <label htmlFor="einkommensbonus" className="text-sm text-[var(--foreground)]">
              Einkommensbonus: Haushaltseinkommen ≤ 40.000 €/Jahr – <span className="text-[#16A34A] font-medium">+30 % Bonus</span>
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Optionale Preisangaben</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="strompreisWP" className={labelClass}>WP-Sondertarif Strom (€/kWh)</label>
            <input id="strompreisWP" type="number" min={0.1} max={0.5} step={0.01} placeholder="Leer = 0,26 €/kWh (2024)"
              value={form.strompreisWP} onChange={(e) => set("strompreisWP", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="gaspreisAktuell" className={labelClass}>Aktueller Gaspreis (€/kWh)</label>
            <input id="gaspreisAktuell" type="number" min={0.01} max={0.3} step={0.01} placeholder="Leer = 0,09 €/kWh (2024)"
              value={form.gaspreisAktuell} onChange={(e) => set("gaspreisAktuell", e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Zusätzliche Angaben (optional)</legend>
        <textarea id="zusatzAngaben" rows={3} placeholder="z.B. Heizkörper oder Fußbodenheizung, Zustand Gebäudedämmung, geplante Maßnahmen…"
          value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)}
          className={inputClass + " resize-none"} maxLength={2000} />
      </fieldset>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyse läuft…" : "Wärmepumpe prüfen"}
      </Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">
        Deine Angaben werden nur für diese Analyse verarbeitet und nicht gespeichert.
      </p>
    </form>
  );
}
