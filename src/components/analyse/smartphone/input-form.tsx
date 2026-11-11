"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SmartphoneFormData {
  segment: string; angebotspreis: string; hersteller: string; modell: string;
  speicherGb: string; ramGb: string; akkuMah: string; displayZoll: string;
  erscheinungsjahr: string; mitVertrag: string; vertragslaufzeit: string;
  monatlicheRate: string; zusatzAngaben: string;
}

interface Props { onSubmit: (data: SmartphoneFormData) => void; isLoading: boolean; }

export function SmartphoneInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<SmartphoneFormData>({
    segment: "mittelklasse", angebotspreis: "", hersteller: "", modell: "",
    speicherGb: "", ramGb: "", akkuMah: "", displayZoll: "",
    erscheinungsjahr: "", mitVertrag: "false", vertragslaufzeit: "", monatlicheRate: "", zusatzAngaben: "",
  });
  const set = (k: keyof SmartphoneFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Segment *</label>
          <select value={form.segment} onChange={set("segment")} className={inputCls} required>
            <option value="einsteiger">Einsteiger (unter 300 €)</option>
            <option value="mittelklasse">Mittelklasse (300–600 €)</option>
            <option value="oberklasse">Oberklasse (600–900 €)</option>
            <option value="flagship">Flagship (ab 900 €)</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Angebotspreis (€) *</label>
          <input type="number" value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="499" className={inputCls} required min={50} max={5000} />
        </div>
        <div>
          <label className={labelCls}>Hersteller</label>
          <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Samsung, Apple, Google…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Modell</label>
          <input type="text" value={form.modell} onChange={set("modell")} placeholder="Galaxy S24, iPhone 15…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Erscheinungsjahr</label>
          <input type="number" value={form.erscheinungsjahr} onChange={set("erscheinungsjahr")} placeholder="2024" className={inputCls} min={2015} max={2026} />
        </div>
        <div>
          <label className={labelCls}>Speicher (GB)</label>
          <input type="number" value={form.speicherGb} onChange={set("speicherGb")} placeholder="128" className={inputCls} min={8} max={2000} />
        </div>
        <div>
          <label className={labelCls}>Mit Vertrag?</label>
          <select value={form.mitVertrag} onChange={set("mitVertrag")} className={inputCls}>
            <option value="false">Nein – Einmalzahlung</option>
            <option value="true">Ja – Vertrag</option>
          </select>
        </div>
        {form.mitVertrag === "true" && (
          <>
            <div>
              <label className={labelCls}>Vertragslaufzeit (Monate)</label>
              <input type="number" value={form.vertragslaufzeit} onChange={set("vertragslaufzeit")} placeholder="24" className={inputCls} min={12} max={36} />
            </div>
            <div>
              <label className={labelCls}>Monatliche Rate (€)</label>
              <input type="number" value={form.monatlicheRate} onChange={set("monatlicheRate")} placeholder="45" className={inputCls} min={1} max={500} />
            </div>
          </>
        )}
      </div>
      <div>
        <label className={labelCls}>Weitere Angaben</label>
        <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Kamera, Akku, Besonderheiten…" className={inputCls} maxLength={500} />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
