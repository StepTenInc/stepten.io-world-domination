import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types matching iavnhggphhrvbcidixiw schema
export interface TaleRow {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  author_id: string | null;
  silo_id: string | null;
  is_pillar: boolean | null;
  status: string | null;
  meta_title: string | null;
  meta_description: string | null;
  schema_json: any | null;
  keywords: string[] | null;
  hero_video_url: string | null;
  hero_image_url: string | null;
  images: any | null;
  word_count: number | null;
  read_time: number | null;
  stepten_score: number | null;
  score_breakdown: any | null;
  voice_input: string | null;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  tags: string[] | null;
}

export interface AuthorRow {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  type: string | null;
}

/**
 * Fetch all published tales with author info
 */
export async function getTales(): Promise<TaleRow[]> {
  const { data, error } = await supabase
    .from('tales')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching tales:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Fetch a single tale by slug
 */
export async function getTaleBySlug(slug: string): Promise<TaleRow | null> {
  const { data, error } = await supabase
    .from('tales')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  
  if (error) {
    console.error('Error fetching tale:', error);
    return null;
  }
  
  return data;
}

/**
 * Fetch author by ID
 */
export async function getAuthorById(id: string): Promise<AuthorRow | null> {
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching author:', error);
    return null;
  }
  
  return data;
}

/**
 * Get all tale slugs (for static generation)
 */
export async function getTaleSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from('tales')
    .select('slug')
    .eq('status', 'published');
  
  if (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
  
  return (data || []).map(t => t.slug);
}
