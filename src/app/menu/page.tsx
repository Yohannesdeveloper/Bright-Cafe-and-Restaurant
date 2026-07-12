import { Suspense } from 'react';
import { getMenuItems } from '@/lib/actions';
import { MenuView } from '@/components/MenuView';

async function MenuContent() {
  let items: any[] = [];
  try {
    const data = await getMenuItems();
    if (data.length > 0) items = data;
  } catch {}
  return <MenuView initialItems={items} />;
}

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuContent />
    </Suspense>
  );
}
