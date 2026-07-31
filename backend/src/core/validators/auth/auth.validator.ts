import { z } from "zod";

const passwordValidation = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: passwordValidation,
    fullName: z.string().min(2, "Full name must be at least 2 characters").trim(),
    username: z.string().min(3).max(30).trim().optional(),
    accountType: z.enum(["STUDENT", "PARENT"]).default("STUDENT"),
    countryCode: z.string().min(1).trim().optional(),
    mobileNumber: z.string().min(7).trim().optional(),
    termsAccepted: z.boolean().refine(val => val === true, "Must accept terms"),
    preferredLanguage: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
    keepMeSignedIn: z.boolean().optional().default(false),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
  }),
});

export const verifyOTPSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address").toLowerCase().trim(),
    otp: z.string().length(5, "OTP must be 5 digits"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: passwordValidation,
  }),
});
