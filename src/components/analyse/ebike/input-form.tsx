"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EBikeFormData {
  klasse: string; motorPosition: string; angebotspreis: string;
  akkuKapazitaet: string; motorLeistung: string; reichweite: string;
  hersteller: string; garantieJahre: string; zusatzAngaben: string;
}

interface Props { onSubmit: (data: EBikeFormData) => void; isLoading: boolean; }

export function EBikeInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<EBikeFormData>({
    klasse: "pedelec_25", motorPosition: "mittelmotor", angebotspreis: "",
    akkuKapazitaet: "", motorLeistung: "", reichweite: "", hersteller: "", garantieJahre: "2", zusatzAngaben: "",
  });
  const set = (k: keyof EBikeFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>E-Bike-Klasse *</label>
          <select value={form.klasse} onChange={set("klasse")} className={inputCls} required>
            <option value="pedelec_25">Pedelec 25 km/h</option>
            <option value="speed_pedelec_45">Speed-Pedelec 45 km/h</option>
            <option value="e_cargo">E-Cargo-Bike</option>
            <option value="e_mountainbike">E-Mountainbike</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Motorposition</label>
          <select value={form.motorPosition} onChange={set("motorPosition")} className={inputCls}>
            <option value="mittelmotor">Mittelmotor</option>
            <option value="heckmotor">Heckmotor</option>
            <option value="frontmotor">Frontmotor</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Angebotspreis (€) *</label>
          <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="2500" className={inputCls} required min={300} max={20000} />
        </div>
        <div>
          <label className={labelCls}>Akku-Kapazität (Wh) *</label>
          <input type="number" value={form.akkuKapazitaet} onChange={set("akkuKapazitaet")} placeholder="500" className={inputCls} required min={100} max={2000} />
        </div>
        <div>
          <label className={labelCls}>Motorleistung (Watt)</label>
          <input type="number" value={form.motorLeistung} onChange={set("motorLeistung")} placeholder="250" className={inputCls} min={100} max={1000} />
        </div>
        <div>
          <label className={labelCls}>Reichweite (km, Herstellerangabe)</label>
          <input type="number" value={form.reichweite} onChange={set("reichweite")} placeholder="80" className={inputCls} min={10} max={500} />
        </div>
        <div>
          <label className={labelCls}>Hersteller</label>
          <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Bosch, Shimano, Specialized…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Garantie (Jahre)</label>
          <input type="number" value={form.garantieJahre} onChange={set("garantieJahre")} placeholder="2" className={inputCls} min={0} max={10} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Weitere Angaben</label>
        <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Ausstattung, Rahmenmaterial, Verwendungszweck…" className={inputCls} maxLength={500} />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
