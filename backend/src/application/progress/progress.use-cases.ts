import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IPlansRepository, IPracticeRepository, IChatRepository, IKnowledgeRepository, IArtifactRepository, IProgressRepository } from "../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { ProgressService } from "../../core/services/progress/progress.service.js";

export class GetDNAUseCase {
  constructor(private readonly progressService: IProgressService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.progressService.getDNA(...args);
  }
}

export class UpdateDNAUseCase {
  constructor(private readonly progressService: IProgressService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.progressService.updateDNA(...args);
  }
}

export class GetMasteryUseCase {
  constructor(private readonly progressService: IProgressService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.progressService.getMastery(...args);
  }
}

export class RecordInteractionUseCase {
  constructor(private readonly progressService: IProgressService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.progressService.recordInteraction(...args);
  }
}

export class GetTimelineUseCase {
  constructor(private readonly progressService: IProgressService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.progressService.getTimeline(...args);
  }
}

