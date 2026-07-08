'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Clock, CheckCircle, XCircle, ChefHat, User, DollarSign, Filter, Eye } from 'lucide-react';
import { useState } from 'react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  customizations: string[];
}

interface Order {
  id: string;
  customer: string;
  table: string;
  items: OrderItem[];
  total: number;
  status: 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  time: string;
  notes?: string;
}

interface OrderManagementProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onViewDetails: (order: Order) => void;
}

export function OrderManagement({ orders, onUpdateStatus, onViewDetails }: OrderManagementProps) {
  const [selectedStatus, setSelectedStatus] = useState<'all' | Order['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    served: orders.filter(o => o.status === 'served').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'preparing':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'ready':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'served':
        return 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <ChefHat className="w-4 h-4" />;
      case 'ready':
        return <Clock className="w-4 h-4" />;
      case 'served':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Order Management
          </h2>
          <p className="text-black/60 dark:text-white/60">
            Real-time order tracking and management
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-3">
        {(['all', 'confirmed', 'preparing', 'ready', 'served', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full border-2 transition-all flex items-center space-x-2 ${
              selectedStatus === status
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-transparent text-black dark:text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
          >
            {getStatusIcon(status === 'all' ? 'confirmed' : status)}
            <span className="capitalize">{status}</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer name or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-full text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
      </GlassCard>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-[#D4AF37]/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                      {order.customer}
                    </h3>
                    <p className="text-sm text-black/60 dark:text-white/60">
                      Table {order.table} • {order.time}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    <span className="capitalize">{order.status}</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black/60 dark:text-white/60">
                    Order #{order.id}
                  </span>
                  <span className="text-xl font-bold text-[#D4AF37]">
                    ETB {order.total}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  {order.items.slice(0, 3).map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-black/60 dark:text-white/60">
                          {item.quantity}x
                        </span>
                        <span className="text-black dark:text-white">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-black/60 dark:text-white/60">
                        ETB {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-[#D4AF37]">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-[#D4AF37]/10 rounded-lg">
                    <p className="text-sm text-black/70 dark:text-white/70 italic">
                      "{order.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-[#D4AF37]/20">
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onViewDetails(order)}
                    className="flex-1 px-4 py-2 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </motion.button>
                  
                  {order.status === 'confirmed' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdateStatus(order.id, 'preparing')}
                      className="flex-1 px-4 py-2 bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500/30 rounded-full font-medium hover:bg-yellow-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <ChefHat className="w-4 h-4" />
                      <span>Start</span>
                    </motion.button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdateStatus(order.id, 'ready')}
                      className="flex-1 px-4 py-2 bg-green-500/20 text-green-500 border-2 border-green-500/30 rounded-full font-medium hover:bg-green-500/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready</span>
                    </motion.button>
                  )}
                  
                  {order.status === 'ready' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onUpdateStatus(order.id, 'served')}
                      className="flex-1 px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] border-2 border-[#D4AF37]/30 rounded-full font-medium hover:bg-[#D4AF37]/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Serve</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <GlassCard className="p-12 text-center">
          <Clock className="w-16 h-16 text-[#D4AF37]/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-black dark:text-white mb-2">
            No orders found
          </h3>
          <p className="text-black/60 dark:text-white/60">
            {selectedStatus === 'all' 
              ? 'There are no orders at the moment' 
              : `No orders with status "${selectedStatus}"`}
          </p>
        </GlassCard>
      )}
    </div>
  );
}