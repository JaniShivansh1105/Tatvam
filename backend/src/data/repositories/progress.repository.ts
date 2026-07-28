import { IProgressRepository } from "../../domain/interfaces/repositories.interface.js";
import { prisma } from "../prisma.js";
import { Prisma } from "@prisma/client";

export class ProgressRepository implements IProgressRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  // ─── Learning DNA ────────────────────────────────────────────────────
  async getDNA(userId: string) {
    return this.prisma.learningDNA.findUnique({ where: { userId } });
  }

  async createDNA(data: Prisma.LearningDNAUncheckedCreateInput) {
    return this.prisma.learningDNA.create({ data });
  }

  async updateDNA(userId: string, data: Prisma.LearningDNAUncheckedUpdateInput) {
    return this.prisma.learningDNA.update({ where: { userId }, data });
  }

  async upsertDNA(userId: string, createData: Prisma.LearningDNAUncheckedCreateInput, updateData: Prisma.LearningDNAUncheckedUpdateInput) {
    return this.prisma.learningDNA.upsert({
      where: { userId },
      create: createData,
      update: updateData,
    });
  }

  // ─── Aggregations & Metrics ──────────────────────────────────────────
  async getConceptMasteries(userId: string, lessonId?: string) {
    return this.prisma.conceptMastery.findMany({
      where: { 
        userId,
        ...(lessonId && { lessonId }),
      },
      include: { lesson: true }
    });
  }

  async getConceptMasteryById(userId: string, lessonId: string, conceptId: string) {
    return this.prisma.conceptMastery.findUnique({
      where: { userId_lessonId_conceptId: { userId, lessonId, conceptId } },
    });
  }

  async upsertConceptMastery(
    userId: string, 
    lessonId: string, 
    conceptId: string, 
    createData: Prisma.ConceptMasteryUncheckedCreateInput, 
    updateData: Prisma.ConceptMasteryUncheckedUpdateInput
  ) {
    return this.prisma.conceptMastery.upsert({
      where: { userId_lessonId_conceptId: { userId, lessonId, conceptId } },
      create: createData,
      update: updateData,
    });
  }

  async getPracticeSets(userId: string, status?: string) {
    return this.prisma.practiceSet.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
    });
  }

  async countNotes(userId: string) {
    return this.prisma.smartNote.count({ where: { userId } });
  }

  async countFlashcards(userId: string) {
    return this.prisma.flashcard.count({ where: { userId } });
  }

  async countBookmarks(userId: string) {
    return this.prisma.bookmark.count({ where: { userId } });
  }

  async countActivities(userId: string) {
    return this.prisma.activity.count({ where: { userId } });
  }

  // ─── Activity Timeline ───────────────────────────────────────────────
  async createActivity(data: Prisma.ActivityUncheckedCreateInput) {
    return this.prisma.activity.create({ data });
  }

  async getTimeline(userId: string, lessonId?: string, take: number = 50) {
    return this.prisma.activity.findMany({
      where: {
        userId,
        ...(lessonId && { lessonId }),
      },
      orderBy: { createdAt: "desc" },
      take,
    });
  }
}
