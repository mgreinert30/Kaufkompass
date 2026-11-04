"use client";

import { useState } from "react";
import { BUNDESLAENDER } from "@/lib/calculations/immobilien";
import { Button } from "@/components/ui/button";

const IMMOBILIENTYPEN = [
  "Einfamilienhaus", "Doppelhaushälfte", "Reihenhaus",
  "Eigentumswohnung", "Mehrfamilienhaus", "Grundstück",
];

const BEISPIEL_DATEN = {
  bundesland: "Bayern",
  immobilientyp: "Eigentumswohnung",
  wohnflaeche: "75",
  baujahr: "2005",
  kaufpreis: "395000",
  eigenkapital: "80000",
  mitMakler: true,
  zusatzAngaben: "2-Zimmer-Wohnung in München-Schwabing. Keller und Tiefgaragenstellplatz inklusive.",
};

interface FormData {
  bundesland: string;
  immobilientyp: string;
  wohnflaeche: string;
  baujahr: string;
  kaufpreis: string;
  eigenkapital: string;
  mitMakler: boolean;
  zusatzAngaben: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

export function ImmobilienInputForm({ onSubmit, isLoading }: Props) {
  const [form, setForm] = useState<FormData>({
    bundesland: "",
    immobilientyp: "",
    wohnflaeche: "",
    baujahr: "",
    kaufpreis: "",
    eigenkapital: "",
    mitMakler: false,
    zusatzAngaben: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function set(field: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.bundesland) e.bundesland = "Bitte Bundesland wählen";
    if (!form.immobilientyp) e.immobilientyp = "Bitte Typ wählen";
    if (!form.kaufpreis || Number(form.kaufpreis) <= 0) e.kaufpreis = "Kaufpreis erforderlich";
    if (form.eigenkapital === "" || Number(form.eigenkapital) < 0) e.eigenkapital = "Eigenkapital erforderlich";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSubmit(form);
  }

  function fillDemo() {
    setForm({ ...BEISPIEL_DATEN, mitMakler: true });
    setErrors({});
  }

  const labelClass = "block text-sm font-medium text-[var(--foreground)] mb-1.5";
  const inputClass = "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const selectClass = inputClass;
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Demo-Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">Pflichtfelder sind mit * markiert.</p>
        <button
          type="button"
          onClick={fillDemo}
          className="text-xs text-blue-600 hover:text-blue-700 underline underline-offset-2"
        >
          Beispieldaten laden
        </button>
      </div>

      {/* Gruppe 1: Objekt */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">
          Objektdaten
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bundesland" className={labelClass}>Bundesland *</label>
            <select
              id="bundesland"
              value={form.bundesland}
              onChange={(e) => set("bundesland", e.target.value)}
              className={selectClass}
            >
              <option value="">Bitte wählen</option>
              {BUNDESLAENDER.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            {errors.bundesland && <p className={errorClass}>{errors.bundesland}</p>}
          </div>

          <div>
            <label htmlFor="immobilientyp" className={labelClass}>Immobilientyp *</label>
            <select
              id="immobilientyp"
              value={form.immobilientyp}
              onChange={(e) => set("immobilientyp", e.target.value)}
              className={selectClass}
            >
              <option value="">Bitte wählen</option>
              {IMMOBILIENTYPEN.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.immobilientyp && <p className={errorClass}>{errors.immobilientyp}</p>}
          </div>

          <div>
            <label htmlFor="wohnflaeche" className={labelClass}>Wohnfläche (m²)</label>
            <input
              id="wohnflaeche"
              type="number"
              min={1} max={2000}
              placeholder="z.B. 95"
              value={form.wohnflaeche}
              onChange={(e) => set("wohnflaeche", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="baujahr" className={labelClass}>Baujahr</label>
            <input
              id="baujahr"
              type="number"
              min={1850} max={2030}
              placeholder="z.B. 2005"
              value={form.baujahr}
              onChange={(e) => set("baujahr", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      {/* Gruppe 2: Finanzen */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">
          Kaufpreis & Finanzierung
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kaufpreis" className={labelClass}>Angebotspreis (€) *</label>
            <input
              id="kaufpreis"
              type="number"
              min={1} max={50000000}
              placeholder="z.B. 395000"
              value={form.kaufpreis}
              onChange={(e) => set("kaufpreis", e.target.value)}
              className={inputClass}
            />
            {errors.kaufpreis && <p className={errorClass}>{errors.kaufpreis}</p>}
          </div>

          <div>
            <label htmlFor="eigenkapital" className={labelClass}>Eigenkapital (€) *</label>
            <input
              id="eigenkapital"
              type="number"
              min={0}
              placeholder="z.B. 80000"
              value={form.eigenkapital}
              onChange={(e) => set("eigenkapital", e.target.value)}
              className={inputClass}
            />
            {errors.eigenkapital && <p className={errorClass}>{errors.eigenkapital}</p>}
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Empfehlung: mindestens 20–30 % des Kaufpreises + Kaufnebenkosten
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="mitMakler"
            type="checkbox"
            checked={form.mitMakler}
            onChange={(e) => set("mitMakler", e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="mitMakler" className="text-sm text-[var(--foreground)]">
            Mit Maklerprovision (Käuferanteil 3,57 % inkl. MwSt.)
          </label>
        </div>
      </fieldset>

      {/* Gruppe 3: Optionale Angaben */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-[var(--foreground)] pb-2 border-b border-[var(--border)] w-full">
          Zusätzliche Angaben (optional)
        </legend>
        <div>
          <label htmlFor="zusatzAngaben" className={labelClass}>
            Besonderheiten des Objekts
          </label>
          <textarea
            id="zusatzAngaben"
            rows={3}
            placeholder="z.B. Lage, Zustand, Besonderheiten aus dem Exposé, bekannte Mängel..."
            value={form.zusatzAngaben}
            onChange={(e) => set("zusatzAngaben", e.target.value)}
            className={inputClass + " resize-none"}
            maxLength={2000}
          />
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Max. 2.000 Zeichen · Keine Dokumente hochladen erforderlich
          </p>
        </div>
      </fieldset>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Analyse läuft…" : "Jetzt Kauf prüfen"}
      </Button>

      <p className="text-xs text-center text-[var(--muted-foreground)]">
        Deine Angaben werden nur für diese Analyse verarbeitet und nicht gespeichert.
      </p>
    </form>
  );
}
