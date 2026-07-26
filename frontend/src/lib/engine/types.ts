export type ConfidenceLevel = "Unknown" | "Exploring" | "Learning" | "Practicing" | "Confident" | "Mastered";

export interface ConceptState {
  id: string;
  title: string;
  confidence: ConfidenceLevel;
  lastReviewed?: number;
  interactions: number;
}

export type LearningDNA = {
  visualPreference: number;
  pacePreference: number;
  detailPreference: number;
  audioPreference: number;
  readingPreference: number;
  animationPreference: number;
  examplePreference: number;
  analogyPreference: number;
  learningSpeed: number;
  readingSpeed: number;
  attentionSpan: number;
  quizAccuracy: number;
  revisionFrequency: number;
  averageSessionDuration: number;
  averageConfidence: number;
  averageAttempts: number;
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
