'use client';

import { OrderManagement } from '@/components/OrderManagement';
import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus, deleteCompletedOrders } from '@/lib/actions';
import { getCached, setCache } from '@/lib/cache';

const CACHE_KEY = 'admin_orders';

export default function AdminOrdersPage() {
  // null = loading, array = ready (cache only contains real DB data)
  const [orders, setOrders] = useState<any[] | null>(() => getCached<any[]>(CACHE_KEY) ?? null);

  const refreshOrders = async () => {
    const data = await getOrders();
    setOrders(data);
    setCache(CACHE_KEY, data);
    return data;
  };

  useEffect(() => {
    // Auth guaranteed by middleware — fetch immediately
    refreshOrders().catch(console.error);
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    await refreshOrders();
  };

  const handleViewDetails = (order: any) => {
    alert(`Order ${order.id}\nCustomer: ${order.customer}\nTable: ${order.table}\nTotal: ETB ${order.total}`);
  };

  const mappedOrders = (orders ?? []).map((o: any) => ({
    id: o.id, customer: o.customer, table: o.table_number,
    items: o.items || [], total: o.total, status: o.status,
    time: new Date(o.created_at).toLocaleString(), notes: o.notes,
  }));

  const handleClearHistory = async () => {
    await deleteCompletedOrders();
    await refreshOrders();
  };

  // Show skeleton on true first load (no cache available)
  if (orders === null) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-3 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-7 w-32 rounded-lg bg-white/[0.06]" />
          <div className="h-9 w-44 rounded-lg bg-white/[0.06]" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
            <div className="w-10 h-10 rounded-lg bg-white/[0.06] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-white/[0.06]" />
              <div className="h-3 w-48 rounded bg-white/[0.04]" />
            </div>
            <div className="h-6 w-20 rounded-full bg-white/[0.06]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white/90">All Orders</h2>
        <button onClick={handleClearHistory} className="px-4 py-2 text-sm rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
          Clear Completed History
        </button>
      </div>
      <OrderManagement orders={mappedOrders} onUpdateStatus={handleUpdateStatus as any} onViewDetails={handleViewDetails as any} />
    </div>
  );
}
