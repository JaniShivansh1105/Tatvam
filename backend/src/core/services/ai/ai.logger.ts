import { IAuthRepository, IWorkspaceRepository, IProgressRepository, IContentRepository, IChatRepository, IPlansRepository, IPracticeRepository } from "../../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../events/event-bus.js";
import { DomainEvents } from "../../events/domain-events.js";
import { IAuthService, IWorkspaceService, IProgressService, IContentService, IAIService } from "../../../domain/interfaces/services.interface.js";
import crypto from "crypto";

export interface AILogMetadata {
  requestId: string;
  feature: string;
  provider: string;
  model: string;
  latencyMs: number;
  retries: number;
  fallbackUsage: boolean;
  validationResult: "success" | "failure";
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export class AILogger implements IAILogger {
  constructor(private readonly eventBus: IEventBus) {}
  static generateRequestId(): string {
    return crypto.randomUUID();
  }

  static logRequestEnd(metadata: AILogMetadata) {
    // In a production system, this would write to Datadog/CloudWatch
    console.log(`[AI_LOGGER] Request ${metadata.requestId} for ${metadata.feature}:`, JSON.stringify(metadata));
  }

  static logError(requestId: string, error: any) {
    console.error(`[AI_LOGGER_ERROR] Request ${requestId} failed:`, error);
  }
}
