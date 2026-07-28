import { IPlansRepository } from "../../domain/interfaces/repositories.interface.js";
import { prisma } from "../prisma.js";
import { Prisma } from "@prisma/client";

export class PlansRepository implements IPlansRepository {
  constructor(private readonly prisma: any = require("../../data/prisma.js").prisma) {}
  async getPlans(userId: string) {
    return this.prisma.studyPlan.findMany({
      where: { userId },
      include: {
        tasks: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { startDate: "desc" }
    });
  }

  async getTaskById(taskId: string) {
    return this.prisma.planTask.findUnique({
      where: { id: taskId },
      include: { plan: true }
    });
  }

  async createPlan(data: Prisma.StudyPlanUncheckedCreateInput, tasksData: any[]) {
    return this.prisma.studyPlan.create({
      data: {
        ...data,
        tasks: {
          create: tasksData
        }
      },
      include: { tasks: true }
    });
  }

  async updateTask(taskId: string, status: string) {
    return this.prisma.planTask.update({
      where: { id: taskId },
      data: { 
        status,
        completedAt: status === "completed" ? new Date() : null
      },
      include: { plan: { include: { tasks: true } } }
    });
  }

  async updatePlanProgress(planId: string, progress: number) {
    return this.prisma.studyPlan.update({
      where: { id: planId },
      data: { progress }
    });
  }
}
