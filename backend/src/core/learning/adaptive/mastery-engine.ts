import { DomainEvents } from "../../events/domain-events.js";
import { IEventBus } from "../../events/event-bus.js";

export class MasteryEngine {
  constructor(private readonly eventBus: IEventBus) {}

  /**
   * Updates the concept mastery profile for a student based on an interaction (e.g. Flashcard or Quiz answer).
   * Modifies confidence, difficulty, retention, and weak topic status.
   */
  async processInteraction(
    userId: string,
    lessonId: string,
    conceptId: string,
    isCorrect: boolean,
    confidenceScore: number = 0.5,
    timeSpentMs: number = 5000,
    currentMastery: any
  ) {
    let { confidence, struggleCount, retention, difficulty } = currentMastery || {
      confidence: 0,
      struggleCount: 0,
      retention: 1.0,
      difficulty: 0.5
    };

    if (isCorrect) {
      confidence = Math.min(1.0, confidence + (0.1 * (1.0 - difficulty)));
      struggleCount = Math.max(0, struggleCount - 1);
      retention = Math.min(1.0, retention + 0.05);
      
      // If answered correctly very quickly, decrease difficulty
      if (timeSpentMs < 3000) {
        difficulty = Math.max(0.1, difficulty - 0.05);
      }
    } else {
      confidence = Math.max(0.0, confidence - (0.15 * difficulty));
      struggleCount += 1;
      retention = Math.max(0.0, retention - 0.1);
      
      // If answered incorrectly despite taking a long time, increase difficulty
      if (timeSpentMs > 15000) {
        difficulty = Math.min(1.0, difficulty + 0.05);
      }
    }

    const isWeakTopic = struggleCount > 3 || confidence < 0.3;
    const trend = isCorrect ? "IMPROVING" : "DECLINING";

    // Build the updated mastery state
    const updatedMastery = {
      confidence,
      struggleCount,
      retention,
      difficulty,
      trend,
      weakTopicStatus: isWeakTopic,
      lastReviewedAt: new Date()
    };

    // Emit Observability/Telemetry Events
    await this.eventBus.publish(DomainEvents.ConceptMasteryUpdated, {
      userId,
      lessonId,
      conceptId,
      updatedMastery
    });

    if (isWeakTopic && (!currentMastery || !currentMastery.weakTopicStatus)) {
      await this.eventBus.publish(DomainEvents.WeakTopicDetected, { userId, conceptId });
    } else if (!isWeakTopic && currentMastery?.weakTopicStatus) {
      await this.eventBus.publish(DomainEvents.WeakTopicResolved, { userId, conceptId });
    }

    if (confidence >= 0.9) {
      await this.eventBus.publish(DomainEvents.MasteryThresholdReached, { userId, conceptId });
    }

    return updatedMastery;
  }
}
