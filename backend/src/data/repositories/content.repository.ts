import { prisma } from "../prisma.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { Prisma } from "@prisma/client";

export class ContentRepository implements IContentRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  // ─── Lessons & Subjects ───────────────────────────────────────────────
  async countLessons() {
    return this.prisma.lesson.count();
  }

  async findSubjectBySlug(slug: string) {
    return this.prisma.subject.findFirst({ where: { slug } });
  }

  async createSubject(data: Prisma.SubjectUncheckedCreateInput) {
    return this.prisma.subject.create({ data });
  }

  async getLessonBySlug(slug: string) {
    return this.prisma.lesson.findFirst({
      where: { slug },
      include: {
        subject: true,
        topics: {
          orderBy: { order: "asc" },
          include: {
            sections: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  async getLessonById(id: string) {
    return this.prisma.lesson.findUnique({
      where: { id },
      include: { topics: true }
    });
  }

  async getFirstLesson() {
    return this.prisma.lesson.findFirst({
      orderBy: { order: "asc" },
      include: {
        subject: true,
        topics: { orderBy: { order: "asc" }, include: { sections: true } },
      },
    });
  }

  async getAllLessonsForRoadmap() {
    return this.prisma.lesson.findMany({
      orderBy: { order: "asc" },
      include: {
        subject: true,
        topics: true,
      },
    });
  }

  async createLesson(data: Prisma.LessonUncheckedCreateInput) {
    return this.prisma.lesson.create({ data });
  }

  // ─── Study Plans ──────────────────────────────────────────────────────
  async getActiveStudyPlan(userId: string) {
    return this.prisma.studyPlan.findFirst({
      where: { userId, progress: { lt: 100 } },
      orderBy: { startDate: "desc" },
    });
  }

  async countActivePlans(userId: string) {
    return this.prisma.studyPlan.count({
      where: { userId, progress: { gt: 0 } }
    });
  }

  // ─── Study Sessions ───────────────────────────────────────────────────
  async getCompletedStudySessions(userId: string) {
    return this.prisma.studySession.findMany({
      where: { userId, endTime: { not: null } },
    });
  }

  // ─── Masteries & Practice Sets (Cross-domain for dashboards) ────────
  async getMasteryIds(userId: string, minConfidence: number = 0.8) {
    return this.prisma.conceptMastery.findMany({
      where: { userId, confidence: { gte: minConfidence } },
      select: { lessonId: true },
    });
  }

  async countMasteries(userId: string, minConfidence: number = 0.8) {
    return this.prisma.conceptMastery.count({
      where: { userId, confidence: { gte: minConfidence } }
    });
  }

  async getCompletedPracticeSets(userId: string) {
    return this.prisma.practiceSet.findMany({
      where: { userId, status: "completed" },
    });
  }
}
