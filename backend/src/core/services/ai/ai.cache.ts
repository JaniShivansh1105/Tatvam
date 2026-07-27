import crypto from "crypto";

interface CacheEntry {
  data: any;
  expiresAt: number;
}

export class AICacheService {
  private static store = new Map<string, CacheEntry>();

  static get(feature: string, keyString: string): any | null {
    if (process.env.AI_ENABLE_CACHE === "false") return null;

    const key = this.generateKey(feature, keyString);
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  static set(feature: string, keyString: string, data: any, ttlMs: number) {
    if (process.env.AI_ENABLE_CACHE === "false") return;

    const key = this.generateKey(feature, keyString);
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlMs
    });
  }

  static invalidate(feature: string, keyString: string) {
    const key = this.generateKey(feature, keyString);
    this.store.delete(key);
  }

  private static generateKey(feature: string, payload: string): string {
    return crypto.createHash("sha256").update(`${feature}_${payload}`).digest("hex");
  }
}
