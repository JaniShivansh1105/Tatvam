import { getDNAUseCase, updateDNAUseCase, getMasteryUseCase, recordInteractionUseCase, getTimelineUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { GetDNAUseCase, UpdateDNAUseCase, GetMasteryUseCase, RecordInteractionUseCase, GetTimelineUseCase } from "../../../application/progress/progress.use-cases.js";
import { sendSuccess } from "../../../utils/api-response.js";

export class ProgressController {
  constructor() {}
  // ─── DNA (Global) ────────────────────────────────────────────────────
  async getDNA(req: Request, res: Response) {
    const userId = req.user!.userId;
    const dna = await getDNAUseCase.execute(userId);
    return sendSuccess({ res, data: { dna } });
  }

  async updateDNA(req: Request, res: Response) {
    const userId = req.user!.userId;
    const dna = await updateDNAUseCase.execute(userId, req.body);
    return sendSuccess({ res, data: { dna } });
  }

  // ─── Mastery (Lesson-Scoped) ─────────────────────────────────────────
  async getMastery(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const mastery = await getMasteryUseCase.execute(userId, lessonId);
    return sendSuccess({ res, data: { mastery } });
  }

  async recordInteraction(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.params.lessonId as string;
    const { conceptId, type } = req.body;
    const mastery = await recordInteractionUseCase.execute(userId, lessonId, conceptId, type);
    return sendSuccess({ res, data: { mastery } });
  }

  // ─── Timeline ────────────────────────────────────────────────────────
  async getTimeline(req: Request, res: Response) {
    const userId = req.user!.userId;
    const lessonId = req.query.lessonId as string | undefined;
    const timeline = await getTimelineUseCase.execute(userId, lessonId);
    return sendSuccess({ res, data: { timeline } });
  }
}
