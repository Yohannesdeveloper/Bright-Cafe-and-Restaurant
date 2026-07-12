import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MenuView = dynamic(() => import('@/components/MenuView').then(m => ({ default: m.MenuView })));

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuView />
    </Suspense>
  );
}
