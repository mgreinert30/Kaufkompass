"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const BEISPIEL_DATEN = {
  marke: "Volkswagen",
  modell: "Golf 2.0 TDI",
  baujahr: "2019",
  kilometerstand: "75000",
  kraftstoff: "diesel",
  kaufpreis: "18500",
  hubraum: "1968",
  verbrauch: "5.5",
  jahresfahrleistung: "15000",
  zusatzAngaben: "Privatverkauf, Scheckheftgepflegt, keine Unfälle laut Aussage des Verkäufers.",
};

interface FormData {
  marke: string;
  modell: string;
  baujahr: string;
  kilometerstand: string;
  kraftstoff: string;
  kaufpreis: string;
  hubraum: string;
  verbrauch: string;
  jahresfahrleistung: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function GebrauchtwagenInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormData>({
    marke: "", modell: "", baujahr: "", kilometerstand: "",
    kraftstoff: "", kaufpreis: "", hubraum: "", verbrauch: "",
    jahresfahrleistung: "15000", zusatzAngaben: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.marke) e.marke = "Marke erforderlich";
    if (!form.modell) e.modell = "Modell erforderlich";
    if (!form.baujahr || Number(form.baujahr) < 1990) e.baujahr = "Baujahr erforderlich (ab 1990)";
    if (!form.kilometerstand) e.kilometerstand = "Kilometerstand erforderlich";
    if (!form.kraftstoff) e.kraftstoff = "Kraftstoff erforderlich";
    if (!form.kaufpreis || Number(form.kaufpreis) <= 0) e.kaufpreis = "Kaufpreis erforderlich";
    if (!form.jahresfahrleistung || Number(form.jahresfahrleistung) < 1000) e.jahresfahrleistung = "Jahresfahrleistung erforderlich";
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
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Fahrzeugdaten</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="marke" className={labelClass}>Marke *</label>
            <input id="marke" type="text" placeholder="z.B. Volkswagen" value={form.marke}
              onChange={(e) => set("marke", e.target.value)} className={inputClass} />
            {errors.marke && <p className={errorClass}>{errors.marke}</p>}
          </div>
          <div>
            <label htmlFor="modell" className={labelClass}>Modell *</label>
            <input id="modell" type="text" placeholder="z.B. Golf 2.0 TDI" value={form.modell}
              onChange={(e) => set("modell", e.target.value)} className={inputClass} />
            {errors.modell && <p className={errorClass}>{errors.modell}</p>}
          </div>
          <div>
            <label htmlFor="baujahr" className={labelClass}>Baujahr *</label>
            <input id="baujahr" type="number" min={1990} max={2026} placeholder="z.B. 2019" value={form.baujahr}
              onChange={(e) => set("baujahr", e.target.value)} className={inputClass} />
            {errors.baujahr && <p className={errorClass}>{errors.baujahr}</p>}
          </div>
          <div>
            <label htmlFor="kilometerstand" className={labelClass}>Kilometerstand *</label>
            <input id="kilometerstand" type="number" min={0} max={1000000} placeholder="z.B. 75000" value={form.kilometerstand}
              onChange={(e) => set("kilometerstand", e.target.value)} className={inputClass} />
            {errors.kilometerstand && <p className={errorClass}>{errors.kilometerstand}</p>}
          </div>
          <div>
            <label htmlFor="kraftstoff" className={labelClass}>Kraftstoff *</label>
            <select id="kraftstoff" value={form.kraftstoff} onChange={(e) => set("kraftstoff", e.target.value)} className={inputClass}>
              <option value="">Bitte wählen</option>
              <option value="benzin">Benzin</option>
              <option value="diesel">Diesel</option>
              <option value="elektro">Elektro</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.kraftstoff && <p className={errorClass}>{errors.kraftstoff}</p>}
          </div>
          <div>
            <label htmlFor="hubraum" className={labelClass}>Hubraum (ccm)</label>
            <input id="hubraum" type="number" min={500} max={10000} placeholder="z.B. 1968" value={form.hubraum}
              onChange={(e) => set("hubraum", e.target.value)} className={inputClass} />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Für genaue KFZ-Steuerberechnung</p>
          </div>
          <div>
            <label htmlFor="verbrauch" className={labelClass}>Verbrauch (L/100km oder kWh/100km)</label>
            <input id="verbrauch" type="number" min={1} max={50} step={0.1} placeholder="z.B. 5.5" value={form.verbrauch}
              onChange={(e) => set("verbrauch", e.target.value)} className={inputClass} />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Optional – Richtwert wird verwendet wenn leer</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Kauf & Nutzung</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kaufpreis" className={labelClass}>Kaufpreis (€) *</label>
            <input id="kaufpreis" type="number" min={500} max={500000} placeholder="z.B. 18500" value={form.kaufpreis}
              onChange={(e) => set("kaufpreis", e.target.value)} className={inputClass} />
            {errors.kaufpreis && <p className={errorClass}>{errors.kaufpreis}</p>}
          </div>
          <div>
            <label htmlFor="jahresfahrleistung" className={labelClass}>Jahresfahrleistung (km) *</label>
            <input id="jahresfahrleistung" type="number" min={1000} max={100000} placeholder="z.B. 15000" value={form.jahresfahrleistung}
              onChange={(e) => set("jahresfahrleistung", e.target.value)} className={inputClass} />
            {errors.jahresfahrleistung && <p className={errorClass}>{errors.jahresfahrleistung}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Zusätzliche Angaben (optional)</legend>
        <div>
          <label htmlFor="zusatzAngaben" className={labelClass}>Besonderheiten</label>
          <textarea id="zusatzAngaben" rows={3} placeholder="z.B. Zustand, Unfallhistorie, Sonderausstattung..."
            value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)}
            className={inputClass + " resize-none"} maxLength={2000} />
        </div>
      </fieldset>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyse läuft…" : "Betriebskosten berechnen"}
      </Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">
        Deine Angaben werden nur für diese Analyse verarbeitet und nicht gespeichert.
      </p>
    </form>
  );
}
