'use server';

import { cookies } from 'next/headers';
import { supabase } from './supabase';

export async function verifyWaiter(email: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, email, role, status')
    .eq('email', email)
    .eq('role', 'waiter')
    .eq('status', 'active')
    .single();

  if (error || !data) {
    return { success: false, error: 'No active waiter found with that email' };
  }

  const cookieStore = await cookies();
  cookieStore.set('waiter_session', JSON.stringify({ id: data.id, name: data.name, email: data.email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
    path: '/',
  });
  return { success: true, name: data.name };
}

export async function logoutWaiter() {
  const cookieStore = await cookies();
  cookieStore.delete('waiter_session');
}

export async function checkWaiterAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get('waiter_session')?.value;
  if (!session) return null;
  try { return JSON.parse(session); } catch { return null; }
}
