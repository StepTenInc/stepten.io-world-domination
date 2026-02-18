'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import { Sparkles, ArrowRight, Brain } from 'lucide-react';

interface RelatedArticle {
  slug: string;
  title: string;
  excerpt?: string;
  hero_image_url?: string;
  relationship_type?: string;
  similarity_score?: number;
  anchor_text?: string;
  shared_topics?: string[];
  recommendation_reason?: string;
}

interface RelatedArticlesProps {
  taleSlug: string;
  taleTitle?: string;
  authorColor?: string;
  className?: string;
}

export function RelatedArticles({ taleSlug, taleTitle, authorColor = '#00d4ff', className = '' }: RelatedArticlesProps) {
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
            shared_topics,
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
            context_snippet,
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
              shared_topics: r.shared_topics,
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
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) return null;

  const getRecommendationReason = (article: RelatedArticle): string => {
    // Generate intelligent recommendation reason
    if (article.shared_topics && article.shared_topics.length > 0) {
      const topics = article.shared_topics.slice(0, 2).join(' and ');
      return `Both articles explore ${topics}`;
    }
    
    switch (article.relationship_type) {
      case 'supports':
        return 'Provides deeper context on concepts mentioned above';
      case 'expands':
        return 'Expands on the ideas introduced in this article';
      case 'related':
        return 'Covers similar themes from a different angle';
      case 'prerequisite':
        return 'Helpful background reading before this article';
      default:
        if (article.similarity_score && article.similarity_score > 0.8) {
          return 'Highly relevant based on semantic analysis';
        }
        return 'Recommended by our knowledge graph';
    }
  };

  return (
    <div className={`${className}`}>
      {/* Section Header */}
      <div className="flex items-start gap-5 mb-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ 
            background: `linear-gradient(135deg, ${authorColor}25, ${authorColor}08)`,
            border: `1px solid ${authorColor}40`,
            boxShadow: `0 0 30px ${authorColor}15`,
          }}
        >
          <Brain size={24} style={{ color: authorColor }} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--fd)' }}>
            The Knowledge Graph Recommends
          </h3>
          <p className="text-base text-white/50 leading-relaxed">
            Our AI analyzed the semantic relationships between articles to find the most relevant reads for you.
          </p>
        </div>
      </div>
      
      {/* Cards - Vertical Stack */}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            href={`/tales/${article.slug}`}
            className="group block overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.01]"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0 overflow-hidden">
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
                
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 md:hidden"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8) 100%)',
                  }}
                />
                
                {/* Match badge */}
                {article.similarity_score && article.similarity_score > 0.7 && (
                  <div 
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md flex items-center gap-2"
                    style={{
                      background: `${authorColor}20`,
                      border: `1px solid ${authorColor}50`,
                      color: authorColor,
                    }}
                  >
                    <Sparkles size={12} />
                    {Math.round(article.similarity_score * 100)}% match
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                {/* Why recommended */}
                <div 
                  className="text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: authorColor }}
                >
                  <span className="w-8 h-px" style={{ background: authorColor }} />
                  {getRecommendationReason(article)}
                </div>
                
                {/* Title */}
                <h4 
                  className="text-xl md:text-2xl font-bold text-white leading-tight mb-4 group-hover:text-opacity-90 transition-colors"
                  style={{ fontFamily: 'var(--fd)' }}
                >
                  {article.title}
                </h4>
                
                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-white/50 text-sm md:text-base leading-relaxed line-clamp-2 mb-5">
                    {article.excerpt}
                  </p>
                )}
                
                {/* Read more */}
                <div 
                  className="flex items-center gap-3 text-sm font-medium transition-all duration-300 group-hover:gap-4"
                  style={{ color: authorColor }}
                >
                  <span>Read this article</span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>

            {/* Hover Glow */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{
                boxShadow: `inset 0 0 40px ${authorColor}10, 0 0 60px ${authorColor}08`,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
