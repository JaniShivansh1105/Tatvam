import { Router } from "express";
import { plansController } from "../../di/container.js";
import { requireAuth } from "../middleware/require-auth.js";

const router = Router();

router.get("/", requireAuth, plansController.getPlans);
router.post("/", requireAuth, plansController.createPlan);
router.put("/tasks/:taskId", requireAuth, plansController.updateTaskStatus);

export const plansRouter = router;
