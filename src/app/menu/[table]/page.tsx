import { Suspense } from 'react';
import { getMenuItems } from '@/lib/actions';
import { MenuView } from '@/components/MenuView';

async function TableMenuContent({ table }: { table: string }) {
  let items: any[] = [];
  try {
    const data = await getMenuItems();
    if (data.length > 0) items = data;
  } catch {}
  return <MenuView key={table} tableNumber={table} initialItems={items} />;
}

export default async function TableMenu({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  return (
    <Suspense fallback={null}>
      <TableMenuContent table={table} />
    </Suspense>
  );
}
