import { Router } from "express";
import { AIController } from "../controllers/ai/ai.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

// Stream a chat response from the AI Mentor
router.post("/mentor/chat", requireAuth, AIController.chat);

export const aiRouter = router;
