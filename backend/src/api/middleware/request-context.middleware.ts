import { Request, Response, NextFunction } from "express";
import { RequestContext } from "../../core/observability/request-context.js";
import { Logger } from "../../core/observability/logger.js";
import { randomUUID } from "crypto";

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = (req.headers["x-correlation-id"] as string) || randomUUID();
  const requestId = randomUUID();

  RequestContext.run({ correlationId, requestId }, () => {
    const startTime = Date.now();
    
    // Log incoming request
    Logger.info(`Incoming ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers["user-agent"]
    });

    res.on("finish", () => {
      const duration = Date.now() - startTime;
      Logger.info(`Completed ${req.method} ${req.originalUrl}`, {
        statusCode: res.statusCode,
      }, duration);
    });

    next();
  });
}
