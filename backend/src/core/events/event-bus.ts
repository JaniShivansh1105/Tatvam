import { Logger } from "../observability/logger.js";
import { randomUUID } from "crypto";

export type DomainEvent = {
  type: string;
  payload: any;
  timestamp: Date;
};

export interface IEventHandler<T = any> {
  handle(event: T): Promise<void>;
}

export interface IEventBus {
  publish(event: string, payload: any): Promise<void>;
  subscribe(event: string, handler: (payload: any) => Promise<void>): void;
  unsubscribe(event: string, handler: (payload: any) => Promise<void>): void;
}

export class EventBus implements IEventBus {
  private handlers: Map<string, ((payload: any) => Promise<void>)[]> = new Map();

  subscribe(event: string, handler: (payload: any) => Promise<void>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  unsubscribe(event: string, handler: (payload: any) => Promise<void>): void {
    if (!this.handlers.has(event)) return;
    const currentHandlers = this.handlers.get(event)!;
    this.handlers.set(
      event,
      currentHandlers.filter((h) => h !== handler)
    );
  }

  async publish(event: string, payload: any): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers || handlers.length === 0) return;

    const eventId = randomUUID();
    Logger.info(`Event Published: ${event}`, { eventId, handlerCount: handlers.length });
    const startTime = Date.now();

    // Isolate errors per handler so one failing handler doesn't break the entire event distribution
    const promises = handlers.map(async (handler, index) => {
      const handlerStart = Date.now();
      try {
        await handler(payload);
        Logger.debug(`Handler ${index} for ${event} succeeded`, { eventId, durationMs: Date.now() - handlerStart });
      } catch (error) {
        Logger.error(`Handler ${index} for ${event} failed`, error, { eventId, durationMs: Date.now() - handlerStart });
      }
    });

    await Promise.allSettled(promises);
    Logger.info(`Event processing completed: ${event}`, { eventId }, Date.now() - startTime);
  }
}
