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
      
      // 4. Embedding
      currentStageName = "Embedding Generation";
      currentStageIndex = 7;
      await this.knowledgeRepo.updateDocumentStatus(documentId, currentStageName);
      const embedStart = Date.now();
      const textsToEmbed = chunks.map(c => c.content);
      const embeddings = await this.embeddingProvider.embedBatch(textsToEmbed);
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
      try {
        const { aiService } = await import("../../di/container.js");
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

        console.log(`[${artifactStageIndex}/10] ${currentStageName}\n✓ Success\n\n↓\n`);
      } catch (artifactErr: any) {
        console.warn(`[${artifactStageIndex}/10] ${currentStageName} Skipped (Non-fatal): ${artifactErr.message}\n\n↓\n`);
      }

      // 6.5 Extract Knowledge Graph (Concepts, Definitions, etc)
      currentStageName = "Extracting Knowledge Graph";
      const extractStageIndex = 10;
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const { env } = await import("../../config/env.js");
        const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const extractedKnowledge = JSON.parse(responseText);

        await prisma.knowledgeDocument.update({
          where: { id: documentId },
          data: {
            metadata: {
              ...(metadata || {}),
              extractedKnowledge
            }
          }
        });
        console.log(`[${extractStageIndex}/10] ${currentStageName}\n✓ Success\n\n↓\n`);
      } catch (extractErr: any) {
        console.warn(`[${extractStageIndex}/10] ${currentStageName} Skipped (Non-fatal): ${extractErr.message}\n\n↓\n`);
      }

      // 7. Finalization
      await this.knowledgeRepo.updateDocumentStatus(documentId, "Completed"); // Used 'Completed' to match getKnowledgeContext query
      
      const totalDuration = Date.now() - processingStart;
      
      console.log(`UPLOAD COMPLETED\n`);
      Logger.info("Document ingestion completed", { 
        documentId, 
        chunkCount: chunks.length, 
        embedDuration, 
        vectorDuration, 
        totalDuration 
      });

      await this.eventBus.publish(DomainEvents.KnowledgeIndexed, { documentId, totalDuration });
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
}
