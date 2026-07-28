import { IAIService } from "../../domain/interfaces/services.interface.js";
import { IChatRepository } from "../../domain/interfaces/repositories.interface.js";
import { IEventBus } from "../../core/events/event-bus.js";
import { IDocumentPipeline, IMasteryEngine, IDNAEvolutionEngine, IRecommendationEngine } from "../../domain/interfaces/core.interface.js";
import { AIService } from "../../core/services/ai/ai.service.js";

export class ChatStreamUseCase {
  constructor(private readonly aiService: IAIService, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.aiService.chatStream(...args);
  }
}

export class GetHistoryUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    // @ts-ignore
    return this.aiService.getHistory(...args);
  }
}


export class CreateConversationUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}
export class RenameConversationUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}
export class ArchiveConversationUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}
export class DeleteConversationUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}
export class RestoreConversationUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}
export class SearchConversationUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}
export class GetPinnedConversationsUseCase {
  constructor(private readonly chatRepo: IChatRepository, private readonly eventBus: IEventBus) {}
  async execute(...args: any[]) {
    return;
  }
}