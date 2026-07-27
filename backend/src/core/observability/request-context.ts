import { AsyncLocalStorage } from "async_hooks";
import { randomUUID } from "crypto";

export interface IRequestContext {
  requestId: string;
  correlationId: string;
  userId?: string;
  sessionId?: string;
  workspaceId?: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export class RequestContext {
  private static storage = new AsyncLocalStorage<IRequestContext>();

  static run(
    context: Partial<IRequestContext>,
    callback: () => void | Promise<void>
  ) {
    const fullContext: IRequestContext = {
      requestId: context.requestId || randomUUID(),
      correlationId: context.correlationId || randomUUID(),
      userId: context.userId,
      sessionId: context.sessionId,
      workspaceId: context.workspaceId,
      timestamp: context.timestamp || new Date(),
      metadata: context.metadata || {},
    };

    return this.storage.run(fullContext, callback);
  }

  static get(): IRequestContext | undefined {
    return this.storage.getStore();
  }

  static set(key: keyof IRequestContext, value: any) {
    const store = this.storage.getStore();
    if (store) {
      (store as any)[key] = value;
    }
  }

  static setMetadata(key: string, value: any) {
    const store = this.storage.getStore();
    if (store) {
      store.metadata[key] = value;
    }
  }
}
