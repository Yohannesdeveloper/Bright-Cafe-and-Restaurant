'use client';

import { OrderManagement } from '@/components/OrderManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getOrders, updateOrderStatus } from '@/lib/actions';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getOrders().then(setOrders).catch(console.error);
    });
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    setOrders(await getOrders());
  };

  const handleViewDetails = (order: any) => {
    alert(`Order ${order.id}\nCustomer: ${order.customer}\nTable: ${order.table}\nTotal: ETB ${order.total}`);
  };

  const mappedOrders = orders.map((o: any) => ({
    id: o.id, customer: o.customer, table: o.table_number,
    items: o.items || [], total: o.total, status: o.status,
    time: new Date(o.created_at).toLocaleString(), notes: o.notes,
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
      <OrderManagement orders={mappedOrders} onUpdateStatus={handleUpdateStatus as any} onViewDetails={handleViewDetails as any} />
    </div>
  );
}
