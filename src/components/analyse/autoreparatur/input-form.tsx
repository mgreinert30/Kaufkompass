"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Position {
  beschreibung: string;
  arbeitsstunden: string;
  teilepreis: string;
}

interface AutoreparaturFormData {
  werkstattTyp: string;
  fahrzeugKlasse: string;
  angebotspreis: string;
  arbeitszeit: string;
  stundensatz: string;
  hauptarbeit: string;
  fahrzeugAlter: string;
  kilometerstand: string;
  positionen: Position[];
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: AutoreparaturFormData) => void;
  isLoading: boolean;
}

const WERKSTATT_TYPEN = [
  { value: "markenwerkstatt", label: "Markenwerkstatt / Autohaus", desc: "Herstellerzertifiziert, höhere Stundensätze" },
  { value: "freie_werkstatt", label: "Freie Fachwerkstatt",        desc: "Qualifizierte Fachbetriebe, marktübliche Preise" },
  { value: "schnellservice",  label: "Schnellservice / Handelskette", desc: "z.B. ATU, Pitstop – Standardarbeiten" },
];

const FAHRZEUG_KLASSEN = [
  { value: "kleinwagen",   label: "Kleinwagen" },
  { value: "kompakt",      label: "Kompaktklasse" },
  { value: "mittelklasse", label: "Mittelklasse" },
  { value: "oberklasse",   label: "Oberklasse / Premium" },
  { value: "nutzfahrzeug", label: "Nutzfahrzeug / Transporter" },
];

export function AutoreparaturInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<AutoreparaturFormData>({
    werkstattTyp: "freie_werkstatt",
    fahrzeugKlasse: "kompakt",
    angebotspreis: "",
    arbeitszeit: "",
    stundensatz: "",
    hauptarbeit: "",
    fahrzeugAlter: "",
    kilometerstand: "",
    positionen: [],
    zusatzAngaben: "",
  });

  const set = (field: keyof AutoreparaturFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  function addPosition() {
    setForm((prev) => ({
      ...prev,
      positionen: [...prev.positionen, { beschreibung: "", arbeitsstunden: "", teilepreis: "" }],
    }));
  }

  function updatePosition(idx: number, field: keyof Position, value: string) {
    setForm((prev) => ({
      ...prev,
      positionen: prev.positionen.map((p, i) => i === idx ? { ...p, [field]: value } : p),
    }));
  }

  function removePosition(idx: number) {
    setForm((prev) => ({ ...prev, positionen: prev.positionen.filter((_, i) => i !== idx) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputCls = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]";
  const labelCls = "block text-sm font-medium text-[var(--foreground)] mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Werkstatttyp */}
      <div>
        <span className={labelCls}>Werkstatttyp *</span>
        <div className="space-y-2 mt-1">
          {WERKSTATT_TYPEN.map((w) => (
            <label key={w.value} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.werkstattTyp === w.value ? "border-[#16A34A] bg-[#F0FDF4]" : "border-[var(--border)] hover:border-[#86EFAC]"}`}>
              <input type="radio" name="werkstattTyp" value={w.value} checked={form.werkstattTyp === w.value}
                onChange={() => set("werkstattTyp", w.value)} className="mt-0.5 accent-[#16A34A]" />
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{w.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{w.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Fahrzeugklasse + Gesamtpreis */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fahrzeugKlasse" className={labelCls}>Fahrzeugklasse *</label>
          <select id="fahrzeugKlasse" className={inputCls} value={form.fahrzeugKlasse}
            onChange={(e) => set("fahrzeugKlasse", e.target.value)} required>
            {FAHRZEUG_KLASSEN.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="angebotspreis" className={labelCls}>Gesamtpreis (€) *</label>
          <input id="angebotspreis" type="number" min="1" max="50000" step="1"
            className={inputCls} placeholder="z.B. 850"
            value={form.angebotspreis} onChange={(e) => set("angebotspreis", e.target.value)} required />
        </div>
      </div>

      {/* Stundensatz + Arbeitszeit */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="stundensatz" className={labelCls}>Stundensatz (€/h) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="stundensatz" type="number" min="30" max="500" step="1"
            className={inputCls} placeholder="z.B. 120"
            value={form.stundensatz} onChange={(e) => set("stundensatz", e.target.value)} />
        </div>
        <div>
          <label htmlFor="arbeitszeit" className={labelCls}>Arbeitszeit (Stunden) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="arbeitszeit" type="number" min="0.1" max="100" step="0.1"
            className={inputCls} placeholder="z.B. 3.5"
            value={form.arbeitszeit} onChange={(e) => set("arbeitszeit", e.target.value)} />
        </div>
      </div>

      {/* Hauptarbeit */}
      <div>
        <label htmlFor="hauptarbeit" className={labelCls}>Art der Reparatur <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
        <input id="hauptarbeit" type="text" maxLength={200} className={inputCls}
          placeholder="z.B. Bremsenwechsel vorne, Inspektion, Zahnriemen"
          value={form.hauptarbeit} onChange={(e) => set("hauptarbeit", e.target.value)} />
      </div>

      {/* Fahrzeugalter + KM */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fahrzeugAlter" className={labelCls}>Fahrzeugalter (Jahre) <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="fahrzeugAlter" type="number" min="0" max="60" step="1"
            className={inputCls} placeholder="z.B. 8"
            value={form.fahrzeugAlter} onChange={(e) => set("fahrzeugAlter", e.target.value)} />
        </div>
        <div>
          <label htmlFor="kilometerstand" className={labelCls}>Kilometerstand <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
          <input id="kilometerstand" type="number" min="0" max="2000000" step="1000"
            className={inputCls} placeholder="z.B. 120000"
            value={form.kilometerstand} onChange={(e) => set("kilometerstand", e.target.value)} />
        </div>
      </div>

      {/* Positionen */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className={labelCls + " mb-0"}>Einzelpositionen <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></span>
          <Button type="button" variant="outline" size="sm" onClick={addPosition}>
            <Plus className="h-3.5 w-3.5" />Position hinzufügen
          </Button>
        </div>
        {form.positionen.length > 0 && (
          <div className="space-y-2">
            {form.positionen.map((pos, idx) => (
              <div key={idx} className="rounded-lg border border-[var(--border)] p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <input type="text" maxLength={200} className={inputCls + " flex-1"} placeholder="Beschreibung der Position"
                    value={pos.beschreibung} onChange={(e) => updatePosition(idx, "beschreibung", e.target.value)} />
                  <button type="button" onClick={() => removePosition(idx)} className="mt-0.5 text-[var(--muted-foreground)] hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" min="0" max="100" step="0.1" className={inputCls} placeholder="Arbeitsstunden"
                    value={pos.arbeitsstunden} onChange={(e) => updatePosition(idx, "arbeitsstunden", e.target.value)} />
                  <input type="number" min="0" max="10000" step="1" className={inputCls} placeholder="Teilepreis (€)"
                    value={pos.teilepreis} onChange={(e) => updatePosition(idx, "teilepreis", e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zusatzangaben */}
      <div>
        <label htmlFor="zusatz" className={labelCls}>Zusatzangaben <span className="text-[var(--muted-foreground)] font-normal">(optional)</span></label>
        <textarea id="zusatz" rows={3} maxLength={500} className={`${inputCls} resize-none`}
          placeholder="z.B. Besonderheiten, verwendete Teile (Original/Nachbau), Garantieumfang …"
          value={form.zusatzAngaben} onChange={(e) => set("zusatzAngaben", e.target.value)} />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Wird analysiert …" : "Reparaturangebot analysieren"}
      </Button>
    </form>
  );
}
