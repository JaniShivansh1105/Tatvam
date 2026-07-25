export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", code = "BAD_REQUEST") {
    super(message, 400, code);
  }
}

export class ValidationError extends AppError {
  public readonly fields: Record<string, string[]>;

  constructor(
    message = "Validation Failed",
    fields: Record<string, string[]> = {}
  ) {
    super(message, 400, "VALIDATION_FAILED");
    this.fields = fields;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(message, 401, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource conflict", code = "CONFLICT") {
    super(message, 409, code);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", code = "RATE_LIMIT_EXCEEDED") {
    super(message, 429, code);
  }
}
