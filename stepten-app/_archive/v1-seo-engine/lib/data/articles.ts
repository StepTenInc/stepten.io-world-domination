// Articles data - reads from Supabase with localStorage fallback
import { createBrowserClient } from '@supabase/ssr';

export interface Article {
    id: string;
    title: string;
    slug: string;
    status: "draft" | "published" | "archived" | "deleted";
    silo: string | null;
    isSiloPillar: boolean;
    depth: number;
    wordCount: number;
    seoScore: number;
    humanScore: number;
    publishedAt: string | null;
    updatedAt: string;
    createdAt: string;
    mainKeyword: string;
    excerpt?: string;
    content?: string;
    heroImage?: string;
    heroVideo?: string | null;
    author?: {
        name: string;
        avatar: string;
    };
    readTime?: string;
    articleType?: "pillar" | "silo" | "supporting";
}

// Create Supabase client for browser
function createSupabaseClient() {
    if (typeof window === 'undefined') return null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn('Supabase credentials not found, using localStorage fallback');
        return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Get articles from localStorage (fallback)
function getArticlesFromStorage(): Article[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem('seo-published-articles');
        if (!stored) return [];
        const articles = JSON.parse(stored);

        // Ensure all articles have required fields
        return articles.map((article: any) => ({
            id: article.id || `article-${Date.now()}`,
            title: article.title || 'Untitled',
            slug: article.slug || '',
            status: article.status || 'published',
            silo: article.silo || null,
            isSiloPillar: article.isSiloPillar || article.is_pillar || false,
            depth: article.depth || 0,
            wordCount: article.wordCount || article.word_count || 0,
            seoScore: article.seoScore || article.seo_score || 0,
            humanScore: article.humanScore || article.human_score || 0,
            publishedAt: article.publishedAt || article.published_at || null,
            updatedAt: article.updatedAt || article.updated_at || new Date().toISOString(),
            createdAt: article.createdAt || article.created_at || new Date().toISOString(),
            mainKeyword: article.mainKeyword || article.main_keyword || '',
            excerpt: article.excerpt,
            content: article.content,
            heroImage: article.heroImage || article.hero_image,
            heroVideo: article.heroVideo || article.hero_video || null,
            author: article.author || {
                name: article.author_name || process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Stephen Ten',
                avatar: article.author_avatar || process.env.NEXT_PUBLIC_AUTHOR_AVATAR || '/images/stephen-avatar.jpg'
            },
            readTime: article.readTime || article.read_time,
            articleType: article.articleType || article.article_type || 'supporting'
        }));
    } catch (error) {
        console.error('Failed to load articles from storage:', error);
        return [];
    }
}

// Convert Supabase article to Article interface
function convertSupabaseArticle(dbArticle: any): Article {
    return {
        id: dbArticle.id,
        title: dbArticle.title || 'Untitled',
        slug: dbArticle.slug || '',
        status: dbArticle.status || 'published',
        silo: dbArticle.silo || null,
        isSiloPillar: dbArticle.is_pillar || false,
        depth: dbArticle.depth || 0,
        wordCount: dbArticle.word_count || 0,
        seoScore: dbArticle.seo_score || 0,
        humanScore: dbArticle.human_score || 0,
        publishedAt: dbArticle.published_at || null,
        updatedAt: dbArticle.updated_at || new Date().toISOString(),
        createdAt: dbArticle.created_at || new Date().toISOString(),
        mainKeyword: dbArticle.main_keyword || '',
        excerpt: dbArticle.excerpt,
        content: dbArticle.content,
        heroImage: dbArticle.hero_image,
        heroVideo: dbArticle.hero_video || null,
        author: {
            name: dbArticle.author_name || process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Stephen Ten',
            avatar: dbArticle.author_avatar || process.env.NEXT_PUBLIC_AUTHOR_AVATAR || '/images/stephen-avatar.jpg'
        },
        readTime: dbArticle.read_time,
        articleType: dbArticle.article_type || 'supporting'
    };
}

// Fetch articles from Supabase
async function getArticlesFromDatabase(): Promise<Article[]> {
    const supabase = createSupabaseClient();
    if (!supabase) {
        return getArticlesFromStorage();
    }

    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase fetch error:', error);
            return getArticlesFromStorage();
        }

        if (!data || data.length === 0) {
            // No articles in database, fallback to localStorage
            return getArticlesFromStorage();
        }

        return data.map(convertSupabaseArticle);
    } catch (error) {
        console.error('Failed to fetch articles from database:', error);
        return getArticlesFromStorage();
    }
}

// Cached articles (will be populated on client side)
let articlesCache: Article[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 60000; // 1 minute cache

// Export a promise-based getter
export async function getArticles(): Promise<Article[]> {
    // Check cache
    if (articlesCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
        return articlesCache;
    }

    // Fetch from database
    const articles = await getArticlesFromDatabase();
    articlesCache = articles;
    cacheTimestamp = Date.now();

    return articles;
}

// Synchronous helper for immediate access (uses cache or localStorage)
export function getArticlesSync(): Article[] {
    if (articlesCache) {
        return articlesCache;
    }
    return getArticlesFromStorage();
}

// Helper to get draft articles (from localStorage only)
export function getDraftArticlesFromStorage(): Article[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem('seo-draft-articles');
        if (!stored) return [];
        const drafts = JSON.parse(stored);

        return drafts.map((article: any) => ({
            id: article.id || `draft-${Date.now()}`,
            title: article.title || 'Untitled Draft',
            slug: article.slug || '',
            status: 'draft',
            silo: article.silo || null,
            isSiloPillar: article.isSiloPillar || false,
            depth: article.depth || 0,
            wordCount: article.wordCount || 0,
            seoScore: article.seoScore || 0,
            humanScore: article.humanScore || 0,
            publishedAt: null,
            updatedAt: article.updatedAt || new Date().toISOString(),
            createdAt: article.createdAt || new Date().toISOString(),
            mainKeyword: article.mainKeyword || '',
            excerpt: article.excerpt,
            content: article.content,
            heroImage: article.heroImage,
            heroVideo: article.heroVideo || null,
            author: article.author || {
                name: process.env.NEXT_PUBLIC_AUTHOR_NAME || 'Stephen Ten',
                avatar: process.env.NEXT_PUBLIC_AUTHOR_AVATAR || '/images/stephen-avatar.jpg'
            },
            readTime: article.readTime,
            articleType: article.articleType || 'supporting'
        }));
    } catch (error) {
        console.error('Failed to load draft articles:', error);
        return [];
    }
}

// Helper functions (async)
export async function getPublishedArticles(): Promise<Article[]> {
    const articles = await getArticles();
    return articles.filter(a => a.status === 'published');
}

export async function getPillarArticles(): Promise<Article[]> {
    const articles = await getArticles();
    return articles.filter(a => a.isSiloPillar && a.status === 'published');
}

export async function getArticlesBySilo(silo: string): Promise<Article[]> {
    const articles = await getArticles();
    return articles.filter(a => a.silo === silo && a.status === 'published');
}

export function getDraftArticles(): Article[] {
    return getDraftArticlesFromStorage();
}

export async function getRecentArticles(limit: number = 5): Promise<Article[]> {
    const articles = await getArticles();
    return articles
        .filter(a => a.status === 'published')
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
        .slice(0, limit);
}

// Synchronous version for backward compatibility
export function getPublishedArticlesSync(): Article[] {
    return getArticlesSync().filter(a => a.status === 'published');
}

// Clear cache (call this after publishing a new article)
export function clearArticlesCache(): void {
    articlesCache = null;
    cacheTimestamp = null;
}
