'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, UtensilsCrossed, Coffee, Wine, Pizza, Cake, Search, ShoppingBag, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRestaurantSettings } from '@/lib/actions';

export default function LandingPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    getRestaurantSettings().then(setSettings).catch(() => {});
  }, []);

  const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay } } });

  const categories = [
    { icon: Coffee, label: 'Hot Drinks', color: 'from-amber-500/20 to-amber-600/10' },
    { icon: Wine, label: 'Beverages', color: 'from-blue-500/20 to-blue-600/10' },
    { icon: Pizza, label: 'Pizza', color: 'from-orange-500/20 to-orange-600/10' },
    { icon: Cake, label: 'Cake & Snacks', color: 'from-pink-500/20 to-pink-600/10' },
    { icon: UtensilsCrossed, label: 'Habesha Food', color: 'from-emerald-500/20 to-emerald-600/10' },
    { icon: Search, label: 'All Categories', color: 'from-[#D4AF37]/20 to-[#D4AF37]/10' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#050508] pointer-events-none" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#D4AF37]/3 blur-[100px]" />
        </div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div {...fadeUp(0)}>
            <img src="/PNG-01.png" alt="Logo" className="h-24 w-auto mx-auto mb-6" />
          </motion.div>
          <motion.h1 {...fadeUp(0.15)} className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
            <span className="text-white">Bright</span>{' '}
            <span className="text-[#D4AF37]">Cafe</span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-white/60 font-light">&amp; Restaurant</span>
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            {settings?.description || 'Experience premium dining with our digital menu. Browse, order, and enjoy — all from your device.'}
          </motion.p>
          <motion.div {...fadeUp(0.45)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="group relative px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black font-bold text-lg rounded-full shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-3">
                Explore Our Menu
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/menu?table=1"
              className="group px-8 py-4 border border-white/20 text-white/80 font-medium text-lg rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Order from Your Table
              </span>
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-[#D4AF37] rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative px-4 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '150+', label: 'Menu Items', icon: UtensilsCrossed },
            { value: '13', label: 'Categories', icon: Search },
            { value: '4.9', label: 'Customer Rating', icon: Star },
            { value: '1000+', label: 'Happy Customers', icon: ShoppingBag },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative group p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent hover:border-[#D4AF37]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 text-center">
                <stat.icon className="w-6 h-6 text-[#D4AF37]/60 mx-auto mb-3" />
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="relative px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Explore <span className="text-[#D4AF37]">Categories</span></h2>
            <p className="text-white/40 text-lg">From traditional Ethiopian dishes to international favorites</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="relative group cursor-pointer"
              >
                <Link href="/menu">
                  <div className={`relative p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${cat.color} overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                        <cat.icon className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <span className="text-sm font-medium text-white/80 text-center">{cat.label}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/3 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to <span className="text-[#D4AF37]">Order?</span></h2>
          <p className="text-white/50 text-lg mb-8">Browse our full menu with stunning visuals and real-time updates</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black font-bold text-lg rounded-full shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
          >
            View Full Menu <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-4 py-8">
        <div className="max-w-5xl mx-auto text-center text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} Bright Cafe and Restaurant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
