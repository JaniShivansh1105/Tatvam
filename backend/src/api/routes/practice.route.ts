import { Router } from "express";
import { PracticeController } from "../controllers/practice/practice.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/", requireAuth, PracticeController.getPracticeSets);
router.post("/generate", requireAuth, PracticeController.generateSet);
router.post("/question/:questionId/submit", requireAuth, PracticeController.submitAnswer);
router.post("/set/:setId/complete", requireAuth, PracticeController.completeSet);

export const practiceRouter = router;
