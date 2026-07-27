import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";
import { IKnowledgeRepository } from "../../domain/interfaces/knowledge/knowledge.interface.js";
import { DocumentPipeline } from "../../core/knowledge/document-pipeline.js";

export class CreateKnowledgeCollectionUseCase {
  constructor(private readonly knowledgeRepo: IKnowledgeRepository) {}
  async execute(ownerId: string, name: string, description?: string, isPublic: boolean = false) {
    return this.knowledgeRepo.createCollection({
      ownerId,
      name,
      description,
      isPublic
    });
  }
}

export class IngestDocumentUseCase {
  constructor(private readonly documentPipeline: IDocumentPipeline) {}
  async execute(collectionId: string, title: string, content: string, metadata?: Record<string, any>) {
    return this.documentPipeline.ingestDocument(collectionId, title, content, metadata);
  }
}
