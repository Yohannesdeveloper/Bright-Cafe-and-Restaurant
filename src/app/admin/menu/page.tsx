'use client';

import { Navigation } from '@/components/Navigation';
import { MenuManagement } from '@/components/MenuManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/actions';
import { FALLBACK_MENU } from '@/lib/menu-data';

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getMenuItems().then((data) => {
        if (data.length > 0) setItems(data);
        else setItems(FALLBACK_MENU.map(item => ({ ...item, available: true })));
      }).catch(() => setItems(FALLBACK_MENU.map(item => ({ ...item, available: true }))));
    });
  }, []);

  const handleAdd = async (item: any) => {
    const { id, ...rest } = item;
    await addMenuItem({ ...rest, rating: 0 });
    setItems(await getMenuItems());
  };

  const handleEdit = async (id: number, item: any) => {
    await updateMenuItem(id, item);
    setItems(await getMenuItems());
  };

  const handleDelete = async (id: number) => {
    await deleteMenuItem(id);
    setItems(await getMenuItems());
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation role="admin" />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <MenuManagement items={items} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}
