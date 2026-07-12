'use client';

import { InventoryManagement } from '@/components/InventoryManagement';
import { useEffect, useState } from 'react';
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '@/lib/actions';

export default function AdminInventoryPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // Auth guaranteed by middleware — fetch immediately
    getInventory().then(setItems).catch(console.error);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <InventoryManagement items={mappedItems} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} onUpdateQuantity={handleUpdateQuantity} />
    </div>
  );
}
