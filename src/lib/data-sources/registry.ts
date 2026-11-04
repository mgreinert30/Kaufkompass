import type { Quelle, Quellentyp } from "@/types/analyse";

// Zentrales Quellenregister – nur tatsächlich verwendbare Quellen
// Keine erfundenen URLs, keine ungeprüften Web-Scraping-Quellen

export interface DataSourceConfig {
  id: string;
  name: string;
  url?: string;
  anbieter: string;
  beschreibung: string;
  kategorien: string[];
  dateninhalt: string;
  aktualisierung: string;
  regionaleAbdeckung: string;
  apiVerfuegbar: boolean;
  lizenz: string;
  erlaubteNutzung: string;
  integration: "statisch" | "api" | "open-data" | "manuell" | "nutzerdokument";
  einschraenkungen: string;
}

export const DATA_SOURCES: Record<string, DataSourceConfig> = {
  grunderwerbsteuer_tabelle: {
    id: "grunderwerbsteuer_tabelle",
    name: "Grunderwerbsteuer-Tabelle (Bundesländer)",
    anbieter: "Bundesministerium der Finanzen / Landesgesetzgeber",
    beschreibung: "Amtliche Grunderwerbsteuersätze je Bundesland",
    kategorien: ["immobilien-kaufcheck"],
    dateninhalt: "Steuersatz in % je Bundesland",
    aktualisierung: "Bei Gesetzesänderungen",
    regionaleAbdeckung: "Bundesweit",
    apiVerfuegbar: false,
    lizenz: "Amtliche Information – frei nutzbar",
    erlaubteNutzung: "Unbeschränkt – amtliche gesetzliche Werte",
    integration: "statisch",
    einschraenkungen: "Muss bei Gesetzesänderungen manuell aktualisiert werden",
  },
  destatis_baupreise: {
    id: "destatis_baupreise",
    name: "Destatis Baupreisindizes",
    url: "https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Baupreise/",
    anbieter: "Statistisches Bundesamt (Destatis)",
    beschreibung: "Statistische Baupreisindizes für Deutschland",
    kategorien: ["sanierungskosten-check", "fenster-dach-check", "bad-renovierung-check"],
    dateninhalt: "Baupreisindizes, Preisentwicklungen",
    aktualisierung: "Quartalsweise",
    regionaleAbdeckung: "Deutschland gesamt",
    apiVerfuegbar: false,
    lizenz: "dl-de/by-2-0",
    erlaubteNutzung: "Nutzung mit Quellenangabe erlaubt (Govdata Lizenz)",
    integration: "manuell",
    einschraenkungen: "Kein direkter API-Zugang; manuelle Einpflege der Indexwerte erforderlich",
  },
  pvgis_eu: {
    id: "pvgis_eu",
    name: "PVGIS – Photovoltaic Geographical Information System",
    url: "https://re.jrc.ec.europa.eu/pvg_tools/de/",
    anbieter: "Europäische Kommission (JRC)",
    beschreibung: "Solare Einstrahlungsdaten für Europa",
    kategorien: ["photovoltaik-check"],
    dateninhalt: "Jahresertrag kWh/kWp nach Standort und Ausrichtung",
    aktualisierung: "Regelmäßig durch die EU-Kommission",
    regionaleAbdeckung: "Europa (Deutschland vollständig)",
    apiVerfuegbar: true,
    lizenz: "Open Data – EU-Kommission",
    erlaubteNutzung: "Frei nutzbar mit Quellenangabe",
    integration: "api",
    einschraenkungen: "API-Aufruf benötigt Koordinaten; keine Authentifizierung erforderlich",
  },
  bafa_foerderung: {
    id: "bafa_foerderung",
    name: "BAFA Bundesförderung für effiziente Gebäude (BEG)",
    url: "https://www.bafa.de/DE/Energie/Effizient_Heizen/Bundesfoerderung_Effiziente_Gebaeude/",
    anbieter: "Bundesamt für Wirtschaft und Ausfuhrkontrolle (BAFA)",
    beschreibung: "Aktuelle Fördersätze für Wärmepumpen und Energiemaßnahmen",
    kategorien: ["waermepumpen-check", "photovoltaik-check", "fenster-dach-check"],
    dateninhalt: "Fördersätze in %, Förderbedingungen",
    aktualisierung: "Bei Programmänderungen",
    regionaleAbdeckung: "Bundesweit",
    apiVerfuegbar: false,
    lizenz: "Öffentliche Information",
    erlaubteNutzung: "Nutzung mit Quellenangabe; Förderbedingungen ändern sich – immer direkt beim BAFA prüfen",
    integration: "manuell",
    einschraenkungen: "WICHTIG: Förderbedingungen ändern sich häufig. Angaben immer als Orientierung kennzeichnen.",
  },
  bundesnetzagentur_strompreise: {
    id: "bundesnetzagentur_strompreise",
    name: "Bundesnetzagentur – Monitoringbericht Energie",
    url: "https://www.bundesnetzagentur.de/",
    anbieter: "Bundesnetzagentur",
    beschreibung: "Statistische Strom- und Gaspreisdaten für Deutschland",
    kategorien: ["energie-tarif-check", "elektroauto-check", "waermepumpen-check"],
    dateninhalt: "Durchschnittliche Haushaltspreise Strom/Gas",
    aktualisierung: "Jährlich",
    regionaleAbdeckung: "Deutschland gesamt",
    apiVerfuegbar: false,
    lizenz: "Öffentliche Statistik",
    erlaubteNutzung: "Nutzung mit Quellenangabe",
    integration: "manuell",
    einschraenkungen: "Jahresdurchschnittswerte; aktuelle Tarife weichen ab",
  },
  eprel_eu: {
    id: "eprel_eu",
    name: "EU EPREL – European Product Registry for Energy Labelling",
    url: "https://eprel.ec.europa.eu/",
    anbieter: "Europäische Kommission",
    beschreibung: "Energieverbrauchswerte registrierter Haushaltsgeräte",
    kategorien: ["haushaltsgeraete-check"],
    dateninhalt: "Energieklasse, Jahresverbrauch (kWh), Produktdaten",
    aktualisierung: "Kontinuierlich durch Hersteller",
    regionaleAbdeckung: "EU-weit",
    apiVerfuegbar: true,
    lizenz: "Open Data – EU-Kommission",
    erlaubteNutzung: "Öffentliche API, kostenlos nutzbar",
    integration: "api",
    einschraenkungen: "API-Zugang möglich; Einrichtung erforderlich",
  },
  got_tierarzt: {
    id: "got_tierarzt",
    name: "Gebührenordnung für Tierärzte (GOT)",
    url: "https://www.gesetze-im-internet.de/got_2022/",
    anbieter: "Bundesministerium für Ernährung und Landwirtschaft",
    beschreibung: "Amtliche Gebührenordnung für Tierärzte",
    kategorien: ["tierarzt-check"],
    dateninhalt: "Mindest- und Regelsätze für tierärztliche Leistungen",
    aktualisierung: "Bei gesetzlichen Änderungen",
    regionaleAbdeckung: "Deutschland",
    apiVerfuegbar: false,
    lizenz: "Amtliche Information",
    erlaubteNutzung: "Unbeschränkt – amtliche gesetzliche Werte",
    integration: "statisch",
    einschraenkungen: "Tierärzte dürfen das 2- bis 3-fache des Regelsatzes berechnen; nur Orientierung",
  },
};

// Quellen für eine Kategorie abrufen
export function getSourcesForCategory(kategorie: string): DataSourceConfig[] {
  return Object.values(DATA_SOURCES).filter((s) =>
    s.kategorien.includes(kategorie)
  );
}

// Quelle für Analyse-Ergebnis formatieren
export function formatQuelleForResult(sourceId: string, datenstand: string): Quelle {
  const source = DATA_SOURCES[sourceId];
  if (!source) throw new Error(`Unbekannte Quelle: ${sourceId}`);
  return {
    name: source.name,
    url: source.url,
    datenstand,
    beschreibung: source.beschreibung,
    typ: source.integration === "statisch" ? "amtlich" : "open-data",
  };
}
