import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../../utils/logger.js";
import { AppError, ValidationError } from "../../utils/errors.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err;

  // Intercept Zod validation errors globally
  if (err instanceof ZodError) {
    const formattedFields: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join(".");
      if (!formattedFields[path]) {
        formattedFields[path] = [];
      }
      formattedFields[path].push(e.message);
    });
    error = new ValidationError("Invalid input provided", formattedFields);
  }

  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? (error as AppError).statusCode : 500;
  const isOperational = isAppError ? (error as AppError).isOperational : false;

  logger.error(
    {
      statusCode,
      message: error.message,
      stack: error.stack,
      isOperational,
    },
    "Request error"
  );

  res.status(statusCode).json({
    success: false,
    data: null,
    error: {
      code: isAppError ? (error as AppError).code : "INTERNAL_SERVER_ERROR",
      message: isOperational
        ? error.message
        : "Something went wrong. Please try again later.",
      ...(isAppError && error instanceof ValidationError
        ? { fields: error.fields }
        : {}),
    },
    meta: null,
  });
};
