'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Star, Heart } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useState } from 'react';

interface FoodModalProps {
  item: {
    id: number;
    name: string;
    description: string;
    price: number;
    rating: number;
    image: string;
    category: string;
    available?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any, quantity: number, customizations: string[]) => void;
}

export function FoodModal({ item, isOpen, onClose, onAddToCart }: FoodModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<string[]>([]);

  const customizations = [
    { id: 'extra-truffle', name: 'Extra Truffle Oil', price: 8 },
    { id: 'gold-leaf', name: '24K Gold Leaf', price: 15 },
    { id: 'wagyu-upgrade', name: 'Wagyu Upgrade', price: 25 },
    { id: 'gluten-free', name: 'Gluten-Free', price: 0 },
  ];

  const toggleCustomization = (id: string) => {
    setSelectedCustomizations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const customizationPrice = customizations
    .filter(c => selectedCustomizations.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);

  const totalPrice = (item.price + customizationPrice) * quantity;

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedCustomizations);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
          >
            <GlassCard className="h-full max-h-[90vh] overflow-y-auto">
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full z-10"
                >
                  <X className="w-6 h-6 text-black dark:text-white" />
                </motion.button>

                <div className="relative">
                  {item.image?.startsWith('http') ? (
                    <img src={item.image} alt={item.name} className="w-full h-64 object-cover" />
                  ) : (
                    <div className="flex w-full h-64 items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-6xl">
                      {item.image}
                    </div>
                  )}
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white font-semibold text-lg px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">Currently Unavailable</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                        {item.name}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(item.rating)
                                  ? 'text-[#D4AF37] fill-[#D4AF37]'
                                  : 'text-black/20 dark:text-white/20'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-black/60 dark:text-white/60">
                          ({item.rating})
                        </span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 border-2 border-[#D4AF37]/30 rounded-full"
                    >
                      <Heart className="w-6 h-6 text-[#D4AF37]" />
                    </motion.button>
                  </div>

                  <p className="text-black/70 dark:text-white/70 mb-6">
                    {item.description}
                  </p>

                  {/* Customizations */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                      Customizations
                    </h3>
                    <div className="space-y-3">
                      {customizations.map((custom) => (
                        <motion.button
                          key={custom.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toggleCustomization(custom.id)}
                          className={`w-full p-4 border-2 rounded-xl flex items-center justify-between transition-all ${
                            selectedCustomizations.includes(custom.id)
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                              : 'border-[#D4AF37]/20 bg-transparent'
                          }`}
                        >
                          <span className="text-black dark:text-white font-medium">
                            {custom.name}
                          </span>
                          {custom.price > 0 && (
                            <span className="text-[#D4AF37] font-bold">
                              +ETB {custom.price}
                            </span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                      Quantity
                    </h3>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 border-2 border-[#D4AF37]/30 rounded-full flex items-center justify-center"
                      >
                        <Minus className="w-5 h-5 text-black dark:text-white" />
                      </motion.button>
                      <span className="text-2xl font-bold text-black dark:text-white w-12 text-center">
                        {quantity}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 border-2 border-[#D4AF37]/30 rounded-full flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 text-black dark:text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between pt-6 border-t border-[#D4AF37]/20">
                    <div>
                      <p className="text-sm text-black/60 dark:text-white/60">Total Price</p>
                      <p className="text-3xl font-bold text-[#D4AF37]">ETB {totalPrice}</p>
                    </div>
                    <motion.button
                      whileHover={item.available ? { scale: 1.05 } : {}}
                      whileTap={item.available ? { scale: 0.95 } : {}}
                      onClick={handleAddToCart}
                      disabled={!item.available}
                      className={`px-8 py-4 rounded-full font-bold text-lg transition-colors ${
                        item.available
                          ? 'bg-[#D4AF37] text-white hover:bg-[#B8962F]'
                          : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                    >
                      {item.available ? 'Add to Cart' : 'Unavailable'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}