"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LeasingFormData {
  fahrzeugListenpreis: string;
  leasingrate: string;
  laufzeit: string;
  kilometerProJahr: string;
  anzahlung: string;
  restwert: string;
  leasingTyp: string;
  fahrzeugModell: string;
  versicherungProMonat: string;
  wartungProMonat: string;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: LeasingFormData) => void;
  isLoading: boolean;
}

export function LeasingInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<LeasingFormData>({
    fahrzeugListenpreis: "",
    leasingrate: "",
    laufzeit: "36",
    kilometerProJahr: "15000",
    anzahlung: "",
    restwert: "",
    leasingTyp: "privat",
    fahrzeugModell: "",
    versicherungProMonat: "",
    wartungProMonat: "",
    zusatzAngaben: "",
  });

  const set = (field: keyof LeasingFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Fahrzeugmodell */}
      <div>
        <label htmlFor="fahrzeugModell" className={labelCls}>Fahrzeug <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
        <input id="fahrzeugModell" type="text" maxLength={100} className={inputCls}
          placeholder="z.B. VW Golf 1.5 eTSI Life"
          value={form.fahrzeugModell} onChange={(e) => set("fahrzeugModell", e.target.value)} />
      </div>

      {/* Listenpreis + Rate */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="listenpreis" className={labelCls}>Fahrzeug-Listenpreis (€) *</label>
          <input id="listenpreis" type="number" min="5000" max="500000" step="100"
            className={inputCls} placeholder="z.B. 32000"
            value={form.fahrzeugListenpreis} onChange={(e) => set("fahrzeugListenpreis", e.target.value)} required />
        </div>
        <div>
          <label htmlFor="leasingrate" className={labelCls}>Monatliche Leasingrate (€) *</label>
          <input id="leasingrate" type="number" min="50" max="10000" step="1"
            className={inputCls} placeholder="z.B. 299"
            value={form.leasingrate} onChange={(e) => set("leasingrate", e.target.value)} required />
        </div>
      </div>

      {/* Laufzeit + KM */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="laufzeit" className={labelCls}>Laufzeit (Monate) *</label>
          <select id="laufzeit" className={inputCls} value={form.laufzeit}
            onChange={(e) => set("laufzeit", e.target.value)} required>
            {[12, 24, 36, 48, 60].map((m) => (
              <option key={m} value={m}>{m} Monate</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="km" className={labelCls}>Freikilometer pro Jahr *</label>
          <select id="km" className={inputCls} value={form.kilometerProJahr}
            onChange={(e) => set("kilometerProJahr", e.target.value)} required>
            {[10000, 15000, 20000, 25000, 30000, 40000, 50000].map((k) => (
              <option key={k} value={k}>{k.toLocaleString("de-DE")} km</option>
            ))}
          </select>
        </div>
      </div>

      {/* Anzahlung + Restwert */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="anzahlung" className={labelCls}>Anzahlung (€) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="anzahlung" type="number" min="0" max="100000" step="100"
            className={inputCls} placeholder="z.B. 3000 (0 = keine)"
            value={form.anzahlung} onChange={(e) => set("anzahlung", e.target.value)} />
        </div>
        <div>
          <label htmlFor="restwert" className={labelCls}>Vertraglicher Restwert (€) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="restwert" type="number" min="0" max="400000" step="100"
            className={inputCls} placeholder="Laut Vertrag (sonst geschätzt)"
            value={form.restwert} onChange={(e) => set("restwert", e.target.value)} />
        </div>
      </div>

      {/* Leasingtyp */}
      <div>
        <span className={labelCls}>Leasingtyp *</span>
        <div className="flex gap-3 mt-1">
          {[
            { value: "privat",       label: "Privat-Leasing" },
            { value: "gewerblich",   label: "Gewerbliches Leasing" },
          ].map((t) => (
            <label key={t.value} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors ${form.leasingTyp === t.value ? "border-[#16A34A] bg-[#F0FDF4] text-[#15803D] font-medium" : "border-[var(--border)] text-[var(--foreground)]"}`}>
              <input type="radio" name="leasingTyp" value={t.value} checked={form.leasingTyp === t.value}
                onChange={() => set("leasingTyp", t.value)} className="accent-[#16A34A]" />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Versicherung + Wartung */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="versicherung" className={labelCls}>Versicherung (€/Monat) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="versicherung" type="number" min="0" max="1000" step="1"
            className={inputCls} placeholder="z.B. 90"
            value={form.versicherungProMonat} onChange={(e) => set("versicherungProMonat", e.target.value)} />
        </div>
        <div>
          <label htmlFor="wartung" className={labelCls}>Wartung/Service (€/Monat) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="wartung" type="number" min="0" max="500" step="1"
            className={inputCls} placeholder="z.B. 25"
            value={form.wartungProMonat} onChange={(e) => set("wartungProMonat", e.target.value)} />
        </div>
      </div>

      {/* Zusatzangaben */}
      <div>
        <label htmlFor="zusatz" className={labelCls}>Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
        <textarea id="zusatz" rows={3} maxLength={500} className={`${inputCls} resize-none`}
          placeholder="z.B. Sonderausstattung, Herstellerprämie, Sonderkonditionen …"
          value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)} />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Wird analysiert …" : "Leasingangebot analysieren"}
      </Button>
    </form>
  );
}
