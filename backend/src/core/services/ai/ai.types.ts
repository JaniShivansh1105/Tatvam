import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
export type ProviderName = "gemini" | "gpt" | "grok";

export interface AIConfig {
  provider: ProviderName;
  models: Record<ProviderName, string>;
  temperature: number;
  maxTokens: number;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  timeoutMs: number;
}

export type CircuitBreakerState = "Closed" | "Open" | "Half-Open";

export type FailureClassification = 
  | "QUOTA_EXHAUSTED" // 429
  | "AUTH_FAILED" // 401, 403, invalid key
  | "UNAVAILABLE" // 503, 500
  | "TIMEOUT"
  | "MALFORMED_RESPONSE"
  | "STREAM_INTERRUPTED"
  | "UNKNOWN";

export interface ProviderCapabilities {
  supportsStreaming: boolean;
  supportsJSON: boolean;
}

export interface ProviderMetrics {
  successCount: number;
  failureCount: number;
  averageLatencyMs: number;
  lastSuccess: number | null;
  lastFailure: number | null;
  cooldownExpiry: number | null;
  state: CircuitBreakerState;
  isKeyConfigured: boolean;
}


export interface AIContext {
  learningDNA?: Record<string, any> | null;
  conceptMastery?: Record<string, any>[];
  lesson?: Record<string, any> | null;
  topic?: Record<string, any> | null;
  preferences?: Record<string, any> | null;
  language?: string;
  recentMistakes?: Record<string, any>[];
  activePlan?: Record<string, any> | null;
}

export interface AIProvider {
  generateText(prompt: string, config: AIConfig): Promise<string>;
  generateJSON(prompt: string, config: AIConfig): Promise<any>;
  generateStream(prompt: string, config: AIConfig): AsyncGenerator<string>;
}

export class AIUnavailableError extends Error {
  constructor(message: string = "AI services are currently unavailable.") {
    super(message);
    this.name = "AIUnavailableError";
  }
}
