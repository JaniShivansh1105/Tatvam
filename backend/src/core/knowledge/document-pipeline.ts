import { DomainEvents } from "../events/domain-events.js";
import { IEventBus } from "../events/event-bus.js";
import { IKnowledgeRepository, IEmbeddingProvider, IVectorRepository } from "../../domain/interfaces/knowledge/knowledge.interface.js";
import { SemanticChunker, SemanticChunk } from "./semantic-chunker.js";
import { Logger } from "../observability/logger.js";
import { randomBytes } from "crypto";

export class DocumentPipeline {
  constructor(
    private readonly knowledgeRepo: IKnowledgeRepository,
    private readonly vectorRepo: IVectorRepository,
    private readonly embeddingProvider: IEmbeddingProvider,
    private readonly eventBus: IEventBus
  ) {}

  /**
   * Full ingestion pipeline: Upload -> Valid -> Extract -> Chunk -> Embed -> VectorStore -> Finalize
   */
  async ingestDocument(collectionId: string, title: string, content: string, metadata: Record<string, any> = {}) {
    const processingStart = Date.now();
    let documentId = "";
    
    try {
      // 1. Registration
      const document = await this.knowledgeRepo.createDocument({
        collectionId,
        title,
        sourceType: "text",
        status: "processing",
        metadata
      });
      documentId = document.id;

      await this.eventBus.publish(DomainEvents.DocumentUploaded, { documentId, collectionId });

      // 2. Versioning
      const versionHash = randomBytes(16).toString("hex"); // Simulate hash of content
      const version = await this.knowledgeRepo.createDocumentVersion({
        documentId,
        versionHash,
        byteSize: Buffer.byteLength(content, 'utf8')
      });

      // 3. Extraction & Semantic Chunking
      const chunks: SemanticChunk[] = SemanticChunker.chunk(content, metadata);
      
      // Save chunks to DB
      const dbChunks = chunks.map(c => ({
        versionId: version.id,
        content: c.content,
        chunkType: c.type,
        metadata: c.metadata,
        tokenCount: c.tokenEstimate
      }));
      
      await this.knowledgeRepo.createDocumentChunks(dbChunks);
      await this.eventBus.publish(DomainEvents.ChunksCreated, { documentId, count: chunks.length });

      // 4. Embedding Generation
      const embedStart = Date.now();
      const textsToEmbed = chunks.map(c => c.content);
      const embeddings = await this.embeddingProvider.embedBatch(textsToEmbed);
      const embedDuration = Date.now() - embedStart;
      
      await this.eventBus.publish(DomainEvents.EmbeddingsGenerated, { documentId, count: embeddings.length, embedDuration });

      // 5. Vector Store Upsertion
      const vectorStart = Date.now();
      for (let i = 0; i < chunks.length; i++) {
        // We use a pseudo-id for the vector since we didn't fetch the exact DB ids back from createMany
        const chunkId = `${version.id}-chunk-${i}`; 
        await this.vectorRepo.upsertVector(chunkId, documentId, collectionId, embeddings[i], chunks[i].metadata);
      }
      const vectorDuration = Date.now() - vectorStart;

      // 6. Finalization
      await this.knowledgeRepo.updateDocumentStatus(documentId, "indexed");
      
      const totalDuration = Date.now() - processingStart;
      
      Logger.info("Document ingestion completed", { 
        documentId, 
        chunkCount: chunks.length, 
        embedDuration, 
        vectorDuration, 
        totalDuration 
      });

      await this.eventBus.publish(DomainEvents.KnowledgeIndexed, { documentId, totalDuration });

      return document;
    } catch (error: any) {
      if (documentId) {
        await this.knowledgeRepo.updateDocumentStatus(documentId, "failed");
      }
      Logger.error("Document ingestion failed", error, { documentId });
      throw error;
    }
  }
}
