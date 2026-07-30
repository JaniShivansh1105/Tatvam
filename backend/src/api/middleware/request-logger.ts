import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { logger } from "../../utils/logger.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = randomUUID();
  (req as any).requestId = requestId;
  const start = Date.now();

  res.setHeader("X-Request-Id", requestId);
  
  // Log IMMEDIATELY upon receiving the request
  console.log(`[REQUEST RECEIVED] ${req.method} ${req.originalUrl} | ID: ${requestId}`);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const userId = (req as any).user?.id || (req as any).user?.userId || "Unauthenticated";
    const responseSize = res.getHeader("content-length") || "unknown";

    console.log(`[REQUEST FINISHED] ${req.method} ${req.originalUrl}\n\nStatus: ${res.statusCode}\nDuration: ${duration}ms\nRequest ID: ${requestId}\nAuthenticated User: ${userId}\nResponse Size: ${responseSize} bytes\n`);
    
    // Also use winston/pino logger if needed
    logger.info(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        userId
      },
      "Request completed"
    );
  });

  next();
};
