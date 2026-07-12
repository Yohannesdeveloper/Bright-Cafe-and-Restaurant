import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('REDIS_URL not configured, Redis caching disabled');
    return null;
  }

  if (!redis) {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  return redis;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    return await withTimeout(
      client.get(key).then((data) => {
        if (!data) return null;
        return JSON.parse(data) as T;
      }),
      300,
      null
    );
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setCache<T>(key: string, data: T, ttl: number = 300): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await withTimeout(
      client.setex(key, ttl, JSON.stringify(data)),
      300,
      undefined
    );
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await withTimeout(
      client.del(key),
      300,
      undefined
    );
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

export async function clearCachePattern(pattern: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    const keys = await withTimeout(
      client.keys(pattern),
      300,
      []
    );
    if (keys.length > 0) {
      await withTimeout(
        client.del(...keys),
        300,
        undefined
      );
    }
  } catch (error) {
    console.error('Redis pattern delete error:', error);
  }
}
