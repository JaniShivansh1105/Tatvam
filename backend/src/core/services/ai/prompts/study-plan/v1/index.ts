import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { AIContext } from "../../../ai.types.js";

export function getSystemPrompt(): string {
  return "You are an expert AI tutor. Generate a personalized study plan for a student.";
}

export function buildContextPrompt(context: AIContext, type: string, availableLessons: any[]): string {
  let masteryContext = "No prior mastery data. The student is a beginner.";
  if (context.conceptMastery && context.conceptMastery.length > 0) {
    masteryContext = context.conceptMastery.map(m => `- ${m.lesson?.title}: ${Math.round(m.confidence * 100)}% mastery`).join("\n");
  }

  const lessonContext = availableLessons.map(l => `- ${l.title} (ID: ${l.id})`).join("\n");

  return `Plan Type: ${type} (daily = 3-4 short tasks, weekly = 7-10 tasks, adaptive = 5-7 focused tasks).

Student's Current Concept Mastery:
${masteryContext}

Available Curriculum Lessons:
${lessonContext}`;
}

export function getRulesPrompt(): string {
  return `Rules:
1. Return ONLY a raw JSON array of objects.
2. Each object MUST have "title" (string) and "lessonId" (string or null).
3. If a task applies to a specific lesson, provide its exact UUID from the curriculum list. Otherwise, set it to null.
4. Do NOT wrap the JSON in markdown code blocks. Output raw JSON only.

Example Output:
[
  { "title": "Review Laws of Motion", "lessonId": "uuid-here" },
  { "title": "Take adaptive practice test", "lessonId": null }
]`;
}
