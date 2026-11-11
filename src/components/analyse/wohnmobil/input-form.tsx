"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WohnmobilFormData {
  typ: string;
  kaufpreis: string;
  baujahr: string;
  kilometerstand: string;
  motortyp: string;
  hersteller: string;
  modell: string;
  nutzungsHaefigkeit: string;
  stellplatzkosten: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: WohnmobilFormData) => void;
  isLoading: boolean;
}

const TYPEN = [
  { value: "alkoven", label: "Alkoven" },
  { value: "teilintegriert", label: "Teilintegriert" },
  { value: "vollintegriert", label: "Vollintegriert" },
  { value: "van_campingbus", label: "Van / Campingbus" },
  { value: "caravan", label: "Caravan (Anhänger)" },
];

const MOTORTYPEN = [
  { value: "diesel", label: "Diesel" },
  { value: "benzin", label: "Benzin" },
  { value: "elektro", label: "Elektro" },
];

const HAEUFIGKEIT = [
  { value: "selten", label: "Selten (1-5 Nächte/Jahr)" },
  { value: "gelegentlich", label: "Gelegentlich (6-20 Nächte/Jahr)" },
  { value: "regelmaessig", label: "Regelmäßig (21-50 Nächte/Jahr)" },
  { value: "haeufig", label: "Häufig (50+ Nächte/Jahr)" },
];

export function WohnmobilInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<WohnmobilFormData>({
    typ: "teilintegriert",
    kaufpreis: "",
    baujahr: "",
    kilometerstand: "",
    motortyp: "diesel",
    hersteller: "",
    modell: "",
    nutzungsHaefigkeit: "gelegentlich",
    stellplatzkosten: "",
    zusatzAngaben: "",
  });

  const set = (k: keyof WohnmobilFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Wohnmobil-Typ *</label>
          <select value={form.typ} onChange={set("typ")} className={inputCls} required>
            {TYPEN.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Kaufpreis (€) *</label>
          <input type="number" value={form.kaufpreis} onChange={set("kaufpreis")} placeholder="45000" className={inputCls} required min={1000} max={500000} />
        </div>
        <div>
          <label className={labelCls}>Baujahr</label>
          <input type="number" value={form.baujahr} onChange={set("baujahr")} placeholder="2018" className={inputCls} min={1990} max={2025} />
        </div>
        <div>
          <label className={labelCls}>Kilometerstand</label>
          <input type="number" value={form.kilometerstand} onChange={set("kilometerstand")} placeholder="85000" className={inputCls} min={0} max={1000000} />
        </div>
        <div>
          <label className={labelCls}>Antrieb</label>
          <select value={form.motortyp} onChange={set("motortyp")} className={inputCls}>
            {MOTORTYPEN.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Nutzungshäufigkeit</label>
          <select value={form.nutzungsHaefigkeit} onChange={set("nutzungsHaefigkeit")} className={inputCls}>
            {HAEUFIGKEIT.map((h) => <option key={h.value} value={h.value}>{h.label}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Hersteller</label>
          <input type="text" value={form.hersteller} onChange={set("hersteller")} placeholder="Hymer, Dethleffs, Bürstner…" className={inputCls} maxLength={100} />
        </div>
        <div>
          <label className={labelCls}>Stellplatzkosten (€/Jahr)</label>
          <input type="number" value={form.stellplatzkosten} onChange={set("stellplatzkosten")} placeholder="1200" className={inputCls} min={0} max={10000} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Weitere Angaben (optional)</label>
        <textarea value={form.zusatzAngaben} onChange={set("zusatzAngaben")} rows={3} placeholder="Ausstattung, bekannte Mängel, Garantie…" className={inputCls} maxLength={500} />
      </div>
      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
