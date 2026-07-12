'use client';

import { FoodModal } from '@/components/FoodModal';
import { Cart } from '@/components/Cart';
import { ShoppingBag, Plus, Search, Globe, Camera, MessageCircle, Play, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getMenuItems, getRestaurantSettings, createOrder } from '@/lib/actions';

import { getCached, setCache } from '@/lib/cache';
import { supabase } from '@/lib/supabase';
import { ThemeToggle } from './ThemeToggle';
import { QRCodeSVG } from 'qrcode.react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  customizations: string[];
  image: string;
}

export function MenuView({ tableNumber, initialItems }: { tableNumber?: string; initialItems?: any[] }) {
  const searchParams = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[] | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const refreshMenu = useCallback(async () => {
    try {
      const data = await getMenuItems();
      if (data.length > 0) { setMenuItems(data); setCache('menuItems', data); }
    } catch {}
  }, []);

  useEffect(() => {
    setMounted(true);
    if (initialItems && initialItems.length > 0) {
      setMenuItems(initialItems);
      setCache('menuItems', initialItems);
    } else {
      const cached = getCached<any[]>('menuItems');
      if (cached) setMenuItems(cached);
    }
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) setActiveCategory(categoryFromUrl);
    refreshMenu();
    const channel = supabase.channel('menu-items')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, refreshMenu)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [refreshMenu, initialItems, searchParams]);

  useEffect(() => {
    getRestaurantSettings().then(setSettings).catch(() => {});
    const channel = supabase.channel('settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_settings' }, () => {
        getRestaurantSettings().then(setSettings).catch(() => {});
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredItems = useMemo(() => (menuItems ?? []).filter(item => {
    const q = searchQuery.toLowerCase();
    return !q || item.name.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
  }), [menuItems, searchQuery]);
  const groupedItems: Record<string, any[]> = {};
  filteredItems.forEach(item => {
    if (!groupedItems[item.category]) groupedItems[item.category] = [];
    groupedItems[item.category].push(item);
  });
  const categoryNames = Object.keys(groupedItems);

  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0]);
    }
  }, [categoryNames, activeCategory]);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleAddToCart = (item: any, quantity: number, customizations: string[]) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
      ));
    } else {
      setCartItems([...cartItems, {
        id: item.id, name: item.name, price: item.price, quantity, customizations, image: item.image,
      }]);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) handleRemoveItem(id);
    else setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (checkingOut) return;
    setCheckingOut(true);
    try {
      await createOrder({
        customer: `Table ${tableNumber || 'Takeaway'}`,
        table_number: tableNumber || '0',
        items: cartItems.map(item => ({
          id: item.id, name: item.name, price: item.price, quantity: item.quantity, customizations: item.customizations,
        })),
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'confirmed',
        notes: '',
      });
      setCartItems([]);
      setIsCartOpen(false);
      alert('Order placed successfully!');
    } catch (e) {
      alert('Failed to place order: ' + (e instanceof Error ? e.message : 'Unknown error'));
    } finally {
      setCheckingOut(false);
    }
  };

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    document.getElementById(`cat-${category}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-white dark:from-[#050508] dark:to-[#0a0a12] text-black dark:text-white">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 py-8 px-4 max-w-7xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white/5 border border-white/[0.06] p-1.5 sm:p-2 flex gap-2">
              <div className="w-[8rem] h-[8rem] rounded-xl bg-white/[0.06] shrink-0" />
              <div className="flex-1 p-2 space-y-2">
                <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
                <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                <div className="h-5 w-1/3 rounded bg-white/[0.06] mt-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-white dark:from-[#050508] dark:to-[#0a0a12] text-black dark:text-white">
      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#D4AF37]/3 dark:bg-[#D4AF37]/5 blur-[150px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[#D4AF37]/2 dark:bg-[#D4AF37]/3 blur-[150px]" />
      </div>

      <div className="relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#050508]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/[0.04]">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <Image src={settings?.logo || '/PNG-01.png'} alt="Logo" width={32} height={32} className="object-contain" priority />
              <span className="text-sm font-medium text-black/50 dark:text-white/50">
                {tableNumber ? `Table ${tableNumber}` : 'Our Menu'}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-black dark:text-white shadow-sm transition hover:border-[#D4AF37]/40 hover:shadow-[#D4AF37]/10 active:scale-95"
                aria-label="Cart"
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-white shadow-lg shadow-[#D4AF37]/30">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Restaurant Hero */}
        <div className="relative px-4 pb-8 pt-8 text-center">
          <div className="mx-auto max-w-7xl">
            <div className="inline-block p-1 rounded-full bg-gradient-to-r from-[#D4AF37]/30 to-transparent mb-6">
              <Image src={settings?.logo || '/PNG-01.png'} alt="Logo" width={80} height={80} className="drop-shadow-2xl" priority />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black dark:text-white">
              {settings?.name || 'Bright Cafe and Restaurant'}
            </h1>
            {settings?.description && (
              <p className="mt-2 text-sm font-medium uppercase tracking-[0.3em] text-[#D4AF37]/70">
                {settings.description}
              </p>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mx-auto max-w-7xl px-4 pb-5">
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-black/30 dark:text-white/30 group-focus-within:text-[#D4AF37] transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-900/80 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <nav className="sticky top-[60px] z-30 mx-auto max-w-7xl overflow-x-auto px-4 py-3 bg-gradient-to-b from-white dark:from-[#050508] to-transparent [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-center gap-2 p-1 rounded-2xl bg-black/5 dark:bg-white/[0.04]">
            {categoryNames.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => scrollToCategory(cat)}
                className={`relative whitespace-nowrap px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  activeCategory === cat
                    ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/25'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Menu Sections */}
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-2">
          {menuItems === null && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 py-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white/5 border border-white/[0.06] p-1.5 sm:p-2 flex gap-2">
                  <div className="w-[8rem] h-[8rem] rounded-xl bg-white/[0.06] shrink-0" />
                  <div className="flex-1 p-2 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
                    <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                    <div className="h-5 w-1/3 rounded bg-white/[0.06] mt-auto" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {menuItems !== null && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-white/30" />
              </div>
              <p className="text-white/40 text-sm">No items match your search</p>
            </div>
          )}
          {categoryNames.map((cat, ci) => (
            <section
              key={cat}
              id={`cat-${cat}`}
              className="scroll-mt-[120px] pt-6 sm:scroll-mt-[124px]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                <h2 className="text-lg sm:text-xl font-bold text-black dark:text-white tracking-tight">{cat}</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/40 to-transparent" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groupedItems[cat].map((item, ii) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: ii * 0.04, duration: 0.4 }}
                    className="group relative flex items-stretch gap-2 rounded-2xl bg-white dark:bg-neutral-900/50 border border-black/5 dark:border-white/[0.06] p-1.5 sm:p-2 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5 dark:hover:shadow-[#D4AF37]/5 transition-all duration-300"
                  >
                    <div className="relative h-full max-h-[140px] min-h-[8rem] w-[8rem] shrink-0 overflow-hidden rounded-xl sm:max-h-[10rem] sm:w-[10rem]">
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className="h-full w-full cursor-zoom-in"
                      >
                        <div className="h-full w-full relative">
                          {item.image?.match(/^(https?|data):/) ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 640px) 8rem, 10rem"
                              className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              loading={ci === 0 && ii < 3 ? 'eager' : 'lazy'}
                              priority={ci === 0 && ii < 3}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-4xl">
                              {item.image}
                            </div>
                          )}
                        </div>
                      </button>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                          <span className="text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">Unavailable</span>
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-y-1 px-1.5 py-1.5">
                      <button
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className="text-left text-sm font-semibold leading-snug text-pretty sm:text-lg group-hover:text-[#D4AF37] transition-colors"
                      >
                        {item.name}
                      </button>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-bold sm:text-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] bg-clip-text text-transparent">
                          Br. {item.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          disabled={!item.available}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.available) handleAddToCart(item, 1, []);
                          }}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-sm transition-all active:scale-90 ${
                            item.available
                              ? 'bg-gradient-to-br from-[#D4AF37] to-[#E5C158] text-white hover:shadow-lg hover:shadow-[#D4AF37]/30'
                              : 'bg-white/10 text-white/30 cursor-not-allowed'
                          }`}
                          aria-label={`Add ${item.name} to order`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>

      {/* Map Section */}
      <section className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="mb-2 text-center text-2xl font-bold text-black dark:text-white">Find Us</h2>
          <p className="mb-6 text-center text-sm text-black/60 dark:text-white/60">
            Bright cafe & restaurant
          </p>
          <div className="mx-auto aspect-[21/9] w-full max-w-4xl overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7880.6!2d38.7605919!3d9.0023799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8535b71f7ba3%3A0x5c30ef01f521d0bb!2sBright%20cafe%20%26%20restaurant!5e0!3m2!1sen!2set!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bright cafe & restaurant location"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-16">
          {/* Logo + Brand */}
          <div className="text-center mb-10">
            <Image src={settings?.logo || '/PNG-01.png'} alt="Logo" width={80} height={80} className="mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black dark:text-white">{settings?.name || 'Bright Cafe and Restaurant'}</h3>
            {settings?.description && (
              <p className="text-sm text-black/50 dark:text-white/50 mt-1 max-w-md mx-auto">{settings.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Contact */}
            <div className="text-center md:text-left">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Contact</h4>
              <div className="space-y-3 text-sm text-black/60 dark:text-white/60">
                <a href={`tel:${settings?.phone || '+251911224765'}`} className="flex items-center justify-center md:justify-start gap-3 hover:text-[#D4AF37] transition-colors">
                  <Phone className="h-4 w-4 shrink-0" /> {settings?.phone || '+251911224765'}
                </a>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Bright cafe & restaurant')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center md:justify-start gap-3 hover:text-[#D4AF37] transition-colors">
                  <MapPin className="h-4 w-4 shrink-0" /> {settings?.address || 'Bright cafe & restaurant'}
                </a>
              </div>
            </div>

            {/* Scan to Order */}
            <div className="text-center">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Scan to Order</h4>
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-2 mx-auto">
                <QRCodeSVG value="https://bright-cafe-and-restaurant.vercel.app/menu" size={100} level="H" includeMargin fgColor="#000000" bgColor="#ffffff" className="w-full h-full" />
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center md:text-right">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-black/40 dark:text-white/40 mb-4">Follow Us</h4>
              <div className="flex items-center justify-center md:justify-end gap-3">
                <a href={settings?.website || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-black/60 dark:text-white/60 transition-all">
                  <Globe className="h-4 w-4" />
                </a>
                <a href={(settings as any)?.instagram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-black/60 dark:text-white/60 transition-all">
                  <Camera className="h-4 w-4" />
                </a>
                <a href={(settings as any)?.telegram || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-black/60 dark:text-white/60 transition-all">
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a href={(settings as any)?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-black/60 dark:text-white/60 transition-all">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href={(settings as any)?.tiktok || '#'} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] text-black/60 dark:text-white/60 transition-all">
                  <Play className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-black/10 dark:border-white/10 text-center">
            <p className="text-xs text-black/60 dark:text-white/60">
              No service charge applies. Kindly note that prices are subject to 15% VAT.
            </p>
          </div>
        </div>
      </footer>

      {/* Food Modal */}
      {selectedItem && (
        <FoodModal
          item={selectedItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}