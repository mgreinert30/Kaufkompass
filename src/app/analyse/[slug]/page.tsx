import { redirect, notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/config/categories";

// Diese Seite leitet zu den implementierten Tool-Seiten weiter
// oder zeigt einen "noch nicht verfügbar" Hinweis

interface Props {
  params: Promise<{ slug: string }>;
}

// Mapping: Welche Slugs haben eine vollständige Implementierung?
const IMPLEMENTED_TOOLS: Record<string, string> = {
  // Familie A – Immobilien & Wohnen
  "immobilien-kaufcheck":    "/analyse/immobilien-kaufcheck",
  "photovoltaik-check":      "/analyse/photovoltaik-check",
  "sanierungskosten-check":  "/analyse/sanierungskosten-check",
  "waermepumpen-check":      "/analyse/waermepumpen-check",
  "kuechen-kaufcheck":       "/analyse/kuechen-kaufcheck",
  "fenster-dach-check":      "/analyse/fenster-dach-check",
  "bad-renovierung-check":   "/analyse/bad-renovierung-check",
  "moebel-kaufcheck":        "/analyse/moebel-kaufcheck",
  // Familie B – Mobilität & Fahrzeuge
  "gebrauchtwagen-check":    "/analyse/gebrauchtwagen-check",
  "autoreparatur-check":     "/analyse/autoreparatur-check",
  "auto-leasing-check":      "/analyse/auto-leasing-check",
  "elektroauto-check":       "/analyse/elektroauto-check",
  "wohnmobil-check":         "/analyse/wohnmobil-check",
  "ebike-kaufcheck":         "/analyse/ebike-kaufcheck",
  // Familie C – Technik & Elektronik
  "laptop-pc-check":         "/analyse/laptop-pc-check",
  "smartphone-check":        "/analyse/smartphone-check",
  "haushaltsgeraete-check":  "/analyse/haushaltsgeraete-check",
  // Familie C – Alltagskäufe
  "matratzen-check":         "/analyse/matratzen-check",
  "kinderwagen-check":       "/analyse/kinderwagen-check",
  "gebrauchtwaren-check":    "/analyse/gebrauchtwaren-check",
  // Familie D – Dienstleistungen & Services
  "versicherung-check":      "/analyse/versicherung-check",
  "energie-tarif-check":     "/analyse/energie-tarif-check",
  "internet-mobil-check":    "/analyse/internet-mobil-check",
  "umzug-check":             "/analyse/umzug-check",
  "hochzeit-check":          "/analyse/hochzeit-check",
  "reise-hotel-check":       "/analyse/reise-hotel-check",
  "weiterbildung-check":     "/analyse/weiterbildung-check",
  "zahnarzt-check":          "/analyse/zahnarzt-check",
  "bestattung-check":        "/analyse/bestattung-check",
  "tierarzt-check":          "/analyse/tierarzt-check",
};

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default async function AnalysePage({ params }: Props) {
  const { slug } = await params;

  // Prüfen ob Kategorie überhaupt existiert
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();

  // Wenn Tool implementiert ist, weiterleiten
  const target = IMPLEMENTED_TOOLS[slug];
  if (target) {
    redirect(target);
  }

  // Sonst: Kategorie-Detailseite (kein fertiges Tool)
  redirect(`/kategorien/${slug}`);
}
