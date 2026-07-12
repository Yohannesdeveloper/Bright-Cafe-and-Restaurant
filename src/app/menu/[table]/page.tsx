import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MenuView = dynamic(() => import('@/components/MenuView').then(m => ({ default: m.MenuView })));

export default async function TableMenu({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  return (
    <Suspense fallback={null}>
      <MenuView key={table} tableNumber={table} />
    </Suspense>
  );
}
