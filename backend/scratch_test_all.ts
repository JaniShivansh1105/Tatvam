import { prisma } from "./src/data/prisma.js";
import { AIService } from "./src/core/services/ai/ai.service.js";

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");
    const userId = user.id;

    console.log("=== 1. Testing AI Mentor (generateStream) ===");
    try {
      const messages = [{ role: "user", text: "Explain quantum computing in one sentence." }];
      const context = {};
      const stream = AIService.chatStream(userId, messages, context);
      let mentorResponse = "";
      for await (const chunk of stream) {
        mentorResponse += chunk;
      }
      console.log("✅ Mentor SUCCESS:", mentorResponse);
    } catch(e: any) {
      console.log("❌ Mentor FAILED:", e.message);
    }

    console.log("\n=== 2. Testing Practice Generation (generateJSON) ===");
    try {
      const practice = await AIService.generatePracticeQuestions(userId, null, "practice", "easy");
      console.log("✅ Practice SUCCESS:", JSON.stringify(practice).substring(0, 100) + "...");
    } catch(e: any) {
      console.log("❌ Practice FAILED:", e.message);
    }

    console.log("\n=== 3. Testing Study Plans (generateJSON) ===");
    try {
      const plan = await AIService.generateStudyPlanTasks(userId, "weekly");
      console.log("✅ Study Plan SUCCESS:", JSON.stringify(plan).substring(0, 100) + "...");
    } catch(e: any) {
      console.log("❌ Study Plan FAILED:", e.message);
    }

    console.log("\n=== 4. Testing Dashboard AI ===");
    try {
      const dashboard = await AIService.generateDashboardRecommendations(userId, { learningTime: 10, completedLessons: 1, accuracy: 80, currentStreak: 3 }, null);
      console.log("✅ Dashboard SUCCESS:", JSON.stringify(dashboard).substring(0, 100) + "...");
    } catch(e: any) {
      console.log("❌ Dashboard FAILED:", e.message);
    }

  } catch (e) {
    console.error("Test framework error", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
