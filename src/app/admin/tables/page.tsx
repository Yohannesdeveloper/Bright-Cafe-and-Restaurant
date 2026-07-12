'use client';

import { TableManagement } from '@/components/TableManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getRestaurantTables, addRestaurantTable, updateRestaurantTable, deleteRestaurantTable } from '@/lib/actions';

const seedTables = async () => {
  const locations = ['Main Hall', 'Terrace', 'VIP Room', 'Garden', 'Balcony'];
  for (let i = 1; i <= 15; i++) {
    const number = i.toString();
    const capacity = i <= 5 ? 2 : i <= 10 ? 4 : 6;
    const location = locations[i % locations.length];
    const qrCode = typeof window !== 'undefined' ? `${window.location.origin}/menu/${number}` : '';
    await addRestaurantTable({ number, capacity, location, qr_code: qrCode, status: 'available' });
  }
};

export default function AdminTablesPage() {
  const [tables, setTables] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then(async (authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      const existing = await getRestaurantTables();
      if (existing.length === 0) {
        await seedTables();
        setTables(await getRestaurantTables());
      } else {
        setTables(existing);
      }
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
    id: t.id, number: t.number, capacity: t.capacity, location: t.location, qrCode: t.qr_code, status: t.status,
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
      <TableManagement tables={mappedTables} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} />
    </div>
  );
}
