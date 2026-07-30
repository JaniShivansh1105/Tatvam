import { Request, Response } from "express";
import { ingestDocumentUseCase } from "../../../di/container.js";

export class KnowledgeController {
  async uploadDocument(req: Request, res: Response) {
    const requestId = (req as any).requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = (req as any).user;
    const file = req.file;

    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      console.log(`UPLOAD REQUEST RECEIVED\n`);
      console.log(`Request ID: ${requestId}`);
      console.log(`User ID: ${user?.id || 'Unauthenticated'}`);
      console.log(`Original File Name: ${file?.originalname || 'N/A'}`);
      console.log(`Stored File Name: ${file?.filename || 'Memory Buffer'}`);
      console.log(`File Size: ${file?.size || 0} bytes`);
      console.log(`Mime Type: ${file?.mimetype || 'N/A'}`);
      console.log(`Timestamp: ${new Date().toISOString()}\n`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      console.log(`[1/8] Authentication`);
      if (!file) {
        throw new Error("No file uploaded");
      }
      
      if (!user) {
        throw new Error("Unauthorized");
      }
      console.log(`✓ Success\n\n↓\n`);

      console.log(`[2/8] Collection Lookup / Creation`);
      const { prisma } = await import("../../../data/prisma.js");
      let collection = await prisma.knowledgeCollection.findFirst({
        where: { ownerId: user.userId, name: "Default Collection" }
      });
      if (!collection) {
        collection = await prisma.knowledgeCollection.create({
          data: { name: "Default Collection", ownerId: user.userId, isPublic: false }
        });
      }
      const collectionId = collection.id;
      
      const fs = await import("fs");
      const path = await import("path");
      const { env } = await import("../../../config/env.js");
      
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const uniqueFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      fs.writeFileSync(path.join(uploadDir, uniqueFileName), file.buffer);
      const fileUrl = `${env.FRONTEND_URL.replace('3000', '4000')}/uploads/${uniqueFileName}`;
      
      console.log(`✓ Success\n\n↓\n`);

      console.log(`[3/8] File Saved / Read Content`);
      // Read file content
      let content = "";
      if (file.mimetype === "application/pdf") {
        const { PDFParse } = await import("pdf-parse");
        const parser = new PDFParse({ data: file.buffer });
        const pdfData = await parser.getText();
        content = pdfData.text;
        await parser.destroy();
        
        // Fallback for image-heavy or scanned PDFs without OCR
        if (content.trim().length < 50) {
           try {
             const { GoogleGenerativeAI } = await import("@google/generative-ai");
             const { env } = await import("../../../config/env.js");
             const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
             const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
             
             const prompt = "Extract all text from this document accurately. Preserve headings, paragraphs, and lists. Do not summarize.";
             const imageParts = [{ inlineData: { data: file.buffer.toString("base64"), mimeType: "application/pdf" } }];
             
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
      console.log(`✓ Success\n\n↓\n`);

      // Run Use Case
      const document = await ingestDocumentUseCase.execute(collectionId, title, content, {
        sourceType: "upload",
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        requestId,
        userId: user.userId,
        fileUrl
      });

      return res.status(200).json({ success: true, data: document });
    } catch (error: any) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      console.log(`FAILED DURING:`);
      console.log(`Initial Validation / Storage\n`);
      console.log(`Reason:\n${error.message}\n`);
      console.log(`Stack:\n${error.stack}\n`);
      console.log(`Request ID: ${requestId}`);
      console.log(`User ID: ${user?.id || 'Unknown'}`);
      console.log(`Document ID: N/A`);
      console.log(`Collection ID: N/A`);
      console.log(`Original File: ${file?.originalname || 'N/A'}`);
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

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
      // Find default collection first
      const collection = await prisma.knowledgeCollection.findFirst({
        where: { ownerId: user.userId, name: "Default Collection" }
      });

      if (!collection) {
        return res.status(200).json({ success: true, data: { concepts: [], definitions: [], formulae: [], relationships: [], dependencies: [], learningGraph: [], importantTopics: [] } });
      }

      // Fetch documents for this user
      const documents = await prisma.knowledgeDocument.findMany({
        where: { collectionId: collection.id, status: "Completed" },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });

      // Fetch chunks from these documents
      const documentIds = documents.map((d: any) => d.id);
      
      const chunks = await prisma.documentChunk.findMany({
        where: {
          version: {
            documentId: { in: documentIds }
          }
        },
        take: 20
      });

      const combinedText = chunks.map((c: any) => c.content).join("\n\n");
      
      if (!combinedText.trim()) {
        return res.status(200).json({ success: true, data: { concepts: [], definitions: [], formulae: [], relationships: [], dependencies: [], learningGraph: [], importantTopics: [] } });
      }

      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const { env } = await import("../../../config/env.js");
      const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Based ONLY on the following text extracted from the user's uploaded documents, extract and generate a JSON object with these exact keys (arrays of strings or objects):
      - "concepts" (array of strings)
      - "definitions" (array of objects { term: string, definition: string })
      - "formulae" (array of strings)
      - "relationships" (array of strings)
      - "dependencies" (array of strings)
      - "learningGraph" (array of strings)
      - "importantTopics" (array of strings)
      
      If the text doesn't contain formulae, return an empty array for it. Do NOT use any external knowledge.
      
      TEXT:
      ${combinedText.substring(0, 30000)}
      
      Respond with ONLY the JSON object, no markdown blocks.`;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(responseText);

      return res.status(200).json({
        success: true,
        data: parsedData
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  async getDocuments(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ success: false, error: "Unauthorized" });

      const { prisma } = await import("../../../data/prisma.js");
      // Find default collection
      const collection = await prisma.knowledgeCollection.findFirst({
        where: { ownerId: user.userId, name: "Default Collection" }
      });

      if (!collection) {
        return res.status(200).json({ success: true, data: [] });
      }

      const documents = await prisma.knowledgeDocument.findMany({
        where: { collectionId: collection.id },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json({ success: true, data: documents });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
