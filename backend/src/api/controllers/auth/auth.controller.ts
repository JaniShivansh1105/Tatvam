import { Request, Response } from "express";
import { AuthService } from "../../../core/services/auth/auth.service.js";
import { sendSuccess } from "../../../utils/api-response.js";
import {
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from "../../../utils/cookies.js";
import { verifyRefreshToken } from "../../../utils/jwt.js";
import { UnauthorizedError } from "../../../utils/errors.js";

export class AuthController {
  static async register(req: Request, res: Response) {
    const sessionInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    const { user, accessToken, refreshTokenString } = await AuthService.register(
      req.body,
      sessionInfo
    );

    res.cookie("refreshToken", refreshTokenString, getRefreshTokenCookieOptions());

    return sendSuccess({
      res,
      status: 201,
      data: { user, accessToken },
    });
  }

  static async login(req: Request, res: Response) {
    const sessionInfo = {
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    };

    const { user, accessToken, refreshTokenString } = await AuthService.login(
      req.body,
      sessionInfo
    );

    res.cookie("refreshToken", refreshTokenString, getRefreshTokenCookieOptions());

    return sendSuccess({
      res,
      data: { user, accessToken },
    });
  }

  static async refresh(req: Request, res: Response) {
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

    const { accessToken, refreshTokenString } = await AuthService.refresh(
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

  static async logout(req: Request, res: Response) {
    const incomingRefreshToken = req.cookies.refreshToken;
    
    // Only attempt to revoke if there is a token to begin with
    if (incomingRefreshToken) {
      try {
        const payload = verifyRefreshToken(incomingRefreshToken);
        await AuthService.logout(payload.userId, incomingRefreshToken);
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

  static async getMe(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await AuthService.getMe(userId);

    return sendSuccess({
      res,
      data: { user },
    });
  }

  static async updatePreferences(req: Request, res: Response) {
    const userId = req.user!.userId;
    const preference = await AuthService.updatePreferences(userId, req.body);
    
    return sendSuccess({
      res,
      data: { preference },
    });
  }

  static async updateProfile(req: Request, res: Response) {
    const userId = req.user!.userId;
    const user = await AuthService.updateProfile(userId, req.body);
    
    return sendSuccess({
      res,
      data: { user },
    });
  }

  // ─── Forgot Password Flow ───────────────────────────────────────────────

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    
    return sendSuccess({
      res,
      data: { message: "If an account with that email exists, an OTP has been sent." },
    });
  }

  static async verifyOTP(req: Request, res: Response) {
    const { email, otp } = req.body;
    const { resetToken } = await AuthService.verifyOTP(email, otp);
    
    return sendSuccess({
      res,
      data: { resetToken, message: "OTP verified successfully." },
    });
  }

  static async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;
    await AuthService.resetPassword(token, newPassword);
    
    return sendSuccess({
      res,
      data: { message: "Password has been reset successfully." },
    });
  }
}
