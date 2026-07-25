import { prisma } from "../../../data/prisma.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class AIService {
  static async *chatStream(userId: string, messages: any[], context: Record<string, any>, provider: string = "gemini") {
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
    
    // Save user message
    if (lastMessage && lastMessage.role === "user") {
      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          role: "user",
          content: lastMessage.content,
        },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const fallbackChunk = "AI Key not configured. Streaming static response: Tatvam is active and ready to help you master concepts!";
      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          role: "assistant",
          content: fallbackChunk,
        },
      });
      yield fallbackChunk;
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-[topicId]" });

    const systemInstruction = `You are Tatvam AI Mentor, a world-class pedagogical tutor. Guide the student with analogies, visual breakdowns, and active recall questions.`;

    const promptText = `${systemInstruction}\n\nUser Question: ${lastMessage?.content || "Explain this concept"}`;

    const responseStream = await model.generateContentStream(promptText);

    let fullAssistantResponse = "";

    for await (const chunk of responseStream.stream) {
      const text = chunk.text();
      fullAssistantResponse += text;
      yield text;
    }

    // Save full assistant message after stream completes
    if (fullAssistantResponse) {
      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          role: "assistant",
          content: fullAssistantResponse,
        },
      });
    }
  }

  static async getHistory(userId: string, lessonId?: string) {
    return prisma.chatSession.findMany({
      where: {
        userId,
        ...(lessonId && { lessonId }),
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
}
