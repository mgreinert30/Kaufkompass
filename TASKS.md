# KaufKompass AI – Implementierungsplan

## Architektur-Status

### ✅ Bereits implementiert
- Tool 01: Immobilien-Kaufcheck (`/analyse/immobilien-kaufcheck`)
- Tool 02: Sanierungskosten-Check (`/analyse/sanierungskosten-check`)
- Tool 03: Wärmepumpen-Check (`/analyse/waermepumpen-check`)
- Tool 04: Photovoltaik-Check (`/analyse/photovoltaik-check`)
- Tool 09: Gebrauchtwagen-Kaufcheck (`/analyse/gebrauchtwagen-check`)
- KI-Provider mit Gemini-Fallback-Chain
- Zentrales Quellenregister (`src/lib/data-sources/registry.ts`)
- Deterministische Berechnungen für alle obigen Tools

### 🔄 In Arbeit (diese Session)
- Result-Seiten-System (`/ergebnis/[analysisId]`)
- In-Memory Analysis-Store
- Tool 05: Küchen-Kaufcheck

---

## Offene Implementierungen (sequenziell)

### Phase 1: Architektur-Upgrade
- [ ] `src/lib/storage/analysis-store.ts` – Server-seitiger In-Memory-Store
- [ ] `src/app/ergebnis/[analysisId]/page.tsx` – Universelle Ergebnisseite
- [ ] `src/app/api/ergebnis/[analysisId]/route.ts` – GET-API für Ergebnisse
- [ ] Bestehende Tool-Routen auf analysisId-Rückgabe umstellen
- [ ] Bestehende Tool-Pages auf Redirect umstellen

### Phase 2: Familie A – Immobilien, Wohnen & Energie
- [ ] Tool 05: Küchen-Kaufcheck
  - [ ] `src/lib/calculations/kueche.ts`
  - [ ] `src/lib/ai/prompts/kueche.ts`
  - [ ] `src/app/api/analyse/kuechen-kaufcheck/route.ts`
  - [ ] `src/components/analyse/kueche/input-form.tsx`
  - [ ] `src/components/analyse/kueche/result-dashboard.tsx`
  - [ ] `src/app/analyse/kuechen-kaufcheck/page.tsx`
- [ ] Tool 06: Fenster- und Dachcheck
- [ ] Tool 07: Badezimmer-Renovierungscheck
- [ ] Tool 08: Möbel-Kaufcheck

### Phase 3: Familie B – Fahrzeuge & Mobilität
- [ ] Tool 10: Autoreparatur-Check
- [ ] Tool 11: Auto-Leasingcheck
- [ ] Tool 12: Elektroauto-Kostencheck
- [ ] Tool 13: Wohnmobil-Check
- [ ] Tool 14: E-Bike-Kaufcheck

### Phase 4: Familie C – Technik & Alltag
- [ ] Tool 15: Laptop- und PC-Check
- [ ] Tool 16: Smartphone-Check
- [ ] Tool 17: Haushaltsgeräte-Check
- [ ] Tool 18: Matratzen-Kaufcheck
- [ ] Tool 19: Baby- und Kinderwagencheck
- [ ] Tool 20: Gebrauchtwaren-Check

### Phase 5: Familie D – Verträge & Dienstleistungen
- [ ] Tool 21: Versicherungscheck
- [ ] Tool 22: Strom- und Gastarifcheck
- [ ] Tool 23: Internet- und Mobilfunkcheck
- [ ] Tool 24: Umzugskosten-Check
- [ ] Tool 25: Hochzeitsbudget-Check
- [ ] Tool 26: Reise- und Hotelcheck
- [ ] Tool 27: Weiterbildungs-Check
- [ ] Tool 28: Zahnbehandlungs-Kostencheck
- [ ] Tool 29: Bestattungskosten-Check
- [ ] Tool 30: Tierarzt-Kostencheck

---

## Design-Regeln (unveränderlich)
- Hintergrund: #F8F7F2 (Cream)
- Primärfarbe: #14532D (Waldgrün)
- Akzent: #16A34A
- Border: #E4E8E1
- Muted: #647067
- Fonts: DM Serif Display (Headings) + Inter (Body)
- Tailwind v4: `@theme inline {}` in globals.css – KEIN tailwind.config.ts

## Sicherheitsregeln (unveränderlich)
- API-Keys ausschließlich in Umgebungsvariablen
- Niemals API-Keys im Frontend-Code
- Rate Limiting auf allen API-Routen
- Input-Validation mit Zod

## Git-Regel
- Nach jedem abgeschlossenen Feature sofort committen und pushen
