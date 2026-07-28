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
      // 1. Registration (Synchronous)
      const document = await this.knowledgeRepo.createDocument({
        collectionId,
        title,
        sourceType: "text",
        status: "processing",
        metadata
      });
      documentId = document.id;

      await this.eventBus.publish(DomainEvents.DocumentUploaded, { documentId, collectionId });

      // Run heavy processing asynchronously without awaiting
      this._processDocumentBackground(documentId, collectionId, title, content, metadata, processingStart).catch(err => {
        Logger.error("Background ingestion wrapper failed", err, { documentId });
      });

      return document;
    } catch (error: any) {
      Logger.error("Document registration failed", error);
      throw error;
    }
  }

  private async _processDocumentBackground(documentId: string, collectionId: string, title: string, content: string, metadata: any, processingStart: number) {
    try {
      // 2. Versioning
      const versionHash = randomBytes(16).toString("hex"); // Simulate hash of content
      const version = await this.knowledgeRepo.createDocumentVersion({
        documentId,
        versionHash,
        byteSize: Buffer.byteLength(content, 'utf8')
      });

      // 3. Extraction & Semantic Chunking
      const chunks: SemanticChunk[] = SemanticChunker.chunk(content, metadata);
      
      // Save chunks and Embeddings (Fixing UUID Cast bug)
      const embedStart = Date.now();
      const textsToEmbed = chunks.map(c => c.content);
      const embeddings = await this.embeddingProvider.embedBatch(textsToEmbed);
      const embedDuration = Date.now() - embedStart;
      
      await this.eventBus.publish(DomainEvents.EmbeddingsGenerated, { documentId, count: embeddings.length, embedDuration });

      const vectorStart = Date.now();
      const { prisma } = await import("../../data/prisma.js");
      
      for (let i = 0; i < chunks.length; i++) {
        // 1. Create chunk
        const createdChunk = await prisma.documentChunk.create({
          data: {
            versionId: version.id,
            content: chunks[i].content,
            chunkType: chunks[i].type,
            metadata: chunks[i].metadata as any,
            tokenCount: chunks[i].tokenEstimate
          }
        });
        
        // 2. Upsert Vector using correct UUID
        await this.vectorRepo.upsertVector(createdChunk.id, documentId, collectionId, embeddings[i], chunks[i].metadata);
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
    } catch (error: any) {
      await this.knowledgeRepo.updateDocumentStatus(documentId, "failed");
      Logger.error("Document ingestion background processing failed", error, { documentId });
    }
  }
}
