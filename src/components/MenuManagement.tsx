'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Plus, Edit, Trash2, Search, Filter, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface MenuManagementProps {
  items: FoodItem[];
  onAdd: (item: Omit<FoodItem, 'id'>) => void;
  onEdit: (id: number, item: Partial<FoodItem>) => void;
  onDelete: (id: number) => void;
}

export function MenuManagement({ items, onAdd, onEdit, onDelete }: MenuManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: FoodItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Menu Management
          </h2>
          <p className="text-black/60 dark:text-white/60">
            Manage your restaurant menu items
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Item</span>
        </motion.button>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-full text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-[#D4AF37]" />
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
        </div>
      </GlassCard>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-[#D4AF37]/30" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex space-x-2">
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
                {!item.available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Unavailable</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {item.name}
                  </h3>
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    ETB {item.price}
                  </span>
                </div>
                
                <p className="text-black/60 dark:text-white/60 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm font-medium">
                    {item.category}
                  </span>
                  <span className={`text-sm font-medium ${
                    item.available ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target as HTMLFormElement);
                const name = data.get('name') as string;
                const description = data.get('description') as string;
                const price = parseFloat(data.get('price') as string);
                const category = data.get('category') as string;
                const image = data.get('image') as string;
                const available = data.get('available') === 'on';

                if (editingItem) {
                  onEdit(editingItem.id, { name, description, price, category, image, available });
                } else {
                  onAdd({ name, description, price, category, image, available } as Omit<FoodItem, 'id'>);
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

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingItem?.description}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
                    placeholder="Enter item description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black dark:text-white mb-2">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={editingItem?.price}
                      className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                      placeholder="0.00"
                      required
                    />
                  </div>

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
                      {Array.from(new Set(items.map(item => item.category))).map(category => (
                        <option key={category} value={category} className="bg-white dark:bg-black">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    defaultValue={editingItem?.image}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="available"
                    id="available"
                    defaultChecked={editingItem?.available ?? true}
                    className="w-5 h-5 accent-[#D4AF37]"
                  />
                  <label htmlFor="available" className="text-sm font-medium text-black dark:text-white">
                    Available for ordering
                  </label>
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