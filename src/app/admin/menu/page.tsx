'use client';

import { MenuManagement } from '@/components/MenuManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/actions';
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
        else setItems(FALLBACK_MENU.map(item => ({ ...item, available: true })));
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
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="relative">
          <div className="w-14 h-14 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <div className="w-14 h-14 border-2 border-[#D4AF37]/10 rounded-full absolute inset-0 animate-ping opacity-30" />
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
