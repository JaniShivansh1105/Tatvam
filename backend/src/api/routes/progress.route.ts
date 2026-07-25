import { Router } from "express";
import { ProgressController } from "../controllers/progress/progress.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

const progressRouter = Router();

progressRouter.use(requireAuth);

// DNA (Global)
progressRouter.get("/dna", asyncHandler(ProgressController.getDNA));
progressRouter.put("/dna", asyncHandler(ProgressController.updateDNA));

// Mastery (Lesson-Scoped)
progressRouter.get("/lessons/:lessonId/mastery", asyncHandler(ProgressController.getMastery));
progressRouter.post("/lessons/:lessonId/mastery", asyncHandler(ProgressController.recordInteraction));

// Timeline
progressRouter.get("/timeline", asyncHandler(ProgressController.getTimeline));

export { progressRouter };
