import { chatStreamUseCase, getHistoryUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { ChatStreamUseCase, GetHistoryUseCase } from "../../../application/ai/ai.use-cases.js";

export class AIController {
  constructor() {}
  async chat(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { messages, context, provider = "gemini" } = req.body;

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const stream = await chatStreamUseCase.execute(userId, messages, context, provider);

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
}
