'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Plus, Edit, Trash2, Search, AlertTriangle, Package, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  cost: number;
  lastRestocked: string;
}

interface InventoryManagementProps {
  items: InventoryItem[];
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  onEdit: (id: number, item: Partial<InventoryItem>) => void;
  onDelete: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export function InventoryManagement({ items, onAdd, onEdit, onDelete, onUpdateQuantity }: InventoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const categories = ['all', 'meat', 'seafood', 'vegetables', 'dairy', 'spices', 'beverages'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => item.quantity <= item.minThreshold);
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= item.minThreshold) {
      return { color: 'text-red-500', bg: 'bg-red-500/20', icon: <AlertTriangle className="w-4 h-4" /> };
    } else if (item.quantity <= item.minThreshold * 2) {
      return { color: 'text-yellow-500', bg: 'bg-yellow-500/20', icon: <AlertTriangle className="w-4 h-4" /> };
    }
    return { color: 'text-green-500', bg: 'bg-green-500/20', icon: <Package className="w-4 h-4" /> };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Inventory Management
          </h2>
          <p className="text-black/60 dark:text-white/60">
            Track ingredients and manage stock levels
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center text-[#D4AF37]">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-black/60 dark:text-white/60">Total Items</p>
              <p className="text-2xl font-bold text-black dark:text-white">{items.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-black/60 dark:text-white/60">Low Stock</p>
              <p className="text-2xl font-bold text-black dark:text-white">{lowStockItems.length}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-black/60 dark:text-white/60">Total Value</p>
              <p className="text-2xl font-bold text-black dark:text-white">ETB {totalValue.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
            <input
              type="text"
              placeholder="Search inventory items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-full text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-full text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-white dark:bg-black">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <GlassCard className="p-4 border-2 border-red-500/30">
          <div className="flex items-center space-x-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-black dark:text-white">Low Stock Alert</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm">
                {item.name}
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const stockStatus = getStockStatus(item);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${stockStatus.bg} rounded-full flex items-center justify-center ${stockStatus.color}`}>
                      {stockStatus.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white">
                        {item.name}
                      </h3>
                      <span className="text-sm text-black/60 dark:text-white/60 capitalize">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full"
                    >
                      <Edit className="w-4 h-4 text-[#D4AF37]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(item.id)}
                      className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60 dark:text-white/60">Quantity</span>
                    <span className="font-bold text-black dark:text-white">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60 dark:text-white/60">Min Threshold</span>
                    <span className="font-bold text-black dark:text-white">
                      {item.minThreshold} {item.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black/60 dark:text-white/60">Cost per Unit</span>
                    <span className="font-bold text-[#D4AF37]">
                      ETB {item.cost}
                    </span>
                  </div>
                </div>

                {/* Quantity Update */}
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="w-10 h-10 border-2 border-[#D4AF37]/30 rounded-full flex items-center justify-center"
                  >
                    <TrendingDown className="w-4 h-4 text-black dark:text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="w-10 h-10 border-2 border-[#D4AF37]/30 rounded-full flex items-center justify-center"
                  >
                    <TrendingUp className="w-4 h-4 text-black dark:text-white" />
                  </motion.button>
                  
                  <span className={`ml-auto text-sm font-medium ${stockStatus.color}`}>
                    {item.quantity <= item.minThreshold ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target as HTMLFormElement);
                const name = data.get('name') as string;
                const category = data.get('category') as string;
                const unit = data.get('unit') as string;
                const quantity = parseFloat(data.get('quantity') as string);
                const minThreshold = parseFloat(data.get('minThreshold') as string);
                const cost = parseFloat(data.get('cost') as string);

                if (editingItem) {
                  onEdit(editingItem.id, { name, category, unit, quantity, minThreshold, cost });
                } else {
                  onAdd({ name, category, unit, quantity, minThreshold, cost, lastRestocked: new Date().toISOString() });
                }
                setIsModalOpen(false);
              }}>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingItem?.name}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="Enter item name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      defaultValue={editingItem?.category}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      required
                    >
                      {categories.filter(c => c !== 'all').map(category => (
                        <option key={category} value={category} className="bg-white dark:bg-black">
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      name="unit"
                      defaultValue={editingItem?.unit}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="kg, lbs, etc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={editingItem?.quantity}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Min Threshold
                    </label>
                    <input
                      type="number"
                      name="minThreshold"
                      defaultValue={editingItem?.minThreshold}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Cost per Unit (ETB)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    step="0.01"
                    defaultValue={editingItem?.cost}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors"
                  >
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </motion.button>
                </div>
              </form>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}