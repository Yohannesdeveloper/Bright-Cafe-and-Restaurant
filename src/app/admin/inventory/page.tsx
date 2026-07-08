'use client';

import { Navigation } from '@/components/Navigation';
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
    id: i.id,
    name: i.name,
    category: i.category,
    quantity: i.quantity,
    unit: i.unit,
    minThreshold: i.min_threshold,
    cost: i.cost,
    lastRestocked: i.last_restocked,
  }));

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
        <InventoryManagement items={mappedItems} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} onUpdateQuantity={handleUpdateQuantity} />
      </div>
    </div>
  );
}
