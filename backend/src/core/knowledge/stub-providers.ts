import { IEmbeddingProvider, IVectorRepository } from "../../domain/interfaces/knowledge/knowledge.interface.js";

/**
 * A stub embedding provider to fulfill the DI container requirements
 * for Sprint 02 Phase 2.3.
 */
export class StubEmbeddingProvider implements IEmbeddingProvider {
  async embedText(text: string): Promise<number[]> {
    return new Array(this.getDimension()).fill(Math.random());
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map(t => this.embedText(t)));
  }

  getDimension(): number {
    return 768; // Standard dimension for many embedding models
  }
}

/**
 * A stub vector repository to fulfill the DI container requirements
 * for Sprint 02 Phase 2.3.
 */
export class StubVectorRepository implements IVectorRepository {
  async upsertVector(chunkId: string, documentId: string, collectionId: string, vector: number[], metadata?: Record<string, any>): Promise<void> {
    // Simulate database IO
    await new Promise(resolve => setTimeout(resolve, 5));
  }

  async deleteDocumentVectors(documentId: string): Promise<void> {}

  async searchSimilar(queryVector: number[], collectionId: string, limit: number = 5, filters?: Record<string, any>): Promise<any[]> {
    return [];
  }
}
