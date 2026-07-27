import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import { z } from "zod";

export const StudyPlanSchema = z.array(
  z.object({
    title: z.string(),
    lessonId: z.string().nullable(),
  })
);

export const PracticeSetSchema = z.array(
  z.object({
    text: z.string(),
    options: z.array(z.string()).length(4),
    correctAnswer: z.string(),
    explanation: z.string(),
    hint: z.string(),
  })
);

export const RecommendationSchema = z.object({
  aiInsight: z.object({
    message: z.string(),
    type: z.enum(["encouragement", "celebration", "motivation", "warning", "focus"]),
  }),
  weakConcepts: z.array(z.string()).optional(),
  recommendedTopics: z.array(z.string()).optional(),
});
