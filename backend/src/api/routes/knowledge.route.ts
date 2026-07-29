import { Router } from "express";
import { knowledgeController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import multer from "multer";

const knowledgeRouter = Router();

// Store files in memory buffer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

knowledgeRouter.use(requireAuth);

knowledgeRouter.post(
  "/upload",
  upload.single("file"),
  asyncHandler(knowledgeController.uploadDocument.bind(knowledgeController))
);

knowledgeRouter.get(
  "/document/:id/status",
  asyncHandler(knowledgeController.getDocumentStatus.bind(knowledgeController))
);

knowledgeRouter.get(
  "/context",
  asyncHandler(knowledgeController.getKnowledgeContext.bind(knowledgeController))
);

export { knowledgeRouter };
