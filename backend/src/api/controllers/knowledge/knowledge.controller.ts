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
      
      const { prisma } = await import("../../../data/prisma.js");
      let collection = await prisma.knowledgeCollection.findFirst({
        where: { ownerId: user.id, name: "Default Collection" }
      });
      if (!collection) {
        collection = await prisma.knowledgeCollection.create({
          data: { name: "Default Collection", ownerId: user.id, isPublic: false }
        });
      }
      const collectionId = collection.id;

      // Run Use Case
      const document = await ingestDocumentUseCase.execute(collectionId, title, content, {
        sourceType: "upload",
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      });

      return res.status(200).json({ success: true, data: document });
    } catch (error: any) {
      console.error("[KnowledgeController] Upload Error:", {
        message: error.message,
        stack: error.stack,
        fileName: __filename,
        function: "uploadDocument"
      });
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDocumentStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { prisma } = await import("../../../data/prisma.js");
      const document = await prisma.knowledgeDocument.findUnique({ where: { id } });
      if (!document) {
        return res.status(404).json({ success: false, error: "Not found" });
      }
      return res.status(200).json({ 
        success: true, 
        data: { 
          status: document.status, 
          errorReason: (document.metadata as any)?.errorReason 
        } 
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getKnowledgeContext(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const { prisma } = await import("../../../data/prisma.js");
      // Fetch documents for this user
      const documents = await prisma.knowledgeDocument.findMany({
        where: { collectionId: user.id, status: "Completed" },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      // Extract dummy or basic context from the documents metadata if available
      // In a full implementation, we'd query the Vector store or a Knowledge Graph DB
      const concepts = documents.map((d: any) => (d.metadata as any)?.title || d.title).filter(Boolean);
      
      const definitions = documents.map((d: any) => ({
        term: d.title,
        definition: `Core concept from ${d.title}. Uploaded for learning.`
      }));

      return res.status(200).json({
        success: true,
        data: {
          concepts: concepts.length > 0 ? concepts : ["Machine Learning", "Neural Networks"],
          definitions: definitions.length > 0 ? definitions : [
            { term: "Vector DB", definition: "Database designed to store and query vectors." }
          ]
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
