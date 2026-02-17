import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage helpers
const STORAGE_BASE = `${supabaseUrl}/storage/v1/object/public`;
export const TALES_BUCKET = 'tales';

/**
 * Auto-generate media URL from slug
 */
export function getTaleMediaUrl(slug: string, type: 'hero-video' | 'hero-image' | 'og-image' | 'thumbnail'): string {
  const base = `${STORAGE_BASE}/${TALES_BUCKET}`;
  
  switch (type) {
    case 'hero-video':
      return `${base}/hero-videos/${slug}.mp4`;
    case 'hero-image':
      return `${base}/images/${slug}/hero.png`;
    case 'og-image':
      return `${base}/images/${slug}/og.png`;
    case 'thumbnail':
      return `${base}/thumbnails/${slug}.jpg`;
  }
}

/**
 * Get inline image URL for a tale
 */
export function getTaleImageUrl(slug: string, imageName: string): string {
  return `${STORAGE_BASE}/${TALES_BUCKET}/images/${slug}/${imageName}`;
}

/**
 * Get all media URLs for a tale (auto-resolved from slug)
 */
export function getTaleMedia(slug: string) {
  return {
    heroVideo: getTaleMediaUrl(slug, 'hero-video'),
    heroImage: getTaleMediaUrl(slug, 'hero-image'),
    ogImage: getTaleMediaUrl(slug, 'og-image'),
    thumbnail: getTaleMediaUrl(slug, 'thumbnail'),
  };
}

// Database types
export interface TaleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string;
  author_type: 'HUMAN' | 'AI' | 'LEGEND';
  category: string;
  published_date: string;
  read_time: string | null;
  featured: boolean;
  is_pillar: boolean;
  silo: string | null;
  tags: string[] | null;
  tools: Array<{ name: string; url?: string }> | null;
  stepten_score: number | null;
  score_breakdown: {
    total: number;
    contentIntelligence: { score: number; max: number };
    technicalSEO: { score: number; max: number };
    llmReadiness: { score: number; max: number };
    authorityLinks: { score: number; max: number };
    distributionSocial: { score: number; max: number };
    competitivePosition: { score: number; max: number };
  } | null;
  status: 'draft' | 'published' | 'archived';
  views_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all published tales
 */
export async function getTales(): Promise<TaleRow[]> {
  const { data, error } = await supabase
    .from('tales')
    .select('*')
    .eq('status', 'published')
    .order('published_date', { ascending: false });
  
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

/**
 * Increment view count
 */
export async function incrementTaleViews(slug: string): Promise<void> {
  await supabase.rpc('increment_tale_views', { tale_slug: slug });
}
