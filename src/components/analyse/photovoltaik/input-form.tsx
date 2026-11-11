"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const BEISPIEL_DATEN = {
  leistungKWp: "10",
  jahresverbrauchKWh: "4500",
  anschaffungskosten: "18000",
  eigenverbrauchQuote: "0.35",
  speichergroesseKWh: "10",
  region: "mitte",
  ausrichtung: "sued",
  einspeiseverguetung: "",
  zusatzAngaben: "Einfamilienhaus, Südseite, Neigung 30 Grad.",
};

interface FormData {
  leistungKWp: string;
  jahresverbrauchKWh: string;
  anschaffungskosten: string;
  eigenverbrauchQuote: string;
  speichergroesseKWh: string;
  region: string;
  ausrichtung: string;
  einspeiseverguetung: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function PhotovoltaikInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormData>({
    leistungKWp: "", jahresverbrauchKWh: "", anschaffungskosten: "",
    eigenverbrauchQuote: "0.30", speichergroesseKWh: "", region: "mitte",
    ausrichtung: "sued", einspeiseverguetung: "", zusatzAngaben: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.leistungKWp || Number(form.leistungKWp) <= 0) e.leistungKWp = "Leistung erforderlich";
    if (!form.jahresverbrauchKWh || Number(form.jahresverbrauchKWh) < 500) e.jahresverbrauchKWh = "Jahresverbrauch erforderlich";
    if (!form.anschaffungskosten || Number(form.anschaffungskosten) <= 0) e.anschaffungskosten = "Anschaffungskosten erforderlich";
    if (!form.eigenverbrauchQuote) e.eigenverbrauchQuote = "Eigenverbrauchsquote erforderlich";
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
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Anlagendaten</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="leistungKWp" className={labelClass}>Anlagenleistung (kWp) *</label>
            <input id="leistungKWp" type="number" min={1} max={100} step={0.5} placeholder="z.B. 10"
              value={form.leistungKWp} onChange={(e) => set("leistungKWp", e.target.value)} className={inputClass} />
            {errors.leistungKWp && <p className={errorClass}>{errors.leistungKWp}</p>}
          </div>
          <div>
            <label htmlFor="jahresverbrauchKWh" className={labelClass}>Jahresstromverbrauch (kWh) *</label>
            <input id="jahresverbrauchKWh" type="number" min={500} max={100000} placeholder="z.B. 4500"
              value={form.jahresverbrauchKWh} onChange={(e) => set("jahresverbrauchKWh", e.target.value)} className={inputClass} />
            {errors.jahresverbrauchKWh && <p className={errorClass}>{errors.jahresverbrauchKWh}</p>}
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Steht auf deiner Jahresabrechnung</p>
          </div>
          <div>
            <label htmlFor="anschaffungskosten" className={labelClass}>Anschaffungskosten gesamt (€) *</label>
            <input id="anschaffungskosten" type="number" min={1000} max={500000} placeholder="z.B. 18000"
              value={form.anschaffungskosten} onChange={(e) => set("anschaffungskosten", e.target.value)} className={inputClass} />
            {errors.anschaffungskosten && <p className={errorClass}>{errors.anschaffungskosten}</p>}
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Module + Wechselrichter + Installation</p>
          </div>
          <div>
            <label htmlFor="eigenverbrauchQuote" className={labelClass}>Eigenverbrauchsquote *</label>
            <select id="eigenverbrauchQuote" value={form.eigenverbrauchQuote}
              onChange={(e) => set("eigenverbrauchQuote", e.target.value)} className={inputClass}>
              <option value="0.20">20 % (selten zuhause)</option>
              <option value="0.30">30 % (typisch ohne Speicher)</option>
              <option value="0.40">40 % (Homeoffice oder kleiner Speicher)</option>
              <option value="0.50">50 % (Speicher vorhanden)</option>
              <option value="0.60">60 % (großer Speicher + E-Auto)</option>
            </select>
            {errors.eigenverbrauchQuote && <p className={errorClass}>{errors.eigenverbrauchQuote}</p>}
          </div>
          <div>
            <label htmlFor="speichergroesseKWh" className={labelClass}>Batteriespeicher (kWh)</label>
            <input id="speichergroesseKWh" type="number" min={0} max={50} step={0.5} placeholder="z.B. 10 (0 = kein Speicher)"
              value={form.speichergroesseKWh} onChange={(e) => set("speichergroesseKWh", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="einspeiseverguetung" className={labelClass}>Einspeisevergütung (ct/kWh)</label>
            <input id="einspeiseverguetung" type="number" min={0} max={30} step={0.01} placeholder="Leer = EEG 2024 (8,29 ct)"
              value={form.einspeiseverguetung} onChange={(e) => set("einspeiseverguetung", e.target.value)} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Standort & Ausrichtung</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="region" className={labelClass}>Region</label>
            <select id="region" value={form.region} onChange={(e) => set("region", e.target.value)} className={inputClass}>
              <option value="sued">Süddeutschland (Bayern, BW, …)</option>
              <option value="mitte">Mitteldeutschland</option>
              <option value="nord">Norddeutschland</option>
            </select>
          </div>
          <div>
            <label htmlFor="ausrichtung" className={labelClass}>Dachausrichtung</label>
            <select id="ausrichtung" value={form.ausrichtung} onChange={(e) => set("ausrichtung", e.target.value)} className={inputClass}>
              <option value="sued">Süd (optimal)</option>
              <option value="suedost">Südost</option>
              <option value="suedwest">Südwest</option>
              <option value="ost_west">Ost-West (Doppeldach)</option>
              <option value="ost">Ost</option>
              <option value="west">West</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Zusätzliche Angaben (optional)</legend>
        <textarea id="zusatzAngaben" rows={3} placeholder="z.B. Dachneigung, Verschattungen, Besonderheiten des Angebots…"
          value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)}
          className={inputClass + " resize-none"} maxLength={2000} />
      </fieldset>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyse läuft…" : "PV-Wirtschaftlichkeit berechnen"}
      </Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">
        Deine Angaben werden nur für diese Analyse verarbeitet und nicht gespeichert.
      </p>
    </form>
  );
}
