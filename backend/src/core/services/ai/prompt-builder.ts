import { AIContext } from "./ai.types.js";

export class AIPromptBuilder {
  /**
   * Enhances any base prompt with global personalization rules
   * derived from the user's AIContext.
   */
  static build(basePrompt: string, context: AIContext): string {
    let finalPrompt = basePrompt;
    
    // Inject Multilingual Rules
    if (context.preferences?.preferredLanguage || context.profile?.preferredLanguage) {
      const preferredLanguage = context.profile?.preferredLanguage || context.preferences?.preferredLanguage || "English";
      
      // We only inject language rules if they prefer something other than English.
      if (preferredLanguage.toLowerCase() !== "english") {
        const languageInjection = `
[GLOBAL MULTILINGUAL INSTRUCTION]
The user's preferred language is ${preferredLanguage}. 
CRITICAL RULES:
1. All your explanations, summaries, and conversational responses MUST be written in ${preferredLanguage}.
2. However, DO NOT translate technical terminology, concept names, or coding keywords. Keep technical terms in English to ensure accuracy.
3. If providing documents or data extraction, NEVER translate the source material. Only translate your explanations of it.
`;
        finalPrompt = `${languageInjection}\n\n${finalPrompt}`;
      }
    }

    return finalPrompt;
  }
}
