import { getPlansUseCase, createPlanUseCase, updateTaskStatusUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { GetPlansUseCase, CreatePlanUseCase, UpdateTaskStatusUseCase } from "../../../application/plans/plans.use-cases.js";
import { AIUnavailableError } from "../../../core/services/ai/ai.types.js";

export class PlansController {
  async getPlans(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const plans = await getPlansUseCase.execute(userId);
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch study plans" });
    }
  }

  async createPlan(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { title, type } = req.body;
    try {
      const plan = await createPlanUseCase.execute(userId, title, type);
      res.json({ success: true, data: plan });
    } catch (error) {
      console.error("Create plan failed:", error);
      if (error instanceof AIUnavailableError) {
        return res.status(503).json({ success: false, error: "AI services are currently unavailable." });
      }
      res.status(500).json({ success: false, error: "Failed to create plan" });
    }
  }

  async updateTaskStatus(req: Request, res: Response) {
    const userId = req.user!.userId;
    const taskId = req.params.taskId as string;
    const { status } = req.body;
    try {
      const result = await updateTaskStatusUseCase.execute(userId, taskId, status);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update task" });
    }
  }
}
