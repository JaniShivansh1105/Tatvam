import { IEmbeddingProvider } from "../../domain/interfaces/knowledge/knowledge.interface.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../../config/env.js";

export class GeminiEmbeddingProvider implements IEmbeddingProvider {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
  }

  async embedText(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-embedding-2" });
    const result = await model.embedContent({ 
      content: { role: 'user', parts: [{ text }] }, 
      outputDimensionality: 768 
    } as any);
    return result.embedding.values;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    // Gemini API natively supports batchEmbedding, or we can Promise.all for simple small batches
    // Due to rate limits, Promise.all might fail if texts is large, but for MVP:
    return Promise.all(texts.map(t => this.embedText(t)));
  }

  getDimension(): number {
    return 768; // Gemini gemini-embedding-2 returns 768 dimensions using outputDimensionality
  }
}
