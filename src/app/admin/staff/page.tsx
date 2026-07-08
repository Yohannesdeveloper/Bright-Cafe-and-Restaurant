'use client';

import { StaffManagement } from '@/components/StaffManagement';
import { useEffect, useState } from 'react';
import { checkAdminAuth } from '@/lib/admin-auth';
import { getStaff, addStaffMember, updateStaffMember, deleteStaffMember } from '@/lib/actions';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    checkAdminAuth().then((authed) => {
      if (!authed) { window.location.href = '/admin/login'; return; }
      setAuthorized(true);
      getStaff().then(setStaff).catch(console.error);
    });
  }, []);

  const handleAdd = async (member: any) => {
    const { joinDate, ...rest } = member;
    await addStaffMember(rest);
    setStaff(await getStaff());
  };
  const handleEdit = async (id: number, member: any) => {
    await updateStaffMember(id, member);
    setStaff(await getStaff());
  };
  const handleDelete = async (id: number) => {
    await deleteStaffMember(id);
    setStaff(await getStaff());
  };

  const mappedStaff = staff.map((s: any) => ({
    id: s.id, name: s.name, email: s.email, phone: s.phone,
    role: s.role, status: s.status, joinDate: new Date(s.join_date).toISOString().split('T')[0],
  }));

  if (authorized === null) {
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
      <StaffManagement staff={mappedStaff} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} />
    </div>
  );
}
