export type AIProviderName = "OpenAI" | "Gemini" | "Grok";

export interface AIProvider {
  name: AIProviderName;
  generate(prompt: string): Promise<string>;
  stream(prompt: string, onToken: (token: string) => void): Promise<void>;
}

export interface AIOrchestrationRequest {
  strategy: string;
  context: string;
  userQuery: string;
}
