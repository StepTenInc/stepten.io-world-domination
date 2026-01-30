/**
 * Database Types for Supabase
 * Auto-generated types for type-safe database access
 */

export type ArticleStatus = 'draft' | 'published' | 'archived' | 'scheduled'
export type ArticleType = 'pillar' | 'silo' | 'supporting'

export interface Article {
  id: string
  created_at: string
  updated_at: string
  published_at: string | null

  // Basic Info
  title: string
  slug: string
  excerpt: string | null
  content: string

  // SEO & Classification
  main_keyword: string | null
  status: ArticleStatus
  article_type: ArticleType
  silo: string | null
  depth: number
  is_pillar: boolean

  // Metrics
  word_count: number
  read_time: string | null
  seo_score: number | null
  human_score: number | null

  // Media
  hero_image: string | null  // Base64 or URL
  hero_video: string | null

  // Metadata
  meta_title: string | null
  meta_description: string | null
  author_name: string | null
  author_avatar: string | null

  // URLs
  url: string | null
}

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: Article
        Insert: Omit<Article, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Article, 'id' | 'created_at'>>
      }
    }
  }
}
