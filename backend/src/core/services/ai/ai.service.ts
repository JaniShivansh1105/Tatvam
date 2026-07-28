import { IAIService } from "../../../domain/interfaces/services.interface.js";
import { IContentRepository, IChatRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { prisma } from "../../../data/prisma.js";
import { AIOrchestrator } from "./ai.orchestrator.js";

export class AIService {
  private readonly orchestrator: AIOrchestrator;
  constructor(private readonly chatRepo: IChatRepository, private readonly contentRepo: IContentRepository, private readonly _ctxBuilder: any, private readonly eventBus: IEventBus) {
    this.orchestrator = new AIOrchestrator(eventBus);
  }

  async *chatStream(userId: string, messages: any[], context: Record<string, any>, _provider: string = "gemini") {
    const lessonId = context.lessonId as string | undefined;

    // Find or create an active chat session for this user + lesson
    let session = await prisma.chatSession.findFirst({
      where: { userId, lessonId, status: "active" },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId,
          lessonId,
          title: "Mentor Session",
        },
      });
    }

    const lastMessage = messages[messages.length - 1];
    const userText = lastMessage?.text || lastMessage?.content || "Explain this concept";
    
    // Save user message
    if (lastMessage && lastMessage.role === "user") {
      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          role: "user",
          content: userText,
        },
      });
    }

    let systemInstruction = `You are Tatvam AI Mentor, a world-class pedagogical tutor. Guide the student with analogies, visual breakdowns, and active recall questions.`;
    
    if (context.strategy) {
      systemInstruction += `\nYour current pedagogical strategy is: ${context.strategy}. Please adhere to this strategy in your response.`;
    }
    
    if (context.learningState) {
      systemInstruction += `\nStudent Learning DNA:
- Visual Preference: ${context.learningState.visualPreference}
- Detail Preference: ${context.learningState.detailPreference}
- Average Confidence: ${context.learningState.averageConfidence}
Adapt your explanation length and detail level according to these preferences.`;
    }

    let lessonContext = "";
    if (lessonId) {
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (lesson) {
        lessonContext = `\nThe student is currently studying the lesson: "${lesson.title}".`;
      }
    }

    // ─────────────────────────────────────────────────────────────────
    // RAG RETRIEVAL: Retrieve relevant chunks from the Knowledge Engine
    // ─────────────────────────────────────────────────────────────────
    let ragContext = "";
    try {
      const { embeddingProvider, vectorRepo } = await import("../../../di/container.js");
      
      // 1. Generate query embedding
      const queryVector = await embeddingProvider.embedText(userText);
      
      // 2. Search Vector Database scoped to user (collectionId = userId)
      const results = await vectorRepo.searchSimilar(queryVector, userId, 5);
      
      if (results && results.length > 0) {
        ragContext = "\n\n=== RELEVANT DOCUMENTS EXTRACTED FROM STUDENT'S UPLOADS ===\n";
        ragContext += "You MUST prioritize these excerpts to answer the student's question. If the answer is found here, use it and cite the source.\n\n";
        
        results.forEach((res: any, index: number) => {
          // Parse metadata to get source context (e.g., heading, document title)
          const meta = res.metadata ? (typeof res.metadata === 'string' ? JSON.parse(res.metadata) : res.metadata) : {};
          const contextStr = meta.context ? `Section: ${meta.context}` : `Chunk ${index + 1}`;
          
          ragContext += `[Citation: Document (User Uploaded), ${contextStr}]\n`;
          ragContext += `${res.content}\n\n`;
        });
      }
    } catch (ragError) {
      console.error("[AIService ChatStream] RAG Retrieval Failed:", ragError);
      // Fail gracefully: proceed without RAG context if search fails
    }

    // Slice history to only the last 10 messages to prevent token exhaustion
    const historyContext = messages.slice(-11, -1).map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text || m.content}`).join('\n\n');

    let fullPrompt = `${systemInstruction}${lessonContext}\n\n`;
    if (ragContext) fullPrompt += `${ragContext}\n\n`;
    if (historyContext) fullPrompt += `Previous Conversation:\n${historyContext}\n\n`;
    fullPrompt += `Student Question: ${userText}`;

    try {
      const availableProviders = (await import("./providers/provider.manager.js")).ProviderManager.getAvailableProviders(await import("./ai.config.js").then(m => m.AI_FEATURES.mentor));
      
      if (availableProviders.length === 0) {
        throw new Error("No healthy providers available");
      }

      const { ProviderRegistry } = await import("./providers/provider.registry.js");
      const { AIErrorClassifier } = await import("./ai.error-classifier.js");
      const providerManager = (await import("./providers/provider.manager.js")).ProviderManager;
      const config = await import("./ai.config.js").then(m => m.AI_FEATURES.mentor);

      let success = false;
      let fullAssistantResponse = "";
      
      for (const providerName of availableProviders) {
        const provider = ProviderRegistry.getProvider(providerName);
        let firstChunkReceived = false;
        try {
          const providerStartTime = Date.now();
          const responseStream = provider.generateStream(fullPrompt, config);
          
          for await (const chunk of responseStream) {
            if (!firstChunkReceived) {
              firstChunkReceived = true;
              providerManager.reportSuccess(providerName, Date.now() - providerStartTime);
            }
            fullAssistantResponse += chunk;
            yield chunk;
          }
          success = true;
          break; // successfully finished stream
        } catch (e: any) {
          const classification = AIErrorClassifier.classify(e, providerName);
          console.error(`[AIService ChatStream] Provider ${providerName} failed with ${classification}:`, e);
          providerManager.reportFailure(providerName, classification);
          
          if (firstChunkReceived) {
            yield "\n\n[Connection lost. Please try asking again.]";
            success = true;
            break; 
          }
        }
      }

      if (!success) {
        throw new Error("All AI providers exhausted");
      }

      if (fullAssistantResponse) {
        await prisma.chatMessage.create({
          data: {
            chatSessionId: session.id,
            role: "assistant",
            content: fullAssistantResponse,
          },
        });
        
        const { DomainEvents } = await import("../../events/domain-events.js");
        await this.eventBus.publish(DomainEvents.ConversationCompleted, { 
          userId, lessonId, sessionId: session.id 
        });
      }
    } catch (error) {
      console.error("[AIService ChatStream Total Exhaustion Error]", error);
      yield "We've temporarily reached today's AI capacity across all available providers. Your conversations are safely saved. Please try again later.";
    }
  }

  async getHistory(userId: string, lessonId?: string) {
    let targetLessonId: string | null | undefined = lessonId;
    if (lessonId === "null" || lessonId === "") {
      targetLessonId = null;
    }

    return prisma.chatSession.findMany({
      where: {
        userId,
        lessonId: targetLessonId !== undefined ? targetLessonId : undefined,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
  }

  async generateStudyPlanTasks(userId: string, type: string) {
    const lessons = await prisma.lesson.findMany({ orderBy: { order: "asc" } });
    return this.orchestrator.execute("studyPlan", userId, { type, lessons });
  }

  async generatePracticeQuestions(userId: string, lessonId: string | null, type: string, difficulty: string) {
    return this.orchestrator.execute("practice", userId, { lessonId, type, difficulty });
  }

  async generateDashboardRecommendations(userId: string, stats: any, nextLesson: any) {
    return this.orchestrator.execute("recommendation", userId, { stats, nextLesson });
  }

  async generateStudyArtifact(userId: string, artifactType: string, requestContent: string, lessonId?: string): Promise<any> {
    let ragContext = "";
    try {
      const { embeddingProvider, vectorRepo } = await import("../../../di/container.js");
      const queryVector = await embeddingProvider.embedText(`${artifactType} ${requestContent}`);
      const results = await vectorRepo.searchSimilar(queryVector, userId, 10);
      
      if (results && results.length > 0) {
        ragContext = "\n\n=== SOURCE KNOWLEDGE (USE EXCLUSIVELY) ===\n";
        results.forEach((res: any) => {
          ragContext += `${res.content}\n\n`;
        });
      }
    } catch (e) {
      console.error("[AIService] Artifact RAG Retrieval Failed:", e);
    }

    const systemPrompt = `You are Tatvam's AI Resource Generator. Your task is to generate a highly accurate study resource of type: ${artifactType}. 
