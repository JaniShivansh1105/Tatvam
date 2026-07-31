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
             const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
             
             const prompt = "Extract all text from this document accurately. Preserve headings, paragraphs, and lists. Do not summarize.";
             const imageParts = [{ inlineData: { data: file.buffer.toString("base64"), mimeType: "application/pdf" } }];
             
             const result = await model.generateContent([prompt, ...imageParts]);
             content = result.response.text() || "OCR fallback failed to extract text.";
           } catch (ocrError) {
             console.error("OCR fallback failed:", ocrError);
             content = "OCR extraction failed. Please ensure the document is readable.";
           }
        }
      } else if (file.mimetype.includes("word") || file.originalname.endsWith(".docx")) {
        try {
          const mammoth = await import("mammoth");
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          content = result.value;
        } catch (e) {
          console.error("DOCX extraction failed", e);
          content = "Failed to extract DOCX text.";
        }
      } else if (file.mimetype.includes("presentation") || file.originalname.endsWith(".pptx")) {
        try {
          // Temporarily write to disk for officeparser since it reliably works with file paths
          const fs = await import("fs");
          const path = await import("path");
          const os = await import("os");
          const tempPath = path.join(os.tmpdir(), uniqueFileName);
          fs.writeFileSync(tempPath, file.buffer);
          
          const officeparser = (await import("officeparser")).default;
          const ast = await officeparser.parseOffice(tempPath);
          content = (ast as any).toText ? (ast as any).toText() : String(ast);
          fs.unlinkSync(tempPath); // cleanup
        } catch (e) {
          console.error("PPTX extraction failed", e);
          content = "Failed to extract PPTX text.";
        }
      } else if (file.mimetype.includes("image") || file.originalname.match(/\.(png|jpg|jpeg)$/)) {
        try {
           const { GoogleGenerativeAI } = await import("@google/generative-ai");
           const { env } = await import("../../../config/env.js");
           const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY || "");
           const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
           
           const prompt = "Extract all text from this image. If it's a diagram, describe it along with the text. Do not summarize.";
           const imageParts = [{ inlineData: { data: file.buffer.toString("base64"), mimeType: file.mimetype || "image/jpeg" } }];
           
           const result = await model.generateContent([prompt, ...imageParts]);
           content = result.response.text() || "Failed to extract text from image.";
        } catch (e) {
           console.error("Image OCR failed", e);
           content = "Image OCR extraction failed.";
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
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      // Aggregate knowledge
      const aggregatedData = {
        concepts: new Set<string>(),
        definitions: [] as any[],
        formulae: new Set<string>(),
        relationships: new Set<string>(),
        dependencies: new Set<string>(),
        learningGraph: new Set<string>(),
        importantTopics: new Set<string>()
      };

      const seenDefs = new Set<string>();

      const { documentPipeline } = await import("../../../di/container.js");
      for (const doc of documents) {
        const metadata = doc.metadata as any;
        console.log(`\n[4. Verification] GET /knowledge/context processing document ${doc.id}`);
        console.log(`Document title: ${doc.title}`);
        console.log(`Document status: ${doc.status}`);
        console.log(`Has metadata?: ${!!metadata}`);
        console.log(`Has metadata.extractedKnowledge?: ${!!metadata?.extractedKnowledge}`);

        if (!metadata || !metadata.extractedKnowledge) {
          console.log(`[Knowledge API] Triggering auto-recovery for missing knowledge in document ${doc.id}`);
          documentPipeline.autoRecoverDocument(doc.id).catch((e: any) => console.error(e));
          continue;
        }
        if (metadata && metadata.extractedKnowledge) {
          const ek = metadata.extractedKnowledge;
          if (Array.isArray(ek.concepts)) ek.concepts.forEach((c: string) => aggregatedData.concepts.add(c));
          if (Array.isArray(ek.formulae)) ek.formulae.forEach((f: string) => aggregatedData.formulae.add(f));
          if (Array.isArray(ek.relationships)) ek.relationships.forEach((r: string) => aggregatedData.relationships.add(r));
          if (Array.isArray(ek.dependencies)) ek.dependencies.forEach((d: string) => aggregatedData.dependencies.add(d));
          if (Array.isArray(ek.learningGraph)) ek.learningGraph.forEach((l: string) => aggregatedData.learningGraph.add(l));
          if (Array.isArray(ek.importantTopics)) ek.importantTopics.forEach((t: string) => aggregatedData.importantTopics.add(t));
          
          if (Array.isArray(ek.definitions)) {
            ek.definitions.forEach((def: any) => {
              if (def && def.term && !seenDefs.has(def.term.toLowerCase())) {
                seenDefs.add(def.term.toLowerCase());
                aggregatedData.definitions.push(def);
              }
            });
          }
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          concepts: Array.from(aggregatedData.concepts),
          definitions: aggregatedData.definitions,
          formulae: Array.from(aggregatedData.formulae),
          relationships: Array.from(aggregatedData.relationships),
          dependencies: Array.from(aggregatedData.dependencies),
          learningGraph: Array.from(aggregatedData.learningGraph),
          importantTopics: Array.from(aggregatedData.importantTopics)
        }
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
