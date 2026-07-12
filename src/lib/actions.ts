'use server';

import { supabase } from './supabase';
import { getCache as getRedisCache, setCache as setRedisCache, deleteCache } from './redis';

// Menu Items
export async function getMenuItems() {
  // Try Redis cache first
  const cached = await getRedisCache<any[]>('menuItems');
  if (cached) return cached;

  // Fetch from database
  const { data, error } = await supabase.from('menu_items').select('id,name,description,price,category,available,rating,created_at').order('id');
  if (error) throw new Error(error);
  
  const items = data || [];
  
  // Cache in Redis for 5 minutes
  await setRedisCache('menuItems', items, 300);
  
  return items;
}

export async function getMenuImages() {
  const { data, error } = await supabase.from('menu_items').select('id,image').order('id');
  if (error) throw new Error(error.message);
  return data || [];
}

export async function seedMenuItems(items: Record<string, unknown>[]) {
  const { data, error } = await supabase.from('menu_items').upsert(items, { onConflict: 'id' }).select();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function addMenuItem(item: Record<string, unknown>) {
  try {
    const { data, error } = await supabase.from('menu_items').insert(item).select();
    if (error) return { success: false, error: error.message };
    
    // Invalidate cache
    await deleteCache('menuItems');
    
    return { success: true, data: data?.[0] || data };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function updateMenuItem(id: number, item: Record<string, unknown>) {
  try {
    const { data, error } = await supabase.from('menu_items').update(item).eq('id', id).select();
    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) {
      const { data: inserted, error: insertError } = await supabase.from('menu_items').insert({ id, ...item }).select();
      if (insertError) return { success: false, error: insertError.message };
      
      // Invalidate cache
      await deleteCache('menuItems');
      
      return { success: true, data: inserted?.[0] || inserted };
    }
    
    // Invalidate cache
    await deleteCache('menuItems');
    
    return { success: true, data: data[0] };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function deleteMenuItem(id: number) {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  
  // Invalidate cache
  await deleteCache('menuItems');
}

// Orders
export async function getOrders() {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createOrder(order: Record<string, unknown>) {
  const { data, error } = await supabase.from('orders').insert({ id: crypto.randomUUID(), ...order }).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCompletedOrders() {
  const { error } = await supabase.from('orders').delete().in('status', ['served', 'cancelled']);
  if (error) throw new Error(error.message);
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
  const { data, error } = await supabase.from('restaurant_tables').insert(table).select();
  if (error) throw new Error(error.message);
  return data?.[0] || data;
}

export async function updateRestaurantTable(id: number, table: Record<string, unknown>) {
  const { data, error } = await supabase.from('restaurant_tables').update(table).eq('id', id).select();
  if (error) throw new Error(error.message);
  return data?.[0] || data;
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
  // Try Redis cache first
  const cached = await getRedisCache<any>('restaurantSettings');
  if (cached) return cached;

  // Fetch from database
  const { data, error } = await supabase.from('restaurant_settings').select('*').single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  
  // Cache in Redis for 10 minutes
  if (data) {
    await setRedisCache('restaurantSettings', data, 600);
  }
  
  return data;
}

export async function saveRestaurantSettings(settings: Record<string, unknown>) {
  const existing = await getRestaurantSettings();
  if (existing) {
    const { data, error } = await supabase.from('restaurant_settings').update(settings).eq('id', (existing as any).id).select().single();
    if (error) throw new Error(error.message);
    
    // Invalidate cache
    await deleteCache('restaurantSettings');
    
    return data;
  }
  const { data, error } = await supabase.from('restaurant_settings').insert(settings).select().single();
  if (error) throw new Error(error.message);
  
  // Invalidate cache
  await deleteCache('restaurantSettings');
  
  return data;
}
