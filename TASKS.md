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
- [ ] ESLint: keine Fehler
- [x] Build: erfolgreich
- [ ] Desktop-Darstellung: geprüft
- [ ] Mobile-Darstellung: geprüft
- [ ] Keyboard-Navigation: grundlegend prüfen
- [ ] TASKS.md aktualisiert

**Phase 1 abgeschlossen:** [ ]

---

## PHASE 2 – Vollständige Website-Struktur

### 2.1 Startseite (`/`)
- [ ] Hero-Bereich mit Headline + CTA
- [ ] Kategorieauswahl im sichtbaren Bereich
- [ ] Beliebte Kaufchecks (Section)
- [ ] Alle Themenbereiche (Section)
- [ ] So funktioniert die Plattform (Section)
- [ ] Beispiele für Kostenanalysen (Section)
- [ ] Vorteile der KI-Kaufprüfung (Section)
- [ ] Preisübersicht (Section)
- [ ] FAQ (Section)
- [ ] Footer

### 2.2 Kategorienübersicht (`/kategorien`)
- [ ] Suchfunktion
- [ ] Filterung nach Themenfamilie
- [ ] Status-Anzeige pro Kategorie
- [ ] Links zu Unterseiten

### 2.3 Allgemeine Seiten
- [ ] `/` – Startseite
- [ ] `/kategorien` – Kategorienübersicht
- [ ] `/so-funktioniert-es` – Erklärungsseite
- [ ] `/preise` – Preisseite
- [ ] `/ueber-uns` – Über die Plattform
- [ ] `/kontakt` – Kontaktseite
- [ ] `/faq` – FAQ
- [ ] `/datenschutz` – Datenschutzerklärung (Vorlage)
- [ ] `/impressum` – Impressum (Vorlage)
- [ ] `/nutzungsbedingungen` – AGB (Vorlage)

### 2.4 Seitenstruktur-Prüfung
- [ ] Alle Navigationslinks funktionieren
- [ ] Keine leeren/fehlerhaften Seiten
- [ ] Mobile Navigation funktioniert
- [ ] Ladezustände vorhanden

**Phase 2 abgeschlossen:** [ ]

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
**Aktuelle Phase:** 1 – Design-System und technische Basis
**Letzte abgeschlossene Aufgabe:** 1.2 – Alle 18 UI-Komponenten + Layout-Komponenten
**Nächste Aufgabe:** 1.3 – ESLint + visuelle Prüfung
**Offene Blocker:** Keine
**Zuletzt aktualisiert:** 2026-11-01
