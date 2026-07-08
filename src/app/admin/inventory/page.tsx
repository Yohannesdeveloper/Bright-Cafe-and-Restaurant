'use client';

import { InventoryManagement } from '@/components/InventoryManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/actions';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getInventory().then(setItems).catch(console.error);
    });
  }, []);

  const handleAdd = async (item: any) => {
    const { lastRestocked, ...rest } = item;
    await addInventoryItem(rest);
    setItems(await getInventory());
  };
  const handleEdit = async (id: number, item: any) => {
    await updateInventoryItem(id, item);
    setItems(await getInventory());
  };
  const handleDelete = async (id: number) => {
    await deleteInventoryItem(id);
    setItems(await getInventory());
  };
  const handleUpdateQuantity = async (id: number, quantity: number) => {
    await updateInventoryItem(id, { quantity });
    setItems(await getInventory());
  };

  const mappedItems = items.map((i: any) => ({
    id: i.id, name: i.name, category: i.category, quantity: i.quantity,
    unit: i.unit, minThreshold: i.min_threshold, cost: i.cost, lastRestocked: i.last_restocked,
  }));

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
      <InventoryManagement items={mappedItems} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} onUpdateQuantity={handleUpdateQuantity} />
    </div>
  );
}
