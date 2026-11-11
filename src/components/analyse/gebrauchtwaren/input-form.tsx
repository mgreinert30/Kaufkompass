"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GebrauchtwarenFormData {
  kategorie: string; zustand: string; angebotspreis: string;
  neupreis: string; baujahr: string; hersteller: string;
  plattform: string; zusatzAngaben: string;
}

interface Props { onSubmit: (data: GebrauchtwarenFormData) => void; isLoading: boolean; }

export function GebrauchtwarenInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<GebrauchtwarenFormData>({
    kategorie: "elektronik", zustand: "gut", angebotspreis: "",
    neupreis: "", baujahr: "", hersteller: "", plattform: "eBay Kleinanzeigen", zusatzAngaben: "",
  });
  const set = (k: keyof GebrauchtwarenFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Kategorie *</label>
          <select value={form.kategorie} onChange={set("kategorie")} className={inputCls} required>
            <option value="moebel">Möbel</option>
            <option value="elektronik">Elektronik</option>
            <option value="fahrrad">Fahrrad</option>
            <option value="kleidung">Kleidung & Mode</option>
            <option value="sport">Sport & Freizeit</option>
            <option value="haushalt">Haushalt & Küche</option>
            <option value="spielzeug">Spielzeug & Kinderartikel</option>
            <option value="sonstiges">Sonstiges</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Zustand *</label>
          <select value={form.zustand} onChange={set("zustand")} className={inputCls} required>
            <option value="neuwertig">Neuwertig / wie neu</option>
            <option value="sehr_gut">Sehr gut erhalten</option>
            <option value="gut">Gut erhalten</option>
            <option value="akzeptabel">Akzeptabler Zustand</option>
            <option value="defekt">Defekt / für Bastler</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Angebotspreis (€) *</label>
          <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="150" className={inputCls} required min={1} max={100000} />
        </div>
        <div>
          <label className={labelCls}>Neupreis (€)</label>
          <input type="number" value={form.neupreis} onChange={set("neupreis")} placeholder="400" className={inputCls} min={1} max={500000} />
        </div>
        <div>
          <label className={labelCls}>Baujahr / Jahrgang</label>
          <input type="number" value={form.baujahr} onChange={set("baujahr")} placeholder="2020" className={inputCls} min={1900} max={2025} />
        </div>
        <div>
          <label className={labelCls}>Hersteller / Marke</label>
          <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Bosch, Apple, Trek…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Plattform</label>
          <input type="text" value={form.plattform} onChange={set("plattform")} placeholder="eBay Kleinanzeigen, Vinted…" className={inputCls} maxLength={100} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Weitere Angaben</label>
        <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Mängel, Zubehör, Verhandlungsbereitschaft…" className={inputCls} maxLength={500} />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
