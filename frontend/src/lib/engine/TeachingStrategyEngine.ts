import { LearningDNA, TeachingStrategy } from "./types";

export class TeachingStrategyEngine {
  
  static determineStrategy(dna: LearningDNA, requestType: string): TeachingStrategy {
    // Explicit requests override DNA
    if (requestType === "Explain Simply") return "Explain Simply";
    if (requestType === "Use Analogy") return "Use Analogy";
    if (requestType === "Challenge Me") return "Challenge Understanding";
    
    // Implicit determination based on DNA
    if (dna.analogyPreference > 0.6) {
      return "Use Analogy";
    }
    
    if (dna.pacePreference < 0.4 || dna.detailPreference > 0.6) {
      return "Explain Simply";
    }

    return "Explain Normally";
  }
}
