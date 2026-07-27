import { prisma } from "./src/data/prisma.js";
import { AIOrchestrator } from "./src/core/services/ai/ai.orchestrator.js";

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user");
    console.log("Testing practice generation for user:", user.id);
    const res = await AIOrchestrator.execute("practice", user.id, { type: "mock_test", difficulty: "mixed" });
    console.log("Success:", JSON.stringify(res, null, 2));
  } catch (e) {
    console.error("Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
