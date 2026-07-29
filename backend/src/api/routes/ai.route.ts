import { Router } from "express";
import { aiController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

// Stream a chat response from the AI Mentor
router.post("/mentor/chat", requireAuth, aiController.chat);

// Get chat history
router.get("/mentor/history", requireAuth, aiController.getHistory);

// Update chat session
router.patch("/mentor/sessions/:id", requireAuth, aiController.updateSession);

// Delete chat session
router.delete("/mentor/sessions/:id", requireAuth, aiController.deleteSession);

// Generate educational artifact
router.post("/mentor/artifact", requireAuth, aiController.generateArtifact);

export const aiRouter = router;
