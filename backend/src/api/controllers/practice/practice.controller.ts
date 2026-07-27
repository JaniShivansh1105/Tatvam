import { getPracticeSetsUseCase, generatePracticeSetUseCase, submitAnswerUseCase, completePracticeSetUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { GetPracticeSetsUseCase, GeneratePracticeSetUseCase, SubmitAnswerUseCase, CompletePracticeSetUseCase } from "../../../application/practice/practice.use-cases.js";
import { AIUnavailableError } from "../../../core/services/ai/ai.types.js";

export class PracticeController {
  async getPracticeSets(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const sets = await getPracticeSetsUseCase.execute(userId);
      res.json({ success: true, data: sets });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch practice sets" });
    }
  }

  async generateSet(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { lessonId, type = "practice", difficulty = "mixed" } = req.body;
    try {
      const set = await generatePracticeSetUseCase.execute(userId, lessonId, type, difficulty);
      res.json({ success: true, data: set });
    } catch (error) {
      if (error instanceof AIUnavailableError) {
        return res.status(503).json({ success: false, error: "AI services are currently unavailable." });
      }
      res.status(500).json({ success: false, error: "Failed to generate practice set" });
    }
  }

  async submitAnswer(req: Request, res: Response) {
    const questionId = req.params.questionId as string;
    const { answer, timeSpentMs } = req.body;
    try {
      const updated = await submitAnswerUseCase.execute(questionId, answer, timeSpentMs);
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof Error && error.message === "Question not found") {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(500).json({ success: false, error: "Failed to submit answer" });
    }
  }

  async completeSet(req: Request, res: Response) {
    const setId = req.params.setId as string;
    try {
      const updated = await completePracticeSetUseCase.execute(setId);
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof Error && error.message === "Set not found") {
        return res.status(404).json({ error: "Set not found" });
      }
      res.status(500).json({ success: false, error: "Failed to complete set" });
    }
  }
}
