"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LaptopFormData {
  geraetTyp: string; verwendungszweck: string; angebotspreis: string;
  hersteller: string; modell: string; prozessor: string;
  ramGb: string; speicherGb: string; betriebssystem: string;
  garantieJahre: string; refurbished: string; zusatzAngaben: string;
}

interface Props { onSubmit: (data: LaptopFormData) => void; isLoading: boolean; }

export function LaptopInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<LaptopFormData>({
    geraetTyp: "laptop_mittelklasse", verwendungszweck: "homeoffice", angebotspreis: "",
    hersteller: "", modell: "", prozessor: "", ramGb: "", speicherGb: "",
    betriebssystem: "", garantieJahre: "1", refurbished: "false", zusatzAngaben: "",
  });
  const set = (k: keyof LaptopFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Gerätetyp *</label>
          <select value={form.geraetTyp} onChange={set("geraetTyp")} className={inputCls} required>
            <option value="laptop_einsteiger">Laptop Einsteiger</option>
            <option value="laptop_mittelklasse">Laptop Mittelklasse</option>
            <option value="laptop_profi">Laptop Profi / Business</option>
            <option value="desktop_pc">Desktop-PC</option>
            <option value="gaming_pc">Gaming-PC</option>
            <option value="macbook">MacBook / Apple</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Verwendungszweck *</label>
          <select value={form.verwendungszweck} onChange={set("verwendungszweck")} className={inputCls} required>
            <option value="buero_web">Büro & Web</option>
            <option value="homeoffice">Homeoffice</option>
            <option value="kreativ_foto_video">Foto & Video (Kreativ)</option>
            <option value="gaming">Gaming</option>
            <option value="programmierung">Programmierung</option>
            <option value="schulstudium">Schule & Studium</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Angebotspreis (€) *</label>
          <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="799" className={inputCls} required min={100} max={10000} />
        </div>
        <div>
          <label className={labelCls}>RAM (GB)</label>
          <input type="number" value={form.ramGb} onChange={set("ramGb")} placeholder="16" className={inputCls} min={1} max={256} />
        </div>
        <div>
          <label className={labelCls}>Speicher (GB)</label>
          <input type="number" value={form.speicherGb} onChange={set("speicherGb")} placeholder="512" className={inputCls} min={16} max={8000} />
        </div>
        <div>
          <label className={labelCls}>Hersteller</label>
          <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Lenovo, Dell, HP, Apple…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Prozessor</label>
          <input type="text" value={form.prozessor} onChange={set("prozessor")} placeholder="Intel Core i5, AMD Ryzen 7…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Garantie (Jahre)</label>
          <input type="number" value={form.garantieJahre} onChange={set("garantieJahre")} placeholder="1" className={inputCls} min={0} max={5} />
        </div>
        <div>
          <label className={labelCls}>Refurbished / Generalüberholt?</label>
          <select value={form.refurbished} onChange={set("refurbished")} className={inputCls}>
            <option value="false">Nein – Neugerät</option>
            <option value="true">Ja – Refurbished</option>
          </select>
        </div>
      </div>
      <div>
        <label className={labelCls}>Weitere Angaben</label>
        <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Display-Größe, Akkulaufzeit, Besonderheiten…" className={inputCls} maxLength={500} />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
