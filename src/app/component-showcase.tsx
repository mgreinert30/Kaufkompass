"use client";

import { Search } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/ui";

export function ComponentShowcase() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="card-base">
        <EmptyState
          icon={<Search className="h-7 w-7" />}
          title="Noch keine Analysen"
          description="Lade ein Angebot oder Dokument hoch, um deine erste Analyse zu starten."
          action={{ label: "Erste Analyse starten", onClick: () => alert("Demo") }}
        />
      </div>
      <div className="card-base">
        <ErrorState
          title="Analyse fehlgeschlagen"
          message="Die KI-Analyse konnte nicht abgeschlossen werden. Bitte versuche es erneut."
          onRetry={() => alert("Retry Demo")}
        />
      </div>
    </div>
  );
}
