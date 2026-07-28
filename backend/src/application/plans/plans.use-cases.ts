import { IAIService } from "../../domain/interfaces/services.interface.js";
import { IPlansRepository } from "../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { PlansRepository } from "../../data/repositories/plans.repository.js";
import { AIService } from "../../core/services/ai/ai.service.js";

export class GetPlansUseCase {
  constructor(private readonly plansRepo: IPlansRepository, private readonly eventBus: IEventBus) {}
  async execute(userId: string) {
    return this.plansRepo.getPlans(userId);
  }
}

export class CreatePlanUseCase {
  constructor(private readonly aiService: IAIService, private readonly plansRepo: IPlansRepository, private readonly eventBus: IEventBus) {}
  async execute(userId: string, title: string, type: string) {
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(now.getDate() + (type === "weekly" ? 7 : 1));

    const generatedTasks = await this.aiService.generateStudyPlanTasks(userId, type || "weekly");

    const tasksData = generatedTasks.map((t: any) => ({
      title: t.title,
      lessonId: t.lessonId
    }));

    const plan = await this.plansRepo.createPlan({
      userId,
      title: title || `${type === "weekly" ? "Weekly" : "Daily"} Plan`,
      type: type || "weekly",
      startDate: now,
      endDate: endDate,
    }, tasksData);

    const { DomainEvents } = await import("../../core/events/domain-events.js");
    await this.eventBus.publish(DomainEvents.StudyPlanCreated, { userId, planId: plan.id, type });

    return plan;
  }
}

export class UpdateTaskStatusUseCase {
  constructor(private readonly plansRepo: IPlansRepository, private readonly eventBus: IEventBus) {}
  async execute(taskId: string, status: string) {
    const task = await this.plansRepo.updateTask(taskId, status);

    // Update plan progress
    const planTasks = (task as any).plan.tasks;
    const completed = planTasks.filter((t: any) => t.status === "completed").length;
    const progress = planTasks.length > 0 ? (completed / planTasks.length) * 100 : 0;

    await this.plansRepo.updatePlanProgress(task.planId, progress);

    return { taskId, status, progress };
  }
}
