import { IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { prisma } from "../prisma.js";
import { Prisma } from "@prisma/client";

export class PracticeRepository implements IPracticeRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  async getPracticeSets(userId: string) {
    return this.prisma.practiceSet.findMany({
      where: { userId },
      include: {
        questions: true
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async createPracticeSet(data: Prisma.PracticeSetUncheckedCreateInput, questionsData: any[]) {
    return this.prisma.practiceSet.create({
      data: {
        ...data,
        questions: {
          create: questionsData
        }
      },
      include: { questions: true }
    });
  }

  async getQuestionById(id: string) {
    return this.prisma.question.findUnique({ where: { id } });
  }

  async updateQuestion(id: string, data: Prisma.QuestionUncheckedUpdateInput) {
    return this.prisma.question.update({
      where: { id },
      data
    });
  }

  async getPracticeSetById(id: string) {
    return this.prisma.practiceSet.findUnique({
      where: { id },
      include: { questions: true }
    });
  }

  async updatePracticeSet(id: string, data: Prisma.PracticeSetUncheckedUpdateInput) {
    return this.prisma.practiceSet.update({
      where: { id },
      data
    });
  }
}
