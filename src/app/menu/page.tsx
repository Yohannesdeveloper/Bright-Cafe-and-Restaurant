import { getMenuItems } from '@/lib/actions';
import { Suspense } from 'react';
import { MenuView } from '@/components/MenuView';

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ table?: string; category?: string }> }) {
  const params = await searchParams;
  let initialItems: any[] = [];
  try {
    initialItems = await getMenuItems();
  } catch {}

  return (
    <Suspense fallback={null}>
      <MenuView tableNumber={params.table} initialItems={initialItems} />
    </Suspense>
  );
}