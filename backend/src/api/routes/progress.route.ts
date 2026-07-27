import { Router } from "express";
import { progressController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

const progressRouter = Router();

progressRouter.use(requireAuth);

// DNA (Global)
progressRouter.get("/dna", asyncHandler(progressController.getDNA.bind(progressController)));
progressRouter.put("/dna", asyncHandler(progressController.updateDNA.bind(progressController)));

// Mastery (Lesson-Scoped)
progressRouter.get("/lessons/:lessonId/mastery", asyncHandler(progressController.getMastery.bind(progressController)));
progressRouter.post("/lessons/:lessonId/mastery", asyncHandler(progressController.recordInteraction.bind(progressController)));

// Timeline
progressRouter.get("/timeline", asyncHandler(progressController.getTimeline.bind(progressController)));

export { progressRouter };
