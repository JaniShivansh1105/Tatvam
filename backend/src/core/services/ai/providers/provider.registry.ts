import { IEventBus } from "../../../events/event-bus.js";
import { AIProvider } from "../ai.types.js";
import { GeminiProvider } from "./gemini.provider.js";
import { GPTProvider } from "./gpt.provider.js";
import { GrokProvider } from "./grok.provider.js";

export class ProviderRegistry  {
  constructor(private readonly eventBus: IEventBus) {}
  private static providers = new Map<string, AIProvider>();

  static getProvider(name: string): AIProvider {
    if (this.providers.has(name)) {
      return this.providers.get(name)!;
    }

    let provider: AIProvider;
    switch (name) {
      case "gemini":
        provider = new GeminiProvider();
        break;
      case "gpt":
        provider = new GPTProvider();
        break;
      case "grok":
        provider = new GrokProvider();
        break;
      default:
        throw new Error(`Unknown provider: ${name}`);
    }

    this.providers.set(name, provider);
    return provider;
  }
}
