/**
 * Database-first tales fetching with fallback to static data
 * This is the scalable architecture - content lives in Supabase
 */

import { supabase, getTaleMedia, TaleRow } from './supabase';
import { tales as staticTales, Tale } from './tales';
import { CharacterKey } from './design-tokens';

/**
 * Convert database row to Tale format (for backwards compatibility)
 */
function dbRowToTale(row: TaleRow): Tale {
  const media = getTaleMedia(row.slug);
  
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || '',
    content: row.content,
    author: row.author as CharacterKey,
    authorType: row.author_type,
    date: new Date(row.published_date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    readTime: row.read_time || '5 min',
    category: row.category as any,
    featured: row.featured,
    isPillar: row.is_pillar,
    silo: row.silo || undefined,
    heroImage: media.heroImage,
    heroVideo: media.heroVideo,
    tags: row.tags || [],
    tools: row.tools || [],
    steptenScore: row.stepten_score || undefined,
    steptenScoreBreakdown: row.score_breakdown as any,
  };
}

/**
 * Fetch all published tales - DB first, fallback to static
 */
export async function getAllTales(): Promise<Tale[]> {
  try {
    const { data, error } = await supabase
      .from('tales')
      .select('*')
      .eq('status', 'published')
      .order('published_date', { ascending: false });
    
    if (error) throw error;
    if (data && data.length > 0) {
      console.log('[tales-db] Fetched from Supabase:', data.length, 'tales');
      return data.map(dbRowToTale);
    }
  } catch (err) {
    console.warn('[tales-db] Supabase fetch failed, using static fallback:', err);
  }
  
  // Fallback to static tales
  return staticTales;
}

/**
 * Fetch single tale by slug - DB first, fallback to static
 */
export async function getTaleBySlugDB(slug: string): Promise<Tale | null> {
  try {
    const { data, error } = await supabase
      .from('tales')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error) throw error;
    if (data) {
      console.log('[tales-db] Fetched from Supabase:', slug);
      return dbRowToTale(data);
    }
  } catch (err) {
    console.warn('[tales-db] Supabase fetch failed for', slug, '- using static fallback');
  }
  
  // Fallback to static tales
  return staticTales.find(t => t.slug === slug) || null;
}

/**
 * Get all slugs for static generation
 */
export async function getAllTaleSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('tales')
      .select('slug')
      .eq('status', 'published');
    
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(t => t.slug);
    }
  } catch (err) {
    console.warn('[tales-db] Could not fetch slugs from Supabase');
  }
  
  return staticTales.map(t => t.slug);
}

/**
 * Get featured tales
 */
export async function getFeaturedTales(): Promise<Tale[]> {
  const all = await getAllTales();
  return all.filter(t => t.featured);
}
