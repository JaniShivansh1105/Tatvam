import { IEventBus } from "../../../events/event-bus.js";
import { 
  ProviderName, 
  AIConfig, 
  ProviderMetrics, 
  FailureClassification
} from "../ai.types.js";
import { AI_PROVIDER_PRIORITY } from "../ai.config.js";

// Configurable constants
const MAX_FAILURES_BEFORE_OPEN = 3;
const COOLDOWN_DURATION_MS = 60 * 1000; // Default 60s cooldown

export class ProviderManager  {
  constructor(private readonly eventBus: IEventBus) {}
  private static metrics: Record<ProviderName, ProviderMetrics> = {
    gemini: this.createEmptyMetrics(!!process.env.GEMINI_API_KEY),
    gpt: this.createEmptyMetrics(!!process.env.OPENAI_API_KEY),
    grok: this.createEmptyMetrics(!!process.env.GROK_API_KEY)
  };

  private static createEmptyMetrics(isKeyConfigured: boolean): ProviderMetrics {
    return {
      successCount: 0,
      failureCount: 0,
      averageLatencyMs: 0,
      lastSuccess: null,
      lastFailure: null,
      cooldownExpiry: null,
      state: isKeyConfigured ? "Closed" : "Open",
      isKeyConfigured
    };
  }

  static getProviderMetrics(name: ProviderName): ProviderMetrics {
    return this.metrics[name];
  }

  /**
   * Periodically check cooldowns to automatically recover Half-Open state.
   */
  static evaluateHealth(name: ProviderName) {
    const metric = this.metrics[name];
    if (metric.state === "Open" && metric.isKeyConfigured) {
      if (metric.cooldownExpiry && Date.now() > metric.cooldownExpiry) {
        metric.state = "Half-Open";
        metric.cooldownExpiry = null;
        console.warn(`[ProviderManager] ${name} recovered from cooldown. State is now Half-Open.`);
      }
    }
  }

  static getAvailableProviders(featureConfig: AIConfig): ProviderName[] {
    const available: ProviderName[] = [];
    
    // First, evaluate auto-recovery
    for (const p of AI_PROVIDER_PRIORITY) {
      this.evaluateHealth(p);
    }

    // Attempt to respect the AI_PROVIDER_PRIORITY, fallback to all configured
    const ordered = AI_PROVIDER_PRIORITY.length > 0 ? AI_PROVIDER_PRIORITY : (["gemini", "gpt", "grok"] as ProviderName[]);
    
    // Always put the preferred provider from config at the front if it's healthy
    const preferred = featureConfig.provider;
    const priorityList = [preferred, ...ordered.filter(p => p !== preferred)];

    for (const p of priorityList) {
      const pName = p as ProviderName;
      const metric = this.metrics[pName];
      if (metric && metric.isKeyConfigured && metric.state !== "Open") {
        available.push(pName);
      }
    }

    return available;
  }

  static reportSuccess(name: ProviderName, latencyMs: number) {
    const metric = this.metrics[name];
    metric.successCount++;
    metric.lastSuccess = Date.now();
    
    // Update moving average latency
    if (metric.successCount === 1) {
      metric.averageLatencyMs = latencyMs;
    } else {
      metric.averageLatencyMs = (metric.averageLatencyMs * 0.9) + (latencyMs * 0.1);
    }

    // Circuit Breaker transition Half-Open -> Closed
    if (metric.state === "Half-Open") {
      metric.state = "Closed";
      metric.failureCount = 0; // Reset failures on success
      console.warn(`[ProviderManager] ${name} fully recovered. State is now Closed.`);
    }
  }

  static reportFailure(name: ProviderName, classification: FailureClassification, retryAfterMs?: number) {
    const metric = this.metrics[name];
    metric.failureCount++;
    metric.lastFailure = Date.now();

    // Do not count MALFORMED_RESPONSE against the circuit breaker aggressively, as it is a model parsing issue
    if (classification === "MALFORMED_RESPONSE") {
      return; 
    }

    if (classification === "AUTH_FAILED") {
      metric.state = "Open";
      // Not permanently disabled, but in long cooldown for the runtime, or until app restarts
      metric.cooldownExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
      console.warn(`[ProviderManager] ${name} Auth failed. Marking Open.`);
      return;
    }

    if (classification === "QUOTA_EXHAUSTED" || metric.failureCount >= MAX_FAILURES_BEFORE_OPEN) {
      metric.state = "Open";
      // Exponential backoff or Retry-After
      const backoff = retryAfterMs || (COOLDOWN_DURATION_MS * Math.pow(2, metric.failureCount - MAX_FAILURES_BEFORE_OPEN));
      metric.cooldownExpiry = Date.now() + backoff;
      console.warn(`[ProviderManager] ${name} failed (${classification}). State Open. Cooldown for ${backoff}ms`);
    }
  }
}
