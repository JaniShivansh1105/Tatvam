import { Request, Response } from "express";
import { prisma } from "../../../data/prisma.js";
import { AIService } from "../../../core/services/ai/ai.service.js";
import { AIUnavailableError } from "../../../core/services/ai/ai.types.js";

export class PracticeController {
  static async getPracticeSets(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const sets = await prisma.practiceSet.findMany({
        where: { userId },
        include: {
          questions: true
        },
        orderBy: { createdAt: "desc" }
      });
      res.json({ success: true, data: sets });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch practice sets" });
    }
  }

  static async generateSet(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { lessonId, type = "practice", difficulty = "mixed" } = req.body;
    try {
      const selected = await AIService.generatePracticeQuestions(userId, lessonId, type, difficulty);

      const set = await prisma.practiceSet.create({
        data: {
          userId,
          lessonId,
          type,
          difficulty,
          status: "in_progress",
          questions: {
            create: selected.map((q: any) => ({
              text: q.text,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              hint: q.hint,
            }))
          }
        },
        include: { questions: true }
      });
      res.json({ success: true, data: set });
    } catch (error) {
      if (error instanceof AIUnavailableError) {
        return res.status(503).json({ success: false, error: "AI services are currently unavailable." });
      }
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to generate practice set" });
    }
  }

  static async submitAnswer(req: Request, res: Response) {
    const questionId = req.params.questionId as string;
    const { answer, timeSpentMs } = req.body;
    try {
      const question = await prisma.question.findUnique({ where: { id: questionId } });
      if (!question) return res.status(404).json({ error: "Question not found" });

      const isCorrect = question.correctAnswer === answer;
      const updated = await prisma.question.update({
        where: { id: questionId },
        data: { userAnswer: answer, isCorrect, timeSpentMs }
      });

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to submit answer" });
    }
  }

  static async completeSet(req: Request, res: Response) {
    const setId = req.params.setId as string;
    try {
      const set = await prisma.practiceSet.findUnique({
        where: { id: setId },
        include: { questions: true }
      });
      if (!set) return res.status(404).json({ error: "Set not found" });

      const answered = (set as any).questions.filter((q: any) => q.isCorrect !== null);
      const correct = answered.filter((q: any) => q.isCorrect === true).length;
      const score = answered.length > 0 ? (correct / answered.length) * 100 : 0;

      const updated = await prisma.practiceSet.update({
        where: { id: setId },
        data: { status: "completed", score }
      });

      const { ProgressService } = await import("../../../core/services/progress/progress.service.js");
      await ProgressService.logActivity(set.userId, "PRACTICE_COMPLETED", set.lessonId || undefined, { setId, score });
      await ProgressService.getDNA(set.userId);

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to complete set" });
    }
  }
}
