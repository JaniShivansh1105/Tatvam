import { Router } from "express";
import { PlansController } from "../controllers/plans/plans.controller.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/", requireAuth, PlansController.getPlans);
router.post("/", requireAuth, PlansController.createPlan);
router.put("/tasks/:taskId", requireAuth, PlansController.updateTaskStatus);

export const plansRouter = router;
