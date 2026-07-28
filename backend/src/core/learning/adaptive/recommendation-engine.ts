import { DomainEvents } from "../../events/domain-events.js";
import { IEventBus } from "../../events/event-bus.js";

export class RecommendationEngine {
  constructor(private readonly eventBus: IEventBus) {}

  /**
   * Generates evidence-based recommendations for a student based on their active masteries.
   */
  async generateRecommendations(userId: string, masteries: any[]) {
    const recommendations = [];

    for (const mastery of masteries) {
      if (mastery.weakTopicStatus) {
        recommendations.push({
          title: `Practice Weak Concept`,
          description: `You've been struggling with this concept. Let's practice it.`,
          actionType: "PRACTICE_WEAK_CONCEPT",
          targetId: mastery.conceptId,
          priority: 0.9,
          reasoning: "High struggle count and low confidence."
        });
      }

      if (mastery.nextReviewAt && new Date(mastery.nextReviewAt) < new Date()) {
        recommendations.push({
          title: `Spaced Repetition Review Due`,
          description: `It's time to review this concept to prevent forgetting it.`,
          actionType: "REVIEW_CONCEPT",
          targetId: mastery.conceptId,
          priority: 0.8,
          reasoning: "Forgetting curve scheduled review."
        });
      }

      if (mastery.confidence > 0.9 && mastery.difficulty < 0.8) {
        recommendations.push({
          title: `Attempt Advanced Quiz`,
          description: `You've mastered the basics. Try a harder challenge.`,
          actionType: "ATTEMPT_ADVANCED_QUIZ",
          targetId: mastery.conceptId,
          priority: 0.5,
          reasoning: "Mastery threshold reached. Ready for advanced difficulty."
        });
      }
    }

    // Sort by priority descending
    recommendations.sort((a, b) => b.priority - a.priority);

    if (recommendations.length > 0) {
      await this.eventBus.publish(DomainEvents.RecommendationGenerated, {
        userId,
        count: recommendations.length
      });
    }

    return recommendations.slice(0, 5); // Return top 5
  }
}
