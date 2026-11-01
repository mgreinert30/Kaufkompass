# Design System – KaufKompass AI

Premium SaaS / Fintech Design Language  
Stand: 2026-11-01

---

## 1. Grundprinzipien

KaufKompass AI ist eine **vertrauensbildende Finanzplattform**, kein Chatbot. Das Design folgt diesen Leitprinzipien:

- **Vertrauen vor Aufmerksamkeit** – Nüchterne, professionelle Ästhetik statt Versprechen
- **Struktur schlägt Dekoration** – Klare Informationshierarchie, keine überladenen Verläufe
- **Mobile First** – Jede Komponente funktioniert auf 320px
- **Barrierefreiheit** – WCAG 2.1 AA als Mindeststandard

---

## 2. Farbpalette

### Markenfarben

| Token                | Hex       | Verwendung                          |
|----------------------|-----------|-------------------------------------|
| `--color-brand-900`  | `#1e3a8a` | Primärfarbe, CTA-Buttons, Headlines |
| `--color-brand-600`  | `#2563eb` | Links, aktive Zustände              |
| `--color-brand-500`  | `#3b82f6` | Hover-Zustand, Highlights           |
| `--color-accent-600` | `#0d9488` | Sekundärfarbe, Erfolgs-Indikator    |
| `--color-accent-700` | `#0f766e` | Dunkler Akzent, Icons               |

### Semantische Farben

| Token                 | Verwendung                  |
|-----------------------|-----------------------------|
| `--color-success-600` | Positive Bewertung, "gut"   |
| `--color-warning-500` | Warnung, "prüfen"           |
| `--color-error-600`   | Fehler, "kritisch"          |

### Surfaces (Light / Dark)

| Token                  | Light      | Dark       |
|------------------------|------------|------------|
| `--background`         | `#ffffff`  | `#0a0f1e`  |
| `--surface`            | `#f8fafc`  | `#0f172a`  |
| `--surface-raised`     | `#ffffff`  | `#1e293b`  |
| `--border`             | `#e2e8f0`  | `#1e293b`  |
| `--muted`              | `#f1f5f9`  | `#1e293b`  |
| `--muted-foreground`   | `#64748b`  | `#94a3b8`  |

---

## 3. Typografie

### Schriften

- **Display / Headings:** Geist Sans (Next.js Standard) — `var(--font-sans)`
- **Body:** Geist Sans — konsistente Schrift für alle Texte
- **Monospace:** Geist Mono — `var(--font-mono)` für Preisangaben, Codes

### Größenskala

| Token               | Größe  | Verwendung                     |
|---------------------|--------|--------------------------------|
| `--font-size-6xl`   | 60px   | Hero-Headline                  |
| `--font-size-5xl`   | 48px   | Section-Headline               |
| `--font-size-4xl`   | 36px   | Page-Title                     |
| `--font-size-3xl`   | 30px   | Card-Headline                  |
| `--font-size-2xl`   | 24px   | Sub-Headline                   |
| `--font-size-xl`    | 20px   | Große Labels                   |
| `--font-size-lg`    | 18px   | Fließtext (Priorität)          |
| `--font-size-base`  | 16px   | Standard-Fließtext             |
| `--font-size-sm`    | 14px   | Sekundärer Text, Captions      |
| `--font-size-xs`    | 12px   | Labels, Badges, Metadaten      |

### Gewichte

- `font-bold` (700) → Headlines, CTAs
- `font-semibold` (600) → Sub-Headlines, wichtige Labels
- `font-medium` (500) → Navigation, Buttons
- `font-normal` (400) → Fließtext

---

## 4. Abstände

Das Spacing-System basiert auf einem 4px-Raster (Tailwind Standard).

### Container

```css
.container-page {
  max-width: 80rem;   /* 1280px */
  padding: 0 1.5rem;  /* 24px mobile */
  padding: 0 2rem;    /* 32px tablet */  
  padding: 0 3rem;    /* 48px desktop */
}
```

### Section-Abstand

```css
.section-padding {
  padding-top: 5rem;    /* 80px desktop */
  padding-bottom: 5rem;
  /* 48px mobile */
}
```

