process.env.OPENAI_API_KEY = "test_key";
process.env.GROK_API_KEY = "test_key";
process.env.GEMINI_API_KEY = "test_key";

import { AIOrchestrator } from "./src/core/services/ai/ai.orchestrator.js";
import { ProviderManager } from "./src/core/services/ai/providers/provider.manager.js";
import { ProviderRegistry } from "./src/core/services/ai/providers/provider.registry.js";
import { AIErrorClassifier } from "./src/core/services/ai/ai.error-classifier.js";
import { prisma } from "./src/data/prisma.js";
import { AIService } from "./src/core/services/ai/ai.service.js";

// Override initial metrics because static init happened before env vars were set
const gptMetrics = ProviderManager.getProviderMetrics("gpt");
gptMetrics.isKeyConfigured = true;
gptMetrics.state = "Closed";

const grokMetrics = ProviderManager.getProviderMetrics("grok");
grokMetrics.isKeyConfigured = true;
grokMetrics.state = "Closed";

const geminiMetrics = ProviderManager.getProviderMetrics("gemini");
geminiMetrics.isKeyConfigured = true;
geminiMetrics.state = "Closed";

async function simulate() {
  console.log("=== Multi-Provider Simulation ===");

  // Mock Gemini throwing a 429
  const originalGemini = ProviderRegistry.getProvider("gemini");
  originalGemini.generateJSON = async () => {
    const err: any = new Error("Quota exceeded!");
    err.status = 429;
    throw err;
  };
  originalGemini.generateStream = async function* () {
    const err: any = new Error("Quota exceeded!");
    err.status = 429;
    throw err;
  }

  // Mock GPT throwing a 500
  const originalGPT = ProviderRegistry.getProvider("gpt");
  originalGPT.generateJSON = async () => {
    const err: any = new Error("Internal Server Error");
    err.status = 500;
    throw err;
  };
  originalGPT.generateStream = async function* () {
    const err: any = new Error("Internal Server Error");
    err.status = 500;
    throw err;
  }

  // Mock Grok succeeding
  const originalGrok = ProviderRegistry.getProvider("grok");
  originalGrok.generateJSON = async () => {
    return {
      success: true,
      aiInsight: {
        type: "encouragement",
        message: "You're doing great! Keep it up.",
        suggestedFocus: "Variables",
        confidence: 80
      },
      continueLearning: null,
      targetWeaknessAction: null,
      flashcardDeck: null
    };
  };
  originalGrok.generateStream = async function* () {
    yield "Hello from Grok!";
  }

  const user = await prisma.user.findFirst();
  if (!user) return console.error("No user found to test.");

  try {
    console.log("1. Triggering JSON Request (Dashboard). Expected route: Gemini (fail) -> GPT (fail) -> Grok (success)");
    await AIOrchestrator.execute("recommendation", user.id, { stats: {}, nextLesson: null });
    
    console.log("Metrics after JSON:");
    console.log("Gemini:", ProviderManager.getProviderMetrics("gemini"));
    console.log("GPT:", ProviderManager.getProviderMetrics("gpt"));
    console.log("Grok:", ProviderManager.getProviderMetrics("grok"));

    console.log("\n2. Triggering Stream Request (Mentor). Grok should be picked immediately since Gemini & GPT are Open.");
    const stream = AIService.chatStream(user.id, [{ role: "user", text: "Hello" }], {});
    for await (const chunk of stream) {
      console.log("Stream Chunk:", chunk);
    }

  } catch (e) {
    console.error("Test failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

simulate();
