export type Uuid = string;
export type IsoTimestamp = string;

/**
 * Standard Envelope matching the API Contract Standards.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: ApiMeta | null;
}

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
}

export interface ApiMeta {
  pagination?: PaginationMeta;
  latency?: string;
  [key: string]: unknown;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

/**
 * Standard request payload for pagination.
 */
export interface PaginationQuery {
  page?: string;
  limit?: string;
}
