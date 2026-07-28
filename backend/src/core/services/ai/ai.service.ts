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

    // Slice history to only the last 10 messages to prevent token exhaustion
    const historyContext = messages.slice(-11, -1).map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text || m.content}`).join('\n\n');

    let fullPrompt = `${systemInstruction}${lessonContext}\n\n`;
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

  async generateStudyArtifact(prompt: string): Promise<any> { return {}; }
}
