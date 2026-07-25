import { Request, Response } from "express";
import { ContentService } from "../../../core/services/content/content.service.js";
import { sendSuccess } from "../../../utils/api-response.js";

export class ContentController {
  static async getLessonBySlug(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const lesson = await ContentService.getLessonBySlug(slug);
    return sendSuccess({ res, data: { lesson } });
  }

  static async getDashboardContent(req: Request, res: Response) {
    const userId = req.user!.userId;
    const content = await ContentService.getDashboardContent(userId);
    return sendSuccess({ res, data: content });
  }

  static async getRoadmap(req: Request, res: Response) {
    const userId = req.user!.userId;
    const roadmap = await ContentService.getRoadmap(userId);
    return sendSuccess({ res, data: roadmap });
  }

  static async getAchievements(req: Request, res: Response) {
    const userId = req.user!.userId;
    const achievements = await ContentService.getAchievements(userId);
    return sendSuccess({ res, data: achievements });
  }
}