Generate the content strictly based on the following source knowledge if provided.
Format your output as raw JSON without markdown code blocks. The JSON must have:
{
  "title": "String",
  "description": "String",
  "tags": ["tag1", "tag2"],
  "content": { <the actual artifact data based on type, e.g. an array of flashcards> }
}
${ragContext}
`;

    const userPrompt = `Generate a ${artifactType} for: ${requestContent}`;

    const availableProviders = (await import("./providers/provider.manager.js")).ProviderManager.getAvailableProviders(await import("./ai.config.js").then(m => m.AI_FEATURES.artifact));
    
    if (availableProviders.length === 0) {
      throw new Error("No providers available for artifact generation.");
    }
    
    const { ProviderRegistry } = await import("./providers/provider.registry.js");
    const config = await import("./ai.config.js").then(m => m.AI_FEATURES.artifact);
    
    for (const providerName of availableProviders) {
       try {
         const provider = ProviderRegistry.getProvider(providerName);
         const response = await provider.generateJSON(`${systemPrompt}\n\n${userPrompt}`, config);
         // If provider.generateJSON returns an object directly, we don't need to JSON.parse it if it's already parsed
         // But if it returns string, we parse. Let's just return response directly assuming it returns parsed JSON, or we check type.
         return typeof response === 'string' ? JSON.parse(response.replace(/```json/g, '').replace(/```/g, '').trim()) : response;
       } catch (err) {
         console.warn(`[AIService] generateStudyArtifact failed with provider ${providerName}`, err);
         continue;
       }
    }
    throw new Error("All AI providers exhausted for generateStudyArtifact.");
  }
}
