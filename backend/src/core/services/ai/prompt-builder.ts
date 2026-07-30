import { AIContext } from "./ai.types.js";

export class AIPromptBuilder {
  /**
   * Enhances any base prompt with global personalization rules
   * derived from the user's AIContext.
   */
  static build(basePrompt: string, context: AIContext, type: 'conversation' | 'artifact' = 'conversation'): string {
    let finalPrompt = basePrompt;
    
    const preferredLanguage = context.profile?.preferredLanguage || context.preferences?.preferredLanguage || "English";

    let languageInjection = `[GLOBAL MULTILINGUAL INSTRUCTION]\n`;

    if (type === 'conversation') {
      languageInjection += `CONVERSATION RULES:
1. You MUST detect the language the user is currently writing in (e.g. Gujarati, Hindi, English).
2. You MUST reply in the exact same language the user wrote their message in.
3. If the user explicitly requests another language, reply in the requested language.
4. Ignore the user's "Preferred Language" for normal conversations if it differs from the language they are currently typing in.
`;
    } else {
      languageInjection += `ARTIFACT GENERATION RULES:
1. You MUST generate this artifact (Notes, Flashcards, Practice, Quiz, etc.) in the user's Preferred Language: ${preferredLanguage}.
`;
    }

    languageInjection += `
TECHNICAL TERMS RULES:
Always preserve technical terminology in English. Do not translate them unless explicitly requested.
Examples: Binary Search, Stack, Queue, Heap, API, Database, Compiler, DFS, BFS, CPU, RAM, etc.
`;

    finalPrompt = `${languageInjection}\n\n${finalPrompt}`;
    return finalPrompt;
  }
}
