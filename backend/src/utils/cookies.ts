import { CookieOptions } from "express";
import { env } from "../config/env.js";

/**
 * Shared configuration for setting strict HTTP-Only cookies.
 * Automatically enforces Secure in production.
 */
export const getRefreshTokenCookieOptions = (keepMeSignedIn: boolean = true): CookieOptions => {
  // Convert 15 days to milliseconds if persistent
  const maxAge = keepMeSignedIn ? 15 * 24 * 60 * 60 * 1000 : undefined;

  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
    maxAge, // If undefined, it becomes a session cookie
  };
};

export const getClearCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth",
  };
};
