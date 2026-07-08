'use client';

import { Navigation } from '@/components/Navigation';
import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock,
  Star,
  ChefHat,
  Utensils,
  LogOut,
  Package,
  MessageSquare,
  Settings,
  Table
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getMenuItems, getOrders } from '@/lib/actions';
import { checkAdminAuth, logoutAdmin } from '@/lib/admin-auth';

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) {
        window.location.href = '/admin/login';
      } else {
        setAuthorized(true);
        getMenuItems().then(setMenuItems).catch(console.error);
        getOrders().then(setOrders).catch(console.error);
      }
    });
  }, []);

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const averageRating = menuItems.length
    ? (menuItems.reduce((sum, i) => sum + i.rating, 0) / menuItems.length).toFixed(1)
    : '0.0';

  const stats = [
    {
      title: 'Total Revenue',
      value: `ETB ${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      change: '+8.2%',
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: 'up',
    },
    {
      title: 'Menu Items',
      value: menuItems.length.toString(),
      change: '+15.3%',
      icon: <Users className="w-6 h-6" />,
      trend: 'up',
    },
    {
      title: 'Average Rating',
      value: averageRating,
      change: '+0.2',
      icon: <Star className="w-6 h-6" />,
      trend: 'up',
    },
  ];

  const recentOrders = orders.slice(0, 4).map(order => ({
    id: order.id,
    customer: order.customer,
    items: order.items.map((i: any) => i.name).join(', '),
    total: `ETB ${order.total}`,
    status: order.status,
    time: new Date(order.created_at).toLocaleDateString(),
  }));

  const topDishes = menuItems
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map(item => ({
      name: item.name,
      orders: Math.floor(Math.random() * 50) + 20,
      revenue: `ETB ${(item.price * (Math.floor(Math.random() * 50) + 20)).toLocaleString()}`,
      rating: item.rating,
    }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-500';
      case 'preparing':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'ready':
        return 'bg-green-500/20 text-green-500';
      case 'served':
        return 'bg-[#D4AF37]/20 text-[#D4AF37]';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

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
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-black/60 dark:text-white/60">
                  Welcome back! Here's what's happening today.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <GlassCard key={stat.title} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    {stat.icon}
                  </div>
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-black dark:text-white mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60">
                  {stat.title}
                </p>
              </GlassCard>
            ))}
          </motion.div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Orders */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Recent Orders
                </h2>
                <button className="text-[#D4AF37] text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/40 rounded-xl border border-[#D4AF37]/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="font-bold text-black dark:text-white">
                          {order.customer}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-black/60 dark:text-white/60">
                        {order.items}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black dark:text-white">{order.total}</p>
                      <p className="text-xs text-black/40 dark:text-white/40">{order.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Top Dishes */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Top Dishes
                </h2>
                <button className="text-[#D4AF37] text-sm font-medium hover:underline">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {topDishes.map((dish, index) => (
                  <motion.div
                    key={dish.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/40 rounded-xl border border-[#D4AF37]/10"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-lg font-bold text-[#D4AF37]">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-black dark:text-white">
                          {dish.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                          <span className="text-black/60 dark:text-white/60">
                            {dish.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-black dark:text-white">{dish.revenue}</p>
                      <p className="text-xs text-black/40 dark:text-white/40">{dish.orders} orders</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <Link href="/admin/menu">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Manage Menu</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Add/Edit dishes</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/admin/orders">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Orders</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Manage orders</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/admin/tables">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <Table className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Tables</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Manage tables & QR codes</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/admin/staff">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Staff</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Manage staff</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/admin/reviews">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Reviews</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Manage reviews</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/admin/inventory">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Inventory</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Track stock levels</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/admin/settings">
              <GlassCard className="p-6 cursor-pointer hover:border-[#D4AF37]/40 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <Settings className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">Settings</h3>
                    <p className="text-sm text-black/60 dark:text-white/60">Restaurant settings</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}