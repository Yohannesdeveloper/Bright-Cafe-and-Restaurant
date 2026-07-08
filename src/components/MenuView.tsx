'use client';

import { FoodModal } from '@/components/FoodModal';
import { Cart } from '@/components/Cart';
import { ShoppingBag, Plus, Globe, Camera, MessageCircle, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMenuItems, getRestaurantSettings } from '@/lib/actions';
import { ThemeToggle } from './ThemeToggle';
import { FALLBACK_MENU } from '@/lib/menu-data';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  customizations: string[];
  image: string;
}

export function MenuView({ tableNumber }: { tableNumber?: string }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>(FALLBACK_MENU);
  const [settings, setSettings] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    getMenuItems().then((data) => { if (data.length > 0) setMenuItems(data); }).catch(() => {});
    getRestaurantSettings().then(setSettings).catch(() => {});
  }, []);

  const groupedItems: Record<string, any[]> = {};
  menuItems.forEach(item => {
    if (!groupedItems[item.category]) groupedItems[item.category] = [];
    groupedItems[item.category].push(item);
  });
  const categoryNames = Object.keys(groupedItems);

  useEffect(() => {
    if (categoryNames.length > 0 && !activeCategory) {
      setActiveCategory(categoryNames[0]);
    }
  }, [categoryNames]);

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

  const handleCheckout = () => {
    alert(`Proceeding to checkout${tableNumber ? ` for Table ${tableNumber}` : ''}...`);
    setIsCartOpen(false);
  };

  const scrollToCategory = (category: string) => {
    setActiveCategory(category);
    document.getElementById(`cat-${category}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-black dark:text-white font-['Inter',system-ui,sans-serif]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-950/90 backdrop-blur">
        <div className="relative mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5 sm:py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-sm font-medium text-black/60 dark:text-white/60">
              {tableNumber ? `Table ${tableNumber}` : 'Menu'}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-black dark:text-white shadow-sm transition hover:opacity-90"
              aria-label="Cart"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Restaurant Hero */}
      <div className="px-4 pb-10 pt-4 text-center">
        <img src="/PNG-01.png" alt="Logo" className="h-16 w-auto mx-auto mb-4" />
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white">
          {settings?.name || 'Bright Cafe and Restaurant'}
        </h1>
        {settings?.description && (
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-black/70 dark:text-white/70">
            {settings.description}
          </p>
        )}
      </div>

      {/* Category Tabs */}
      <nav className="sticky top-[56px] z-30 mx-auto max-w-4xl overflow-x-auto px-4 py-2 bg-white dark:bg-neutral-950 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex w-max items-center gap-5">
          {categoryNames.map(cat => (
            <li key={cat}>
              <button
                type="button"
                onClick={() => scrollToCategory(cat)}
                className={`relative whitespace-nowrap py-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition-opacity ${
                  activeCategory === cat
                    ? 'text-[#D4AF37] after:bg-[#D4AF37] after:opacity-100'
                    : 'text-black/60 dark:text-white/60 after:opacity-0 hover:text-black dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu Sections */}
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-5">
        {categoryNames.map(cat => (
          <section
            key={cat}
            id={`cat-${cat}`}
            className="scroll-mt-[104px] pt-2 sm:scroll-mt-[108px]"
          >
            <h2 className="text-xl font-semibold sm:text-2xl text-black dark:text-white">{cat}</h2>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {groupedItems[cat].map(item => (
                <article
                  key={item.id}
                  className="flex items-stretch gap-2 rounded-2xl bg-white dark:bg-neutral-900 p-1.5 sm:p-2"
                >
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className="h-full max-h-[115px] min-h-[6.5625rem] w-[6.5625rem] shrink-0 cursor-zoom-in overflow-hidden rounded-xl border border-black/10 dark:border-white/10 sm:max-h-[8.4375rem]"
                  >
                    {item.image?.startsWith('http') ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 text-4xl">
                        {item.image}
                      </div>
                    )}
                  </button>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-y-1 px-1.5 py-1">
                    <button
                      type="button"
                      onClick={() => handleItemClick(item)}
                      className="text-left text-sm font-semibold leading-snug text-pretty sm:text-base hover:underline underline-offset-4"
                    >
                      {item.name}
                    </button>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold sm:text-base">
                        Br. {item.price.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item, 1, []);
                        }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-sm transition hover:opacity-90 active:scale-90"
                        aria-label={`Add ${item.name} to order`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>

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
      <div className="border-t border-black/10 dark:border-white/10 px-4 py-8 text-center">
        <div className="mx-auto mb-4 flex items-center justify-center space-x-5">
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-[#D4AF37] dark:text-white/60 dark:hover:text-[#D4AF37] transition-colors">
            <Camera className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-[#D4AF37] dark:text-white/60 dark:hover:text-[#D4AF37] transition-colors">
            <Globe className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-[#D4AF37] dark:text-white/60 dark:hover:text-[#D4AF37] transition-colors">
            <MessageCircle className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="text-black/60 hover:text-[#D4AF37] dark:text-white/60 dark:hover:text-[#D4AF37] transition-colors">
            <Play className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs text-black/60 dark:text-white/60">
          No service charge applies. Kindly note that prices are subject to 15% VAT.
        </p>
      </div>

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
