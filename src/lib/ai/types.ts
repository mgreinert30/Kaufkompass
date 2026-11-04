export interface AIRequestOptions {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  usage: { inputTokens: number; outputTokens: number };
}

export interface AIError {
  code: "no_api_key" | "api_error" | "parse_error" | "timeout";
  message: string;
}
