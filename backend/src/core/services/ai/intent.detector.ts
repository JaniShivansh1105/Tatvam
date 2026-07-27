import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { EducationalIntent } from "./ai.types.js";

export class IntentDetector implements IIntentDetector {
  constructor(private readonly eventBus: IEventBus) {}
  /**
   * Fast heuristic-based intent detection to classify student messages before generating the prompt.
   * In a future iteration, this can be swapped with a small local LLM classification pass.
   */
  static detect(message: string, context?: Record<string, any>): EducationalIntent {
    const text = message.toLowerCase();
    
    if (/quiz|test me|ask me/i.test(text)) return "GENERATE_QUIZ";
    if (/flashcard|cards/i.test(text)) return "GENERATE_FLASHCARDS";
    if (/note|summary|summarize|tl;dr|tldr/i.test(text)) return "SUMMARIZE";
    if (/revise|revision|review/i.test(text)) return "REVISION";
    if (/practice|exercise/i.test(text)) return "PRACTICE";
    if (/career|job|interview|resume/i.test(text)) return "CAREER_GUIDANCE";
    if (/debug|error|bug|exception|stack trace/i.test(text)) return "DEBUG_CODE";
    if (/solve|calculate|equation|math/i.test(text)) return "SOLVE_PROBLEM";
    if (/explain|what is|how does|why is/i.test(text)) return "EXPLAIN_CONCEPT";
    
    // Default fallback
    return "CONVERSATION";
  }
}
