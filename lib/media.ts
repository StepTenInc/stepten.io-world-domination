/**
 * Supabase Storage media URL helpers for StepTen tales
 */

const SUPABASE_PROJECT = 'lcxxjftqaafukixdhfjg';
const STORAGE_BASE = `https://${SUPABASE_PROJECT}.supabase.co/storage/v1/object/public`;

export const TALES_BUCKET = 'tales';

/**
 * Generate Supabase Storage URL for tale media
 */
export function getTaleMediaUrl(slug: string, type: 'hero-image' | 'hero-video' | 'og-image' | 'thumbnail'): string {
  const base = `${STORAGE_BASE}/${TALES_BUCKET}`;
  
  switch (type) {
    case 'hero-image':
      return `${base}/images/${slug}/hero.png`;
    case 'hero-video':
      return `${base}/hero-videos/${slug}.mp4`;
    case 'og-image':
      return `${base}/images/${slug}/og.png`;
    case 'thumbnail':
      return `${base}/thumbnails/${slug}.jpg`;
    default:
      throw new Error(`Unknown media type: ${type}`);
  }
}

/**
 * Generate URL for article inline image
 */
export function getTaleImageUrl(slug: string, imageName: string): string {
  return `${STORAGE_BASE}/${TALES_BUCKET}/images/${slug}/${imageName}`;
}

/**
 * Check if a tale has a hero video (by convention)
 */
export function getTaleHeroVideo(slug: string): string {
  return getTaleMediaUrl(slug, 'hero-video');
}

/**
 * Get all media URLs for a tale
 */
export function getTaleMedia(slug: string) {
  return {
    heroImage: getTaleMediaUrl(slug, 'hero-image'),
    heroVideo: getTaleMediaUrl(slug, 'hero-video'),
    ogImage: getTaleMediaUrl(slug, 'og-image'),
    thumbnail: getTaleMediaUrl(slug, 'thumbnail'),
  };
}

/**
 * Storage bucket structure reference:
 * 
 * tales/
 * ├── hero-videos/
 * │   └── {slug}.mp4
 * ├── images/
 * │   └── {slug}/
 * │       ├── hero.png
 * │       ├── og.png
 * │       └── {other-images}.png
 * └── thumbnails/
 *     └── {slug}.jpg
 */
