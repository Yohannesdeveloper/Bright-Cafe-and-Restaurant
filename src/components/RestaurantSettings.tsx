'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Save, MapPin, Phone, Mail, Clock, Globe, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface RestaurantSettingsProps {
  settings: {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    openingHours: {
      weekdays: string;
      weekends: string;
    };
    logo: string;
    coverImage: string;
  };
  onSave: (settings: any) => void;
}

export function RestaurantSettings({ settings, onSave }: RestaurantSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
          Restaurant Settings
        </h2>
        <p className="text-black/60 dark:text-white/60">
          Manage your restaurant information and preferences
        </p>
      </div>

      {/* Basic Information */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-6">
          Basic Information
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              value={localSettings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
              placeholder="Enter restaurant name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Description
            </label>
            <textarea
              value={localSettings.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all resize-none"
              placeholder="Describe your restaurant..."
            />
          </div>
        </div>
      </GlassCard>

      {/* Contact Information */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-6">
          Contact Information
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
              <input
                type="text"
                value={localSettings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="Enter restaurant address"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                <input
                  type="tel"
                  value={localSettings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
                <input
                  type="email"
                  value={localSettings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                  placeholder="restaurant@example.com"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
              <input
                type="url"
                value={localSettings.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="https://yourrestaurant.com"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Opening Hours */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-6">
          Opening Hours
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Weekdays (Monday - Friday)
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
              <input
                type="text"
                value={localSettings.openingHours.weekdays}
                onChange={(e) => handleChange('openingHours.weekdays', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="11:00 AM - 10:00 PM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Weekends (Saturday - Sunday)
            </label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
              <input
                type="text"
                value={localSettings.openingHours.weekends}
                onChange={(e) => handleChange('openingHours.weekends', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="10:00 AM - 11:00 PM"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Images */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-black dark:text-white mb-6">
          Branding Images
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Logo URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
              <input
                type="url"
                value={localSettings.logo}
                onChange={(e) => handleChange('logo', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Cover Image URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
              <input
                type="url"
                value={localSettings.coverImage}
                onChange={(e) => handleChange('coverImage', e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="https://example.com/cover.jpg"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Save Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-8 py-4 bg-[#D4AF37] text-white rounded-full font-bold hover:bg-[#B8962F] transition-colors flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </motion.button>
      </div>
    </div>
  );
}