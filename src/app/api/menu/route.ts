import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'edge';

export async function GET() {
  // In-memory cache doesn't work on edge, rely on CDN + Supabase
  const { data, error } = await supabase
    .from('menu_items')
    .select('id,name,description,price,category,image,available,rating,created_at')
    .order('id');

  const items = error ? [] : (data || []);

  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
