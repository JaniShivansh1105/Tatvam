import crypto from "crypto";
import { prisma } from "../../../data/prisma.js";
import { hashPassword, verifyPassword } from "../../../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../../../utils/errors.js";

import { registerSchema, loginSchema } from "../../validators/auth/auth.validator.js";
import { z } from "zod";

type RegisterData = z.infer<typeof registerSchema>["body"];
type LoginData = z.infer<typeof loginSchema>["body"];

interface SessionInfo {
  userAgent?: string;
  ipAddress?: string;
}

interface OTPStore {
  hashedOTP: string;
  expiresAt: number;
  attempts: number;
}
const otpStore = new Map<string, OTPStore>();
import { EmailService } from "../email/email.service.js";

const safeUserSelect = {
  id: true,
  email: true,
  username: true,
  fullName: true,
  avatarUrl: true,
  emailVerified: true,
  accountStatus: true,
  accountType: true,
  onboardingCompleted: true,
  onboardingStep: true,
  profileCompletion: true,
  createdAt: true,
  updatedAt: true,
};

export class AuthService {
  async register(data: RegisterData, sessionInfo: SessionInfo) {
    const { email, password, fullName, username, accountType, countryCode, mobileNumber, termsAccepted } = data;

    // 1. Perform reads outside the transaction
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(username ? [{ username }] : [])],
      },
      select: { email: true, username: true },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictError("Email is already in use");
      }
      throw new ConflictError("Username is already in use");
    }

    if (mobileNumber) {
      const existingMobile = await prisma.user.findFirst({
        where: { mobileNumber },
        select: { mobileNumber: true },
      });
      if (existingMobile) {
        throw new ConflictError("Mobile number is already in use");
      }
    }

    // 2. Perform expensive hashing and token generation outside the transaction
    const hashedPw = await hashPassword(password);
    const userId = crypto.randomUUID();
    const accessToken = generateAccessToken({ userId });
    const refreshTokenString = generateRefreshToken({ userId });
    const hashedRefreshToken = await hashPassword(refreshTokenString);

    // 3. Resolve language dependencies outside the transaction
    let defaultLang = await prisma.language.findFirst({
      where: { active: true },
      select: { id: true },
    });

    if (!defaultLang) {
      defaultLang = await prisma.language.create({
        data: {
          name: "English",
          code: "en",
          nativeName: "English",
        },
        select: { id: true },
      });
    }

    // 4. Perform the single atomic DB write without locking the connection for hundreds of ms
    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        username,
        fullName,
        hashedPassword: hashedPw,
        accountType,
        countryCode,
        mobileNumber,
        termsAccepted,
        termsAcceptedAt: termsAccepted ? new Date() : null,
        profile: {
          create: {},
        },
        preference: {
          create: {
            preferredLanguageId: defaultLang.id,
          },
        },
        sessions: {
          create: {
            hashedRefreshToken,
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
            userAgent: sessionInfo.userAgent,
            ipAddress: sessionInfo.ipAddress,
          },
        },
      },
      select: {
        ...safeUserSelect,
        profile: true,
        preference: true,
      },
    });

    return {
      user,
      accessToken,
      refreshTokenString,
    };
  }

  async login(data: LoginData, sessionInfo: SessionInfo) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        ...safeUserSelect,
        hashedPassword: true,
        profile: true,
        preference: {
          include: {
            language: true,
          },
        },
        learningDNA: true,
        userSubjects: true,
      },
    });

    if (!user) {
      throw new NotFoundError("No account exists with this email.");
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Account is suspended or inactive");
    }

    const isValid = await verifyPassword(password, user.hashedPassword);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshTokenString = generateRefreshToken({ userId: user.id });
    const hashedRefreshToken = await hashPassword(refreshTokenString);

    await prisma.session.create({
      data: {
        userId: user.id,
        hashedRefreshToken,
        expiresAt: new Date(Date.now() + (data.keepMeSignedIn ? 15 : 1) * 24 * 60 * 60 * 1000), // 15 days or 1 day for session
        userAgent: sessionInfo.userAgent,
        ipAddress: sessionInfo.ipAddress,
      },
    });

    const { hashedPassword, ...safeUser } = user;

    return {
      user: safeUser,
      accessToken,
      refreshTokenString,
    };
  }

  async refresh(userId: string, incomingRefreshToken: string, sessionInfo: SessionInfo) {
    const activeSessions = await prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, hashedRefreshToken: true, userAgent: true, ipAddress: true },
    });

    if (activeSessions.length === 0) {
      throw new UnauthorizedError("Session expired or invalid");
    }

    let currentSession = null;
    for (const session of activeSessions) {
      const isMatch = await verifyPassword(incomingRefreshToken, session.hashedRefreshToken);
      if (isMatch) {
        currentSession = session;
        break;
      }
    }

    if (!currentSession) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken({ userId });
    const newRefreshTokenString = generateRefreshToken({ userId });
    const newHashedRefreshToken = await hashPassword(newRefreshTokenString);

    await prisma.session.update({
      where: { id: currentSession.id },
      data: {
        hashedRefreshToken: newHashedRefreshToken,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        userAgent: sessionInfo.userAgent || currentSession.userAgent,
        ipAddress: sessionInfo.ipAddress || currentSession.ipAddress,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshTokenString: newRefreshTokenString,
    };
  }

  async logout(userId: string, incomingRefreshToken: string): Promise<void> {
    const activeSessions = await prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
      },
      select: { id: true, hashedRefreshToken: true },
    });

    let currentSession = null;
    for (const session of activeSessions) {
      const isMatch = await verifyPassword(incomingRefreshToken, session.hashedRefreshToken);
      if (isMatch) {
        currentSession = session;
        break;
      }
    }

    if (currentSession) {
      await prisma.session.update({
        where: { id: currentSession.id },
        data: { revokedAt: new Date() },
      });
    }
    
    return;
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...safeUserSelect,
        profile: true,
        preference: {
          include: {
            language: true,
          }
        },
        learningDNA: true,
        userSubjects: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updatePreferences(userId: string, data: { preferredLanguageName?: string; notificationsEnabled?: boolean; theme?: string; accentColor?: string }) {
    const updateData: any = {};
    if (data.notificationsEnabled !== undefined) {
      updateData.notificationsEnabled = data.notificationsEnabled;
    }
    if (data.theme) {
      updateData.theme = data.theme.toUpperCase();
    }
    if (data.accentColor) {
      updateData.accentColor = data.accentColor;
    }

    if (data.preferredLanguageName) {
      let language = await prisma.language.findFirst({
        where: { name: data.preferredLanguageName }
      });
      
      if (!language) {
        language = await prisma.language.create({
          data: {
            name: data.preferredLanguageName,
            code: data.preferredLanguageName.toLowerCase().substring(0, 2),
            nativeName: data.preferredLanguageName
          }
        });
      }
      updateData.preferredLanguageId = language.id;
    }

    const defaultLang = await prisma.language.findFirst({ where: { active: true } });

    return prisma.userPreference.upsert({
      where: { userId },
      create: {
        userId,
        preferredLanguageId: defaultLang?.id || (await prisma.language.create({ data: { name: "English", code: "en", nativeName: "English" } })).id,
        ...updateData
      },
      update: updateData,
      include: { language: true }
    });
  }

  // ─── Forgot Password Flow ───────────────────────────────────────────────

  async forgotPassword(email: string) {
    // 1. Verify email exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, accountStatus: true },
    });

    if (!user) {
      throw new NotFoundError("No account exists with this email.");
    }

    if (user.accountStatus !== "ACTIVE") {
      throw new UnauthorizedError("Account is suspended or inactive");
    }

    // 2. Generate secure 5-digit OTP
    const otp = crypto.randomInt(10000, 99999).toString();
    const hashedOTP = await hashPassword(otp);

    // 3. Rate limiting and store
    // Check rate limit (e.g., max 3 requests per 15 minutes) - omitting full rate limit for brevity, just storing the latest OTP
    // 120 seconds expiry
    otpStore.set(email, {
      hashedOTP,
      expiresAt: Date.now() + 120 * 1000,
      attempts: 0,
    });

    await new EmailService({} as any).sendOTP(email, otp);

    return;
  }

  async verifyOTP(email: string, otp: string) {
    const stored = otpStore.get(email);
    
    if (!stored) {
      throw new UnauthorizedError("Invalid or expired OTP");
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      throw new UnauthorizedError("OTP has expired");
    }

    if (stored.attempts >= 5) {
      otpStore.delete(email);
      throw new UnauthorizedError("Too many failed attempts. Please request a new OTP.");
    }

    const isValid = await verifyPassword(otp, stored.hashedOTP);
    
    if (!isValid) {
      stored.attempts += 1;
      throw new UnauthorizedError("Invalid OTP");
    }

    // OTP verified, generate secure reset token
    // The OTP cannot be reused
    otpStore.delete(email);

    // Create a short-lived JWT for password reset
    // In production, we'd use a dedicated secret or private key
    const secret = process.env.JWT_SECRET || "default_fallback_secret_tatvam";
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require("jsonwebtoken");
    const resetToken = jwt.sign({ email, purpose: "password_reset" }, secret, { expiresIn: "15m" });

    return { resetToken };
  }

  async resetPassword(token: string, newPassword: string) {
    const secret = process.env.JWT_SECRET || "default_fallback_secret_tatvam";
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require("jsonwebtoken");
    
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      throw new UnauthorizedError("Invalid or expired reset token");
    }

    if (decoded.purpose !== "password_reset" || !decoded.email) {
      throw new UnauthorizedError("Invalid reset token purpose");
    }

    const email = decoded.email;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const hashedPw = await hashPassword(newPassword);

    // Update password and revoke all active sessions to force re-login
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword: hashedPw },
      }),
      prisma.session.updateMany({
        where: { userId: user.id, revokedAt: null },
        data: { revokedAt: new Date() },
      })
    ]);

    return;
  }

  async updateProfile(userId: string, data: { fullName?: string; bio?: string; country?: string; timezone?: string; dna?: any }) {
    const { fullName, bio, country, timezone, dna } = data;
    
    if (fullName) {
      await prisma.user.update({
        where: { id: userId },
        data: { fullName },
      });
    }

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        bio: bio || null,
        country: country || null,
        timezone: timezone || "UTC",
      },
      update: {
        ...(bio !== undefined && { bio }),
        ...(country !== undefined && { country }),
        ...(timezone !== undefined && { timezone }),
      },
    });

    if (dna) {
      await prisma.learningDNA.upsert({
        where: { userId },
        create: {
          userId,
          visualPreference: dna.visualPreference ?? 0.5,
          pacePreference: dna.pacePreference ?? 0.5,
          detailPreference: dna.detailPreference ?? 0.5,
          audioPreference: dna.audioPreference ?? 0.5,
          readingPreference: dna.readingPreference ?? 0.5,
          animationPreference: dna.animationPreference ?? 0.5,
          examplePreference: dna.examplePreference ?? 0.5,
          analogyPreference: dna.analogyPreference ?? 0.5,
        },
        update: {
          ...(dna.visualPreference !== undefined && { visualPreference: dna.visualPreference }),
          ...(dna.pacePreference !== undefined && { pacePreference: dna.pacePreference }),
          ...(dna.detailPreference !== undefined && { detailPreference: dna.detailPreference }),
          ...(dna.analogyPreference !== undefined && { analogyPreference: dna.analogyPreference }),
          ...(dna.examplePreference !== undefined && { examplePreference: dna.examplePreference }),
        },
      });
    }

    // Dynamic completion calculation could be done here, but usually read on getMe.
    return this.getMe(userId);
  }

  async updateOnboarding(userId: string, data: any) {
    const { onboardingStep, onboardingCompleted, ...profileData } = data;
    
    if (onboardingStep !== undefined || onboardingCompleted !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(onboardingStep !== undefined && { onboardingStep }),
          ...(onboardingCompleted !== undefined && { onboardingCompleted }),
        }
      });
    }

    if (Object.keys(profileData).length > 0) {
      // Split user specific and profile specific fields
      const { fullName, email, ...restProfile } = profileData;
      if (fullName || email) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            ...(fullName && { fullName }),
            ...(email && { email }),
          }
        });
      }
      
      if (Object.keys(restProfile).length > 0) {
         await prisma.profile.upsert({
           where: { userId },
           create: { userId, ...restProfile },
           update: { ...restProfile }
         });
      }
    }

    // Recalculate profileCompletion
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (updatedUser) {
      let filled = 0;
      let total = 0;
      let optFilled = 0;
      
      const optional = ["bio", "avatarUrl", "alternateEmail", "emergencyContact", "socialLinks", "learningInterests", "careerGoal"];
      optional.forEach(f => {
        if (updatedUser.profile?.[f as keyof typeof updatedUser.profile] || (updatedUser as any)[f]) optFilled++;
      });
      
      if (updatedUser.accountType === "STUDENT") {
        const required = ["dateOfBirth", "gender", "state", "city", "board", "medium", "gradeClass", "preferredLanguage"];
        total = required.length;
        required.forEach(f => {
          if (updatedUser.profile?.[f as keyof typeof updatedUser.profile] || (updatedUser as any)[f]) filled++;
        });
      } else {
        const required = ["parentName", "relationship", "phone", "city", "state", "preferredLanguage"];
        total = required.length;
        required.forEach(f => {
          if (updatedUser.profile?.[f as keyof typeof updatedUser.profile] || (updatedUser as any)[f]) filled++;
        });
      }
      
      const mandatoryPercent = total > 0 ? (filled / total) * 80 : 0;
      const optPercent = optional.length > 0 ? (optFilled / optional.length) * 20 : 0;
      const completion = Math.round(mandatoryPercent + optPercent);
      
      await prisma.user.update({
        where: { id: userId },
        data: { profileCompletion: completion }
      });
    }

    return this.getMe(userId);
  }

  async addSubject(userId: string, name: string) {
    await prisma.userSubject.upsert({
      where: {
        userId_name: { userId, name }
      },
      create: { userId, name },
      update: {}
    });
    return prisma.userSubject.findMany({ where: { userId } });
  }

  async removeSubject(userId: string, subjectId: string) {
    // Security: verify ownership before delete to prevent cross-user data leakage
    const subject = await prisma.userSubject.findFirst({
      where: { id: subjectId, userId },
    });
    if (!subject) {
      throw new NotFoundError("Subject not found");
    }
    await prisma.userSubject.delete({
      where: { id: subjectId }
    });
    return prisma.userSubject.findMany({ where: { userId } });
  }
}

