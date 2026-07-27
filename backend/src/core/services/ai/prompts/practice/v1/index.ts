import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { AIContext } from "../../../ai.types.js";

export function getSystemPrompt(): string {
  return "You are an expert AI teacher generating practice questions.";
}

export function buildContextPrompt(context: AIContext, type: string, difficulty: string): string {
  let dnaContext = "";
  if (context.learningDNA) {
    dnaContext = `DNA Profile: Visual Preference ${context.learningDNA.visualPreference}, Detail Preference ${context.learningDNA.detailPreference}`;
  }

  let lessonContext = "General Physics";
  if (context.lesson) {
    lessonContext = `Lesson: ${context.lesson.title}. Topics: ${context.lesson.topics?.map((t:any) => t.title).join(", ")}`;
  }

  return `Type: ${type}, Difficulty: ${difficulty}
Student DNA: ${dnaContext}
Current Lesson Context: ${lessonContext}`;
}

export function getRulesPrompt(): string {
  return `Rules:
1. Return ONLY a raw JSON array of 5 question objects.
2. Each object MUST have: text, options (array of exactly 4 strings), correctAnswer (string matching one of the options), explanation (string), hint (string).
3. Output raw JSON only, no markdown formatting.`;
}
