import { getLessonUseCase, getDashboardUseCase, getRoadmapUseCase, getAchievementsUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { GetLessonUseCase, GetDashboardUseCase, GetRoadmapUseCase, GetAchievementsUseCase } from "../../../application/content/content.use-cases.js";
import { sendSuccess } from "../../../utils/api-response.js";

export class ContentController {
  constructor() {}
  async getLessonBySlug(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const lesson = await getLessonUseCase.execute(slug);
    return sendSuccess({ res, data: { lesson } });
  }

  async getDashboardContent(req: Request, res: Response) {
    const userId = req.user!.userId;
    const content = await getDashboardUseCase.execute(userId);
    return sendSuccess({ res, data: content });
  }

  async getRoadmap(req: Request, res: Response) {
    const userId = req.user!.userId;
    const roadmap = await getRoadmapUseCase.execute(userId);
    return sendSuccess({ res, data: roadmap });
  }

  async getAchievements(req: Request, res: Response) {
    const userId = req.user!.userId;
    const achievements = await getAchievementsUseCase.execute(userId);
    return sendSuccess({ res, data: achievements });
  }
}
