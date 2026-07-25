import { LearningDNA } from "./types";

export class LearningProfileEngine {
  
  static generateInitialDNA(): LearningDNA {
    return {
      traits: ["Visual Learner", "Curious"],
      preferredPace: "Normal",
      curiosityLevel: "Medium"
    };
  }

  static adaptDNA(currentDNA: LearningDNA, interactionType: string): LearningDNA {
    const newDNA = { ...currentDNA };
    const traits = new Set(newDNA.traits);

    if (interactionType === "confused") {
      traits.add("Needs Simpler Explanations");
      traits.delete("Fast Reader");
    }
    
    if (interactionType === "analogy") {
      traits.add("Analogy Driven");
    }

    if (interactionType === "challenge") {
      traits.add("Prefers Challenges");
      newDNA.curiosityLevel = "High";
    }

    newDNA.traits = Array.from(traits);
    return newDNA;
  }
}
