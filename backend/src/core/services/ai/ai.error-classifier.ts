import { IEventBus } from "../../events/event-bus.js";
import { FailureClassification } from "./ai.types.js";

export class AIErrorClassifier  {
  constructor(private readonly eventBus: IEventBus) {}
  static classify(error: any, _provider: string): FailureClassification {
    const errString = String(error?.message || error).toLowerCase();
    
    // Check Status codes if available
    const status = error?.status || error?.statusCode || error?.response?.status;
    
    if (status === 429) return "QUOTA_EXHAUSTED";
    if (status === 401 || status === 403) return "AUTH_FAILED";
    if (status >= 500 && status < 600) return "UNAVAILABLE";
    
    // Text-based heuristics
    if (errString.includes("429") || errString.includes("quota") || errString.includes("rate limit") || errString.includes("too many requests")) {
      return "QUOTA_EXHAUSTED";
    }
    
    if (errString.includes("401") || errString.includes("403") || errString.includes("invalid api key") || errString.includes("unauthorized") || errString.includes("forbidden")) {
      return "AUTH_FAILED";
    }

    if (errString.includes("timeout") || errString.includes("econnreset") || errString.includes("socket hang up") || errString.includes("abort")) {
      return "TIMEOUT";
    }

    if (errString.includes("json") || errString.includes("parse") || errString.includes("syntaxerror") || errString.includes("unterminated string")) {
      return "MALFORMED_RESPONSE";
    }

    if (errString.includes("stream") || errString.includes("premature close")) {
      return "STREAM_INTERRUPTED";
    }

    if (errString.includes("500") || errString.includes("502") || errString.includes("503") || errString.includes("504") || errString.includes("unavailable") || errString.includes("overloaded") || errString.includes("econnrefused") || errString.includes("fetch failed")) {
      return "UNAVAILABLE";
    }
    
    return "UNKNOWN";
  }
}