---

## 5. Border Radius

| Token          | Wert     | Verwendung                         |
|----------------|----------|------------------------------------|
| `--radius-sm`  | 0.375rem | Kleine Elemente (Badges, Tags)     |
| `--radius-md`  | 0.5rem   | Inputs, kleine Buttons             |
| `--radius-lg`  | 0.75rem  | Cards, Standard-Komponenten        |
| `--radius-xl`  | 1rem     | Große Cards, Modals                |
| `--radius-2xl` | 1.5rem   | Hero-Elemente, Feature-Panels      |

---

## 6. Schatten

| Token         | Verwendung                              |
|---------------|-----------------------------------------|
| `--shadow-sm` | Subtile Erhebung (Inputs, small cards)  |
| `--shadow-md` | Standard-Cards                          |
| `--shadow-lg` | Hover-Zustand, Dropdown                 |
| `--shadow-xl` | Modals, Floating-Elemente               |

---

## 7. Komponenten-Übersicht

Alle Komponenten liegen in `src/components/ui/`.

### Phase 1.2 – Zu implementieren

| Komponente         | Datei                    | Status |
|--------------------|--------------------------|--------|
| Header             | `header.tsx`             | [ ]    |
| Navigation         | `navigation.tsx`         | [ ]    |
| MobileNav          | `mobile-nav.tsx`         | [ ]    |
| Footer             | `footer.tsx`             | [ ]    |
| Button             | `button.tsx`             | [ ]    |
| CategoryCard       | `category-card.tsx`      | [ ]    |
| FeatureCard        | `feature-card.tsx`       | [ ]    |
| UploadComponent    | `upload-component.tsx`   | [ ]    |
| InputComponent     | `input-component.tsx`    | [ ]    |
| ProgressIndicator  | `progress-indicator.tsx` | [ ]    |
| StatusBadge        | `status-badge.tsx`       | [ ]    |
| PriceDisplay       | `price-display.tsx`      | [ ]    |
| AnalysisResultCard | `analysis-result-card.tsx` | [ ] |
| WarningCard        | `warning-card.tsx`       | [ ]    |
| ComparisonTable    | `comparison-table.tsx`   | [ ]    |
| LoadingSkeleton    | `loading-skeleton.tsx`   | [ ]    |
| EmptyState         | `empty-state.tsx`        | [ ]    |
| ErrorState         | `error-state.tsx`        | [ ]    |

---

## 8. Utility-Klassen

Definiert in `globals.css`:

| Klasse            | Verwendung                              |
|-------------------|-----------------------------------------|
| `.container-page` | Seitenbreite mit responsivem Padding    |
| `.section-padding`| Vertikaler Abstand zwischen Sections   |
| `.card-base`      | Standard-Card-Styling                   |
| `.card-hover`     | Hover-Animation für Cards               |
| `.gradient-text`  | Blau→Türkis Farbverlauf für Text        |
| `.gradient-brand` | Dunkler Marken-Hintergrund              |

---

## 9. Ikonographie

Bibliothek: **Lucide React** (`lucide-react`)

- Größen: 16px (inline), 20px (Standard), 24px (Navigations-Icons), 32px (Feature-Icons)
- Strichstärke: `strokeWidth={1.5}` (Standard)
- Farbe: immer `currentColor` (Tailwind-Klassen)

---

## 10. Animation

Bibliothek: **Framer Motion** (`framer-motion`)

- Hover-Übergang: `duration: 0.2`
- Einblenden: `duration: 0.4`, `ease: "easeOut"`
- Seitenübergänge: `duration: 0.3`
- `prefers-reduced-motion` respektieren → Animationen deaktivieren

---

## 11. Qualitätsregeln

1. Kein Inline-Style außer dynamischen Werten
2. Keine Magic Numbers ohne Kommentar
3. Alle interaktiven Elemente haben `focus-visible` Styling
4. Alle Bilder haben `alt`-Text
5. Kontrastverhältnis: mind. 4.5:1 (AA)
6. Touch-Targets: mind. 44×44px
