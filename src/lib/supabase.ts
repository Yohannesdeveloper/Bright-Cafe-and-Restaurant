import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase() {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn('Supabase env vars not set — returning null client');
    return null;
  }
  _supabase = createClient(url, key);
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    if (!client) {
      throw new Error('Supabase client is not initialized (missing env vars)');
    }
    return (client as any)[prop];
  },
});

// Upload image to Supabase Storage
export async function uploadImageToStorage(file: File, fileName: string): Promise<string | null> {
  try {
    const client = getSupabase();
    if (!client) {
      console.error('Supabase client not initialized');
      return null;
    }

    const { data, error } = await client.storage
      .from('menu-images')
      .upload(`${fileName}-${Date.now()}`, file, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = client.storage
      .from('menu-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
