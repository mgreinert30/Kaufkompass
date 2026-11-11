import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { berechneLaptop } from "@/lib/calculations/laptop";
import { LAPTOP_SYSTEM_PROMPT, buildLaptopUserMessage } from "@/lib/ai/prompts/laptop";
import { callKI } from "@/lib/ai/provider";
import { saveAnalyse } from "@/lib/storage/analysis-store";

const InputSchema = z.object({
  geraetTyp: z.enum(["laptop_einsteiger","laptop_mittelklasse","laptop_profi","desktop_pc","gaming_pc","macbook"]),
  verwendungszweck: z.enum(["buero_web","homeoffice","kreativ_foto_video","gaming","programmierung","schulstudium"]),
  angebotspreis: z.number().positive().max(10_000),
  hersteller: z.string().max(100).optional(), modell: z.string().max(100).optional(),
  prozessor: z.string().max(100).optional(), ramGb: z.number().int().min(1).max(256).optional(),
  speicherGb: z.number().int().min(16).max(8_000).optional(),
  betriebssystem: z.string().max(50).optional(),
  garantieJahre: z.number().int().min(0).max(5).optional(),
  refurbished: z.boolean().optional(),
  zusatzAngaben: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = InputSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, error: "Ungültige Eingabe" }, { status: 400 });
    const input = parsed.data;
    const berechnungen = berechneLaptop(input);
    const { result: ki_raw, verfuegbar } = await callKI(LAPTOP_SYSTEM_PROMPT, buildLaptopUserMessage(input, berechnungen));
    let ki_analyse: Record<string, unknown> | null = null;
    if (verfuegbar && ki_raw) { try { ki_analyse = JSON.parse(ki_raw) as Record<string, unknown>; } catch { ki_analyse = null; } }
    const analysisId = saveAnalyse({ toolSlug: "laptop-pc-check", toolTitle: "Laptop- und PC-Check", eingabe: input as Record<string, unknown>, berechnungen: berechnungen as unknown as Record<string, unknown>, ki_analyse, ki_verfuegbar: verfuegbar });
    return NextResponse.json({ success: true, analysisId, result: { calculations: berechnungen, ki_analyse, ki_verfuegbar: verfuegbar } });
  } catch { return NextResponse.json({ success: false, error: "Interner Fehler" }, { status: 500 }); }
}
