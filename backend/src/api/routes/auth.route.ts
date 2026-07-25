import { Router } from "express";
import { AuthController } from "../controllers/auth/auth.controller.js";
import { validateRequest } from "../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { registerSchema, loginSchema, forgotPasswordSchema, verifyOTPSchema, resetPasswordSchema } from "../../core/validators/auth/auth.validator.js";
import { requireAuth } from "../middleware/require-auth.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(AuthController.register)
);

authRouter.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(AuthController.login)
);

authRouter.post(
  "/refresh",
  asyncHandler(AuthController.refresh)
);

authRouter.post(
  "/logout",
  asyncHandler(AuthController.logout)
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(AuthController.getMe)
);

authRouter.put(
  "/preferences",
  requireAuth,
  asyncHandler(AuthController.updatePreferences)
);

authRouter.put(
  "/profile",
  requireAuth,
  asyncHandler(AuthController.updateProfile)
);

// ─── Forgot Password Flow ───

authRouter.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  asyncHandler(AuthController.forgotPassword)
);

authRouter.post(
  "/verify-otp",
  validateRequest(verifyOTPSchema),
  asyncHandler(AuthController.verifyOTP)
);

authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  asyncHandler(AuthController.resetPassword)
);

export { authRouter };
