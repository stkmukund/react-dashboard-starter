import { appConfig } from "../../config/app";
import type { StorageConfig, TypedStorage } from "./types";

/**
 * In-memory Storage fallback implementation for SSR or when Web Storage is blocked/disabled.
 */
class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

/**
 * Check if a storage driver is accessible and writable.
 */
function isStorageAvailable(type: "localStorage" | "sessionStorage"): boolean {
  if (typeof window === "undefined") return false;
  try {
    const s = window[type];
    const testKey = `__storage_test__`;
    s.setItem(testKey, testKey);
    s.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Factory creating a safe, prefix-aware, JSON-serializing TypedStorage implementation.
 */
export class StorageHandler implements TypedStorage {
  private readonly storage: Storage;
  private readonly prefix: string;
  private readonly suffix: string;

  constructor(type: "localStorage" | "sessionStorage", config?: StorageConfig) {
    this.prefix = config?.prefix ?? "";
    this.suffix = config?.suffix ?? "";

    if (config?.driver) {
      this.storage = config.driver;
    } else if (isStorageAvailable(type)) {
      this.storage = window[type];
    } else {
      this.storage = new MemoryStorage();
    }
  }

  /**
   * Generates namespaced key with prefix/suffix applied.
   */
  private formatKey(key: string): string {
    return `${this.prefix}${key}${this.suffix}`;
  }

  /**
   * Strips prefix/suffix to return original key name.
   */
  private stripKey(formattedKey: string): string | null {
    if (this.prefix && !formattedKey.startsWith(this.prefix)) return null;
    if (this.suffix && !formattedKey.endsWith(this.suffix)) return null;

    let key = formattedKey;
    if (this.prefix) {
      key = key.slice(this.prefix.length);
    }
    if (this.suffix) {
      key = key.slice(0, -this.suffix.length);
    }
    return key;
  }

  /**
   * Retrieves and deserializes value from storage.
   */
  public get<T = unknown>(key: string, fallback?: T): T | null {
    try {
      const raw = this.storage.getItem(this.formatKey(key));
      if (raw === null || raw === undefined) {
        return fallback ?? null;
      }
      try {
        return JSON.parse(raw) as T;
      } catch {
        // Fallback for raw string or non-JSON value
        return raw as unknown as T;
      }
    } catch {
      return fallback ?? null;
    }
  }

  /**
   * Serializes and writes value to storage.
   */
  public set<T = unknown>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      this.storage.setItem(this.formatKey(key), serialized);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Removes item from storage.
   */
  public remove(key: string): boolean {
    try {
      this.storage.removeItem(this.formatKey(key));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if key exists in storage.
   */
  public has(key: string): boolean {
    try {
      return this.storage.getItem(this.formatKey(key)) !== null;
    } catch {
      return false;
    }
  }

  /**
   * Clears all items belonging to this namespace.
   */
  public clear(): boolean {
    try {
      if (!this.prefix && !this.suffix) {
        this.storage.clear();
        return true;
      }

      const keysToRemove: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const rawKey = this.storage.key(i);
        if (rawKey && this.stripKey(rawKey) !== null) {
          keysToRemove.push(rawKey);
        }
      }

      keysToRemove.forEach((k) => this.storage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Lists all keys belonging to this namespace.
   */
  public keys(): string[] {
    const list: string[] = [];
    try {
      for (let i = 0; i < this.storage.length; i++) {
        const rawKey = this.storage.key(i);
        if (rawKey) {
          const stripped = this.stripKey(rawKey);
          if (stripped !== null) {
            list.push(stripped);
          }
        }
      }
    } catch {
      // ignore
    }
    return list;
  }
}

/**
 * Creates configured storage instances with custom namespace.
 */
export function createStorage(config?: StorageConfig): {
  local: TypedStorage;
  session: TypedStorage;
} {
  return {
    local: new StorageHandler("localStorage", config),
    session: new StorageHandler("sessionStorage", config),
  };
}

/**
 * Default global storage instance configured with centralized app namespace.
 */
export const storage = createStorage({
  prefix: appConfig.storage.prefix,
  suffix: appConfig.storage.suffix,
});
