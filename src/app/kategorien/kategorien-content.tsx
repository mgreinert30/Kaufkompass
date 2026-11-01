"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { InputComponent } from "@/components/ui/input-component";
import { StatusBadge } from "@/components/ui/status-badge";
import { CategoryCardHome } from "@/components/homepage/category-card-home";
import { CATEGORIES, CATEGORY_FAMILIES, STATUS_LABELS, STATUS_BADGE_VARIANT } from "@/config/categories";
import type { CategoryFamily, CategoryStatus } from "@/config/categories";

const ALL_FAMILIES = ["Alle", "A", "B", "C", "D"] as const;
const ALL_STATUSES: Array<CategoryStatus | "all"> = ["all", "available", "demo", "development", "planned"];

export function KategorienContent() {
  const [search, setSearch] = React.useState("");
  const [family, setFamily] = React.useState<"Alle" | CategoryFamily>("Alle");
  const [status, setStatus] = React.useState<CategoryStatus | "all">("all");

  const filtered = CATEGORIES.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    const matchFamily = family === "Alle" || c.family === family;
    const matchStatus = status === "all" || c.status === status;
    return matchSearch && matchFamily && matchStatus;
  });

  return (
    <section className="section-padding">
      <div className="container-page">
        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-end">
          <div className="flex-1 max-w-xs">
            <InputComponent
              label=""
              placeholder="Kategorie suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_FAMILIES.map((f) => (
              <button
                key={f}
                onClick={() => setFamily(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  family === f
                    ? "bg-blue-700 text-white"
                    : "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]"
                }`}
              >
                {f === "Alle" ? "Alle Familien" : `Familie ${f}: ${CATEGORY_FAMILIES[f].label}`}
              </button>
            ))}
          </div>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {ALL_STATUSES.map((s) => {
            const variant = s === "all" ? "outline" : (STATUS_BADGE_VARIANT[s] as "success" | "primary" | "warning" | "outline");
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full ${status === s ? "ring-2 ring-offset-1 ring-blue-500" : ""}`}
              >
                <StatusBadge variant={variant} className="cursor-pointer">
                  {s === "all" ? "Alle Status" : STATUS_LABELS[s]}
                </StatusBadge>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <p className="text-sm text-[var(--muted-foreground)] mb-5">
          {filtered.length} {filtered.length === 1 ? "Kategorie" : "Kategorien"} gefunden
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((cat) => (
              <CategoryCardHome key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-10 w-10 text-[var(--muted-foreground)] mb-4" aria-hidden="true" />
            <p className="font-semibold text-[var(--foreground)] mb-1">Keine Treffer</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Passe die Filter an oder suche nach einem anderen Begriff.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
