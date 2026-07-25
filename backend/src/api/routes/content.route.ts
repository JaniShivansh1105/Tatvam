import { Router } from "express";
import { ContentController } from "../controllers/content/content.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { asyncHandler } from "../../utils/async-handler.js";

const contentRouter = Router();

contentRouter.use(requireAuth);

contentRouter.get("/lessons/:slug", asyncHandler(ContentController.getLessonBySlug));
contentRouter.get("/dashboard", asyncHandler(ContentController.getDashboardContent));
contentRouter.get("/roadmap", asyncHandler(ContentController.getRoadmap));
contentRouter.get("/achievements", asyncHandler(ContentController.getAchievements));

export { contentRouter };
