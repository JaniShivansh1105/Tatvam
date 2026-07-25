import { CookieOptions } from "express";
import { env } from "../config/env.js";

/**
 * Shared configuration for setting strict HTTP-Only cookies.
 * Automatically enforces Secure in production.
 */
export const getRefreshTokenCookieOptions = (): CookieOptions => {
  // Convert something like "7d" from env to milliseconds
  const maxAge = 7 * 24 * 60 * 60 * 1000;

  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge,
  };
};

export const getClearCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
  };
};
