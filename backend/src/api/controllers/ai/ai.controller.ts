import { chatStreamUseCase, getHistoryUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { ChatStreamUseCase, GetHistoryUseCase } from "../../../application/ai/ai.use-cases.js";

export class AIController {
  constructor() {}
  async chat(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { messages, context, provider = "gemini" } = req.body;
    const prefLang = req.headers["x-preferred-language"] as string || "English";

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const stream = await chatStreamUseCase.execute(userId, messages, context, provider, prefLang);

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error("AI Stream Error:", error);
      res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
      res.end();
    }
  }

  async getHistory(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { lessonId } = req.query;
    try {
      const history = await getHistoryUseCase.execute(userId, lessonId as string | undefined);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch history" });
    }
  }

  async updateSession(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const data = req.body;
    try {
      const { renameConversationUseCase } = await import("../../../di/container.js");
      const updated = await renameConversationUseCase.execute(userId, id, data);
      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update session" });
    }
  }

  async translate(req: Request, res: Response) {
    try {
      const { text, targetLanguage, format } = req.body;
      if (!text || !targetLanguage) {
        return res.status(400).json({ success: false, error: "text and targetLanguage required" });
      }
      
      const { aiService } = await import("../../../di/container.js");
      const translated = await aiService.translateText(text, targetLanguage, format);
      return res.json({ success: true, data: { translated } });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ success: false, error: "Translation failed" });
    }
  }

  async deleteSession(req: Request, res: Response) {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    try {
      const { deleteConversationUseCase } = await import("../../../di/container.js");
      await deleteConversationUseCase.execute(userId, id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete session" });
    }
  }

  async generateArtifact(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { artifactType, requestContent, lessonId } = req.body;
    const prefLang = req.headers["x-preferred-language"] as string || "English";
    try {
      const { aiService } = await import("../../../di/container.js");
      const artifact = await aiService.generateStudyArtifact(userId, artifactType, requestContent, lessonId, prefLang);
      res.json({ success: true, data: artifact });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to generate artifact" });
    }
  }
}
