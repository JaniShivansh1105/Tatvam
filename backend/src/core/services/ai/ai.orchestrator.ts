import { IEventBus } from "../../events/event-bus.js";
import { AIContextBuilder } from "./ai.context-builder.js";

import { AIUnavailableError } from "./ai.types.js";
import { AILogger } from "./ai.logger.js";
import { AICacheService } from "./ai.cache.js";
import { AI_FEATURES } from "./ai.config.js";
import { z } from "zod";
import * as StudyPlanPrompts from "./prompts/study-plan/v1/index.js";
import * as PracticePrompts from "./prompts/practice/v1/index.js";
import * as RecommendationPrompts from "./prompts/recommendation/v1/index.js";
import { StudyPlanSchema, PracticeSetSchema, RecommendationSchema } from "./schemas/ai.schemas.js";

export class AIOrchestrator {
  constructor(private readonly eventBus: IEventBus) {}

  async execute(feature: keyof typeof AI_FEATURES, userId: string, params: any) {
    const requestId = AILogger.generateRequestId();
    const startTime = Date.now();
    let fallbackTriggered = false;

    // 1. Build Context (lazy import to avoid circular dependency)
    const { aiContextBuilder } = await import("../../../di/container.js");
    const context = await aiContextBuilder.buildContext(userId, params.lessonId);

    // 2. Check Cache
    const cacheKey = JSON.stringify({ context, params });
    const cachedResponse = AICacheService.get(feature, cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 3. Assemble Prompt
    let promptText = "";
    let schema: z.ZodTypeAny;
    let ttlMs = 0;

    switch (feature) {
      case "studyPlan":
        promptText = [
          StudyPlanPrompts.getSystemPrompt(),
          StudyPlanPrompts.buildContextPrompt(context, params.type, params.lessons),
          StudyPlanPrompts.getRulesPrompt()
        ].join("\n\n");
        schema = StudyPlanSchema;
        ttlMs = 3600000; // 1 hr
        break;
      case "practice":
        promptText = [
          PracticePrompts.getSystemPrompt(),
          PracticePrompts.buildContextPrompt(context, params.type, params.difficulty),
          PracticePrompts.getRulesPrompt()
        ].join("\n\n");
        schema = PracticeSetSchema;
        ttlMs = 86400000; // 24 hr
        break;
      case "recommendation":
        promptText = [
          RecommendationPrompts.getSystemPrompt(),
          RecommendationPrompts.buildContextPrompt(context, params.stats, params.nextLesson),
          RecommendationPrompts.getRulesPrompt()
        ].join("\n\n");
        schema = RecommendationSchema;
        ttlMs = 900000; // 15 mins
        break;
      default:
        throw new Error(`Unsupported feature for Orchestrator: ${feature}`);
    }

    // Apply Global Multilingual Foundation
    const { AIPromptBuilder } = await import("./prompt-builder.js");
    promptText = AIPromptBuilder.build(promptText, context);

    // 4. Router & Provider Execution
    let rawResponse: any;
    let validationResult: "success" | "failure" = "failure";
    let finalProviderName = "";
    
    const availableProviders = (await import("./providers/provider.manager.js")).ProviderManager.getAvailableProviders(AI_FEATURES[feature]);
    
    if (availableProviders.length === 0) {
      throw new AIUnavailableError("All AI providers are currently unavailable or exhausted.");
    }

    let success = false;
    let lastError: Error | null = null;
    const providerManager = (await import("./providers/provider.manager.js")).ProviderManager;
    const { ProviderRegistry } = (await import("./providers/provider.registry.js"));
    const { AIErrorClassifier } = (await import("./ai.error-classifier.js"));

    for (const providerName of availableProviders) {
      finalProviderName = providerName;
      const config = AI_FEATURES[feature];
      const provider = ProviderRegistry.getProvider(providerName);
      
      try {
        const providerStartTime = Date.now();
        rawResponse = await provider.generateJSON(promptText, config);
        
        providerManager.reportSuccess(providerName, Date.now() - providerStartTime);
        success = true;
        break;
      } catch (e: any) {
        lastError = e;
        const classification = AIErrorClassifier.classify(e, providerName);
        console.error(`[AI_ORCHESTRATOR] Provider ${providerName} failed with ${classification} for ${requestId}:`, e.message);
        
        providerManager.reportFailure(providerName, classification);
        fallbackTriggered = true;
      }
    }

    if (!success) {
      throw new AIUnavailableError(`All AI providers failed. Last error: ${lastError?.message}`);
    }

    // 5. Validation
    const parsed = schema.safeParse(rawResponse);
    if (!parsed.success) {
      AILogger.logError(requestId, parsed.error);
      throw new Error(`AI generated invalid response structure for ${feature}`);
    }
    validationResult = "success";

    // 6. Cache & Log
    AICacheService.set(feature, cacheKey, parsed.data, ttlMs);
    
    const latencyMs = Date.now() - startTime;
    AILogger.logRequestEnd({
      requestId,
      feature,
      provider: finalProviderName,
      model: AI_FEATURES[feature].models[finalProviderName as "gemini"|"gpt"|"grok"],
      latencyMs,
      retries: fallbackTriggered ? 1 : 0,
      fallbackUsage: fallbackTriggered,
      validationResult
    });

    return parsed.data;
  }
}
