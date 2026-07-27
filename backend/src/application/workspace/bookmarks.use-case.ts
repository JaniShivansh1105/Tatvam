import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IPlansRepository, IPracticeRepository, IChatRepository, IKnowledgeRepository, IArtifactRepository, IProgressRepository } from "../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { WorkspaceService } from "../../core/services/workspace/workspace.service.js";

export class GetBookmarksUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string, query?: any) {
    return this.workspaceService.getBookmarks(userId, lessonId, query);
  }
}

export class AddBookmarkUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string, data: any) {
    return this.workspaceService.addBookmark(userId, lessonId, data);
  }
}

export class UpdateBookmarkUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, id: string, data: any) {
    return this.workspaceService.updateBookmark(userId, id, data);
  }
}

export class RemoveBookmarkUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, id: string) {
    return this.workspaceService.removeBookmark(userId, id);
  }
}

export class RestoreBookmarkUseCase {
  constructor(private readonly workspaceService: IWorkspaceService, private readonly eventBus: IEventBus) {}
  async execute(userId: string, id: string) {
    return this.workspaceService.restoreBookmark(userId, id);
  }
}
