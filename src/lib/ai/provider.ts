// KI-Provider-Abstraktion
// Primär: Gemini (GEMINI_API_KEY)
// Fallback: Claude (ANTHROPIC_API_KEY)
// Ohne Keys: Berechnungen laufen weiter, KI-Interpretation entfällt

import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import type { AIRequestOptions, AIResponse } from "./types";

let geminiClient: GoogleGenerativeAI | null = null;
let anthropicClient: Anthropic | null = null;

function getGemini(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!geminiClient) geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return geminiClient;
}

function getAnthropic(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!anthropicClient) anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropicClient;
}

export function isAIAvailable(): boolean {
  return Boolean(process.env.GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY);
}

const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite"];

export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  // Primär: Gemini (versucht mehrere Modelle bei 503/404)
  const gemini = getGemini();
  if (gemini) {
    let lastError: unknown;
    for (const modelName of GEMINI_MODELS) {
      try {
        const model = gemini.getGenerativeModel({
          model: modelName,
          systemInstruction: options.systemPrompt,
        });
        const result = await model.generateContent(options.userMessage);
        const text = result.response.text();
        return {
          content: text,
          usage: {
            inputTokens:  result.response.usageMetadata?.promptTokenCount     ?? 0,
            outputTokens: result.response.usageMetadata?.candidatesTokenCount ?? 0,
          },
        };
      } catch (err) {
        const msg = String(err);
        // Bei 503 (Überlast) oder 404 (Modell nicht verfügbar): nächstes Modell versuchen
        if (msg.includes("503") || msg.includes("404")) {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    // Alle Gemini-Modelle fehlgeschlagen – zu Claude weitergehen
    console.error("Alle Gemini-Modelle fehlgeschlagen:", lastError);
  }

  // Fallback: Claude
  const anthropic = getAnthropic();
  if (anthropic) {
    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: options.maxTokens ?? 4000,
      system: options.systemPrompt,
      messages: [{ role: "user", content: options.userMessage }],
    });
    const block = msg.content[0];
    if (block.type !== "text") throw new Error("Unerwarteter Antworttyp vom KI-Modell");
    return {
      content: block.text,
      usage: { inputTokens: msg.usage.input_tokens, outputTokens: msg.usage.output_tokens },
    };
  }

  throw new Error("Keine KI konfiguriert – GEMINI_API_KEY oder ANTHROPIC_API_KEY fehlt");
}

export function extractJSON<T>(text: string): T {
  const m = text.match(/```json\n?([\s\S]*?)\n?```/) ?? text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("Kein JSON in KI-Antwort gefunden");
  return JSON.parse(m[1] ?? m[0]) as T;
}
