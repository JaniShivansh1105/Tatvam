/**
 * Centralized Route Configuration
 * 
 * All internal application routes must be referenced from this file.
 * This prevents stale routes and allows easy migration.
 */

export const ROUTES = {
  // Public Marketing Routes
  HOME: "/",
  PRIVACY: "/privacy-policy",
  TERMS: "/terms-and-conditions",
  
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ONBOARDING: "/onboarding",

  // Dashboard / App Routes (Protected)
  DASHBOARD: {
    HOME: "/dashboard",
    LEARN: "/dashboard/learn",
    MENTOR: "/dashboard/mentor",
    PLANS: "/dashboard/plans",
    PRACTICE: "/dashboard/practice",
    ASSESSMENTS: "/dashboard/assessments",
    ACHIEVEMENTS: "/dashboard/achievements",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
  }
} as const;

export type RouteKeys = keyof typeof ROUTES;
