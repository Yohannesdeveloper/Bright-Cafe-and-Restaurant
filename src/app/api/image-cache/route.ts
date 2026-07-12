import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

const IMAGE_CACHE_TTL = 86400; // 24 hours

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const redis = getRedisClient();
  
  if (!redis) {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  }

  const cacheKey = `img:${Buffer.from(url).toString('base64').slice(0, 128)}`;
  
  try {
    const cached = await redis.getBuffer(cacheKey);
    if (cached) {
      const contentType = await redis.get(`${cacheKey}:type`) || 'image/jpeg';
      return new NextResponse(new Uint8Array(cached), {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
          'X-Cache': 'HIT',
        },
      });
    }
  } catch (err) {
    console.error('Redis read error:', err);
  }

  const response = await fetch(url, { next: { revalidate: 86400 } });
  
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status });
  }

  const blob = await response.arrayBuffer();
  const contentType = response.headers.get('Content-Type') || 'image/jpeg';

  try {
    await redis.setex(cacheKey, IMAGE_CACHE_TTL, Buffer.from(blob));
    await redis.setex(`${cacheKey}:type`, IMAGE_CACHE_TTL, contentType);
  } catch (err) {
    console.error('Redis write error:', err);
  }

  return new NextResponse(blob, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'X-Cache': 'MISS',
    },
  });
}