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
          content: lastMessage.text || lastMessage.content,
          contextText: JSON.stringify(context),
        }
      });
    }

    let fullResponse = "";

    // If Gemini key exists, use it. Otherwise, use simulated response.
    if (provider === "gemini" && process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Construct history for Gemini
        const history = messages.slice(0, -1).map(m => ({
          role: m.role === "ai" ? "model" : "user",
          parts: [{ text: m.text || m.content }],
        }));

        const chat = model.startChat({
          history,
          systemInstruction: `You are Tatvam, an expert AI mentor. The student is learning ${context.lessonTitle || 'a concept'}. Current Strategy: ${context.strategy}. Be extremely helpful, concise, and pedagogical.`
        });

        const result = await chat.sendMessageStream(lastMessage.text || lastMessage.content);
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullResponse += chunkText;
          yield chunkText;
        }
      } catch (e) {
        console.error("Gemini AI Error:", e);
        const errorMsg = "[Error] Failed to connect to Gemini API. Check your keys or quota.";
        fullResponse = errorMsg;
        yield errorMsg;
      }
    } else {
      const prefix = provider === "openai" ? "[OpenAI-Backed]" : "[Gemini-Backed]";
      const response = `${prefix} This is a secure, backend-proxied AI response. The architecture is now ready to drop in the real SDK utilizing environment variables safely. Strategy used: ${context.strategy}.`;
      
      const chunks = response.split(" ");
      for (const chunk of chunks) {
        await new Promise(r => setTimeout(r, 50));
        fullResponse += chunk + " ";
        yield chunk + " ";
      }
    }
    
    // Save assistant message
    if (fullResponse) {
      await prisma.chatMessage.create({
        data: {
          chatSessionId: session.id,
          role: "assistant",
          content: fullResponse,
        }
      });
    }
  }
}
