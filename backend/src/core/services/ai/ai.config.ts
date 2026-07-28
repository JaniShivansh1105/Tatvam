import { AIConfig, ProviderName } from "./ai.types.js";

type AIFeatureName = "mentor" | "studyPlan" | "practice" | "recommendation" | "flashcard";

export const AI_PROVIDER_PRIORITY: ProviderName[] = (process.env.AI_PROVIDER_PRIORITY || "gemini,gpt,grok")
  .split(",")
  .map(p => p.trim().toLowerCase() as ProviderName);

export const AI_FEATURES: Record<AIFeatureName, AIConfig> = {
  mentor: {
    provider: (process.env.AI_PRIMARY_PROVIDER as AIConfig["provider"]) || AI_PROVIDER_PRIORITY[0] || "gemini",
    models: {
      gemini: "gemini-3.5-flash-lite",
      gpt: "gpt-4o-mini",
      grok: "grok-2-latest"
    },
    temperature: 0.7,
    maxTokens: 2048,
    retryPolicy: { maxRetries: 2, backoffMs: 1000 },
    timeoutMs: 30000,
  },
  studyPlan: {
    provider: (process.env.AI_PRIMARY_PROVIDER as AIConfig["provider"]) || AI_PROVIDER_PRIORITY[0] || "gemini",
    models: {
      gemini: "gemini-3.5-flash-lite",
      gpt: "gpt-4o",
      grok: "grok-2-latest"
    },
    temperature: 0.2,
    maxTokens: 4096,
    retryPolicy: { maxRetries: 3, backoffMs: 2000 },
    timeoutMs: 45000,
  },
  practice: {
    provider: (process.env.AI_PRIMARY_PROVIDER as AIConfig["provider"]) || AI_PROVIDER_PRIORITY[0] || "gemini",
    models: {
      gemini: "gemini-3.5-flash-lite",
      gpt: "gpt-4o",
      grok: "grok-2-latest"
    },
    temperature: 0.4,
    maxTokens: 4096,
    retryPolicy: { maxRetries: 2, backoffMs: 1500 },
    timeoutMs: 45000,
  },
  recommendation: {
    provider: (process.env.AI_PRIMARY_PROVIDER as AIConfig["provider"]) || AI_PROVIDER_PRIORITY[0] || "gemini",
    models: {
      gemini: "gemini-3.5-flash-lite",
      gpt: "gpt-4o-mini",
      grok: "grok-2-latest"
    },
    temperature: 0.3,
    maxTokens: 1024,
    retryPolicy: { maxRetries: 1, backoffMs: 500 },
    timeoutMs: 10000,
  },
  flashcard: {
    provider: (process.env.AI_PRIMARY_PROVIDER as AIConfig["provider"]) || AI_PROVIDER_PRIORITY[0] || "gemini",
    models: {
      gemini: "gemini-3.5-flash-lite",
      gpt: "gpt-4o-mini",
      grok: "grok-2-latest"
    },
    temperature: 0.3,
    maxTokens: 2048,
    retryPolicy: { maxRetries: 1, backoffMs: 1000 },
    timeoutMs: 15000,
  }
};
