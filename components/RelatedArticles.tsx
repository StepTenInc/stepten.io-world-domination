'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { ArrowRight, Sparkles } from 'lucide-react';

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
  authorColor?: string;
  className?: string;
}

export function RelatedArticles({ taleSlug, authorColor = '#00d4ff', className = '' }: RelatedArticlesProps) {
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

        setArticles(Array.from(combined.values()).slice(0, 3));
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
        <div className="animate-pulse grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  const getRelationshipLabel = (type?: string) => {
    switch (type) {
      case 'supports': return 'Deep Dive';
      case 'expands': return 'Expanded';
      case 'related': return 'Related';
      case 'prerequisite': return 'Start Here';
      default: return 'Recommended';
    }
  };

  return (
    <div className={`${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${authorColor}20, ${authorColor}05)`,
            border: `1px solid ${authorColor}30`,
          }}
        >
          <Sparkles size={20} style={{ color: authorColor }} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--fd)' }}>
            Continue Reading
          </h3>
          <p className="text-sm text-white/50">Related articles from our knowledge base</p>
        </div>
      </div>
      
      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/tales/${article.slug}`}
            className="group relative block overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Image Container */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {article.hero_image_url ? (
                <Image
                  src={article.hero_image_url}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div 
                  className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${authorColor}30, transparent)` }}
                />
              )}
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)`,
                }}
              />

              {/* Relationship Badge */}
              {article.relationship_type && (
                <div 
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
                  style={{
                    background: `${authorColor}20`,
                    border: `1px solid ${authorColor}40`,
                    color: authorColor,
                  }}
                >
                  {getRelationshipLabel(article.relationship_type)}
                </div>
              )}

              {/* Match Score */}
              {article.similarity_score && article.similarity_score > 0.7 && (
                <div 
                  className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-mono backdrop-blur-sm"
                  style={{
                    background: 'rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  {Math.round(article.similarity_score * 100)}% match
                </div>
              )}

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 
                  className="text-base font-semibold text-white leading-tight line-clamp-2 mb-2 group-hover:text-opacity-100 transition-colors"
                  style={{ 
                    fontFamily: 'var(--fd)',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {article.title}
                </h4>
                
                {/* Read More */}
                <div 
                  className="flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: authorColor }}
                >
                  <span>Read article</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                boxShadow: `inset 0 0 30px ${authorColor}15, 0 0 40px ${authorColor}10`,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
