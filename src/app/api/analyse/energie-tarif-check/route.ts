import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { ENERGIE_TARIF_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  energieArt: z.enum(["strom","gas","strom_gas"]),
  anbieter: z.string().max(100).optional(),
  jahresVerbrauch: z.number().positive().max(1_000_000).optional(),
  preisCentProKwh: z.number().positive().max(200).optional(),
  grundpreis: z.number().min(0).max(5_000).optional(),
  laufzeit: z.string().max(50).optional(),
  bonus: z.number().min(0).max(2_000).optional(),
  aktuellerAnbieter: z.string().max(100).optional(),
  aktuellerPreis: z.number().positive().max(200).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const userMsg = `Energie-Tarif-Check:\nArt: ${input.energieArt}\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.jahresVerbrauch ? `Jahresverbrauch: ${input.jahresVerbrauch} kWh\n` : ""}${input.preisCentProKwh ? `Preis: ${input.preisCentProKwh} ct/kWh\n` : ""}${input.grundpreis ? `Grundpreis: ${input.grundpreis} €/Jahr\n` : ""}${input.laufzeit ? `Laufzeit: ${input.laufzeit}\n` : ""}${input.bonus ? `Bonus: ${input.bonus} €\n` : ""}${input.aktuellerAnbieter ? `Aktuell bei: ${input.aktuellerAnbieter}, ${input.aktuellerPreis ?? ""} ct/kWh\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(ENERGIE_TARIF_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "energie-tarif-check", toolTitle: "Energie-Tarif-Check", eingabe: input as Record<string, unknown>, berechnungen: {}, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: {}, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
