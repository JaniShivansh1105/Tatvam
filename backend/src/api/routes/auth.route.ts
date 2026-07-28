import { Router } from "express";
import { authController } from "../../di/container.js";
import { validateRequest } from "../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { registerSchema, loginSchema, forgotPasswordSchema, verifyOTPSchema, resetPasswordSchema } from "../../core/validators/auth/auth.validator.js";
import { requireAuth } from "../middleware/require-auth.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

authRouter.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

authRouter.post(
  "/refresh",
  asyncHandler(authController.refresh.bind(authController))
);

authRouter.post(
  "/logout",
  asyncHandler(authController.logout.bind(authController))
);

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(authController.getMe.bind(authController))
);

authRouter.put(
  "/preferences",
  requireAuth,
  asyncHandler(authController.updatePreferences.bind(authController))
);

authRouter.put(
  "/profile",
  requireAuth,
  asyncHandler(authController.updateProfile.bind(authController))
);

authRouter.post(
  "/profile/onboarding",
  requireAuth,
  asyncHandler(authController.updateOnboarding.bind(authController))
);

authRouter.post(
  "/profile/subjects",
  requireAuth,
  asyncHandler(authController.addSubject.bind(authController))
);

authRouter.delete(
  "/profile/subjects/:id",
  requireAuth,
  asyncHandler(authController.removeSubject.bind(authController))
);

// ─── Forgot Password Flow ───

authRouter.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword.bind(authController))
);

authRouter.post(
  "/verify-otp",
  validateRequest(verifyOTPSchema),
  asyncHandler(authController.verifyOTP.bind(authController))
);

authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  asyncHandler(authController.resetPassword.bind(authController))
);

export { authRouter };
