# TASKS.md – Entwicklungsphasen & Aufgaben: KaufKompass AI

Legende: `[ ]` Nicht begonnen | `[~]` In Bearbeitung | `[x]` Fertig & geprüft | `[!]` Blockiert

---

## PHASE 1 – Design-System und technische Basis

### 1.1 Designkonzept
- [x] Design-Tokens definieren (Farben, Typografie, Abstände)
- [x] `docs/DESIGN_SYSTEM.md` erstellen
- [x] Tailwind-Konfiguration mit Design-Tokens erweitern
- [x] CSS-Variablen für Light/Dark-Theme

### 1.2 Wiederverwendbare Komponenten
- [x] Header
- [x] Navigation (Desktop)
- [x] Mobile Navigation (Hamburger/Drawer)
- [x] Footer
- [x] Button (Primary, Secondary, Ghost, Destructive)
- [x] CategoryCard
- [x] FeatureCard
- [x] UploadComponent
- [x] InputComponent (mit Label, Fehler, Helfertext)
- [x] ProgressIndicator
- [x] StatusBadge
- [x] PriceDisplay
- [x] AnalysisResultCard
- [x] WarningCard
- [x] ComparisonTable
- [x] LoadingSkeleton
- [x] EmptyState
- [x] ErrorState

### 1.3 Technische Qualitätsprüfung
- [x] TypeScript: keine Fehler
- [x] ESLint: keine Fehler (Build sauber)
- [x] Build: erfolgreich (Next.js 16.4.3, Turbopack)
- [x] Desktop-Darstellung: geprüft (Artifact-Vorschau)
- [x] Mobile-Darstellung: geprüft (responsive, 400px)
- [x] Keyboard-Navigation: focus-visible auf allen interaktiven Elementen
- [x] TASKS.md aktualisiert

**Phase 1 abgeschlossen:** [x]

---

## PHASE 2 – Vollständige Website-Struktur

### 2.1 Startseite (`/`)
- [x] Hero-Bereich mit Headline + CTA
- [x] Kategorieauswahl im sichtbaren Bereich
- [x] Beliebte Kaufchecks (Section)
- [x] Alle Themenbereiche (Section)
- [x] So funktioniert die Plattform (Section)
- [x] Beispiele für Kostenanalysen (Section)
- [x] Vorteile der KI-Kaufprüfung (Section)
- [x] Preisübersicht (Section)
- [x] FAQ (Section)
- [x] Footer

### 2.2 Kategorienübersicht (`/kategorien`)
- [x] Suchfunktion
- [x] Filterung nach Themenfamilie
- [x] Status-Anzeige pro Kategorie
- [x] Links zu Unterseiten

### 2.3 Allgemeine Seiten
- [x] `/` – Startseite
- [x] `/kategorien` – Kategorienübersicht
- [x] `/so-funktioniert-es` – Erklärungsseite
- [x] `/preise` – Preisseite
- [x] `/ueber-uns` – Über die Plattform
- [x] `/kontakt` – Kontaktseite
- [x] `/faq` – FAQ
- [x] `/datenschutz` – Datenschutzerklärung (Vorlage)
- [x] `/impressum` – Impressum (Vorlage)
- [x] `/nutzungsbedingungen` – AGB (Vorlage)

### 2.4 Seitenstruktur-Prüfung
- [x] Alle Navigationslinks funktionieren
- [x] Keine leeren/fehlerhaften Seiten (44/44 Seiten OK)
- [x] Mobile Navigation funktioniert
- [x] Build fehlerfrei (TypeScript + Next.js 16.4.3)
- [x] Deployed auf Vercel: https://kaufkompass-ai.vercel.app

**Phase 2 abgeschlossen:** [x] – 2026-11-01

---

## PHASE 3 – Alle 30 Kategorien anlegen

### Themenfamilie A – Immobilien, Wohnen und Energie
- [ ] 01. Immobilien-Kaufcheck (`/kategorien/immobilien-kaufcheck`)
- [ ] 02. Sanierungskosten-Check (`/kategorien/sanierungskosten-check`)
- [ ] 03. Wärmepumpen-Angebotscheck (`/kategorien/waermepumpen-check`)
- [ ] 04. Photovoltaik-Check (`/kategorien/photovoltaik-check`)
- [ ] 05. Küchen-Kaufcheck (`/kategorien/kuechen-kaufcheck`)
- [ ] 06. Fenster- und Dachcheck (`/kategorien/fenster-dach-check`)
- [ ] 07. Badezimmer-Renovierungscheck (`/kategorien/bad-renovierung-check`)
- [ ] 08. Möbel-Kaufcheck (`/kategorien/moebel-kaufcheck`)

### Themenfamilie B – Fahrzeuge und Mobilität
- [ ] 09. Gebrauchtwagen-Kaufcheck (`/kategorien/gebrauchtwagen-check`)
- [ ] 10. Autoreparatur-Check (`/kategorien/autoreparatur-check`)
- [ ] 11. Auto-Leasingcheck (`/kategorien/auto-leasing-check`)
- [ ] 12. Elektroauto-Kostencheck (`/kategorien/elektroauto-check`)
- [ ] 13. Wohnmobil- und Campercheck (`/kategorien/wohnmobil-check`)
- [ ] 14. E-Bike-Kaufcheck (`/kategorien/ebike-kaufcheck`)

