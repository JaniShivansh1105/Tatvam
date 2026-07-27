import { prisma } from "../../../data/prisma.js";
import { AIContext } from "./ai.types.js";

export class AIContextBuilder {
  static async buildContext(userId: string, lessonId?: string | null): Promise<AIContext> {
    const context: AIContext = {};

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preference: true, profile: true }
    });

    if (user?.preference) {
      context.preferences = user.preference;
    }

    const dna = await prisma.learningDNA.findUnique({ where: { userId } });
    if (dna) context.learningDNA = dna;

    const masteries = await prisma.conceptMastery.findMany({
      where: { userId },
      include: { lesson: true }
    });
    if (masteries.length > 0) context.conceptMastery = masteries;

    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { topics: true }
      });
      if (lesson) context.lesson = lesson;
    }

    const activePlan = await prisma.studyPlan.findFirst({
      where: { userId, progress: { lt: 100 } },
      orderBy: { startDate: "desc" },
    });
    if (activePlan) context.activePlan = activePlan;

    return context;
  }
}
