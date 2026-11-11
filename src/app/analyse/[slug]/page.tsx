import { redirect, notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/config/categories";

// Diese Seite leitet zu den implementierten Tool-Seiten weiter
// oder zeigt einen "noch nicht verfügbar" Hinweis

interface Props {
  params: Promise<{ slug: string }>;
}

// Mapping: Welche Slugs haben eine vollständige Implementierung?
const IMPLEMENTED_TOOLS: Record<string, string> = {
  "immobilien-kaufcheck":    "/analyse/immobilien-kaufcheck",
  "gebrauchtwagen-check":    "/analyse/gebrauchtwagen-check",
  "photovoltaik-check":      "/analyse/photovoltaik-check",
  "sanierungskosten-check":  "/analyse/sanierungskosten-check",
  "waermepumpen-check":      "/analyse/waermepumpen-check",
  "kuechen-kaufcheck":       "/analyse/kuechen-kaufcheck",
  "fenster-dach-check":      "/analyse/fenster-dach-check",
  "bad-renovierung-check":   "/analyse/bad-renovierung-check",
  "moebel-kaufcheck":        "/analyse/moebel-kaufcheck",
  "autoreparatur-check":     "/analyse/autoreparatur-check",
  "auto-leasing-check":      "/analyse/auto-leasing-check",
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
