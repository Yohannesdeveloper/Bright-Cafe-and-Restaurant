const CACHE_DURATION = 300_000;

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

function getStore() {
  try { return localStorage; } catch { return null; }
}

export function getCached<T>(key: string): T | null {
  try {
    const store = getStore();
    if (!store) return null;
    const raw = store.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() > entry.expiry) {
      store.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCache<T>(key: string, data: T, ttl = CACHE_DURATION): void {
  try {
    const store = getStore();
    if (!store) return;
    store.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
  } catch {
    // Storage full or unavailable
  }
}
