import { prisma } from "../../../data/prisma.js";

export class ProgressService {
  // ─── DNA (Global to user) ────────────────────────────────────────────
  static async getDNA(userId: string) {
    let dna = await prisma.learningDNA.findUnique({ where: { userId } });
    if (!dna) {
      dna = await prisma.learningDNA.create({ data: { userId } });
    }

    // Dynamic evolution based on platform telemetry
    const masteries = await prisma.conceptMastery.findMany({ where: { userId } });
    const practiceSets = await prisma.practiceSet.findMany({ where: { userId, status: "completed" } });
    const notesCount = await prisma.smartNote.count({ where: { userId } });
    const flashcardsCount = await prisma.flashcard.count({ where: { userId } });
    const bookmarksCount = await prisma.bookmark.count({ where: { userId } });
    const activityCount = await prisma.activity.count({ where: { userId } });

    const avgMasteryConfidence = masteries.length > 0
      ? masteries.reduce((sum, m) => sum + m.confidence, 0) / masteries.length
      : dna.averageConfidence;

    const avgQuizScore = practiceSets.length > 0
      ? practiceSets.reduce((sum, p) => sum + (p.score || 0), 0) / practiceSets.length / 100
      : dna.quizAccuracy;

    // Evolve preferences smoothly
    const evolvedVisual = Math.min(1.0, Math.max(0.2, dna.visualPreference + (bookmarksCount > 0 ? 0.05 : 0)));
    const evolvedReading = Math.min(1.0, Math.max(0.2, dna.readingPreference + (notesCount > 0 ? 0.05 : 0)));
    const evolvedPace = Math.min(1.0, Math.max(0.2, 0.4 + (avgMasteryConfidence * 0.5)));
    const evolvedDetail = Math.min(1.0, Math.max(0.2, 0.5 + (flashcardsCount * 0.02)));

    const updatedDNA = await prisma.learningDNA.update({
      where: { userId },
      data: {
        visualPreference: parseFloat(evolvedVisual.toFixed(2)),
        readingPreference: parseFloat(evolvedReading.toFixed(2)),
        pacePreference: parseFloat(evolvedPace.toFixed(2)),
        detailPreference: parseFloat(evolvedDetail.toFixed(2)),
        quizAccuracy: parseFloat(avgQuizScore.toFixed(2)),
        averageConfidence: parseFloat(avgMasteryConfidence.toFixed(2)),
      },
    });

    return updatedDNA;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async updateDNA(userId: string, data: Partial<any>) {
    const existing = await this.getDNA(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const { id: _id, userId: _userId, createdAt: _createdAt, updatedAt: _updatedAt, ...merged } = { ...existing, ...data } as any;

    return prisma.learningDNA.upsert({
      where: { userId },
      update: merged,
      create: { userId, ...merged },
    });
  }

  // ─── Activity Timeline (Lesson-Scoped) ────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async logActivity(userId: string, type: string, lessonId?: string, details?: any) {
    return prisma.activity.create({
      data: {
        userId,
        lessonId,
        type,
        details: details || {},
      },
    });
  }

  static async getTimeline(userId: string, lessonId?: string) {
    return prisma.activity.findMany({
      where: {
        userId,
        ...(lessonId && { lessonId }),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  // ─── Mastery (Lesson-Scoped) ──────────────────────────────────────────
  static async getMastery(userId: string, lessonId: string) {
    return prisma.conceptMastery.findMany({
      where: { userId, lessonId },
    });
  }

  static async recordInteraction(userId: string, lessonId: string, conceptId: string, type: "mastered" | "confused" | "analogy" | "challenge") {
    const existing = await prisma.conceptMastery.findUnique({
      where: { userId_lessonId_conceptId: { userId, lessonId, conceptId } },
    });

    let newConfidence = existing ? existing.confidence : 0.5;
    let struggleCount = existing ? existing.struggleCount : 0;
    let forgettingCurve = existing ? existing.forgettingCurve : 1.0;
    let trend = existing ? existing.trend : "STABLE";

    switch (type) {
      case "mastered":
        newConfidence = Math.min(1.0, newConfidence + 0.2);
        forgettingCurve = Math.max(0.2, forgettingCurve - 0.1);
        trend = "IMPROVING";
        break;
      case "confused":
        newConfidence = Math.max(0.0, newConfidence - 0.2);
        struggleCount += 1;
        forgettingCurve = Math.min(2.0, forgettingCurve + 0.2);
        trend = "DECLINING";
        break;
      case "analogy":
        newConfidence = Math.max(0.0, newConfidence - 0.1);
        struggleCount += 1;
        trend = "DECLINING";
        break;
      case "challenge":
        newConfidence = Math.min(1.0, newConfidence + 0.1);
        trend = "IMPROVING";
        break;
    }

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + Math.round(5 / forgettingCurve));

    const mastery = await prisma.conceptMastery.upsert({
      where: { userId_lessonId_conceptId: { userId, lessonId, conceptId } },
      update: {
        confidence: newConfidence,
        struggleCount,
        forgettingCurve,
        trend,
        lastReviewedAt: new Date(),
        nextReviewAt,
      },
      create: {
        userId,
        lessonId,
        conceptId,
        confidence: newConfidence,
        struggleCount,
        forgettingCurve,
        trend,
        lastReviewedAt: new Date(),
        nextReviewAt,
      },
    });

    await this.logActivity(userId, "MASTERY_INTERACTION", lessonId, { conceptId, type });
    return mastery;
  }
}
