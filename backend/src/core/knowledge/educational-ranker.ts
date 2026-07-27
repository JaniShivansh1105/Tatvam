export interface ScoredChunk {
  chunk: any;
  semanticScore: number;
  educationalScore: number;
  finalScore: number;
}

export interface RankingWeights {
  semantic: number;
  subjectMatch: number;
  chapterMatch: number;
  weakConceptMatch: number;
  learningGoalMatch: number;
  sessionMatch: number;
  documentPriority: number;
  sourceQuality: number;
  languageMatch: number;
}

const DEFAULT_WEIGHTS: RankingWeights = {
  semantic: 0.4,
  subjectMatch: 0.15,
  chapterMatch: 0.1,
  weakConceptMatch: 0.1,
  learningGoalMatch: 0.05,
  sessionMatch: 0.05,
  documentPriority: 0.05,
  sourceQuality: 0.05,
  languageMatch: 0.05,
};

export class EducationalRanker {
  /**
   * Ranks retrieved vector chunks using multidimensional educational context
   * instead of relying solely on vector cosine similarity.
   */
  static rank(
    chunks: any[], 
    context: Record<string, any>, 
    weights: RankingWeights = DEFAULT_WEIGHTS
  ): ScoredChunk[] {
    const scoredChunks: ScoredChunk[] = chunks.map(chunk => {
      const metadata = chunk.metadata || {};
      let eduScore = 0;

      // 1. Subject Match
      if (metadata.subject === context.lesson?.subjectId) {
        eduScore += weights.subjectMatch;
      }

      // 2. Chapter/Lesson Match
      if (metadata.chapter === context.lesson?.id || metadata.lessonId === context.lesson?.id) {
        eduScore += weights.chapterMatch;
      }

      // 3. Weak Concept Match
      if (context.conceptMastery && Array.isArray(context.conceptMastery)) {
        const isWeak = context.conceptMastery.some(c => 
          metadata.tags?.includes(c.conceptId) || 
          metadata.type === "Concept" && chunk.content?.includes(c.conceptId)
        );
        if (isWeak) eduScore += weights.weakConceptMatch;
      }

      // 4. Learning Goal Match
      if (context.activePlan && metadata.tags?.includes("goal-aligned")) {
        eduScore += weights.learningGoalMatch;
      }

      // 5. Session/Conversation Match
      if (metadata.sessionId === context.sessionId) {
        eduScore += weights.sessionMatch;
      }

      // 6. Document Priority (e.g. Teacher-provided vs Community)
      if (metadata.priority === "high" || metadata.sourceQuality === "verified") {
        eduScore += weights.documentPriority;
        eduScore += weights.sourceQuality;
      }

      // 7. Language Match
      if (metadata.language === context.language || (!metadata.language && context.language === "en")) {
        eduScore += weights.languageMatch;
      }

      // We assume chunk.score is the raw semantic similarity (e.g., cosine similarity from 0 to 1)
      const semanticScore = chunk.score || 0.5; // fallback
      
      const finalScore = (semanticScore * weights.semantic) + eduScore;

      return {
        chunk,
        semanticScore,
        educationalScore: eduScore,
        finalScore
      };
    });

    // Sort descending by final score
    return scoredChunks.sort((a, b) => b.finalScore - a.finalScore);
  }

  static compressAndGroup(scoredChunks: ScoredChunk[], limit: number = 10): Record<string, string[]> {
    const topChunks = scoredChunks.slice(0, limit);
    const grouped: Record<string, string[]> = {
      Definitions: [],
      Concepts: [],
      Examples: [],
      Formulae: [],
      Exercises: [],
      References: []
    };

    const seenContents = new Set<string>();

    for (const sc of topChunks) {
      const type = sc.chunk.metadata?.type || "Concepts";
      let content = sc.chunk.content as string;

      // Basic deduplication: if exact content exists, skip
      if (seenContents.has(content)) continue;
      seenContents.add(content);

      // Compression heuristic: remove excessive whitespace
      content = content.replace(/\\s+/g, ' ').trim();

      if (type === "Definition" || type === "Definitions") grouped.Definitions.push(content);
      else if (type === "Example" || type === "Examples") grouped.Examples.push(content);
      else if (type === "Formula" || type === "Formulae") grouped.Formulae.push(content);
      else if (type === "Exercise" || type === "Exercises") grouped.Exercises.push(content);
      else if (type === "Reference" || type === "References") grouped.References.push(content);
      else grouped.Concepts.push(content);
    }

    return grouped;
  }
}
