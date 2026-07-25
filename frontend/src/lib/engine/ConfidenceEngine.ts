import { ConfidenceLevel, ConceptState } from "./types";

const CONFIDENCE_PROGRESSION: ConfidenceLevel[] = [
  "Unknown", "Exploring", "Learning", "Practicing", "Confident", "Mastered"
];

export class ConfidenceEngine {
  
  static increaseConfidence(concept: ConceptState): ConceptState {
    const currentIndex = CONFIDENCE_PROGRESSION.indexOf(concept.confidence);
    if (currentIndex < CONFIDENCE_PROGRESSION.length - 1) {
      return {
        ...concept,
        confidence: CONFIDENCE_PROGRESSION[currentIndex + 1],
        interactions: concept.interactions + 1,
      };
    }
    return { ...concept, interactions: concept.interactions + 1 };
  }

  static decreaseConfidence(concept: ConceptState): ConceptState {
    const currentIndex = CONFIDENCE_PROGRESSION.indexOf(concept.confidence);
    if (currentIndex > 1) { // Never drop below Exploring once introduced
      return {
        ...concept,
        confidence: CONFIDENCE_PROGRESSION[currentIndex - 1],
        interactions: concept.interactions + 1,
      };
    }
    return { ...concept, interactions: concept.interactions + 1 };
  }

  static evaluateUnderstandingCheck(status: "mastered" | "confused" | "analogy", concept: ConceptState): ConceptState {
    if (status === "mastered") return this.increaseConfidence(concept);
    if (status === "confused") return this.decreaseConfidence(concept);
    return { ...concept, interactions: concept.interactions + 1 }; // Analogy doesn't drop confidence, just adds interaction
  }
}
