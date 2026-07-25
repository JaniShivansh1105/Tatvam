import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logger } from "../../utils/logger.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = randomUUID();
  const start = Date.now();

  res.setHeader("X-Request-Id", requestId);

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
      },
      "Request completed"
    );
  });

  next();
};
