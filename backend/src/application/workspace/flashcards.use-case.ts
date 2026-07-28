import { IWorkspaceService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { WorkspaceService } from "../../core/services/workspace/workspace.service.js";

export class GetFlashcardsUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string) {
    return this.workspaceService.getFlashcards(userId, lessonId);
  }
}

export class GenerateFlashcardUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string, data: any) {
    return this.workspaceService.generateFlashcard(userId, lessonId, data);
  }
}

export class ReviewFlashcardUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, id: string, data: any) {
    return this.workspaceService.reviewFlashcard(userId, id, data);
  }
}
