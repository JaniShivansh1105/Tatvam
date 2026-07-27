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
  }
}
