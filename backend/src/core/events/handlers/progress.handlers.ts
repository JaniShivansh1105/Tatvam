import { IProgressService } from "../../../domain/interfaces/services.interface.js";
import { IEventBus } from "../event-bus.js";
import { DomainEvents } from "../domain-events.js";

export class ProgressEventHandlers {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly progressService: IProgressService
  ) {}

  register() {
    this.eventBus.subscribe(DomainEvents.PracticeCompleted, async (payload) => {
      const { userId, lessonId, setId, score } = payload;
      await this.progressService.logActivity(userId, "PRACTICE_COMPLETED", lessonId, { setId, score });
      await this.progressService.getDNA(userId); // Triggers DNA evolution
    });

    this.eventBus.subscribe(DomainEvents.BookmarkCreated, async (payload) => {
      const { userId, lessonId, bookmarkId } = payload;
      await this.progressService.logActivity(userId, "BOOKMARK_CREATED", lessonId, { bookmarkId });
    });

    this.eventBus.subscribe(DomainEvents.NoteCreated, async (payload) => {
      const { userId, lessonId, noteId } = payload;
      await this.progressService.logActivity(userId, "NOTE_CREATED", lessonId, { noteId });
    });
    
    this.eventBus.subscribe(DomainEvents.FlashcardsGenerated, async (payload) => {
      const { userId, lessonId, flashcardId } = payload;
      await this.progressService.logActivity(userId, "FLASHCARD_GENERATED", lessonId, { flashcardId });
    });

    this.eventBus.subscribe(DomainEvents.ConversationCompleted, async (payload) => {
      const { userId, lessonId, sessionId } = payload;
      await this.progressService.logActivity(userId, "CONVERSATION_COMPLETED", lessonId, { sessionId });
    });

    this.eventBus.subscribe(DomainEvents.KnowledgeIndexed, async (payload) => {
      const { userId, documentId, title } = payload;
      if (userId) {
        await this.progressService.logActivity(userId, "KNOWLEDGE_INDEXED", undefined, { documentId, title });
      }
    });

    this.eventBus.subscribe(DomainEvents.DocumentUploaded, async (payload) => {
      const { userId, documentId, title } = payload;
      if (userId) {
        await this.progressService.logActivity(userId, "DOCUMENT_UPLOADED", undefined, { documentId, title });
      }
    });

    this.eventBus.subscribe(DomainEvents.AssessmentCompleted, async (payload) => {
      const { userId, lessonId, setId, score } = payload;
      await this.progressService.logActivity(userId, "ASSESSMENT_COMPLETED", lessonId, { setId, score });
    });

    this.eventBus.subscribe(DomainEvents.ArtifactCreated, async (payload) => {
      const { userId, artifactId, type } = payload;
      if (userId) {
        await this.progressService.logActivity(userId, "ARTIFACT_CREATED", undefined, { artifactId, type });
      }
    });

    this.eventBus.subscribe(DomainEvents.ConceptMasteryUpdated, async (payload) => {
      const { userId, conceptId, masteryLevel } = payload;
      if (userId) {
        await this.progressService.logActivity(userId, "MASTERY_UPDATED", undefined, { conceptId, masteryLevel });
      }
    });

    this.eventBus.subscribe(DomainEvents.RecommendationGenerated, async (payload) => {
      const { userId, recommendations } = payload;
      if (userId) {
        await this.progressService.logActivity(userId, "RECOMMENDATION_GENERATED", undefined, { count: recommendations?.length || 0 });
      }
    });
  }
}
