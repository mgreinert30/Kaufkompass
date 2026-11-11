"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat } from "lucide-react";

interface KuecheFormData {
  angebotspreis: string;
  groesse: string;
  typ: string;
  ausstattung: string;
  mitMontage: boolean;
  mitElektrogeraeten: boolean;
  marke: string;
  laufmeter: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: KuecheFormData) => void;
  isLoading: boolean;
}

export function KuecheInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<KuecheFormData>({
    angebotspreis: "",
    groesse: "mittel",
    typ: "l_form",
    ausstattung: "mittel",
    mitMontage: true,
    mitElektrogeraeten: true,
    marke: "",
    laufmeter: "",
    zusatzAngaben: "",
  });

  const set = (field: keyof KuecheFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const setCheck = (field: "mitMontage" | "mitElektrogeraeten") =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.checked }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent";
  const selectCls = inputCls;
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Angebotspreis */}
      <div>
        <label htmlFor="kueche-preis" className={labelCls}>
          Angebotspreis (inkl. MwSt.) *
        </label>
        <div className="relative">
          <input
            id="kueche-preis"
            type="number"
            min="500"
            max="500000"
            step="100"
            required
            value={form.angebotspreis}
            onChange={set("angebotspreis")}
            placeholder="z.B. 12000"
            className={inputCls + " pr-10"}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">€</span>
        </div>
      </div>

      {/* Größe und Typ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kueche-groesse" className={labelCls}>Küchengröße *</label>
          <select id="kueche-groesse" value={form.groesse} onChange={set("groesse")} className={selectCls}>
            <option value="klein">Klein (bis ca. 8 m²)</option>
            <option value="mittel">Mittel (8–14 m²)</option>
            <option value="gross">Groß (14–20 m²)</option>
            <option value="xlarge">Sehr groß (20+ m²)</option>
          </select>
        </div>
        <div>
          <label htmlFor="kueche-typ" className={labelCls}>Küchenform *</label>
          <select id="kueche-typ" value={form.typ} onChange={set("typ")} className={selectCls}>
            <option value="l_form">L-Form</option>
            <option value="u_form">U-Form</option>
            <option value="gerade">Einzeilig (Gerade)</option>
            <option value="insel">Inselküche</option>
          </select>
        </div>
      </div>

      {/* Ausstattung */}
      <div>
        <label htmlFor="kueche-ausstattung" className={labelCls}>Ausstattungsniveau *</label>
        <select id="kueche-ausstattung" value={form.ausstattung} onChange={set("ausstattung")} className={selectCls}>
          <option value="basis">Basis (einfache Fronten, günstige Geräte)</option>
          <option value="mittel">Standard (gute Qualität, Markengeräte)</option>
          <option value="premium">Premium (hochwertige Fronten, Top-Geräte)</option>
        </select>
      </div>

      {/* Checkboxen */}
      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.mitMontage}
            onChange={setCheck("mitMontage")}
            className="h-4 w-4 rounded border-[var(--border)] accent-[#14532D]"
          />
          <span className="text-sm text-[var(--foreground)]">Montage inklusive</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.mitElektrogeraeten}
            onChange={setCheck("mitElektrogeraeten")}
            className="h-4 w-4 rounded border-[var(--border)] accent-[#14532D]"
          />
          <span className="text-sm text-[var(--foreground)]">Elektrogeräte inklusive</span>
        </label>
      </div>

      {/* Optionale Felder */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="kueche-marke" className={labelCls}>
            Marke / Hersteller <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <input
            id="kueche-marke"
            type="text"
            value={form.marke}
            onChange={set("marke")}
            placeholder="z.B. Nobilia, IKEA, Häcker"
            maxLength={100}
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="kueche-lm" className={labelCls}>
            Laufmeter Schrankelemente <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="kueche-lm"
              type="number"
              min="1"
              max="30"
              step="0.5"
              value={form.laufmeter}
              onChange={set("laufmeter")}
              placeholder="z.B. 4.5"
              className={inputCls + " pr-10"}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">lm</span>
          </div>
        </div>
      </div>

      {/* Zusatzangaben */}
      <div>
        <label htmlFor="kueche-zusatz" className={labelCls}>
          Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </label>
        <textarea
          id="kueche-zusatz"
          rows={3}
          value={form.zusatzAngaben}
          onChange={set("zusatzAngaben")}
          maxLength={2000}
          placeholder="z.B. Besonderheiten, offene Fragen, was dir wichtig ist…"
          className={inputCls + " resize-none"}
        />
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{form.zusatzAngaben.length}/2000 Zeichen</p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={isLoading || !form.angebotspreis}
        className="w-full"
      >
        <ChefHat className="h-4 w-4" aria-hidden="true" />
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
