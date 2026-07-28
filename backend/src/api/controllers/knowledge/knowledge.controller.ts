import { Request, Response } from "express";
import { ingestDocumentUseCase } from "../../../di/container.js";

export class KnowledgeController {
  async uploadDocument(req: Request, res: Response) {
    try {
      const file = req.file;
      const user = (req as any).user;
      
      if (!file) {
        return res.status(400).json({ success: false, error: "No file uploaded" });
      }
      
      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      // Read file content
      const content = file.buffer.toString("utf-8"); // Only supports text/markdown currently for MVP
      const title = file.originalname;
      const collectionId = user.id; // For simplicity, collectionId is userId for personal knowledge

      // Run Use Case
      const document = await ingestDocumentUseCase.execute(collectionId, title, content, {
        sourceType: "upload",
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      });

      return res.status(200).json({ success: true, data: document });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
