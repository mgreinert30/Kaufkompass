"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface HaushaltsgeraeteFormData {
  geraeteTyp: string; energieKlasse: string; angebotspreis: string;
  hersteller: string; modell: string; jahresverbrauchKwh: string;
  strompreis: string; garantieJahre: string; zusatzAngaben: string;
}

interface Props { onSubmit: (data: HaushaltsgeraeteFormData) => void; isLoading: boolean; }

export function HaushaltsgeraeteInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<HaushaltsgeraeteFormData>({
    geraeteTyp: "waschmaschine", energieKlasse: "A", angebotspreis: "",
    hersteller: "", modell: "", jahresverbrauchKwh: "", strompreis: "0.30", garantieJahre: "2", zusatzAngaben: "",
  });
  const set = (k: keyof HaushaltsgeraeteFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Gerätetyp *</label>
          <select value={form.geraeteTyp} onChange={set("geraeteTyp")} className={inputCls} required>
            <option value="kuehlschrank">Kühlschrank</option>
            <option value="waschmaschine">Waschmaschine</option>
            <option value="trockner">Trockner</option>
            <option value="geschirrspueler">Geschirrspüler</option>
            <option value="herd_backofen">Herd / Backofen</option>
            <option value="mikrowelle">Mikrowelle</option>
            <option value="staubsauger">Staubsauger</option>
            <option value="kaffeemaschine">Kaffeemaschine</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Energieklasse *</label>
          <select value={form.energieKlasse} onChange={set("energieKlasse")} className={inputCls} required>
            {["A", "B", "C", "D", "E", "F", "G"].map(k => (
              <option key={k} value={k}>Klasse {k}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Angebotspreis (€) *</label>
          <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="599" className={inputCls} required min={10} max={10000} />
        </div>
        <div>
          <label className={labelCls}>Jahresverbrauch (kWh)</label>
          <input type="number" value={form.jahresverbrauchKwh} onChange={set("jahresverbrauchKwh")} placeholder="150" className={inputCls} min={1} max={5000} />
        </div>
        <div>
          <label className={labelCls}>Strompreis (€/kWh)</label>
          <input type="number" value={form.strompreis} onChange={set("strompreis")} placeholder="0.30" className={inputCls} min={0.01} max={2} step={0.01} />
        </div>
        <div>
          <label className={labelCls}>Hersteller</label>
          <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Bosch, Siemens, Miele…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Modell</label>
          <input type="text" value={form.modell} onChange={set("modell")} placeholder="Modellbezeichnung…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Garantie (Jahre)</label>
          <input type="number" value={form.garantieJahre} onChange={set("garantieJahre")} placeholder="2" className={inputCls} min={0} max={10} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Weitere Angaben</label>
        <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Besonderheiten, Vergleichsgeräte…" className={inputCls} maxLength={500} />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
