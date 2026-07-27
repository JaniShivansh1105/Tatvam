import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IPlansRepository, IPracticeRepository, IChatRepository, IKnowledgeRepository, IArtifactRepository, IProgressRepository } from "../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { ContentService } from "../../core/services/content/content.service.js";

export class GetLessonUseCase {
  constructor(private readonly contentService: IContentService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.contentService.getLesson(...args);
  }
}

export class GetDashboardUseCase {
  constructor(private readonly contentService: IContentService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.contentService.getDashboard(...args);
  }
}

export class GetRoadmapUseCase {
  constructor(private readonly contentService: IContentService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.contentService.getRoadmap(...args);
  }
}

export class GetAchievementsUseCase {
  constructor(private readonly contentService: IContentService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.contentService.getAchievements(...args);
  }
}

