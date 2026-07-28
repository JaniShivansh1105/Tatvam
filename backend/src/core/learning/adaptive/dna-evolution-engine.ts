import { DomainEvents } from "../../events/domain-events.js";
import { IEventBus } from "../../events/event-bus.js";

export class DNAEvolutionEngine {
  constructor(private readonly eventBus: IEventBus) {}

  /**
   * Evolves the Learning DNA of a student dynamically based on aggregated interaction data.
   * If a student consistently takes longer but answers correctly, pacePreference decreases (needs slow pace).
   * If a student blitzes through quizzes correctly, velocity increases.
   */
  async evolveDNA(
    userId: string,
    currentDNA: any,
    sessionMetrics: {
      averageTimeSpentMs: number;
      accuracyRate: number;
      isVisualContentEngaged: boolean;
    }
  ) {
    if (!currentDNA) return null;

    let { pacePreference, velocity, quizAccuracy, visualPreference } = currentDNA;

    // Adjust Pace and Velocity
    if (sessionMetrics.accuracyRate > 0.8 && sessionMetrics.averageTimeSpentMs < 10000) {
      // Fast and accurate
      velocity = Math.min(2.0, velocity + 0.05);
      pacePreference = Math.min(1.0, pacePreference + 0.05);
    } else if (sessionMetrics.accuracyRate < 0.5 || sessionMetrics.averageTimeSpentMs > 30000) {
      // Slow or struggling
      velocity = Math.max(0.5, velocity - 0.05);
      pacePreference = Math.max(0.1, pacePreference - 0.05);
    }

    // Adjust Visual Preference
    if (sessionMetrics.isVisualContentEngaged) {
      visualPreference = Math.min(1.0, visualPreference + 0.02);
    }

    // Update Quiz Accuracy rolling average
    quizAccuracy = (quizAccuracy * 0.9) + (sessionMetrics.accuracyRate * 0.1);

    const evolvedDNA = {
      ...currentDNA,
      pacePreference,
      velocity,
      visualPreference,
      quizAccuracy,
      streak: currentDNA.streak + 1 // Simulated daily streak bump
    };

    await this.eventBus.publish(DomainEvents.LearningDNAUpdated, { userId, evolvedDNA });

    return evolvedDNA;
  }
}
