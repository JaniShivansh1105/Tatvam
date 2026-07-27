import { Router } from "express";
import { contentController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

const contentRouter = Router();

contentRouter.use(requireAuth);

contentRouter.get("/lessons/:slug", asyncHandler(contentController.getLessonBySlug.bind(contentController)));
contentRouter.get("/dashboard", asyncHandler(contentController.getDashboardContent.bind(contentController)));
contentRouter.get("/roadmap", asyncHandler(contentController.getRoadmap.bind(contentController)));
contentRouter.get("/achievements", asyncHandler(contentController.getAchievements.bind(contentController)));

export { contentRouter };
