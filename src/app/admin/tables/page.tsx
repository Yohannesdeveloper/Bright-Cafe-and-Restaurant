'use client';

import { Navigation } from '@/components/Navigation';
import { TableManagement } from '@/components/TableManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getRestaurantTables, addRestaurantTable, updateRestaurantTable, deleteRestaurantTable } from '@/lib/actions';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getRestaurantTables().then(setTables).catch(console.error);
    });
  }, []);

  const handleAdd = async (table: any) => {
    const qrCode = typeof window !== 'undefined' ? `${window.location.origin}/menu/${table.number}` : '';
    await addRestaurantTable({ ...table, qr_code: qrCode });
    setTables(await getRestaurantTables());
  };

  const handleEdit = async (id: number, table: any) => {
    await updateRestaurantTable(id, table);
    setTables(await getRestaurantTables());
  };

  const handleDelete = async (id: number) => {
    await deleteRestaurantTable(id);
    setTables(await getRestaurantTables());
  };

  const mappedTables = tables.map((t: any) => ({
    id: t.id,
    number: t.number,
    capacity: t.capacity,
    location: t.location,
    qrCode: t.qr_code,
    status: t.status,
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
        <TableManagement tables={mappedTables} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} />
      </div>
    </div>
  );
}
