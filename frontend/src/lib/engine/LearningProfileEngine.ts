import { LearningDNA } from "./types";

export class LearningProfileEngine {
  
  static generateInitialDNA(): LearningDNA {
    return {
      visualPreference: 0.5,
      pacePreference: 0.5,
      detailPreference: 0.5,
      audioPreference: 0.5,
      readingPreference: 0.5,
      animationPreference: 0.5,
      examplePreference: 0.5,
      analogyPreference: 0.5,
      learningSpeed: 1.0,
      readingSpeed: 1.0,
      attentionSpan: 15.0,
      quizAccuracy: 0.0,
      revisionFrequency: 1.0,
      averageSessionDuration: 0.0,
      averageConfidence: 0.0,
      averageAttempts: 0.0,
    };
  }

  static adaptDNA(currentDNA: LearningDNA, interactionType: string): LearningDNA {
    const newDNA = { ...currentDNA };

    if (interactionType === "confused") {
      newDNA.pacePreference = Math.max(0.1, newDNA.pacePreference - 0.1);
      newDNA.detailPreference = Math.min(1.0, newDNA.detailPreference + 0.1);
    }
    
    if (interactionType === "analogy") {
      newDNA.analogyPreference = Math.min(1.0, newDNA.analogyPreference + 0.2);
    }

    if (interactionType === "challenge") {
      newDNA.pacePreference = Math.min(1.0, newDNA.pacePreference + 0.1);
      newDNA.detailPreference = Math.max(0.1, newDNA.detailPreference - 0.1);
    }

    return newDNA;
  }
}
