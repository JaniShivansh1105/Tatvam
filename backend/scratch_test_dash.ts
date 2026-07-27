import { prisma } from "./src/data/prisma.js";
import { AIService } from "./src/core/services/ai/ai.service.js";

async function test() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error("No user found");
    const userId = user.id;

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
