import { redirect, notFound } from "next/navigation";
import { CATEGORIES, getCategoryBySlug } from "@/config/categories";

// Diese Seite leitet zu den implementierten Tool-Seiten weiter
// oder zeigt einen "noch nicht verfügbar" Hinweis

interface Props {
  params: Promise<{ slug: string }>;
}

// Mapping: Welche Slugs haben eine vollständige Implementierung?
const IMPLEMENTED_TOOLS: Record<string, string> = {
  "immobilien-kaufcheck": "/analyse/immobilien-kaufcheck",
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
