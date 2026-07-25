import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt.js";
import { UnauthorizedError } from "../../utils/errors.js";

/**
 * Middleware to enforce authentication.
 * Extracts the Bearer token from the Authorization header,
 * verifies it, and attaches the user payload to the request object.
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication required. Token missing.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error); // Passes the UnauthorizedError (from verifyAccessToken) to the global error handler
  }
};
