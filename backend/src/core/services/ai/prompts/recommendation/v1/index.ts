import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { AIContext } from "../../../ai.types.js";

export function getSystemPrompt(): string {
  return "You are a personalized AI learning advisor analyzing student dashboard data.";
}

export function buildContextPrompt(context: AIContext, stats: any, nextLesson: any): string {
  let masteryContext = "No mastery data.";
  if (context.conceptMastery && context.conceptMastery.length > 0) {
    masteryContext = context.conceptMastery.map(m => `- ${m.lesson?.title}: ${Math.round(m.confidence * 100)}%`).join("\n");
  }

  return `Student Stats: Completed Lessons: ${stats.completedLessons}, Accuracy: ${stats.accuracy}, Streak: ${stats.currentStreak}
Next Lesson: ${nextLesson ? nextLesson.title : "None"}
Mastery Profiles: 
${masteryContext}`;
}

export function getRulesPrompt(): string {
  return `Rules:
1. Return ONLY raw JSON.
2. Structure: { aiInsight: { message: string, type: "encouragement" | "celebration" | "motivation" | "warning" | "focus" }, weakConcepts: string[], recommendedTopics: string[] }
3. No markdown.`;
}
