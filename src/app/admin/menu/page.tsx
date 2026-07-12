import { getMenuItems } from '@/lib/actions';
import { AdminMenuClient } from './AdminMenuClient';

export default async function AdminMenuPage() {
  let initialItems: any[] = [];
  try {
    const data = await getMenuItems();
    if (data.length > 0) initialItems = data;
  } catch {}
  return <AdminMenuClient initialItems={initialItems} />;
}
