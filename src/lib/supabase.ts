import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Upload image to Supabase Storage
export async function uploadImageToStorage(file: File, fileName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('menu-images')
      .upload(`${fileName}-${Date.now()}`, file, {
        cacheControl: '31536000',
        upsert: false,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}
