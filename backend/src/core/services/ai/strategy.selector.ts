import { IEventBus } from "../../events/event-bus.js";
import { EducationalIntent, LearningStrategy, AIContext } from "./ai.types.js";

export class StrategySelector  {
  constructor(private readonly eventBus: IEventBus) {}
  static selectStrategy(intent: EducationalIntent, context: AIContext): LearningStrategy {
    const dna = context.learningDNA;
    const masteries = context.conceptMastery || [];
    const avgConfidence = masteries.reduce((acc, m) => acc + m.confidence, 0) / (masteries.length || 1);

    if (intent === "PRACTICE" || intent === "GENERATE_QUIZ") {
      return avgConfidence > 0.7 ? "EXAM_MODE" : "PRACTICE_FIRST_MODE";
    }

    if (intent === "DEBUG_CODE" || intent === "SOLVE_PROBLEM") {
      // If they prefer theory over practical, explain the concept first. Otherwise, hint first.
      return dna?.readingPreference > 0.7 ? "CONCEPT_FIRST_MODE" : "HINT_FIRST_MODE";
    }

    if (intent === "EXPLAIN_CONCEPT") {
      // Very low confidence or explicitly requesting Socratic
      if (avgConfidence < 0.4 || dna?.analogyPreference > 0.8) {
        return "SOCRATIC_QUESTIONING";
      }
      if (dna?.examplePreference > 0.7) {
        return "GUIDED_DISCOVERY";
      }
      // If slow pace preferred, use scaffolded learning
      if (dna?.pacePreference < 0.4) {
        return "SCAFFOLDED_LEARNING";
      }
      return "STEP_BY_STEP_REASONING";
    }

    // Default strategy
    return "DIRECT_EXPLANATION";
  }

  static getStrategyInstruction(strategy: LearningStrategy, dna?: Record<string, any> | null): string {
    let instruction = "";
    
    switch (strategy) {
      case "SOCRATIC_QUESTIONING":
        instruction = "You are using Socratic Questioning. Do NOT give the direct answer immediately. Ask leading questions to help the student discover the answer themselves.";
        break;
      case "GUIDED_DISCOVERY":
        instruction = "You are using Guided Discovery. Provide an intuitive analogy or a real-world example first, then ask how it relates to the topic.";
        break;
      case "SCAFFOLDED_LEARNING":
        instruction = "You are using Scaffolded Learning. Break down the explanation into very small, manageable chunks. Pause after the first chunk to ensure understanding before moving on.";
        break;
      case "STEP_BY_STEP_REASONING":
        instruction = "You are using Step-by-Step Reasoning. Walk through the logic sequentially, numbering your steps clearly.";
        break;
      case "HINT_FIRST_MODE":
        instruction = "You are using Hint-First Mode. Do not solve the problem or debug the code entirely. Point out where the error is or give a conceptual hint, and encourage them to fix it.";
        break;
      case "EXAM_MODE":
        instruction = "You are in Exam Mode. Present the material as a rigorous challenge. Be strict with accuracy and do not offer hints unless explicitly requested.";
        break;
      case "CONCEPT_FIRST_MODE":
        instruction = "You are in Concept-First Mode. Explain the underlying theoretical principles before applying them to the specific problem.";
        break;
      case "PRACTICE_FIRST_MODE":
        instruction = "You are in Practice-First Mode. Immediately provide a practical exercise or a block of code, then explain the theory afterward based on their attempt.";
        break;
      case "DIRECT_EXPLANATION":
      default:
        instruction = "You are giving a Direct Explanation. Be clear, concise, and provide exactly what was asked.";
        break;
    }

    if (dna) {
      instruction += `\n\nAdapt to the student's Learning DNA:
- Visual Learner (use diagrams/markdown): ${dna.visualPreference > 0.6 ? 'Yes' : 'No'}
- Detail Oriented: ${dna.detailPreference > 0.6 ? 'High' : 'Moderate'}
- Desired Pace: ${dna.pacePreference < 0.4 ? 'Slow and methodical' : 'Standard'}`;
    }

    return instruction;
  }
}
