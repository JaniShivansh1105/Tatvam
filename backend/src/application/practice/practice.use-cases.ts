import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IPlansRepository, IPracticeRepository, IChatRepository, IKnowledgeRepository, IArtifactRepository, IProgressRepository } from "../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { PracticeRepository } from "../../data/repositories/practice.repository.js";
import { AIService } from "../../core/services/ai/ai.service.js";
import { ProgressService } from "../../core/services/progress/progress.service.js";

export class GetPracticeSetsUseCase {
  constructor(private readonly practiceRepo: IPracticeRepository, private readonly eventBus: IEventBus) {}
  async execute(userId: string) {
    return this.practiceRepo.getPracticeSets(userId);
  }
}

export class GeneratePracticeSetUseCase {
  constructor(private readonly aiService: IAIService, private readonly practiceRepo: IPracticeRepository, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string | null, type: string, difficulty: string) {
    const selected = await this.aiService.generatePracticeQuestions(userId, lessonId, type, difficulty);

    const questionsData = selected.map((q: any) => ({
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      hint: q.hint,
    }));

    return this.practiceRepo.createPracticeSet({
      userId,
      lessonId,
      type,
      difficulty,
      status: "in_progress",
    }, questionsData);
  }
}

export class SubmitAnswerUseCase {
  constructor(private readonly practiceRepo: IPracticeRepository, private readonly eventBus: IEventBus) {}
  async execute(questionId: string, answer: string, timeSpentMs: number) {
    const question = await this.practiceRepo.getQuestionById(questionId);
    if (!question) throw new Error("Question not found");

    const isCorrect = question.correctAnswer === answer;
    return this.practiceRepo.updateQuestion(questionId, {
      userAnswer: answer,
      isCorrect,
      timeSpentMs
    });
  }
}

export class CompletePracticeSetUseCase {
  constructor(private readonly practiceRepo: IPracticeRepository, private readonly progressService: IProgressService, private readonly eventBus: IEventBus) {}
  async execute(setId: string) {
    const set = await this.practiceRepo.getPracticeSetById(setId);
    if (!set) throw new Error("Set not found");

    const answered = (set as any).questions.filter((q: any) => q.isCorrect !== null);
    const correct = answered.filter((q: any) => q.isCorrect === true).length;
    const score = answered.length > 0 ? (correct / answered.length) * 100 : 0;

    const updated = await this.practiceRepo.updatePracticeSet(setId, {
      status: "completed",
      score
    });

    await this.progressService.logActivity(set.userId, "PRACTICE_COMPLETED", set.lessonId || undefined, { setId, score });
    await this.progressService.getDNA(set.userId);

    return updated;
  }
}
