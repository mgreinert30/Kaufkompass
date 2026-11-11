"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface ElektroautoFormData {
  kaufpreis: string; reichweite: string; akkuKapazitaet: string;
  jahresfahrleistung: string; strompreisHaushalt: string; strompreisOeffentlich: string;
  ladeinfrastruktur: string; fahrzeugTyp: string;
  vergleichsfahrzeugKraftstoff: string; kraftstoffpreis: string;
  fahrzeugModell: string; zusatzAngaben: string;
}

interface Props { onSubmit: (d: ElektroautoFormData) => void; isLoading: boolean; }

const iCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]";
const lCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

export function ElektroautoInputForm({ onSubmit, isLoading }: Props) {
  const [f, setF] = useState<ElektroautoFormData>({
    kaufpreis: "", reichweite: "", akkuKapazitaet: "", jahresfahrleistung: "15000",
    strompreisHaushalt: "32", strompreisOeffentlich: "", ladeinfrastruktur: "wallbox_kauf",
    fahrzeugTyp: "bev", vergleichsfahrzeugKraftstoff: "", kraftstoffpreis: "1.80",
    fahrzeugModell: "", zusatzAngaben: "",
  });
  const s = (k: keyof ElektroautoFormData, v: string) => setF(p => ({ ...p, [k]: v }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSubmit(f); }} className="space-y-5">
      <div>
        <label htmlFor="eModell" className={lCls}>Fahrzeugmodell <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
        <input id="eModell" type="text" maxLength={100} className={iCls} placeholder="z.B. Tesla Model 3, VW ID.4" value={f.fahrzeugModell} onChange={e => s("fahrzeugModell", e.target.value)} />
      </div>
      <div>
        <span className={lCls}>Fahrzeugtyp *</span>
        <div className="flex gap-3 mt-1">
          {[{ v: "bev", l: "Vollelektrisch (BEV)" }, { v: "phev", l: "Plug-in-Hybrid (PHEV)" }].map(t => (
            <label key={t.v} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm ${f.fahrzeugTyp === t.v ? "border-[#16A34A] bg-[#F0FDF4] font-medium text-[#15803D]" : "border-[var(--border)]"}`}>
              <input type="radio" name="fahrzeugTyp" value={t.v} checked={f.fahrzeugTyp === t.v} onChange={() => s("fahrzeugTyp", t.v)} className="accent-[#16A34A]" />{t.l}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div><label className={lCls}>Kaufpreis (€) *</label><input type="number" min="10000" max="500000" step="100" className={iCls} placeholder="z.B. 42000" value={f.kaufpreis} onChange={e => s("kaufpreis", e.target.value)} required /></div>
        <div><label className={lCls}>Reichweite WLTP (km) *</label><input type="number" min="50" max="1000" step="1" className={iCls} placeholder="z.B. 480" value={f.reichweite} onChange={e => s("reichweite", e.target.value)} required /></div>
        <div><label className={lCls}>Akku (kWh) *</label><input type="number" min="10" max="200" step="0.5" className={iCls} placeholder="z.B. 77" value={f.akkuKapazitaet} onChange={e => s("akkuKapazitaet", e.target.value)} required /></div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className={lCls}>Jahresfahrleistung (km) *</label><input type="number" min="1000" max="200000" step="1000" className={iCls} value={f.jahresfahrleistung} onChange={e => s("jahresfahrleistung", e.target.value)} required /></div>
        <div><label className={lCls}>Haushaltsstrom (ct/kWh) *</label><input type="number" min="10" max="100" step="0.1" className={iCls} placeholder="z.B. 32" value={f.strompreisHaushalt} onChange={e => s("strompreisHaushalt", e.target.value)} required /></div>
      </div>
      <div>
        <label className={lCls}>Ladeinfrastruktur *</label>
        <select className={iCls} value={f.ladeinfrastruktur} onChange={e => s("ladeinfrastruktur", e.target.value)}>
          <option value="nur_oeffentlich">Nur öffentliches Laden</option>
          <option value="wallbox_miete">Wallbox-Miete (Installation ~300 €)</option>
          <option value="wallbox_kauf">Wallbox-Kauf inkl. Installation (~1.500 €)</option>
        </select>
      </div>
      <div className="rounded-lg border border-[var(--border)] p-4">
        <p className="text-sm font-medium text-[var(--foreground)] mb-3">Vergleich mit Verbrenner <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div><label className={lCls}>Verbrauch Verbrenner (L/100km)</label><input type="number" min="3" max="30" step="0.1" className={iCls} placeholder="z.B. 7.0" value={f.vergleichsfahrzeugKraftstoff} onChange={e => s("vergleichsfahrzeugKraftstoff", e.target.value)} /></div>
          <div><label className={lCls}>Kraftstoffpreis (€/L)</label><input type="number" min="0.5" max="5" step="0.01" className={iCls} placeholder="z.B. 1.80" value={f.kraftstoffpreis} onChange={e => s("kraftstoffpreis", e.target.value)} /></div>
        </div>
      </div>
      <div><label className={lCls}>Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label><textarea rows={2} maxLength={500} className={`${iCls} resize-none`} value={f.zusatzAngaben} onChange={e => s("zusatzAngaben", e.target.value)} /></div>
      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>{isLoading ? "Wird analysiert …" : "E-Auto-Kosten berechnen"}</Button>
    </form>
  );
}
