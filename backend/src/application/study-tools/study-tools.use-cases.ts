import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";
import { IArtifactRepository } from "../../domain/interfaces/study-tools/artifact.repository.interface.js";
import { IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";

export class GenerateEducationalArtifactUseCase {
  constructor(private readonly aiService: IAIService, private readonly artifactRepo: IArtifactRepository, private readonly eventBus: IEventBus) {}
  async execute(userId: string, artifactType: string, requestContent: string, lessonId?: string, conversationId?: string) {
    const generationStart = Date.now();
    
    // The generation MUST flow through the unified AI pipeline (Context Builder + RAG + DNA)
    // The AIService handles the heavy lifting of context assembly.
    const generationResult = await this.aiService.generateStudyArtifact(userId, artifactType, requestContent, lessonId);
    
    const artifact = await this.artifactRepo.createArtifact({
      ownerId: userId,
      artifactType,
      title: generationResult.title || `Generated ${artifactType}`,
      description: generationResult.description || "",
      content: generationResult.content,
      sourceConversationId: conversationId,
      sourceKnowledgeIds: generationResult.usedKnowledgeIds || [],
      tags: generationResult.tags || [],
      educationalMetadata: generationResult.metadata || {}
    });

    const duration = Date.now() - generationStart;

    await this.eventBus.publish(DomainEvents.ArtifactCreated, { 
      userId, 
      artifactId: artifact.id, 
      artifactType, 
      duration 
    });

    // Fire specific event based on type
    const eventMap: Record<string, string> = {
      "FLASHCARD": DomainEvents.FlashcardsGenerated,
      "QUIZ": DomainEvents.QuizGenerated,
      "PRACTICE": DomainEvents.PracticeGenerated,
      "SMART_NOTES": DomainEvents.NotesGenerated,
      "SUMMARY": DomainEvents.SummaryGenerated,
      "REVISION_SHEET": DomainEvents.RevisionSheetGenerated
    };

    if (eventMap[artifactType]) {
      await this.eventBus.publish(eventMap[artifactType], { userId, artifactId: artifact.id });
    }

    return artifact;
  }
}
