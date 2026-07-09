'use client';

import { RestaurantSettings } from '@/components/RestaurantSettings';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getRestaurantSettings, saveRestaurantSettings, deleteRestaurantSettings } from '@/lib/actions';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getRestaurantSettings().then(setSettings).catch(console.error);
    });
  }, []);

  const handleSave = async (data: any) => {
    const payload = {
      name: data.name, description: data.description, address: data.address,
      phone: data.phone, email: data.email, website: data.website,
      opening_hours_weekdays: data.openingHours?.weekdays,
      opening_hours_weekends: data.openingHours?.weekends,
      logo: data.logo, cover_image: data.coverImage,
      instagram: data.instagram || '',
      telegram: data.telegram || '',
      tiktok: data.tiktok || '',
      youtube: data.youtube || '',
      facebook: data.facebook || '',
    };
    await saveRestaurantSettings(payload);
    alert('Settings saved!');
  };

  const defaultSettings = settings ? {
    name: settings.name || '', description: settings.description || '',
    address: settings.address || '', phone: settings.phone || '',
    email: settings.email || '', website: settings.website || '',
    openingHours: {
      weekdays: settings.opening_hours_weekdays || '8:00 AM - 11:00 PM',
      weekends: settings.opening_hours_weekends || '8:00 AM - 12:00 AM',
    },
    logo: settings.logo || '', coverImage: settings.cover_image || '',
    instagram: settings.instagram || '',
    telegram: settings.telegram || '',
    tiktok: settings.tiktok || '',
    youtube: settings.youtube || '',
    facebook: settings.facebook || '',
  } : null;

  const handleDelete = async () => {
    if (!confirm('Delete all restaurant settings? This cannot be undone.')) return;
    await deleteRestaurantSettings();
    setSettings(null);
    alert('Settings deleted. Refresh to restore defaults.');
  };

  if (authorized === null || !defaultSettings) {
    return (
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <div className="relative">
          <div className="w-14 h-14 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <div className="w-14 h-14 border-2 border-[#D4AF37]/10 rounded-full absolute inset-0 animate-ping opacity-30" />
        </div>
      </div>
    );
  }
  if (!authorized) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4">
      <RestaurantSettings settings={defaultSettings} onSave={handleSave} />
      <div className="flex justify-end">
        <button onClick={handleDelete}
          className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all">
          Delete Settings
        </button>
      </div>
    </div>
  );
}
