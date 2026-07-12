import { NextResponse } from 'next/server';
import { getCache, setCache } from '@/lib/redis';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  const cached = await getCache<any[]>('menuItems');
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  }

  const { data, error } = await supabase
    .from('menu_items')
    .select('id,name,description,price,category,image,available,rating,created_at')
    .order('id');

  if (error) return NextResponse.json([], { status: 500 });

  const items = data || [];
  await setCache('menuItems', items, 3600);

  return NextResponse.json(items, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
