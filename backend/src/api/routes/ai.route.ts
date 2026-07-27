import { Router } from "express";
import { aiController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

// Stream a chat response from the AI Mentor
router.post("/mentor/chat", requireAuth, aiController.chat);

// Get chat history
router.get("/mentor/history", requireAuth, aiController.getHistory);

export const aiRouter = router;
