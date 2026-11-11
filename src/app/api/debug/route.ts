import { NextResponse } from "next/server";
import { callAI } from "@/lib/ai/provider";

export async function GET() {
  const geminiSet = Boolean(process.env.GEMINI_API_KEY);
  const anthropicSet = Boolean(process.env.ANTHROPIC_API_KEY);

  let testResult = "nicht getestet";
  let errorMsg = "";

  if (geminiSet || anthropicSet) {
    try {
      const res = await callAI({
        systemPrompt: "Antworte nur mit: OK",
        userMessage: "Ping",
        maxTokens: 10,
      });
      testResult = `Erfolg: "${res.content.slice(0, 50)}"`;
    } catch (err) {
      testResult = "Fehler";
      errorMsg = String(err);
    }
  }

  return NextResponse.json({
    gemini_key_set: geminiSet,
    anthropic_key_set: anthropicSet,
    test: testResult,
    error: errorMsg || undefined,
  });
}
