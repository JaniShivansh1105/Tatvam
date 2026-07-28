import { IEventBus } from "../../core/events/event-bus.js";

export interface IDocumentPipeline {
  ingestDocument(collectionId: string, title: string, content: string, metadata?: Record<string, any>): Promise<any>;
}

export interface IMasteryEngine {
  calculateMastery(interactions: any[]): { masteryLevel: number; confidence: number; trend: string };
}

export interface IDNAEvolutionEngine {
  evolve(currentDNA: any, interactions: any[]): any;
}

export interface IRecommendationEngine {
  generateRecommendations(masteries: any[], dna: any): any[];
}
