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
    
    // Better semantic chunking with context overlap
    const paragraphs = text.split(/\n\n+/);
    
    let currentContext = "";
    
    for (let i = 0; i < paragraphs.length; i++) {
      const para = paragraphs[i].trim();
      if (!para) continue;
      
      let type: ChunkType = "Paragraph";
      
      if (para.match(/^#{1,6}\s/)) {
        type = "Topic";
        currentContext = para.replace(/^#{1,6}\s/, "").trim(); // Save heading as context
      } else if (para.toLowerCase().startsWith("def") || para.includes(" is defined as ")) {
        type = "Definition";
      } else if (para.toLowerCase().includes("example:") || para.toLowerCase().includes("for instance")) {
        type = "Example";
      } else if (para.match(/^[0-9]+\. /) || para.match(/^[-*] /)) {
        type = "Paragraph"; // List item
      } else if (para.includes("=") && /[+\-*/]/.test(para)) {
        type = "Formula";
      } else if (para.toLowerCase().startsWith("exercise") || para.toLowerCase().startsWith("q:")) {
        type = "Exercise";
      }

      // Add overlap from previous paragraph if it's short, to maintain context
      let contentToEmbed = para;
      if (i > 0 && para.length < 200) {
        const prevPara = paragraphs[i - 1].trim();
        if (prevPara.length < 500) {
          contentToEmbed = prevPara.substring(prevPara.length - 150) + "\n\n" + para;
        }
      }

      if (currentContext && type !== "Topic") {
        contentToEmbed = `[Context: ${currentContext}]\n${contentToEmbed}`;
      }

      chunks.push({
        content: contentToEmbed,
        type,
        tokenEstimate: Math.ceil(contentToEmbed.split(" ").length * 1.3),
        metadata: { ...globalMetadata, type, context: currentContext }
      });
    }

    return chunks;
  }
}