### Themenfamilie C – Technik und Alltag
- [ ] 15. Laptop- und PC-Check (`/kategorien/laptop-pc-check`)
- [ ] 16. Smartphone-Check (`/kategorien/smartphone-check`)
- [ ] 17. Haushaltsgeräte-Check (`/kategorien/haushaltsgeraete-check`)
- [ ] 18. Matratzen-Kaufcheck (`/kategorien/matratzen-check`)
- [ ] 19. Baby- und Kinderwagencheck (`/kategorien/kinderwagen-check`)
- [ ] 20. Gebrauchtwaren-Check (`/kategorien/gebrauchtwaren-check`)

### Themenfamilie D – Verträge und Dienstleistungen
- [ ] 21. Versicherungscheck (`/kategorien/versicherung-check`)
- [ ] 22. Strom- und Gastarifcheck (`/kategorien/energie-tarif-check`)
- [ ] 23. Internet- und Mobilfunkcheck (`/kategorien/internet-mobil-check`)
- [ ] 24. Umzugskosten-Check (`/kategorien/umzug-check`)
- [ ] 25. Hochzeitsbudget-Check (`/kategorien/hochzeit-check`)
- [ ] 26. Reise- und Hotelcheck (`/kategorien/reise-hotel-check`)
- [ ] 27. Weiterbildungs-Check (`/kategorien/weiterbildung-check`)
- [ ] 28. Zahnbehandlungs-Kostencheck (`/kategorien/zahnarzt-check`)
- [ ] 29. Bestattungskosten-Check (`/kategorien/bestattung-check`)
- [ ] 30. Tierarzt-Kostencheck (`/kategorien/tierarzt-check`)

**Phase 3 abgeschlossen:** [ ]

---

## PHASE 4 – Zentrales Analyse-System

- [ ] 4.1 Allgemeiner Eingabeprozess (Multi-Step-Flow)
- [ ] 4.2 Dokumentenverarbeitung (Upload, Validierung, Textextraktion)
- [ ] 4.3 KI-Schnittstelle (Provider-Abstraktion, Zod-Validierung)
- [ ] 4.4 Quellen- und Preisdatensystem
- [ ] 4.5 Berechnungs-Engine (Unit-Tests)

**Phase 4 abgeschlossen:** [ ]

---

## PHASE 5 – Gemeinsames Ergebnis-Dashboard

- [ ] Berichtsstruktur (A–J Elemente)
- [ ] KPI-Karten
- [ ] Diagramme (Recharts)
- [ ] Vergleichstabellen
- [ ] PDF-Export
- [ ] Mobile Optimierung

**Phase 5 abgeschlossen:** [ ]

---

## PHASE 6 – Erste 5 voll funktionsfähige KI-Tools

- [ ] Tool 1: Immobilien-Kaufcheck (vollständig)
- [ ] Tool 2: Gebrauchtwagen-Kaufcheck (vollständig)
- [ ] Tool 3: Wärmepumpen-Angebotscheck (vollständig)
- [ ] Tool 4: Küchen-Angebotscheck (vollständig)
- [ ] Tool 5: Photovoltaik-Angebotscheck (vollständig)

**Phase 6 abgeschlossen:** [ ]

---

## PHASE 7 – Vergleichsfunktion
- [ ] Mehrere Angebote gleichzeitig analysieren
- [ ] Vergleichs-Dashboard

**Phase 7 abgeschlossen:** [ ]

---

## PHASE 8 – Nutzerkonten und Bezahlung
- [ ] Auth (Registrierung, Login)
- [ ] Analyseverlauf
- [ ] Stripe-Anbindung (Testmodus)
- [ ] Sicherheit & Rate Limiting

**Phase 8 abgeschlossen:** [ ]

---

## PHASE 9 – SEO und Marketing
- [ ] Metadata pro Seite/Kategorie
- [ ] Sitemap
- [ ] Landingpage-Bausteine
- [ ] Datenschutzkonformes Tracking

**Phase 9 abgeschlossen:** [ ]

---

## PHASE 10 – Qualitätssicherung
- [ ] Design-Review (Desktop/Tablet/Mobile)
- [ ] Funktionstests aller Bereiche
- [ ] Sicherheitsprüfung
- [ ] `docs/PROJECT_STATUS.md` erstellen

**Phase 10 abgeschlossen:** [ ]

---

## Aktueller Stand
**Aktuelle Phase:** 3 – Alle 30 Kategorien anlegen
**Letzte abgeschlossene Aufgabe:** Phase 2 vollständig – Website-Struktur, 44 Seiten, Vercel-Deployment
**Nächste Aufgabe:** 3.x – Phase 3 beginnen (Kategorie-Detailseiten mit vollständigem Analyse-Flow)
**Offene Blocker:** Keine
**Zuletzt aktualisiert:** 2026-11-01
