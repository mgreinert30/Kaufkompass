import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { INTERNET_MOBIL_PROMPT } from "@/lib/ai/prompts/familie-d";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  tarifArt: z.enum(["internet","mobil","kombitarif"]),
  anbieter: z.string().max(100).optional(),
  monatspreis: z.number().positive().max(500).optional(),
  laufzeit: z.number().int().min(1).max(36).optional(),
  downloadGescwindigkeit: z.number().positive().max(10_000).optional(),
  datenvolumen: z.string().max(50).optional(),
  aktionspreisMonat: z.number().int().min(0).max(36).optional(),
  normalpreis: z.number().positive().max(500).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const laufzeit = input.laufzeit ?? 24;
    const gesamt = input.monatspreis ? input.monatspreis * laufzeit : 0;
    const userMsg = `Internet/Mobil-Tarif-Check:\nArt: ${input.tarifArt}\n${input.anbieter ? `Anbieter: ${input.anbieter}\n` : ""}${input.monatspreis ? `Monatspreis: ${input.monatspreis} €\n` : ""}Laufzeit: ${laufzeit} Monate\nGesamtkosten: ${gesamt} €\n${input.downloadGescwindigkeit ? `Download: ${input.downloadGescwindigkeit} Mbit/s\n` : ""}${input.datenvolumen ? `Datenvolumen: ${input.datenvolumen}\n` : ""}${input.aktionspreisMonat ? `Aktionspreis für ${input.aktionspreisMonat} Monate, dann ${input.normalpreis ?? "?"} €\n` : ""}${input.zusatzAngaben ? `Zusatz: ${input.zusatzAngaben}` : ""}`;
    const { result: ki_raw, verfuegbar } = await callKI(INTERNET_MOBIL_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "internet-mobil-check", toolTitle: "Internet- & Mobil-Check", eingabe: input as Record<string, unknown>, berechnungen: { gesamtkostenLaufzeit: gesamt }, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: { gesamtkostenLaufzeit: gesamt }, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
