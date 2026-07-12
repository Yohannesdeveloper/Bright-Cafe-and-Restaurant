'use client';

import { MenuManagement } from '@/components/MenuManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/actions';
import { getCached, setCache } from '@/lib/cache';
import { FALLBACK_MENU } from '@/lib/menu-data';
import { RefreshCw } from 'lucide-react';

const FALLBACK = FALLBACK_MENU.map(item => ({ ...item, available: true }));

export function AdminMenuClient() {
  const [items, setItems] = useState<any[]>(() => getCached<any[]>('adminMenuItems') || FALLBACK);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
    });
    getMenuItems().then(data => {
      if (data.length > 0) { setItems(data); setCache('adminMenuItems', data); }
    }).catch(() => {});
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const data = await getMenuItems();
      if (data.length > 0) { setItems(data); setCache('adminMenuItems', data); }
    } catch {}
    finally { setRefreshing(false); }
  };

  const handleAdd = async (item: any) => {
    const res = await addMenuItem(item);
    if (!res.success) { alert('Failed: ' + res.error); return; }
    const next = [...items, { ...res.data, available: true }];
    setItems(next); setCache('adminMenuItems', next);
  };

  const handleEdit = async (id: number, item: any) => {
    const res = await updateMenuItem(id, item);
    if (!res.success) { alert('Failed: ' + res.error); return; }
    const next = items.map(i => i.id === id ? { ...i, ...item } : i);
    setItems(next); setCache('adminMenuItems', next);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMenuItem(id);
      const next = items.filter(i => i.id !== id);
      setItems(next); setCache('adminMenuItems', next);
    } catch (e) {
      alert('Failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
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
      <div className="flex items-center justify-end mb-4">
        <button onClick={refresh} disabled={refreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all disabled:opacity-50">
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Sync from DB'}
        </button>
      </div>
      <MenuManagement items={items} onAdd={handleAdd} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
