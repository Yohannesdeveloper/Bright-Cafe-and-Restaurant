import { MenuView } from '@/components/MenuView';

export default async function TableMenu({ params }: { params: Promise<{ table: string }> }) {
  const { table } = await params;
  return <MenuView key={table} tableNumber={table} />;
}
