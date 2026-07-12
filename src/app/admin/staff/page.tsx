'use client';

import { StaffManagement } from '@/components/StaffManagement';
import { useEffect, useState } from 'react';
import { getStaff, addStaffMember, updateStaffMember, deleteStaffMember } from '@/lib/actions';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);

  useEffect(() => {
    // Auth guaranteed by middleware — fetch immediately
    getStaff().then(setStaff).catch(console.error);
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

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <StaffManagement staff={mappedStaff} onAdd={handleAdd} onEdit={handleEdit as any} onDelete={handleDelete} />
    </div>
  );
}
