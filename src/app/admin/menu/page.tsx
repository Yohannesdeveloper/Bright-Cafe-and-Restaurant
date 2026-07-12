'use client';

import { MenuManagement } from '@/components/MenuManagement';
import { useEffect, useState, useRef } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/actions';
import { FALLBACK_MENU } from '@/lib/menu-data';

const FALLBACK = FALLBACK_MENU.map(item => ({ ...item, available: true }));

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>(FALLBACK);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    checkAdminAuth().then(async (authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      if (loaded.current) return;
      loaded.current = true;
      try {
        const data = await getMenuItems();
        if (data.length > 0) { setItems(data); }
      } catch { /* fallback already shown */ }
    });
  }, []);

  const handleAdd = async (item: any) => {
    const res = await addMenuItem(item);
    if (!res.success) { alert('Failed: ' + res.error); return; }
    setItems(prev => [...prev, { ...res.data, available: true }]);
  };

  const handleEdit = async (id: number, item: any) => {
    const res = await updateMenuItem(id, item);
    if (!res.success) { alert('Failed: ' + res.error); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  const handleDelete = async (id: number) => {
    try { await deleteMenuItem(id); setItems(prev => prev.filter(i => i.id !== id)); }
    catch (e) { alert('Failed: ' + (e instanceof Error ? e.message : 'Unknown error')); }
  };

  if (authorized === null) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <MenuManagement items={items} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
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
