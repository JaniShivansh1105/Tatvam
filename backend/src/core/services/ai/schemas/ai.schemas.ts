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
