import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

let memCache: { data: any[]; ts: number } | null = null;
const MEM_TTL = 60_000; // 60s in-memory cache

export async function GET() {
  // 1. In-memory cache — zero latency
  if (memCache && Date.now() - memCache.ts < MEM_TTL) {
    return NextResponse.json(memCache.data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  }

  // 2. Supabase fetch
  const { data, error } = await supabase
    .from('menu_items')
    .select('id,name,description,price,category,image,available,rating,created_at')
    .order('id');

  if (error) return NextResponse.json(memCache?.data ?? [], { status: error ? 200 : 500 });

  const items = data || [];
  memCache = { data: items, ts: Date.now() };

  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
