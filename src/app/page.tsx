'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, UtensilsCrossed, Coffee, Wine, Pizza, Cake, Search, ShoppingBag, Smartphone, Scan, CheckCircle, ChefHat, Clock, MapPin, Phone, Quote, Play, Camera, MessageCircle, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { getRestaurantSettings, getMenuItems } from '@/lib/actions';
import { getCached, setCache } from '@/lib/cache';
import Image from 'next/image';

const IMG = {
  food1: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  food2: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  food3: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
  food4: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  food5: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  food6: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
  interior1: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  interior2: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
  interior3: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  interior4: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80',
};

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * to));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function useInView(ref: React.RefObject<HTMLDivElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

export default function LandingPage() {
  const [settings, setSettings] = useState<any>(null);
  const [featured, setFeatured] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const cachedSettings = getCached<any>('settings');
    if (cachedSettings) setSettings(cachedSettings);
    else getRestaurantSettings().then(d => { setSettings(d); setCache('settings', d); }).catch(() => {});

    const cachedFeatured = getCached<any[]>('featured');
    if (cachedFeatured) { setFeatured(cachedFeatured); setLoadingFeatured(false); }
    else getMenuItems().then(data => {
      const food = data.filter(Boolean).filter(item => !['Beverages & Drinks', 'Hot Drinks', 'Juice & Shakes', 'Soft Drinks'].includes(item.category));
      const priority = ['Bright Special Double Beef Burger', 'Bright Special Burger', 'Beef Burger', 'Bright Special Pizza', 'Grilled Fish', 'Mixed Salad', 'Chicken Burger', 'Fish Cutlet', 'Club Sandwich'];
      const byPriority = priority.map(n => food.find(i => i.name === n)).filter(Boolean) as any[];
      const rest = food.filter(i => !priority.includes(i.name));
      const result = [...byPriority, ...rest].slice(0, 6);
      setFeatured(result);
      setCache('featured', result);
      setLoadingFeatured(false);
    }).catch(() => setLoadingFeatured(false));
  }, []);

  const fadeUp = (delay = 0) => ({ initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: 0.7, delay } });
  const sectionHeaderClass = (delay: number) => `animate-fade-in-up anim-delay-${delay}`;

  const categories = [
    { icon: Coffee, label: 'Hot Drinks', category: 'Hot Drinks', color: 'from-amber-500/20 to-amber-600/10', emoji: '☕' },
    { icon: Wine, label: 'Beverages', category: 'Beverages & Drinks', color: 'from-blue-500/20 to-blue-600/10', emoji: '🥤' },
    { icon: Pizza, label: 'Pizza', category: 'Pizza', color: 'from-orange-500/20 to-orange-600/10', emoji: '🍕' },
    { icon: Cake, label: 'Cake & Snacks', category: 'Cake & Snacks', color: 'from-pink-500/20 to-pink-600/10', emoji: '🍰' },
    { icon: UtensilsCrossed, label: 'Habesha Food', category: 'የሐበሻ ምግብ (Habesha Food)', color: 'from-emerald-500/20 to-emerald-600/10', emoji: '🇪🇹' },
    { icon: Search, label: 'All Categories', category: '', color: 'from-[#D4AF37]/20 to-[#D4AF37]/10', emoji: '✨' },
  ];

  const testimonials = [
    { name: 'Sarah T.', role: 'Regular Customer', text: 'The digital menu experience is incredible! Ordering from my phone is so convenient.', rating: 5 },
    { name: 'Michael K.', role: 'Food Enthusiast', text: 'Best Habesha food in town. The traditional dishes are authentic and delicious.', rating: 5 },
    { name: 'Helen W.', role: 'Event Organizer', text: 'Perfect for large groups. Everyone can order individually right from their phone.', rating: 5 },
    { name: 'David M.', role: 'Business Traveler', text: 'Fast service, amazing food, and the QR menu makes everything so smooth.', rating: 5 },
  ];

  const steps = [
    { icon: Scan, title: 'Scan the QR', description: 'Find the QR code on your table and scan it with your phone camera', color: 'from-[#D4AF37] to-[#E5C158]' },
    { icon: Search, title: 'Browse Menu', description: 'Explore our extensive menu with beautiful food photography', color: 'from-amber-500 to-orange-500' },
    { icon: ShoppingBag, title: 'Place Order', description: 'Add items to your cart and place your order instantly', color: 'from-emerald-500 to-teal-500' },
    { icon: ChefHat, title: 'Enjoy', description: 'Our chefs prepare your meal while you relax', color: 'from-rose-500 to-pink-500' },
  ];

  const floatingEmojis = ['🍕', '🥤', '☕', '🍰', '🥗', '🍝', '🥩', '🍦'];

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-hidden">
      {/* Floating Background Emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl sm:text-6xl opacity-[0.04]"
            style={{ left: `${10 + i * 12}%`, top: `${15 + (i % 4) * 20}%` }}
            animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src="/PNG-01.png" alt="Bright Cafe" width={36} height={36} className="w-auto h-9" priority />
          </div>
          <div className="flex items-center gap-6">
            <Link href="/menu" className="text-sm text-white/60 hover:text-white transition-colors">Menu</Link>
            <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">How It Works</a>
            <a href="#gallery" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Gallery</a>
            <a href="#events" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Events</a>
            <a href="#contact" className="text-sm text-white/60 hover:text-white transition-colors hidden sm:block">Contact</a>
            <Link href="/menu" className="px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black text-sm font-semibold rounded-full hover:brightness-110 transition-all">
              Order Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section style={{ scale: heroScale, opacity: heroOpacity }} className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/8 via-transparent to-[#050508] pointer-events-none" />
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-[700px] h-[700px] rounded-full bg-[#D4AF37]/5 blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/3 blur-[120px]" />
        </div>
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Now accepting digital orders
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Image src="/PNG-01.png" alt="Logo" width={128} height={128} className="h-28 sm:h-32 w-auto mx-auto mb-6 drop-shadow-2xl" priority />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-4">
            <span className="text-white">Bright</span>{' '}
            <span className="text-[#D4AF37] relative">
              Cafe
              <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.8 }} className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent origin-left" />
            </span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-white/60 font-light">&amp; Restaurant</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-white/50 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {settings?.description || 'Make Your Day Bright'}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.45 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu" className="group relative px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black font-bold text-lg rounded-full shadow-2xl shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/50 transition-all duration-500 hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <span className="relative flex items-center gap-3">
                Explore Our Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>
            <Link href="/menu?table=1" className="group px-8 py-4 border border-white/20 text-white/80 font-medium text-lg rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300">
              <span className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Order from Your Table
              </span>
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/15 rounded-full flex justify-center p-1">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-3 bg-[#D4AF37] rounded-full" />
          </div>
        </motion.div>
      </motion.section>

      {/* Featured Dishes */}
      <section className="relative px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Premium Selection</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Featured <span className="text-[#D4AF37]">Dishes</span></h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">Hand-picked favorites from our master chefs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {loadingFeatured ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-[3/4] bg-white/[0.03] animate-pulse" />
            )) : featured.map((item, i) => (
              <motion.div key={item.id || item.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer"
              >
                <Link href="/menu">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    loading={i < 3 ? 'eager' : 'lazy'}
                    priority={i < 3}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-[#050508]/30 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80">{item.category}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-semibold text-white leading-tight mb-1">{item.name}</h3>
                    <p className="text-[#D4AF37] font-bold">Br. {item.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/3 via-transparent to-[#D4AF37]/3" />
        <div className="relative max-w-6xl mx-auto">
          <div className={`text-center mb-16 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Simple Process</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">How It <span className="text-[#D4AF37]">Works</span></h2>
            <p className="text-white/40 text-lg">From your table to your plate in four easy steps</p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Connection lines */}
            <div className="absolute top-20 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-[#D4AF37]/40 via-[#D4AF37]/20 to-transparent hidden lg:block" />
            {steps.map((step, i) => (
              <div key={step.title} className={`relative flex flex-col items-center text-center animate-fade-in-up anim-delay-${i + 1}`}>
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 mb-6 shadow-lg`}>
                  <div className="w-full h-full rounded-2xl bg-[#050508] flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#D4AF37] text-black text-xs font-bold flex items-center justify-center shadow-lg">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 150, suffix: '+', label: 'Menu Items', icon: UtensilsCrossed },
            { value: 13, suffix: '', label: 'Categories', icon: Search },
            { value: 49, suffix: '', label: '5-Star Reviews', icon: Star },
            { value: 1000, suffix: '+', label: 'Happy Customers', icon: ShoppingBag },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="relative group p-6 sm:p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent hover:border-[#D4AF37]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 text-center">
                <stat.icon className="w-6 h-6 text-[#D4AF37]/60 mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categories Preview */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-14 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Browse by</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Explore <span className="text-[#D4AF37]">Categories</span></h2>
            <p className="text-white/40 text-lg">From traditional Ethiopian dishes to international favorites</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Link href={cat.category ? `/menu?category=${encodeURIComponent(cat.category)}` : '/menu'} className="block h-full">
                  <div className={`relative h-full p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br ${cat.color} overflow-hidden group`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="text-3xl mb-1">{cat.emoji}</div>
                      <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center">
                        <cat.icon className="w-5 h-5 text-[#D4AF37]" />
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

      {/* Testimonials */}
      <section className="relative px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/3 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className={`text-center mb-14 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Testimonials</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">What Our <span className="text-[#D4AF37]">Guests Say</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent"
              >
                <Quote className="w-8 h-8 text-[#D4AF37]/20 mb-4" />
                <p className="text-sm text-white/70 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="relative px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/3 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className={`text-center mb-14 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Special Events</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Upcoming <span className="text-[#D4AF37]">Events</span></h2>
            <p className="text-white/40 text-lg">Join us for unforgettable evenings</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="relative rounded-3xl overflow-hidden border border-white/[0.06] group"
          >
            <div className="aspect-[21/9] sm:aspect-[3/1]">
              <Image src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=1200&q=80" alt="Piano Night" fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/95 via-[#050508]/70 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="p-8 sm:p-12 lg:p-16 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  Every Tuesday &amp; Thursday
                </div>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Piano <span className="text-[#D4AF37]">Night</span></h3>
                <p className="text-white/60 text-lg mb-8 max-w-md leading-relaxed">Enjoy live piano performances while savoring our exquisite dishes. An elegant evening of music and fine dining.</p>
                <div className="flex items-center gap-6 text-sm text-white/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#D4AF37]/70" />
                    <span>7:00 PM - 10:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#D4AF37]/70" />
                    <span>Reservations Open</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-14 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Ambiance</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Our <span className="text-[#D4AF37]">Restaurant</span></h2>
            <p className="text-white/40 text-lg">Experience the atmosphere before you arrive</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['/image%201.webp', '/image%202.webp', '/image%203.webp', '/Traditional%20coffee.jpg'].map((img, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              >
                <div className={`${i === 0 ? 'aspect-[4/5] md:aspect-auto md:h-full' : 'aspect-[4/3]'}`}>
                  <Image
                    src={img}
                    alt="Restaurant"
                    fill
                    sizes={i === 0 ? '(max-width: 768px) 50vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    className="object-cover hover:scale-110 transition-transform duration-700"
                    loading={i < 2 ? 'eager' : 'lazy'}
                    priority={i < 2}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="relative px-4 py-24 scroll-mt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/3 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto">
          <div className={`text-center mb-14 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Events</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Upcoming <span className="text-[#D4AF37]">Events</span></h2>
            <p className="text-white/40 text-lg">Join us for special nights and celebrations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Live Piano Night', date: 'Every Friday', time: '7:00 PM - 10:00 PM', desc: 'Enjoy soothing piano melodies while you dine', icon: '🎹' },
              { title: 'Weekend Brunch', date: 'Sat & Sun', time: '9:00 AM - 2:00 PM', desc: 'All-you-can-eat brunch buffet', icon: '🥂' },
              { title: 'Cultural Evening', date: 'Every Saturday', time: '6:00 PM - 9:00 PM', desc: 'Traditional music and cuisine', icon: '🎭' },
            ].map((event, i) => (
              <motion.div key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6 text-center hover:border-[#D4AF37]/20 transition-colors relative"
              >
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">Reservations Open</span>
                <span className="text-4xl mb-4 block">{event.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                <p className="text-[#D4AF37] text-sm font-medium">{event.date}</p>
                <p className="text-white/40 text-xs mt-1">{event.time}</p>
                <p className="text-white/50 text-sm mt-3">{event.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-4 py-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/5 blur-[200px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-6">Ready to <span className="text-[#D4AF37]">Dine?</span></h2>
          <p className="text-white/50 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">Browse our full menu with stunning visuals, place your order, and enjoy a premium dining experience.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/menu" className="group relative px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-black font-bold text-xl rounded-full shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/50 transition-all duration-500 hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-3">
                View Full Menu <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </Link>
            <a href={`tel:${settings?.phone || '+251911224765'}`} className="flex items-center gap-2 px-8 py-5 border border-white/20 text-white/80 font-medium text-lg rounded-full hover:bg-white/5 hover:border-white/30 transition-all duration-300">
              <Phone className="w-5 h-5" /> Call to Reserve
            </a>
          </div>
        </motion.div>
      </section>

      {/* QR Code Section */}
      <section className="relative px-4 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className={`mb-8 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Digital Menu</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Scan &amp; <span className="text-[#D4AF37]">Order</span></h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">Point your camera at the QR code below to browse our full menu and place your order directly from your phone.</p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center p-4 rounded-3xl bg-white shadow-2xl shadow-[#D4AF37]/10 border border-white/10"
          >
            <QRCodeSVG value="https://bright-cafe-and-restaurant.vercel.app/menu" size={280} level="H" includeMargin fgColor="#000000" bgColor="#ffffff" />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-6 text-white/30 text-sm flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" /> No app download needed
          </motion.p>
        </div>
      </section>

      {/* Map */}
      <section className="relative px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`text-center mb-12 ${sectionHeaderClass(0)}`}>
            <span className="text-[#D4AF37] text-sm font-semibold uppercase tracking-[0.3em]">Visit Us</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3 mb-4">Find <span className="text-[#D4AF37]">Us</span></h2>
            <p className="text-white/40 text-lg">{settings?.address || 'Bright cafe & restaurant'}</p>
          </div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/[0.06]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7880.6!2d38.7605919!3d9.0023799!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8535b71f7ba3%3A0x5c30ef01f521d0bb!2sBright%20cafe%20%26%20restaurant!5e0!3m2!1sen!2set!4v1"
              className="w-full h-[400px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bright cafe & restaurant location"
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/[0.06] px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src={settings?.logo || '/PNG-01.png'} alt="Logo" width={36} height={36} className="object-contain" />
                <span className="font-semibold">Bright Cafe &amp; Restaurant</span>
              </div>
              <p className="text-white/40 text-sm max-w-md">Make Your Day Bright</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-white/40">
                <Link href="/menu" className="block hover:text-[#D4AF37] transition-colors">Our Menu</Link>
                <a href="#how-it-works" className="block hover:text-[#D4AF37] transition-colors">How It Works</a>
                <a href="#gallery" className="block hover:text-[#D4AF37] transition-colors">Gallery</a>
                <a href="#events" className="block hover:text-[#D4AF37] transition-colors">Events</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-white/40">
                <a href={`tel:${settings?.phone || '+251911224765'}`} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {settings?.phone || '+251911224765'}
                </a>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(settings?.address || 'Bright cafe & restaurant')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                  <MapPin className="w-3.5 h-3.5" /> Find us on Maps
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} Bright Cafe and Restaurant. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#D4AF37] transition-colors"><Camera className="w-4 h-4" /></a>}
              {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#D4AF37] transition-colors"><MessageCircle className="w-4 h-4" /></a>}
              {settings?.tiktok && <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-[#D4AF37] transition-colors"><Play className="w-4 h-4" /></a>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
