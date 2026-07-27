import { AI_FEATURES } from "./ai.config.js";
import { ProviderRegistry } from "./providers/provider.registry.js";
import { ProviderManager } from "./providers/provider.manager.js";
import { AIProvider, AIConfig, AIUnavailableError, ProviderName } from "./ai.types.js";

export class AIRouter {
  static async getProviderForFeature(feature: keyof typeof AI_FEATURES): Promise<{ provider: AIProvider, config: AIConfig, name: ProviderName }> {
    const config = AI_FEATURES[feature];
    
    // Ask ProviderManager for the ordered list of healthy available providers
    const availableProviders = ProviderManager.getAvailableProviders(config);

    if (availableProviders.length === 0) {
      throw new AIUnavailableError(`All AI providers are currently unavailable or exhausted.`);
    }

    // Try the first available healthy provider. Orchestrator handles the loop.
    const selectedProviderName = availableProviders[0];
    const provider = ProviderRegistry.getProvider(selectedProviderName);

    return { provider, config, name: selectedProviderName };
  }
}
