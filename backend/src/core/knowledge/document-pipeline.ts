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

      await this.eventBus.publish(DomainEvents.DocumentUploaded, { documentId, collectionId, userId: metadata.userId || "unknown_user", title });

      // Run heavy processing synchronously
      await this._processDocumentBackground(documentId, collectionId, title, content, metadata, processingStart);

      const { prisma } = await import("../../data/prisma.js");
      const updatedDocument = await prisma.knowledgeDocument.findUnique({
        where: { id: documentId }
      });

      return updatedDocument || document;
    } catch (error: any) {
      Logger.error("Document registration failed", error);
      throw error;
    }
  }

  private async _processDocumentBackground(documentId: string, collectionId: string, title: string, content: string, metadata: any, processingStart: number) {
    let currentStageName = "Text Extraction";
    let currentStageIndex = 4;
    const totalStages = 8;
    const requestId = metadata.requestId || "unknown_req";
    const userId = metadata.userId || "unknown_user";

    const logStageSuccess = (index: number, name: string) => {
      console.log(`[${index}/${totalStages}] ${name}\n✓ Success\n\n↓\n`);
    };

    try {
      // 2. Versioning (Text Extraction step)
      currentStageName = "Text Extraction";
      currentStageIndex = 4;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      const versionHash = randomBytes(16).toString("hex");
      const version = await this.knowledgeRepo.createDocumentVersion({
        documentId,
        versionHash,
        byteSize: Buffer.byteLength(content, 'utf8')
      });
      logStageSuccess(currentStageIndex, currentStageName);

      // OCR step (We'll assume it passed if we got here, since we do it in controller, but pipeline will log it as 5)
      currentStageName = "OCR";
      currentStageIndex = 5;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      logStageSuccess(currentStageIndex, currentStageName);

      // 3. Chunking
      currentStageName = "Semantic Chunking";
      currentStageIndex = 6;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      const chunks: SemanticChunk[] = SemanticChunker.chunk(content, metadata);
      logStageSuccess(currentStageIndex, currentStageName);
      
      // Helper for retries
      const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
        let lastErr;
        for (let attempt = 1; attempt <= retries; attempt++) {
          try { return await fn(); }
          catch (e) {
            lastErr = e;
            if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        }
        throw lastErr;
      };

      // 4. Embedding
      currentStageName = "Embedding Generation";
      currentStageIndex = 7;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      const embedStart = Date.now();
      const textsToEmbed = chunks.map(c => c.content);
      const embeddings = await withRetry(() => this.embeddingProvider.embedBatch(textsToEmbed));
      const embedDuration = Date.now() - embedStart;
      
      await this.eventBus.publish(DomainEvents.EmbeddingsGenerated, { documentId, count: embeddings.length, embedDuration });
      logStageSuccess(currentStageIndex, currentStageName);

      // 5. Vector Indexing
      currentStageName = "Vector Indexing";
      currentStageIndex = 8;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      const vectorStart = Date.now();
      const { prisma } = await import("../../data/prisma.js");
      
      for (let i = 0; i < chunks.length; i++) {
        const createdChunk = await prisma.documentChunk.create({
          data: {
            versionId: version.id,
            content: chunks[i].content,
            chunkType: chunks[i].type,
            metadata: chunks[i].metadata as any,
            tokenCount: chunks[i].tokenEstimate
          }
        });
        await this.vectorRepo.upsertVector(createdChunk.id, documentId, collectionId, embeddings[i], chunks[i].metadata);
      }
      const vectorDuration = Date.now() - vectorStart;
      logStageSuccess(currentStageIndex, currentStageName);

      // 6. Auto-Generating Resources (Part 7: Resources Tab)
      currentStageName = "Auto-Generating Resources";
      const artifactStageIndex = 9;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      const { aiService } = await import("../../di/container.js");
      
      await withRetry(async () => {
        const flashcardsArtifact = await aiService.generateStudyArtifact(userId, "Flashcards", `Important concepts from ${title}`);
        await prisma.educationalArtifact.create({
          data: {
            title: flashcardsArtifact.title,
            artifactType: "Flashcards",
            description: flashcardsArtifact.description,
            content: flashcardsArtifact.content,
            tags: flashcardsArtifact.tags,
            ownerId: userId
          }
        });
        
        const notesArtifact = await aiService.generateStudyArtifact(userId, "Smart Notes", `Key summary and notes from ${title}`);
        await prisma.educationalArtifact.create({
          data: {
            title: notesArtifact.title,
            artifactType: "Smart Notes",
            description: notesArtifact.description,
            content: notesArtifact.content,
            tags: notesArtifact.tags,
            ownerId: userId
          }
        });
      }, 3);
      console.log(`[${artifactStageIndex}/10] ${currentStageName}\n✓ Success\n\n↓\n`);

      // 6.5 Extract Knowledge Graph (Concepts, Definitions, etc)
      currentStageName = "Extracting Knowledge Graph";
      const extractStageIndex = 10;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      
      await withRetry(async () => {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const { env } = await import("../../config/env.js");
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } });

        const combinedText = chunks.slice(0, 30).map(c => c.content).join("\n\n");
        const prompt = `Based ONLY on the following text extracted from the user's uploaded documents, extract and generate a JSON object with these exact keys (arrays of strings or objects):
        - "concepts" (array of strings)
        - "definitions" (array of objects { term: string, definition: string })
        - "formulae" (array of strings)
        - "relationships" (array of strings)
        - "dependencies" (array of strings)
        - "learningGraph" (array of strings)
        - "importantTopics" (array of strings)
        
        If the text doesn't contain formulae, return an empty array for it. Do NOT use any external knowledge.
        
        TEXT:
        ${combinedText.substring(0, 30000)}
        
        Respond with ONLY the JSON object, no markdown blocks.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();
        responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const extractedKnowledge = JSON.parse(responseText);
        console.log(`\n\n[1. Verification] Extracted Knowledge Generated: ${!!extractedKnowledge} | Concepts count: ${extractedKnowledge?.concepts?.length || 0}`);

        await prisma.knowledgeDocument.update({
          where: { id: documentId },
          data: {
            metadata: {
              ...(metadata || {}),
              extractedKnowledge
            }
          }
        });
        console.log(`[2. Verification] Prisma update() completed.`);

        const verifDoc = await prisma.knowledgeDocument.findUnique({ where: { id: documentId } });
        const verifMetadata = verifDoc?.metadata as any;
        console.log(`[3. Verification] Immediately after update, read document metadata:`);
        console.log(`Has extractedKnowledge?: ${!!verifMetadata?.extractedKnowledge}`);
        if (!verifMetadata?.extractedKnowledge) {
          console.error(`ERROR: extractedKnowledge is missing from DB metadata! Saving failed!`);
        }
      }, 3);
      console.log(`[${extractStageIndex}/10] ${currentStageName}\n✓ Success\n\n↓\n`);

      // 7. Finalization
      await this.knowledgeRepo.updateDocumentStatus(documentId, "Completed");
      
      const totalDuration = Date.now() - processingStart;
      
      console.log(`UPLOAD COMPLETED\n`);
      Logger.info("Document ingestion completed", { 
        documentId, 
        chunkCount: chunks.length, 
        embedDuration, 
        vectorDuration, 
        totalDuration 
      });

      await this.eventBus.publish(DomainEvents.KnowledgeIndexed, { documentId, totalDuration, userId, title });
    } catch (error: any) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      console.log(`FAILED DURING:\n`);
      console.log(`${currentStageName}\n`);
      console.log(`Reason:\n`);
      console.log(`${error.message}\n`);
      console.log(`Stack:\n`);
      console.log(`${error.stack}\n`);
      console.log(`Request ID: ${requestId}`);
      console.log(`User ID: ${userId}`);
      console.log(`Document ID: ${documentId}`);
      console.log(`Collection ID: ${collectionId}`);
      console.log(`Original File: ${metadata.originalName || 'Unknown'}\n`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

      const { prisma } = await import("../../data/prisma.js");
      const exactErrorReason = `${currentStageName} Failed`;
      
      await prisma.knowledgeDocument.update({
        where: { id: documentId },
        data: { 
          status: exactErrorReason, 
          metadata: { 
            ...(metadata || {}), 
            errorReason: error.message,
            failedStage: currentStageName,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
          }
        }
      });
      Logger.error(`Document ingestion background processing failed at ${currentStageName}`, error, { documentId });
    }
  }

  /**
   * Auto-recover a completed document that is missing its extracted knowledge or resources.
   * This retrieves chunks from the database to reconstruct content.
   */
  async autoRecoverDocument(documentId: string): Promise<void> {
    const { prisma } = await import("../../data/prisma.js");
    const doc = await prisma.knowledgeDocument.findUnique({ 
      where: { id: documentId },
      include: { collection: true }
    });
    if (!doc) return;
    
    const metadata = doc.metadata as any;
    if (doc.status === "Completed" && metadata && metadata.extractedKnowledge) {
      return; // Already good
    }
    
    // Attempt recovery
    console.log(`[AutoRecovery] Starting recovery for ${documentId}`);
    try {
      const versions = await prisma.documentVersion.findMany({ 
        where: { documentId: doc.id }, 
        include: { chunks: true },
        orderBy: { createdAt: 'desc' },
        take: 1
      });
      
      if (!versions.length || !versions[0].chunks.length) {
        console.log(`[AutoRecovery] No chunks found for ${documentId}`);
        return;
      }
      
      const chunks = versions[0].chunks;
      const combinedText = chunks.slice(0, 30).map(c => c.content).join("\n\n");
      const userId = metadata?.userId || doc.collection.ownerId;
      const title = doc.title;

      const withRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
        let lastErr;
        for (let attempt = 1; attempt <= retries; attempt++) {
          try { return await fn(); }
          catch (e) {
            lastErr = e;
            if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        }
        throw lastErr;
      };

      // 1. Regenerate Resources
      const { aiService } = await import("../../di/container.js");
      await withRetry(async () => {
        const flashcardsArtifact = await aiService.generateStudyArtifact(userId, "Flashcards", `Important concepts from ${title}`);
        await prisma.educationalArtifact.create({
          data: {
            title: flashcardsArtifact.title,
            artifactType: "Flashcards",
            description: flashcardsArtifact.description,
            content: flashcardsArtifact.content,
            tags: flashcardsArtifact.tags,
            ownerId: userId,
            sourceKnowledgeIds: [documentId]
          }
        });
        
        const notesArtifact = await aiService.generateStudyArtifact(userId, "Smart Notes", `Key summary and notes from ${title}`);
        await prisma.educationalArtifact.create({
          data: {
            title: notesArtifact.title,
            artifactType: "Smart Notes",
            description: notesArtifact.description,
            content: notesArtifact.content,
            tags: notesArtifact.tags,
            ownerId: userId,
            sourceKnowledgeIds: [documentId]
          }
        });
      }, 3);
      console.log(`[AutoRecovery] Generated resources for ${documentId}`);

      // 2. Extract Knowledge Graph
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const { env } = await import("../../config/env.js");
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-flash-latest", generationConfig: { responseMimeType: "application/json" } });

      const prompt = `Based ONLY on the following text extracted from the user's uploaded documents, extract and generate a JSON object with these exact keys (arrays of strings or objects):
      - "concepts" (array of strings)
      - "definitions" (array of objects { term: string, definition: string })
      - "formulae" (array of strings)
      - "relationships" (array of strings)
      - "dependencies" (array of strings)
      - "learningGraph" (array of strings)
      - "importantTopics" (array of strings)
      
      If the text doesn't contain formulae, return an empty array for it. Do NOT use any external knowledge.
      
      TEXT:
      ${combinedText.substring(0, 30000)}
      
      Respond with ONLY the JSON object, no markdown blocks.`;

      const result = await withRetry(() => model.generateContent(prompt), 3);
      let responseText = result.response.text();
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const extractedKnowledge = JSON.parse(responseText);

      await prisma.knowledgeDocument.update({
        where: { id: documentId },
        data: {
          status: "Completed",
          metadata: {
            ...(metadata || {}),
            extractedKnowledge
          }
        }
      });
      console.log(`[AutoRecovery] Successfully recovered ${documentId}`);
    } catch (err: any) {
      console.error(`[AutoRecovery] Failed for ${documentId}: ${err.message}`);
    }
  }
}
