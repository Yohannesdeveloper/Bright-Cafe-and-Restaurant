'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { verifyAdmin } from '@/lib/admin-auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyAdmin(email, password);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Admin Login
            </h1>
            <p className="text-black/60 dark:text-white/60">
              Enter your credentials to access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                  placeholder="admin@luxurydining.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-[#D4AF37]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D4AF37] text-white rounded-full font-bold text-lg hover:bg-[#B8962F] transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
