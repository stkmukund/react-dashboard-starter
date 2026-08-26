/**
 * Storage configuration options.
 */
export interface StorageConfig {
  /** Prefix applied to all keys in this namespace */
  prefix?: string;
  /** Suffix applied to all keys in this namespace */
  suffix?: string;
  /** Custom fallback storage driver (e.g. in-memory map) when web storage is unavailable */
  driver?: Storage;
}

/**
 * Interface representing a typed storage driver.
 */
export interface TypedStorage {
  /** Retrieve and deserialize a value by key. Returns fallback or null if missing/invalid */
  get<T = unknown>(key: string, fallback?: T): T | null;
  /** Serialize and store a value by key */
  set<T = unknown>(key: string, value: T): boolean;
  /** Remove a key from storage */
  remove(key: string): boolean;
  /** Clear all keys belonging to this namespace prefix */
  clear(): boolean;
  /** Check if a key exists in storage */
  has(key: string): boolean;
  /** Get all raw keys belonging to this storage namespace */
  keys(): string[];
}
