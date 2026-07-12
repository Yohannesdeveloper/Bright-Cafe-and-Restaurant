'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkWaiterAuth, logoutWaiter } from '@/lib/waiter-auth';
import { LogOut, ShoppingBag, User, LayoutDashboard, Table2 } from 'lucide-react';

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [waiter, setWaiter] = useState<{ id: number; name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === '/waiter/login') { setLoading(false); return; }
    checkWaiterAuth().then((u) => {
      if (!u) { router.push('/waiter/login'); return; }
      setWaiter(u as any);
      setLoading(false);
    });
  }, [pathname]);

  const handleLogout = async () => {
    await logoutWaiter();
    router.push('/waiter/login');
  };

  if (pathname === '/waiter/login') return <>{children}</>;
  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#050508]">
      <header className="sticky top-0 z-40 bg-[#050508]/90 backdrop-blur border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-white/80">{waiter?.name || 'Waiter'}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push('/waiter/dashboard')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
            </button>
            <button onClick={() => router.push('/waiter/orders')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5" /> Orders
            </button>
            <button onClick={() => router.push('/waiter/tables')}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-1.5">
              <Table2 className="w-3.5 h-3.5" /> Tables
            </button>
            <button onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/40 hover:text-red-400 hover:bg-white/[0.06] transition-all flex items-center gap-1.5">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
