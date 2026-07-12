'use client';

import { MenuManagement } from '@/components/MenuManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, seedMenuItems } from '@/lib/actions';
import { FALLBACK_MENU } from '@/lib/menu-data';

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then(async (authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      try {
        const data = await getMenuItems();
        if (data.length > 0) setItems(data);
        else {
          const seeded = await seedMenuItems(FALLBACK_MENU.map(item => ({ ...item, available: true })));
          setItems(seeded.success ? seeded.data! : FALLBACK_MENU.map(item => ({ ...item, available: true })));
        }
      } catch {
        setItems(FALLBACK_MENU.map(item => ({ ...item, available: true })));
      }
    });
  }, []);
  const handleAdd = async (item: any) => {
    const newId = Date.now();
    const res = await addMenuItem({ id: newId, ...item, rating: 0 });
    if (!res.success) {
      alert('Failed to add item: ' + res.error);
      return;
    }
    setItems(prev => [...prev, { ...res.data, available: true }]);
  };
  const handleEdit = async (id: number, item: any) => {
    const res = await updateMenuItem(id, item);
    if (!res.success) {
      alert('Failed to update item: ' + res.error);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteMenuItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) {
      alert('Failed to delete item: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  };
  if (authorized === null) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Skeleton header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-40 bg-white/[0.04] rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-white/[0.04] rounded-xl animate-pulse" />
        </div>
        {/* Skeleton search & filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="h-10 flex-1 bg-white/[0.04] rounded-xl animate-pulse" />
          <div className="h-10 w-40 bg-white/[0.04] rounded-xl animate-pulse" />
        </div>
        {/* Skeleton grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4] bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  if (!authorized) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <MenuManagement items={items} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
