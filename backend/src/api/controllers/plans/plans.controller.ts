import { Request, Response } from "express";
import { prisma } from "../../../data/prisma.js";
import { AIService } from "../../../core/services/ai/ai.service.js";
import { AIUnavailableError } from "../../../core/services/ai/ai.types.js";

export class PlansController {
  static async getPlans(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const plans = await prisma.studyPlan.findMany({
        where: { userId },
        include: {
          tasks: {
            orderBy: { createdAt: "asc" }
          }
        },
        orderBy: { startDate: "desc" }
      });
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch study plans" });
    }
  }

  static async createPlan(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { title, type } = req.body;
    try {
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + (type === "weekly" ? 7 : 1));

      const generatedTasks = await AIService.generateStudyPlanTasks(userId, type || "weekly");

      const plan = await prisma.studyPlan.create({
        data: {
          userId,
          title: title || `${type === "weekly" ? "Weekly" : "Daily"} Plan`,
          type: type || "weekly",
          startDate: now,
          endDate: endDate,
          tasks: {
            create: generatedTasks.map((t: any) => ({
              title: t.title,
              lessonId: t.lessonId
            }))
          }
        },
        include: { tasks: true }
      });
      res.json({ success: true, data: plan });
    } catch (error) {
      if (error instanceof AIUnavailableError) {
        return res.status(503).json({ success: false, error: "AI services are currently unavailable." });
      }
      res.status(500).json({ success: false, error: "Failed to create plan" });
    }
  }

  static async updateTaskStatus(req: Request, res: Response) {
    const taskId = req.params.taskId as string;
    const { status } = req.body;
    try {
      const task = await prisma.planTask.update({
        where: { id: taskId },
        data: { 
          status,
          completedAt: status === "completed" ? new Date() : null
        },
        include: { plan: { include: { tasks: true } } }
      });

      // Update plan progress
      const planTasks = (task as any).plan.tasks;
      const completed = planTasks.filter((t: any) => t.status === "completed").length;
      const progress = planTasks.length > 0 ? (completed / planTasks.length) * 100 : 0;

      await prisma.studyPlan.update({
        where: { id: task.planId },
        data: { progress }
      });

      res.json({ success: true, data: { taskId, status, progress } });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update task" });
    }
  }
}
