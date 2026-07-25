import { AIProvider, AIOrchestrationRequest, AIProviderName } from "./types";

// Mock Provider Adapters
class MockAdapter implements AIProvider {
  name: AIProviderName;

  constructor(name: AIProviderName) {
    this.name = name;
  }

  async generate(prompt: string): Promise<string> {
    return `[${this.name}] Processed: ${prompt}`;
  }

  async stream(prompt: string, onToken: (token: string) => void): Promise<void> {
    const response = `[${this.name}] Mock streaming response for prompt: ${prompt}. In production, this connects to the real LLM endpoint.`;
    const tokens = response.split(" ");
    
    for (let i = 0; i < tokens.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      onToken(tokens[i] + " ");
    }
  }
}

export class AIOrchestrator {
  private providers: Map<AIProviderName, AIProvider>;
  private activeProvider: AIProviderName = "Gemini";

  constructor() {
    this.providers = new Map();
    this.providers.set("OpenAI", new MockAdapter("OpenAI"));
    this.providers.set("Gemini", new MockAdapter("Gemini"));
    this.providers.set("Grok", new MockAdapter("Grok"));
  }

  setActiveProvider(name: AIProviderName) {
    this.activeProvider = name;
  }

  async executeStrategyStreaming(request: AIOrchestrationRequest, onToken: (token: string) => void): Promise<void> {
    const provider = this.providers.get(this.activeProvider);
    if (!provider) throw new Error("Active provider not found");

    const systemPrompt = `You are the Tatvam Intelligence Engine. 
Teaching Strategy: ${request.strategy}
Context: ${request.context}
Query: ${request.userQuery}`;

    await provider.stream(systemPrompt, onToken);
  }
}

export const orchestrator = new AIOrchestrator();
