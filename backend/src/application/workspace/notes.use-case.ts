import { IWorkspaceService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { WorkspaceService } from "../../core/services/workspace/workspace.service.js";

export class GetNotesUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string, query?: any) {
    return this.workspaceService.getNotes(userId, lessonId, query);
  }
}

export class AddNoteUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string, data: any) {
    return this.workspaceService.addNote(userId, lessonId, data);
  }
}

export class UpdateNoteUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, id: string, data: any) {
    return this.workspaceService.updateNote(userId, id, data);
  }
}

export class RemoveNoteUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, id: string) {
    return this.workspaceService.removeNote(userId, id);
  }
}
