const CACHE_DURATION = 60_000;

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttl = CACHE_DURATION): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
  } catch {
    // Storage full or unavailable
  }
}
