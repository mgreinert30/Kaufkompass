"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bath } from "lucide-react";

interface BadFormData {
  groesse: string;
  ausstattung: string;
  flaeche: string;
  angebotspreis: string;
  baujahr: string;
  mitBarrierefreiheit: boolean;
  mitHeizung: boolean;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: BadFormData) => void;
  isLoading: boolean;
}

export function BadRenovierungInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<BadFormData>({
    groesse: "mittel",
    ausstattung: "komfort",
    flaeche: "",
    angebotspreis: "",
    baujahr: "",
    mitBarrierefreiheit: false,
    mitHeizung: false,
    zusatzAngaben: "",
  });

  const set = (field: keyof BadFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-transparent";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bad-groesse" className={labelCls}>Badgröße *</label>
          <select id="bad-groesse" value={form.groesse} onChange={set("groesse")} className={inputCls}>
            <option value="klein">Klein (bis 6 m²)</option>
            <option value="mittel">Mittel (6–10 m²)</option>
            <option value="gross">Groß (10+ m²)</option>
          </select>
        </div>
        <div>
          <label htmlFor="bad-ausstattung" className={labelCls}>Ausstattungsniveau *</label>
          <select id="bad-ausstattung" value={form.ausstattung} onChange={set("ausstattung")} className={inputCls}>
            <option value="basis">Basis (funktional)</option>
            <option value="komfort">Komfort (Markenprodukte)</option>
            <option value="premium">Premium (hochwertig)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bad-flaeche" className={labelCls}>
            Badfläche <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input id="bad-flaeche" type="number" min="2" max="100" step="0.5"
              value={form.flaeche} onChange={set("flaeche")} placeholder="z.B. 7"
              className={inputCls + " pr-10"} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">m²</span>
          </div>
        </div>
        <div>
          <label htmlFor="bad-angebot" className={labelCls}>
            Angebotspreis <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
          </label>
          <div className="relative">
            <input id="bad-angebot" type="number" min="500" max="500000"
              value={form.angebotspreis} onChange={set("angebotspreis")} placeholder="z.B. 15000"
              className={inputCls + " pr-10"} />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]">€</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="bad-baujahr" className={labelCls}>
          Baujahr Gebäude <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </label>
        <input id="bad-baujahr" type="number" min="1850" max="2030"
          value={form.baujahr} onChange={set("baujahr")} placeholder="z.B. 1975"
          className={inputCls} />
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.mitBarrierefreiheit}
            onChange={(e) => setForm((f) => ({ ...f, mitBarrierefreiheit: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[#14532D]" />
          <div>
            <span className="text-sm font-medium text-[var(--foreground)]">Barrierefreier Umbau</span>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">+15–30 % Aufschlag; KfW 455-B Förderung prüfen</p>
          </div>
        </label>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={form.mitHeizung}
            onChange={(e) => setForm((f) => ({ ...f, mitHeizung: e.target.checked }))}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border)] accent-[#14532D]" />
          <span className="text-sm font-medium text-[var(--foreground)]">Fußbodenheizung inklusive</span>
        </label>
      </div>

      <div>
        <label htmlFor="bad-zusatz" className={labelCls}>
          Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span>
        </label>
        <textarea id="bad-zusatz" rows={3} value={form.zusatzAngaben} onChange={set("zusatzAngaben")}
          maxLength={2000} placeholder="z.B. Besonderheiten, Fragen…"
          className={inputCls + " resize-none"} />
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="w-full">
        <Bath className="h-4 w-4" aria-hidden="true" />
        {isLoading ? "Analyse läuft…" : "Jetzt analysieren"}
      </Button>
    </form>
  );
}
