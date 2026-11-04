# DATA_SOURCES.md – Quellenregister KaufKompass AI

## Grundprinzipien

- **Keine erfundenen Quellen** – jede zitierte Quelle muss tatsächlich verwendet worden sein
- **Keine ungeprüfte Automatisierung** – öffentliche Webseiten sind nicht automatisch frei zu scrapen
- **Einschränkungen kommunizieren** – wenn keine Marktdaten verfügbar sind, sagt das Tool das

---

## Verfügbare Quellen (implementiert)

### Grunderwerbsteuer-Tabelle
- **Anbieter:** Bundesministerium der Finanzen / Landesgesetzgeber
- **Typ:** Statisch, amtlich
- **Nutzung:** Unbeschränkt (gesetzliche Festwerte)
- **Kategorien:** Immobilien-Kaufcheck
- **Stand:** Bundesländer-Tabelle 2024
- **Einschränkungen:** Bei Gesetzesänderungen manuell zu aktualisieren

### Annuitätenformel (mathematisch)
- **Typ:** Mathematische Formel (kein externer Anbieter)
- **Nutzung:** Unbeschränkt
- **Kategorien:** Immobilien-Kaufcheck, Leasing-Check
- **Quelle:** Standardformel: `P × (r(1+r)^n) / ((1+r)^n − 1)`

---

## Verfügbare Quellen (noch anzubinden)

### PVGIS – Photovoltaic Geographical Information System
- **Anbieter:** Europäische Kommission (JRC)
- **URL:** https://re.jrc.ec.europa.eu/pvg_tools/de/
- **Typ:** Open Data API
- **Lizenz:** EU Open Data, kostenlos nutzbar mit Quellenangabe
- **API:** Ja, keine Authentifizierung erforderlich
- **Kategorien:** Photovoltaik-Check
- **Zu tun:** `src/lib/data-sources/pvgis.ts` implementieren

### EU EPREL – Energy Label Product Database
- **Anbieter:** Europäische Kommission
- **URL:** https://eprel.ec.europa.eu/
- **Typ:** Open Data API
- **Lizenz:** EU Open Data
- **API:** Ja, kostenlos
- **Kategorien:** Haushaltsgeräte-Check
- **Zu tun:** Produktsuche per API implementieren

### Bundesnetzagentur – Energiemonitoring
- **Anbieter:** Bundesnetzagentur
- **URL:** https://www.bundesnetzagentur.de/
- **Typ:** Öffentliche Statistik (manuelle Einpflege)
- **Kategorien:** Strom- und Gastarifcheck, Elektroauto
- **Zu tun:** Jahresdurchschnittswerte als statische Referenz einpflegen

### GOT – Gebührenordnung für Tierärzte
- **Anbieter:** BMF/Gesetzgeber
- **URL:** https://www.gesetze-im-internet.de/got_2022/
- **Typ:** Statisch, amtlich
- **Kategorien:** Tierarzt-Check
- **Zu tun:** Häufigste Positionen als statische Tabelle implementieren

### BAFA – Bundesförderung Effiziente Gebäude
- **Anbieter:** BAFA
- **URL:** https://www.bafa.de/
- **Typ:** Öffentliche Information (manuelle Einpflege)
- **Einschränkung:** Förderbedingungen ändern sich häufig – immer als "Stand [Datum]" kennzeichnen
- **Kategorien:** Wärmepumpe, Photovoltaik, Fenster/Dach

---

## Nicht verfügbare Quellen

### DAT / Schwacke (Fahrzeugpreise)
- **Status:** ❌ Lizenzpflichtig, kein öffentlicher API-Zugang
- **Alternative:** ADAC-Tipps als redaktionelle Referenz (keine Preisdaten)
- **Konsequenz:** Tool 09 Gebrauchtwagen kann keinen Preisvergleich anbieten; kommuniziert das explizit

### BORIS NRW / Bodenrichtwerte
- **Status:** ⚠️ Regional unterschiedlich; automatisierter Abruf erfordert Prüfung je Bundesland
- **Alternative:** Nutzer wird auf das jeweilige Landesportal verwiesen
- **Konsequenz:** Kein automatischer Bodenrichtwertabruf

### Aktuelle Immobilienmarktdaten (IVD, Sprengnetter etc.)
- **Status:** ❌ Lizenzpflichtig
- **Konsequenz:** Kein Kaufpreisvergleich – KI kommuniziert dies explizit

---

## Quellenauszeichnung im Ergebnis

Jede Zahl im Ergebnis-Dashboard wird mit ihrer Quelle belegt:

| Typ | Kennzeichnung |
|-----|---------------|
| Amtlicher Festwert | "Quelle: [Gesetz/Behörde], Stand [Jahr]" |
| Mathematische Berechnung | "Berechnung: [Formel]" |
| Schätzwert / Richtwert | "Schätzwert – tatsächliche Kosten variieren" |
| Nutzereingabe | "Angabe: Nutzer" |
| KI-Interpretation | "KI-Einschätzung – keine Garantie" |
| Nicht verfügbar | "Daten nicht verfügbar" |
