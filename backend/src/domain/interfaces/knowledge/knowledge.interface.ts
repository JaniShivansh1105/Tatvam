export interface IEmbeddingProvider {
  /**
   * Generates a vector embedding for the given text.
   */
  embedText(text: string): Promise<number[]>;
  
  /**
   * Generates vector embeddings for a batch of texts.
   */
  embedBatch(texts: string[]): Promise<number[][]>;
  
  /**
   * The dimensionality of the embeddings produced by this provider.
   */
  getDimension(): number;
}

export interface IVectorRepository {
  /**
   * Upserts a chunk and its corresponding vector into the vector database.
   */
  upsertVector(chunkId: string, documentId: string, collectionId: string, vector: number[], metadata?: Record<string, any>): Promise<void>;
  
  /**
   * Deletes all vectors associated with a specific document.
   */
  deleteDocumentVectors(documentId: string): Promise<void>;
  
  /**
   * Searches for similar chunks based on a query vector.
   */
  searchSimilar(queryVector: number[], collectionId: string, limit?: number, filters?: Record<string, any>): Promise<any[]>;
}

export interface IKnowledgeRepository {
  createCollection(data: any): Promise<any>;
  getCollectionById(id: string): Promise<any>;
  getOrCreateDefaultCollection(userId: string): Promise<any>;
  
  createDocument(data: any): Promise<any>;
  updateDocumentStatus(id: string, status: string): Promise<any>;
  
  createDocumentVersion(data: any): Promise<any>;
  createDocumentChunks(data: any[]): Promise<any>;
}
