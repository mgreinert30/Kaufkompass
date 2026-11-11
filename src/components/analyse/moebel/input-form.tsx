"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MoebelFormData {
  kategorie: string;
  qualitaet: string;
  angebotspreis: string;
  material: string;
  hersteller: string;
  massanfertigung: boolean;
  lieferung: boolean;
  montage: boolean;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: MoebelFormData) => void;
  isLoading: boolean;
}

const KATEGORIEN = [
  { value: "sofa_couch",       label: "Sofa / Couch" },
  { value: "bett_lattenrost",  label: "Bett mit Lattenrost" },
  { value: "kleiderschrank",   label: "Kleiderschrank" },
  { value: "esstisch_stuehle", label: "Esstisch mit Stühlen" },
  { value: "regal_schrank",    label: "Regal / Schrank" },
  { value: "schreibtisch",     label: "Schreibtisch" },
  { value: "kommode",          label: "Kommode" },
  { value: "matratze",         label: "Matratze" },
  { value: "sonstiges",        label: "Sonstiges Möbelstück" },
];

const QUALITAETEN = [
  { value: "einfach",    label: "Einfach / Einsteiger",    desc: "Kaufhausqualität, MDF/Spanplatte, günstiger Bezug" },
  { value: "mittel",     label: "Standard / Mittelklasse", desc: "Gute Verarbeitung, Marken-Mittelsegment" },
  { value: "hochwertig", label: "Hochwertig / Premium",    desc: "Massivholz, Leder, Designermarken, Maßanfertigung" },
];

export function MoebelInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<MoebelFormData>({
    kategorie: "sofa_couch",
    qualitaet: "mittel",
    angebotspreis: "",
    material: "",
    hersteller: "",
    massanfertigung: false,
    lieferung: false,
    montage: false,
    zusatzAngaben: "",
  });

  const set = (field: keyof MoebelFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Kategorie */}
      <div>
        <label htmlFor="kategorie" className={labelCls}>Möbelkategorie *</label>
        <select id="kategorie" className={inputCls} value={form.kategorie}
          onChange={(e) => set("kategorie", e.target.value)} required>
          {KATEGORIEN.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
      </div>

      {/* Qualitätsniveau */}
      <div>
        <span className={labelCls}>Qualitätsniveau *</span>
        <div className="space-y-2 mt-1">
          {QUALITAETEN.map((q) => (
            <label key={q.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.qualitaet === q.value ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[var(--border)] hover:border-[#86EFAC]"}`}>
              <input type="radio" name="qualitaet" value={q.value} checked={form.qualitaet === q.value}
                onChange={() => set("qualitaet", q.value)} className="mt-0.5 accent-[#16A34A]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{q.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{q.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Angebotspreis */}
      <div>
        <label htmlFor="angebotspreis" className={labelCls}>Angebotspreis (€) *</label>
        <input id="angebotspreis" type="number" min="1" max="100000" step="1"
          className={inputCls} placeholder="z.B. 1200"
          value={form.angebotspreis} onChange={(e) => set("angebotspreis", e.target.value)} required />
      </div>

      {/* Material & Hersteller */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="material" className={labelCls}>Material <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="material" type="text" maxLength={100} className={inputCls}
            placeholder="z.B. Massivholz, MDF, Leder"
            value={form.material} onChange={(e) => set("material", e.target.value)} />
        </div>
        <div>
          <label htmlFor="hersteller" className={labelCls}>Hersteller / Marke <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="hersteller" type="text" maxLength={100} className={inputCls}
            placeholder="z.B. IKEA, Rolf Benz"
            value={form.hersteller} onChange={(e) => set("hersteller", e.target.value)} />
        </div>
      </div>

      {/* Checkboxen */}
      <div>
        <span className={labelCls}>Was ist im Preis enthalten?</span>
        <div className="space-y-2 mt-1">
          {[
            { field: "lieferung" as keyof MoebelFormData, label: "Lieferung inklusive" },
            { field: "montage"   as keyof MoebelFormData, label: "Montage / Aufbau inklusive" },
            { field: "massanfertigung" as keyof MoebelFormData, label: "Maßanfertigung" },
          ].map(({ field, label }) => (
            <label key={field} className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form[field] as boolean}
                onChange={(e) => set(field, e.target.checked)}
                className="h-4 w-4 rounded accent-[#16A34A]" />
              <span className="text-sm text-[var(--foreground)]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Zusatzangaben */}
      <div>
        <label htmlFor="zusatz" className={labelCls}>Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
        <textarea id="zusatz" rows={3} maxLength={500} className={`${inputCls} resize-none`}
          placeholder="z.B. Besonderheiten, spezielle Ausstattung, Verhandlungsstand …"
          value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)} />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Wird analysiert …" : "Möbelangebot analysieren"}
      </Button>
    </form>
  );
}
