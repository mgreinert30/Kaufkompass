// KI-Provider-Abstraktion
// Einzige Stelle im Projekt, die den Anthropic-Client instanziiert.
// API-Schlüssel ausschließlich aus Umgebungsvariable ANTHROPIC_API_KEY.

import Anthropic from "@anthropic-ai/sdk";
import type { AIRequestOptions, AIResponse } from "./types";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY nicht konfiguriert");
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export async function callAI(options: AIRequestOptions): Promise<AIResponse> {
  const c = getClient();

  const message = await c.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: options.maxTokens ?? 4000,
    system: options.systemPrompt,
    messages: [{ role: "user", content: options.userMessage }],
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unerwarteter Antworttyp vom KI-Modell");

  return {
    content: block.text,
    usage: {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    },
  };
}

export function isAIAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// Versucht, JSON aus einer KI-Antwort zu extrahieren (robuste Variante)
export function extractJSON<T>(text: string): T {
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ??
                    text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Kein JSON in KI-Antwort gefunden");
  const raw = jsonMatch[1] ?? jsonMatch[0];
  return JSON.parse(raw) as T;
}
