import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponseOptions<T> {
  res: Response;
  status?: number;
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Ensures all API responses strictly adhere to the standard JSON envelope:
 * { success, data, error, meta }
 */
export const sendSuccess = <T>({
  res,
  status = 200,
  data,
  meta = null as unknown as Record<string, unknown>,
}: ApiResponseOptions<T>) => {
  return res.status(status).json({
    success: true,
    data,
    error: null,
    meta,
  });
};
