'use client';

import { Navigation } from '@/components/Navigation';
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
    id: o.id,
    customer: o.customer,
    table: o.table_number,
    items: o.items || [],
    total: o.total,
    status: o.status,
    time: new Date(o.created_at).toLocaleString(),
    notes: o.notes,
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
        <OrderManagement orders={mappedOrders} onUpdateStatus={handleUpdateStatus as any} onViewDetails={handleViewDetails as any} />
      </div>
    </div>
  );
}
