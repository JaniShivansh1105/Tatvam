import { Router } from "express";
import { practiceController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/", requireAuth, practiceController.getPracticeSets);
router.post("/generate", requireAuth, practiceController.generateSet);
router.post("/question/:questionId/submit", requireAuth, practiceController.submitAnswer);
router.post("/set/:setId/complete", requireAuth, practiceController.completeSet);

export const practiceRouter = router;
