import { registerUseCase, loginUseCase, refreshUseCase, logoutUseCase, getMeUseCase, updatePreferencesUseCase, updateProfileUseCase, forgotPasswordUseCase, verifyOTPUseCase, resetPasswordUseCase } from "../../../di/container.js";
import { Request, Response } from "express";
import { RegisterUseCase, LoginUseCase, RefreshUseCase, LogoutUseCase, GetMeUseCase, UpdatePreferencesUseCase, UpdateProfileUseCase, ForgotPasswordUseCase, VerifyOTPUseCase, ResetPasswordUseCase, UpdateOnboardingUseCase, AddSubjectUseCase, RemoveSubjectUseCase } from "../../../application/auth/auth.use-cases.js";
import { sendSuccess } from "../../../utils/api-response.js";
import {
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from "../../../utils/cookies.js";
import { verifyRefreshToken } from "../../../utils/jwt.js";
import { UnauthorizedError } from "../../../utils/errors.js";

export class AuthController {
  constructor() {}
  async register(req: Request, res: Response) {
    const sessionInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    const { user, accessToken, refreshTokenString } = await registerUseCase.execute(
      req.body,
      sessionInfo
    );

    res.cookie("refreshToken", refreshTokenString, getRefreshTokenCookieOptions(true));

    return sendSuccess({
      res,
      status: 201,
      data: { user, accessToken },
    });
  }

  async login(req: Request, res: Response) {
    const sessionInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    const { user, accessToken, refreshTokenString } = await loginUseCase.execute(
      req.body,
      sessionInfo
    );

    res.cookie("refreshToken", refreshTokenString, getRefreshTokenCookieOptions(req.body.keepMeSignedIn));

    return sendSuccess({
      res,
      data: { user, accessToken },
    });
  }

  async refresh(req: Request, res: Response) {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new UnauthorizedError("Refresh token missing");
    }

    // Decode to get user ID without exposing DB to invalid signatures
    const payload = verifyRefreshToken(incomingRefreshToken);

    const sessionInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    const { accessToken, refreshTokenString } = await refreshUseCase.execute(
      payload.userId,
      incomingRefreshToken,
      sessionInfo
    );

    res.cookie("refreshToken", refreshTokenString, getRefreshTokenCookieOptions());

    return sendSuccess({
      res,
      data: { accessToken },
    });
  }

  async logout(req: Request, res: Response) {
    const incomingRefreshToken = req.cookies.refreshToken;
    
    // Only attempt to revoke if there is a token to begin with
    if (incomingRefreshToken) {
      try {
        const payload = verifyRefreshToken(incomingRefreshToken);
        await logoutUseCase.execute(payload.userId, incomingRefreshToken);
      } catch {
        // If the token is invalid/expired during logout, just swallow the error
        // since our ultimate goal is to clear the cookie and sign out anyway.
      }
    }

    res.clearCookie("refreshToken", getClearCookieOptions());

    return sendSuccess({
      res,
      data: { message: "Successfully logged out" },
    });
  }

  async getMe(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await getMeUseCase.execute(userId);

    return sendSuccess({
      res,
      data: { user },
    });
  }

  async updatePreferences(req: Request, res: Response) {
    const userId = req.user!.userId;
    const preference = await updatePreferencesUseCase.execute(userId, req.body);
    
    return sendSuccess({
      res,
      data: { preference },
    });
  }

  async updateProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await updateProfileUseCase.execute(userId, req.body);
    
    return sendSuccess({
      res,
      data: { user },
    });
  }

  async updateOnboarding(req: Request, res: Response) {
    const userId = req.user!.userId;
    // We import updateOnboardingUseCase dynamically or it can be injected. 
    // Wait, the container has it exported. We should import it at the top.
    const { updateOnboardingUseCase, addSubjectUseCase, removeSubjectUseCase } = await import("../../../di/container.js");
    const user = await updateOnboardingUseCase.execute(userId, req.body);
    return sendSuccess({ res, data: { user } });
  }

  async addSubject(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { name } = req.body;
    const { addSubjectUseCase } = await import("../../../di/container.js");
    const subjects = await addSubjectUseCase.execute(userId, name);
    return sendSuccess({ res, data: { subjects } });
  }

  async removeSubject(req: Request, res: Response) {
    const userId = req.user!.userId;
    const { id } = req.params;
    const { removeSubjectUseCase } = await import("../../../di/container.js");
    const subjects = await removeSubjectUseCase.execute(userId, id);
    return sendSuccess({ res, data: { subjects } });
  }

  // ─── Forgot Password Flow ───────────────────────────────────────────────

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    await forgotPasswordUseCase.execute(email);
    
    return sendSuccess({
      res,
      data: { message: "If an account with that email exists, an OTP has been sent." },
    });
  }

  async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const { resetToken } = await verifyOTPUseCase.execute(email, otp);
    
    return sendSuccess({
      res,
      data: { resetToken, message: "OTP verified successfully." },
    });
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    await resetPasswordUseCase.execute(token, newPassword);
    
    return sendSuccess({
      res,
      data: { message: "Password has been reset successfully." },
    });
  }
}
