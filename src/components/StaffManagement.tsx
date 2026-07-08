'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Plus, Edit, Trash2, Search, Shield, ChefHat, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'chef' | 'waiter' | 'host';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface StaffManagementProps {
  staff: StaffMember[];
  onAdd: (member: Omit<StaffMember, 'id'>) => void;
  onEdit: (id: number, member: Partial<StaffMember>) => void;
  onDelete: (id: number) => void;
}

export function StaffManagement({ staff, onAdd, onEdit, onDelete }: StaffManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | StaffMember['role']>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    all: staff.length,
    admin: staff.filter(s => s.role === 'admin').length,
    manager: staff.filter(s => s.role === 'manager').length,
    chef: staff.filter(s => s.role === 'chef').length,
    waiter: staff.filter(s => s.role === 'waiter').length,
    host: staff.filter(s => s.role === 'host').length,
  };

  const getRoleIcon = (role: StaffMember['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4" />;
      case 'manager':
        return <Users className="w-4 h-4" />;
      case 'chef':
        return <ChefHat className="w-4 h-4" />;
      case 'waiter':
        return <Users className="w-4 h-4" />;
      case 'host':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: StaffMember['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'chef':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      case 'waiter':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'host':
        return 'bg-pink-500/20 text-pink-500 border-pink-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const handleEdit = (member: StaffMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Staff Management
          </h2>
          <p className="text-black/60 dark:text-white/60">
            Manage restaurant staff and their roles
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Staff Member</span>
        </motion.button>
      </div>

      {/* Role Filters */}
      <div className="flex flex-wrap gap-3">
        {(['all', 'admin', 'manager', 'chef', 'waiter', 'host'] as const).map((role) => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-full border-2 transition-all flex items-center space-x-2 ${
              selectedRole === role
                ? 'bg-[#D4AF37] text-white border-[#D4AF37]'
                : 'bg-transparent text-black dark:text-white border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
          >
            {getRoleIcon(role === 'all' ? 'admin' : role)}
            <span className="capitalize">{role}</span>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
              {roleCounts[role]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] w-5 h-5" />
          <input
            type="text"
            placeholder="Search staff by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-full text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>
      </GlassCard>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-[#D4AF37]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-black dark:text-white">
                      {member.name}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(member.role)}`}>
                      <span className="capitalize">{member.role}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(member)}
                    className="p-2 bg-white/80 dark:bg/black/80 backdrop-blur-sm rounded-full"
                  >
                    <Edit className="w-4 h-4 text-[#D4AF37]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(member.id)}
                    className="p-2 bg-white/80 dark:bg/black/80 backdrop-blur-sm rounded-full"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </motion.button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-black dark:text-white">{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-black dark:text-white">{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-black dark:text-white">Joined {member.joinDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/20">
                <span className={`text-sm font-medium ${
                  member.status === 'active' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {member.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingMember ? 'Edit Staff Member' : 'Add New Staff'}
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const data = new FormData(e.target as HTMLFormElement);
                const name = data.get('name') as string;
                const email = data.get('email') as string;
                const phone = data.get('phone') as string;
                const role = data.get('role') as StaffMember['role'];
                const status = data.get('status') as StaffMember['status'];

                if (editingMember) {
                  onEdit(editingMember.id, { name, email, phone, role, status });
                } else {
                  onAdd({ name, email, phone, role, status, joinDate: new Date().toISOString().split('T')[0] });
                }
                setIsModalOpen(false);
              }}>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingMember?.name}
                    className="w-full px-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingMember?.email}
                    className="w-full px-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="staff@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={editingMember?.phone}
                    className="w-full px-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    defaultValue={editingMember?.role || 'waiter'}
                    className="w-full px-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  >
                    <option value="admin" className="bg-white dark:bg-black">Admin</option>
                    <option value="manager" className="bg-white dark:bg/black">Manager</option>
                    <option value="chef" className="bg-white dark:bg/black">Chef</option>
                    <option value="waiter" className="bg-white dark:bg/black">Waiter</option>
                    <option value="host" className="bg-white dark:bg/black">Host</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingMember?.status || 'active'}
                    className="w-full px-4 py-3 bg-white/60 dark:bg/black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    required
                  >
                    <option value="active" className="bg-white dark:bg/black">Active</option>
                    <option value="inactive" className="bg-white dark:bg/black">Inactive</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors"
                  >
                    {editingMember ? 'Update Staff' : 'Add Staff'}
                  </motion.button>
                </div>
              </form>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}