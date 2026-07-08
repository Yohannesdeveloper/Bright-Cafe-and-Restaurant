'use server';

import { supabase } from './supabase';

// Menu Items
export async function getMenuItems() {
  const { data, error } = await supabase.from('menu_items').select('*').order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function addMenuItem(item: Record<string, unknown>) {
  const { data, error } = await supabase.from('menu_items').insert(item).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateMenuItem(id: number, item: Record<string, unknown>) {
  const { data, error } = await supabase.from('menu_items').update(item).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteMenuItem(id: number) {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Orders
export async function getOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createOrder(order: Record<string, unknown>) {
  const { data, error } = await supabase.from('orders').insert(order).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

// Inventory
export async function getInventory() {
  const { data, error } = await supabase.from('inventory').select('*').order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function addInventoryItem(item: Record<string, unknown>) {
  const { data, error } = await supabase.from('inventory').insert(item).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateInventoryItem(id: number, item: Record<string, unknown>) {
  const { data, error } = await supabase.from('inventory').update(item).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteInventoryItem(id: number) {
  const { error } = await supabase.from('inventory').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Tables
export async function getRestaurantTables() {
  const { data, error } = await supabase.from('restaurant_tables').select('*').order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function addRestaurantTable(table: Record<string, unknown>) {
  const { data, error } = await supabase.from('restaurant_tables').insert(table).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateRestaurantTable(id: number, table: Record<string, unknown>) {
  const { data, error } = await supabase.from('restaurant_tables').update(table).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteRestaurantTable(id: number) {
  const { error } = await supabase.from('restaurant_tables').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Staff
export async function getStaff() {
  const { data, error } = await supabase.from('staff').select('*').order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function addStaffMember(member: Record<string, unknown>) {
  const { data, error } = await supabase.from('staff').insert(member).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateStaffMember(id: number, member: Record<string, unknown>) {
  const { data, error } = await supabase.from('staff').update(member).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteStaffMember(id: number) {
  const { error } = await supabase.from('staff').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Reviews
export async function getReviews() {
  const { data, error } = await supabase.from('reviews').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function updateReviewStatus(id: number, status: string) {
  const { data, error } = await supabase.from('reviews').update({ status }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function respondToReview(id: number, response: string) {
  const { data, error } = await supabase.from('reviews').update({ response }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteReview(id: number) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// Restaurant Settings
export async function getRestaurantSettings() {
  const { data, error } = await supabase.from('restaurant_settings').select('*').single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  return data;
}

export async function saveRestaurantSettings(settings: Record<string, unknown>) {
  const existing = await getRestaurantSettings();
  if (existing) {
    const { data, error } = await supabase.from('restaurant_settings').update(settings).eq('id', (existing as any).id).select().single();
    if (error) throw new Error(error.message);
    return data;
  }
  const { data, error } = await supabase.from('restaurant_settings').insert(settings).select().single();
  if (error) throw new Error(error.message);
  return data;
}
