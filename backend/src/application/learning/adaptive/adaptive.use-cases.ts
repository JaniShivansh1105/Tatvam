import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";
import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../domain/interfaces/repositories.interface.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../domain/interfaces/services.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { DomainEvents } from "../../core/events/domain-events.js";
import { IEventBus } from "../../../core/events/event-bus.js";
import { MasteryEngine } from "../../../core/learning/adaptive/mastery-engine.js";
import { RevisionScheduler } from "../../../core/learning/adaptive/revision-scheduler.js";
import { DNAEvolutionEngine } from "../../../core/learning/adaptive/dna-evolution-engine.js";
import { RecommendationEngine } from "../../../core/learning/adaptive/recommendation-engine.js";
import { IProgressRepository } from "../../../domain/interfaces/repositories.interface.js";
import { DomainEvents } from "../../../core/events/domain-events.js";

export class TrackInteractionUseCase {
  constructor(private readonly progressRepo: IProgressRepository, private readonly masteryEngine: IMasteryEngine, private readonly dnaEvolutionEngine: IDNAEvolutionEngine, private readonly eventBus: IEventBus) {}
  async execute(userId: string, lessonId: string, conceptId: string, interaction: {
    isCorrect: boolean;
    confidenceScore: number;
    timeSpentMs: number;
    quality: number; // 0-5 for Spaced Repetition
  }) {
    const currentMastery = await this.progressRepo.getConceptMastery(userId, lessonId, conceptId) || {};

    // 1. Update Concept Mastery
    const updatedMastery = await this.masteryEngine.processInteraction(
      userId,
      lessonId,
      conceptId,
      interaction.isCorrect,
      interaction.confidenceScore,
      interaction.timeSpentMs,
      currentMastery
    );

    // 2. Schedule Next Review (Spaced Repetition)
    const { nextReviewAt, interval } = RevisionScheduler.scheduleNextReview(
      interaction.quality,
      currentMastery.reviewHistory?.length ? (currentMastery.reviewHistory[currentMastery.reviewHistory.length - 1]?.interval || 0) : 0,
      currentMastery.forgettingCurve || 2.5
    );
    updatedMastery.nextReviewAt = nextReviewAt;

    await this.eventBus.publish(DomainEvents.RevisionScheduled, { userId, conceptId, nextReviewAt, interval });

    // Save Mastery to DB
    await this.progressRepo.updateConceptMastery(userId, lessonId, conceptId, updatedMastery);

    // 3. Evolve Learning DNA
    const currentDNA = await this.progressRepo.getDNA(userId);
    if (currentDNA) {
      await this.dnaEvolutionEngine.evolveDNA(userId, currentDNA, {
        averageTimeSpentMs: interaction.timeSpentMs,
        accuracyRate: interaction.isCorrect ? 1.0 : 0.0, // In a real app, this would be a rolling window average
        isVisualContentEngaged: false
      });
    }

    return updatedMastery;
  }
}

export class GenerateRecommendationsUseCase {
  constructor(private readonly progressRepo: IProgressRepository, private readonly recommendationEngine: IRecommendationEngine) {}
  async execute(userId: string) {
    const masteries = await this.progressRepo.getConceptMasteries(userId);
    const recommendations = await this.recommendationEngine.generateRecommendations(userId, masteries);
    
    // In a real app, we would save these to the Recommendation table
    return recommendations;
  }
}
