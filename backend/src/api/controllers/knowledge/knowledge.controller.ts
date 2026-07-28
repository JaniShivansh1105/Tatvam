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
      let content = "";
      if (file.mimetype === "application/pdf") {
        const pdfModule = await import("pdf-parse");
        const pdfParse = (pdfModule as any).default || pdfModule;
        const pdfData = await pdfParse(file.buffer);
        content = pdfData.text;
        
        // Fallback for image-heavy or scanned PDFs without OCR
        if (content.trim().length < 50) {
           try {
             const { GoogleGenerativeAI } = await import("@google/generative-ai");
             const { env } = await import("../../../config/env.js");
             const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
             const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
             
             const prompt = "Extract all text from this document accurately. Preserve headings, paragraphs, and lists. Do not summarize.";
             const imageParts = [
               {
                 inlineData: {
                   data: file.buffer.toString("base64"),
                   mimeType: "application/pdf"
                 }
               }
             ];
             
             const result = await model.generateContent([prompt, ...imageParts]);
             content = result.response.text() || "OCR fallback failed to extract text.";
           } catch (ocrError) {
             console.error("OCR fallback failed:", ocrError);
             content = "OCR extraction failed. Please ensure the document is readable.";
           }
        }
      } else {
        content = file.buffer.toString("utf-8");
      }
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
