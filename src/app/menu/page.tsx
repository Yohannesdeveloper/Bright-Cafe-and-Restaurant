import { Suspense } from 'react';
import { MenuView } from '@/components/MenuView';

export default async function MenuPage({ searchParams }: { searchParams: Promise<{ table?: string; category?: string }> }) {
  const params = await searchParams;

  return (
    <Suspense fallback={null}>
      <MenuView tableNumber={params.table} />
    </Suspense>
  );
}