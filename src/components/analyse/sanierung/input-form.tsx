"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const BEISPIEL_DATEN = {
  massnahme: "fassade",
  flaeche: "180",
  angebotspreis: "25000",
  mitISFP: false,
  baujahr: "1978",
  zusatzAngaben: "Altbau, WDVS mit 16 cm EPS-Dämmung geplant.",
};

interface FormData {
  massnahme: string;
  flaeche: string;
  angebotspreis: string;
  mitISFP: boolean;
  baujahr: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function SanierungInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormData>({
    massnahme: "", flaeche: "", angebotspreis: "", mitISFP: false, baujahr: "", zusatzAngaben: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.massnahme) e.massnahme = "Bitte Maßnahme wählen";
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

  const flaecheLabel: Record<string, string> = {
    fassade: "Fassadenfläche (m²)",
    dach: "Dachfläche (m²)",
    keller: "Kellerdeckenfläche (m²)",
    fenster: "Anzahl Fenster (Stück)",
    komplett: "Wohnfläche (m²)",
    heizung: "",
  };

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
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Sanierungsmaßnahme</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="massnahme" className={labelClass}>Maßnahme *</label>
            <select id="massnahme" value={form.massnahme} onChange={(e) => set("massnahme", e.target.value)} className={inputClass}>
              <option value="">Bitte wählen</option>
              <option value="fassade">Fassadendämmung (WDVS)</option>
              <option value="dach">Dachdämmung</option>
              <option value="keller">Kellerdeckendämmung</option>
              <option value="fenster">Fensteraustausch</option>
              <option value="heizung">Heizungserneuerung</option>
              <option value="komplett">Komplettsanierung</option>
            </select>
            {errors.massnahme && <p className={errorClass}>{errors.massnahme}</p>}
          </div>
          {form.massnahme && form.massnahme !== "heizung" && (
            <div>
              <label htmlFor="flaeche" className={labelClass}>
                {flaecheLabel[form.massnahme] || "Fläche / Menge"}
              </label>
              <input id="flaeche" type="number" min={1} max={10000} placeholder="z.B. 180"
                value={form.flaeche} onChange={(e) => set("flaeche", e.target.value)} className={inputClass} />
            </div>
          )}
          <div>
            <label htmlFor="angebotspreis" className={labelClass}>Vorliegender Angebotspreis (€)</label>
            <input id="angebotspreis" type="number" min={100} max={1000000} placeholder="Optional – zum Vergleich"
              value={form.angebotspreis} onChange={(e) => set("angebotspreis", e.target.value)} className={inputClass} />
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Wenn vorhanden, wird das Angebot bewertet</p>
          </div>
          <div>
            <label htmlFor="baujahr" className={labelClass}>Baujahr des Gebäudes</label>
            <input id="baujahr" type="number" min={1850} max={2030} placeholder="z.B. 1978"
              value={form.baujahr} onChange={(e) => set("baujahr", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <input id="mitISFP" type="checkbox" checked={form.mitISFP}
            onChange={(e) => set("mitISFP", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#14532D] focus:ring-[#14532D]" />
          <label htmlFor="mitISFP" className="text-sm text-[var(--foreground)]">
            Individueller Sanierungsfahrplan (iSFP) vorhanden – <span className="text-[#16A34A] font-medium">+5 % Förderbonus</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">Zusätzliche Angaben (optional)</legend>
        <textarea id="zusatzAngaben" rows={3} placeholder="z.B. Zustand des Gebäudes, geplante Dämmstärke, Besonderheiten…"
          value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)}
          className={inputClass + " resize-none"} maxLength={2000} />
      </fieldset>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Analyse läuft…" : "Sanierungskosten prüfen"}
      </Button>
      <p className="text-xs text-center text-[var(--muted-foreground)]">
        Deine Angaben werden nur für diese Analyse verarbeitet und nicht gespeichert.
      </p>
    </form>
  );
}
