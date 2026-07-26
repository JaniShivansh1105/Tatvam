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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const responseStream = await model.generateContentStream(fullPrompt);

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

  static async generateStudyPlanTasks(userId: string, type: string) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback if no API key
      return [
        { title: "Review introductory concepts", lessonId: null },
        { title: "Complete fundamental practice set", lessonId: null },
      ];
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch user context
    const masteries = await prisma.conceptMastery.findMany({
      where: { userId },
      include: { lesson: true }
    });

    const lessons = await prisma.lesson.findMany({
      orderBy: { order: "asc" }
    });

    let masteryContext = "";
    if (masteries.length > 0) {
      masteryContext = masteries.map(m => `- ${m.lesson.title}: ${Math.round(m.confidence * 100)}% mastery`).join("\n");
    } else {
      masteryContext = "No prior mastery data. The student is a beginner.";
    }

    const lessonContext = lessons.map(l => `- ${l.title} (ID: ${l.id})`).join("\n");

    const prompt = `You are an expert AI tutor. Generate a personalized study plan for a student.
Plan Type: ${type} (daily = 3-4 short tasks, weekly = 7-10 tasks, adaptive = 5-7 focused tasks).

Student's Current Concept Mastery:
${masteryContext}

Available Curriculum Lessons:
${lessonContext}

Rules:
1. Return ONLY a raw JSON array of objects.
2. Each object MUST have "title" (string) and "lessonId" (string or null).
3. If a task applies to a specific lesson, provide its exact UUID from the curriculum list above. Otherwise, set it to null.
4. Do NOT wrap the JSON in markdown code blocks. Output raw JSON only.

Example Output:
[
  { "title": "Review Laws of Motion", "lessonId": "uuid-here" },
  { "title": "Take adaptive practice test", "lessonId": null }
]`;

    try {
      const response = await model.generateContent(prompt);
      let text = response.response.text().trim();
      if (text.startsWith("\`\`\`json")) text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      else if (text.startsWith("\`\`\`")) text = text.replace(/\`\`\`/g, "").trim();
      
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Plan Generation Error:", error);
      return [
        { title: "Review foundational concepts", lessonId: null },
        { title: "Complete general practice test", lessonId: null }
      ];
    }
  }
}
