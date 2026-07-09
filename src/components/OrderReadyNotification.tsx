'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface ReadyOrder {
  id: string;
  customer: string;
  table_number: string | null;
  items: any[];
  total: number;
}

interface Notification {
  id: string;
  order: ReadyOrder;
  timestamp: number;
}

export function useOrderReadyNotifications(orders: any[]) {
  const prevOrdersRef = useRef<any[]>(orders);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const prevOrders = prevOrdersRef.current;
    const prevReadyIds = new Set(
      prevOrders.filter(o => o.status === 'ready').map(o => o.id)
    );
    const currReady = orders.filter(o => o.status === 'ready');

    const newReady = currReady.filter(o => !prevReadyIds.has(o.id));

    if (newReady.length > 0) {
      const newNotifications: Notification[] = newReady.map(order => {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
        const total = Array.isArray(items)
          ? items.reduce((s: number, it: any) => s + it.price * it.quantity, 0)
          : 0;
        return {
          id: order.id + '-' + Date.now(),
          order: {
            id: order.id,
            customer: order.customer || `Order #${String(order.id).slice(-6)}`,
            table_number: order.table_number,
            items,
            total,
          },
          timestamp: Date.now(),
        };
      });
      setNotifications(prev => [...prev, ...newNotifications]);
    }

    prevOrdersRef.current = orders;
  }, [orders]);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, dismiss };
}

export function OrderReadyToast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto"
    >
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 backdrop-blur-xl p-4 shadow-2xl shadow-emerald-500/10 w-80">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Order Ready!</p>
            <p className="text-xs text-white/60 mt-0.5">
              {notification.order.customer}
              {notification.order.table_number && ` · Table ${notification.order.table_number}`}
            </p>
            <p className="text-xs text-white/40 mt-1 line-clamp-1">
              {Array.isArray(notification.order.items)
                ? notification.order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')
                : ''}
            </p>
            <p className="text-sm font-bold text-emerald-400 mt-1.5">ETB {notification.order.total.toFixed(2)}</p>
          </div>
          <button
            onClick={() => onDismiss(notification.id)}
            className="text-white/30 hover:text-white/60 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
