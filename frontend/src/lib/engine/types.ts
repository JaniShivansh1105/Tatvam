export type ConfidenceLevel = "Unknown" | "Exploring" | "Learning" | "Practicing" | "Confident" | "Mastered";

export interface ConceptState {
  id: string;
  title: string;
  confidence: ConfidenceLevel;
  lastReviewed?: number;
  interactions: number;
}

export type LearningDNA = {
  traits: string[]; // e.g. "Visual Learner", "Needs Reinforcement", "Analogy Driven"
  preferredPace: "Slow" | "Normal" | "Fast";
  curiosityLevel: "Low" | "Medium" | "High";
};

export type TeachingStrategy = 
  | "Explain Normally" 
  | "Explain Simply" 
  | "Use Analogy" 
  | "Generate Visual Explanation" 
  | "Provide Real World Example" 
  | "Challenge Understanding" 
  | "Summarize";

export interface SessionMetrics {
  startTime: number;
  conceptsCovered: string[];
  questionsAsked: number;
  aiInterventions: number;
  attentionState: "High" | "Medium" | "Fatigued";
}
