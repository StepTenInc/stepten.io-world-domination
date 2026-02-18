'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

interface RelatedArticle {
  slug: string;
  title: string;
  excerpt?: string;
  hero_image_url?: string;
  relationship_type?: string;
  similarity_score?: number;
  anchor_text?: string;
}

interface RelatedArticlesProps {
  taleSlug: string;
  className?: string;
}

export function RelatedArticles({ taleSlug, className = '' }: RelatedArticlesProps) {
  const [articles, setArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseKey) {
          setLoading(false);
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get current tale ID
        const { data: currentTale } = await supabase
          .from('tales')
          .select('id')
          .eq('slug', taleSlug)
          .single();

        if (!currentTale?.id) {
          setLoading(false);
          return;
        }

        // Fetch from tale_relationships (semantic links)
        const { data: relationships } = await supabase
          .from('tale_relationships')
          .select(`
            relationship_type,
            similarity_score,
            target_tale_id,
            tales!tale_relationships_target_tale_id_fkey (
              slug,
              title,
              excerpt,
              hero_image_url
            )
          `)
          .eq('source_tale_id', currentTale.id)
          .order('similarity_score', { ascending: false })
          .limit(5);

        // Fetch from internal_links (with anchor text)
        const { data: internalLinks } = await supabase
          .from('internal_links')
          .select(`
            anchor_text,
            relevance_score,
            target_tale_id,
            tales!internal_links_target_tale_id_fkey (
              slug,
              title,
              excerpt,
              hero_image_url
            )
          `)
          .eq('source_tale_id', currentTale.id)
          .order('relevance_score', { ascending: false })
          .limit(5);

        // Combine and dedupe
        const combined = new Map<string, RelatedArticle>();
        
        relationships?.forEach((r: any) => {
          if (r.tales) {
            combined.set(r.tales.slug, {
              slug: r.tales.slug,
              title: r.tales.title,
              excerpt: r.tales.excerpt,
              hero_image_url: r.tales.hero_image_url,
              relationship_type: r.relationship_type,
              similarity_score: r.similarity_score,
            });
          }
        });

        internalLinks?.forEach((l: any) => {
          if (l.tales && !combined.has(l.tales.slug)) {
            combined.set(l.tales.slug, {
              slug: l.tales.slug,
              title: l.tales.title,
              excerpt: l.tales.excerpt,
              hero_image_url: l.tales.hero_image_url,
              anchor_text: l.anchor_text,
            });
          }
        });

        setArticles(Array.from(combined.values()).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch related:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRelated();
  }, [taleSlug]);

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="animate-pulse flex gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 h-32 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-sm">🔗</span>
        Related from the Knowledge Base
      </h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/tales/${article.slug}`}
            className="group block bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl p-4 transition-all duration-300"
          >
            {article.hero_image_url && (
              <div className="relative aspect-video mb-3 rounded-lg overflow-hidden">
                <Image
                  src={article.hero_image_url}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {article.relationship_type && (
                  <span className="absolute top-2 left-2 text-xs bg-black/70 text-cyan-400 px-2 py-0.5 rounded">
                    {article.relationship_type}
                  </span>
                )}
              </div>
            )}
            
            <h4 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
              {article.anchor_text || article.title}
            </h4>
            
            {article.similarity_score && (
              <div className="flex items-center gap-2 text-xs text-white/40">
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    style={{ width: `${article.similarity_score * 100}%` }}
                  />
                </div>
                <span>{Math.round(article.similarity_score * 100)}% match</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
