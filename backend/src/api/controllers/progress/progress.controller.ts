import { Request, Response } from "express";
import { ProgressService } from "../../../core/services/progress/progress.service.js";
import { sendSuccess } from "../../../utils/api-response.js";

export class ProgressController {
  // ─── DNA (Global) ────────────────────────────────────────────────────
  static async getDNA(req: Request, res: Response) {
    const userId = req.user!.userId;
    const dna = await ProgressService.getDNA(userId);
    return sendSuccess({ res, data: { dna } });
  }

  static async updateDNA(req: Request, res: Response) {
    const userId = req.user!.userId;
    const dna = await ProgressService.updateDNA(userId, req.body);
    return sendSuccess({ res, data: { dna } });
  }

  // ─── Mastery (Lesson-Scoped) ─────────────────────────────────────────
  static async getMastery(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const mastery = await ProgressService.getMastery(userId, lessonId);
    return sendSuccess({ res, data: { mastery } });
  }

  static async recordInteraction(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const { conceptId, type } = req.body;
    const mastery = await ProgressService.recordInteraction(userId, lessonId, conceptId, type);
    return sendSuccess({ res, data: { mastery } });
  }

  // ─── Timeline ────────────────────────────────────────────────────────
  static async getTimeline(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.query.lessonId as string | undefined;
    const timeline = await ProgressService.getTimeline(userId, lessonId);
    return sendSuccess({ res, data: { timeline } });
  }
}
