import { RequestContext } from "./request-context.js";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

export class Logger {
  private static redactFields = ["password", "token", "refreshToken", "jwt", "secret"];

  private static formatMessage(level: LogLevel, message: string, meta: Record<string, any> = {}, durationMs?: number) {
    const ctx = RequestContext.get();
    
    const logData = {
      timestamp: new Date().toISOString(),
      level,
      message,
      requestId: ctx?.requestId,
      correlationId: ctx?.correlationId,
      userId: ctx?.userId,
      durationMs,
      ...this.redact(meta),
    };

    return JSON.stringify(logData);
  }

  private static redact(obj: any): any {
    if (typeof obj !== "object" || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map((i) => this.redact(i));

    const redacted = { ...obj };
    for (const key of Object.keys(redacted)) {
      if (this.redactFields.some((field) => key.toLowerCase().includes(field))) {
        redacted[key] = "***REDACTED***";
      } else if (typeof redacted[key] === "object") {
        redacted[key] = this.redact(redacted[key]);
      }
    }
    return redacted;
  }

  static debug(message: string, meta?: Record<string, any>) {
    console.debug(this.formatMessage("DEBUG", message, meta));
  }

  static info(message: string, meta?: Record<string, any>, durationMs?: number) {
    console.info(this.formatMessage("INFO", message, meta, durationMs));
  }

  static warn(message: string, meta?: Record<string, any>) {
    console.warn(this.formatMessage("WARN", message, meta));
  }

  static error(message: string, error?: any, meta?: Record<string, any>) {
    console.error(this.formatMessage("ERROR", message, { ...meta, error: error?.message || error, stack: error?.stack }));
  }

  static fatal(message: string, error?: any, meta?: Record<string, any>) {
    console.error(this.formatMessage("FATAL", message, { ...meta, error: error?.message || error, stack: error?.stack }));
    // Ideally trigger alerts here
  }
}
