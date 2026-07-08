'use client';

import { Navigation } from '@/components/Navigation';
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
    id: s.id,
    name: s.name,
    email: s.email,
    phone: s.phone,
    role: s.role,
    status: s.status,
    joinDate: new Date(s.join_date).toISOString().split('T')[0],
  }));

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation role="admin" />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <StaffManagement staff={mappedStaff} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} />
      </div>
    </div>
  );
}
