'use client';

import { RestaurantSettings } from '@/components/RestaurantSettings';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getRestaurantSettings, saveRestaurantSettings } from '@/lib/actions';

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
  } : null;

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
    <div className="p-4 sm:p-6 lg:p-8">
      <RestaurantSettings settings={defaultSettings} onSave={handleSave} />
    </div>
  );
}
