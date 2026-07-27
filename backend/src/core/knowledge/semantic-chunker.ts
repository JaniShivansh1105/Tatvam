export type ChunkType = "Concept" | "Definition" | "Formula" | "Example" | "Exercise" | "Paragraph" | "Topic" | "Reference";

export interface SemanticChunk {
  content: string;
  type: ChunkType;
  metadata?: Record<string, any>;
  tokenEstimate: number;
}

export class SemanticChunker {
  /**
   * Semantically chunks a document rather than using naive fixed-length splitting.
   * This is a stub implementation that simulates semantic boundaries for the foundation phase.
   */
  static chunk(text: string, globalMetadata: Record<string, any> = {}): SemanticChunk[] {
    const chunks: SemanticChunk[] = [];
    
    // Simulate semantic paragraph splitting
    const paragraphs = text.split(/\\n\\n+/);
    
    for (const para of paragraphs) {
      const content = para.trim();
      if (!content) continue;
      
      let type: ChunkType = "Paragraph";
      
      // Basic heuristic detection for chunk typing
      if (content.toLowerCase().startsWith("def") || content.includes(" is defined as ")) {
        type = "Definition";
      } else if (content.toLowerCase().includes("example:") || content.toLowerCase().includes("for instance")) {
        type = "Example";
      } else if (content.includes("=") && /[\\+\\-\\*\\/]/.test(content)) {
        type = "Formula";
      } else if (content.toLowerCase().startsWith("exercise") || content.toLowerCase().startsWith("q:")) {
        type = "Exercise";
      } else if (content.startsWith("#")) {
        type = "Topic";
      }

      chunks.push({
        content,
        type,
        tokenEstimate: Math.ceil(content.split(" ").length * 1.3), // Rough estimation
        metadata: { ...globalMetadata, type }
      });
    }

    return chunks;
  }
}
