const fs = require('fs');
const path = require('path');

function generatePlansUseCases() {
  const dir = path.join('src', 'application', 'plans');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const usecasesContent = `import { PlansRepository } from "../../data/repositories/plans.repository.js";
import { AIService } from "../../core/services/ai/ai.service.js";

export class GetPlansUseCase {
  static async execute(userId: string) {
    return PlansRepository.getPlans(userId);
  }
}

export class CreatePlanUseCase {
  static async execute(userId: string, title: string, type: string) {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + (type === "weekly" ? 7 : 1));

    const generatedTasks = await AIService.generateStudyPlanTasks(userId, type || "weekly");

    const tasksData = generatedTasks.map((t: any) => ({
      title: t.title,
      lessonId: t.lessonId
    }));

    return PlansRepository.createPlan({
      userId,
      title: title || \`\${type === "weekly" ? "Weekly" : "Daily"} Plan\`,
      type: type || "weekly",
      startDate: now,
      endDate: endDate,
    }, tasksData);
  }
}

export class UpdateTaskStatusUseCase {
  static async execute(taskId: string, status: string) {
    const task = await PlansRepository.updateTask(taskId, status);

    // Update plan progress
    const planTasks = (task as any).plan.tasks;
    const completed = planTasks.filter((t: any) => t.status === "completed").length;
    const progress = planTasks.length > 0 ? (completed / planTasks.length) * 100 : 0;

    await PlansRepository.updatePlanProgress(task.planId, progress);

    return { taskId, status, progress };
  }
}
`;

  fs.writeFileSync(path.join(dir, 'plans.use-cases.ts'), usecasesContent);
  
  const controllerFile = 'src/api/controllers/plans/plans.controller.ts';
  let controllerCode = `import { Request, Response } from "express";
import { GetPlansUseCase, CreatePlanUseCase, UpdateTaskStatusUseCase } from "../../../application/plans/plans.use-cases.js";
import { AIUnavailableError } from "../../../core/services/ai/ai.types.js";

export class PlansController {
  static async getPlans(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const plans = await GetPlansUseCase.execute(userId);
      res.json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch study plans" });
    }
  }

  static async createPlan(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { title, type } = req.body;
    try {
      const plan = await CreatePlanUseCase.execute(userId, title, type);
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
      const result = await UpdateTaskStatusUseCase.execute(taskId, status);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update task" });
    }
  }
}
`;
  
  fs.writeFileSync(controllerFile, controllerCode);
}

function generatePracticeUseCases() {
  const dir = path.join('src', 'application', 'practice');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const usecasesContent = `import { PracticeRepository } from "../../data/repositories/practice.repository.js";
import { AIService } from "../../core/services/ai/ai.service.js";
import { ProgressService } from "../../core/services/progress/progress.service.js";

export class GetPracticeSetsUseCase {
  static async execute(userId: string) {
    return PracticeRepository.getPracticeSets(userId);
  }
}

export class GeneratePracticeSetUseCase {
  static async execute(userId: string, lessonId: string | null, type: string, difficulty: string) {
    const selected = await AIService.generatePracticeQuestions(userId, lessonId, type, difficulty);

    const questionsData = selected.map((q: any) => ({
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      hint: q.hint,
    }));

    return PracticeRepository.createPracticeSet({
      userId,
      lessonId,
      type,
      difficulty,
      status: "in_progress",
    }, questionsData);
  }
}

export class SubmitAnswerUseCase {
  static async execute(questionId: string, answer: string, timeSpentMs: number) {
    const question = await PracticeRepository.getQuestionById(questionId);
    if (!question) throw new Error("Question not found");

    const isCorrect = question.correctAnswer === answer;
    return PracticeRepository.updateQuestion(questionId, {
      userAnswer: answer,
      isCorrect,
      timeSpentMs
    });
  }
}

export class CompletePracticeSetUseCase {
  static async execute(setId: string) {
    const set = await PracticeRepository.getPracticeSetById(setId);
    if (!set) throw new Error("Set not found");

    const answered = (set as any).questions.filter((q: any) => q.isCorrect !== null);
    const correct = answered.filter((q: any) => q.isCorrect === true).length;
    const score = answered.length > 0 ? (correct / answered.length) * 100 : 0;

    const updated = await PracticeRepository.updatePracticeSet(setId, {
      status: "completed",
      score
    });

    await ProgressService.logActivity(set.userId, "PRACTICE_COMPLETED", set.lessonId || undefined, { setId, score });
    await ProgressService.getDNA(set.userId);

    return updated;
  }
}
`;

  fs.writeFileSync(path.join(dir, 'practice.use-cases.ts'), usecasesContent);
  
  const controllerFile = 'src/api/controllers/practice/practice.controller.ts';
  let controllerCode = `import { Request, Response } from "express";
import { GetPracticeSetsUseCase, GeneratePracticeSetUseCase, SubmitAnswerUseCase, CompletePracticeSetUseCase } from "../../../application/practice/practice.use-cases.js";
import { AIUnavailableError } from "../../../core/services/ai/ai.types.js";

export class PracticeController {
  static async getPracticeSets(req: Request, res: Response) {
    const userId = req.user!.userId;
    try {
      const sets = await GetPracticeSetsUseCase.execute(userId);
      res.json({ success: true, data: sets });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch practice sets" });
    }
  }

  static async generateSet(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { lessonId, type = "practice", difficulty = "mixed" } = req.body;
    try {
      const set = await GeneratePracticeSetUseCase.execute(userId, lessonId, type, difficulty);
      res.json({ success: true, data: set });
    } catch (error) {
      if (error instanceof AIUnavailableError) {
        return res.status(503).json({ success: false, error: "AI services are currently unavailable." });
      }
      res.status(500).json({ success: false, error: "Failed to generate practice set" });
    }
  }

  static async submitAnswer(req: Request, res: Response) {
    const questionId = req.params.questionId as string;
    const { answer, timeSpentMs } = req.body;
    try {
      const updated = await SubmitAnswerUseCase.execute(questionId, answer, timeSpentMs);
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof Error && error.message === "Question not found") {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(500).json({ success: false, error: "Failed to submit answer" });
    }
  }

  static async completeSet(req: Request, res: Response) {
    const setId = req.params.setId as string;
    try {
      const updated = await CompletePracticeSetUseCase.execute(setId);
      res.json({ success: true, data: updated });
    } catch (error) {
      if (error instanceof Error && error.message === "Set not found") {
        return res.status(404).json({ error: "Set not found" });
      }
      res.status(500).json({ success: false, error: "Failed to complete set" });
    }
  }
}
`;
  
  fs.writeFileSync(controllerFile, controllerCode);
}


generatePlansUseCases();
generatePracticeUseCases();
console.log("Plans and Practice Use Cases generated.");
