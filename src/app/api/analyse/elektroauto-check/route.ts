import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneElektroauto } from "@/lib/calculations/elektroauto";
import { ELEKTROAUTO_SYSTEM_PROMPT, buildElektroautoUserMessage } from "@/lib/ai/prompts/elektroauto";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  kaufpreis: z.number().positive().max(500_000),
  reichweite: z.number().positive().max(1_000),
  akkuKapazitaet: z.number().positive().max(200),
  jahresfahrleistung: z.number().int().min(1_000).max(200_000),
  strompreisHaushalt: z.number().positive().max(100),
  strompreisOeffentlich: z.number().positive().max(200).optional(),
  ladeinfrastruktur: z.enum(["nur_oeffentlich", "wallbox_miete", "wallbox_kauf"]),
  fahrzeugTyp: z.enum(["bev", "phev"]),
  vergleichsfahrzeugKraftstoff: z.number().positive().max(30).optional(),
  kraftstoffpreis: z.number().positive().max(5).optional(),
  foerderungErhalten: z.boolean().optional(),
  fahrzeugModell: z.string().max(100).optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = InputSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneElektroauto(input);
    const userMsg = buildElektroautoUserMessage(input, berechnungen);
    const { result: ki_raw, verfuegbar } = await callKI(ELEKTROAUTO_SYSTEM_PROMPT, userMsg);
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "elektroauto-check", toolTitle: "Elektroauto-Kostencheck", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch (err) { console.error("elektroauto-check error:", err); return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
