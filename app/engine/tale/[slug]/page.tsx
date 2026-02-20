'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient(
  'https://iavnhggphhrvbcidixiw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhdm5oZ2dwaGhydmJjaWRpeGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwMDUwMzgsImV4cCI6MjA4MzU4MTAzOH0.o6-WnuWzunOS637ihjfsVMyag9EHMscm5A0ywtJYu2I'
);

interface Tale {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author_id: string;
  status: string;
  stepten_score: number | null;
  score_breakdown: Record<string, number> | null;
  word_count: number | null;
  hero_image_url: string | null;
  hero_video_url: string | null;
  images: { url: string; alt: string; caption?: string }[] | null;
  outbound_links: { url: string; anchor: string }[] | null;
  keywords: string[] | null;
  tags: string[] | null;
  schema_json: Record<string, unknown> | null;
  meta_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at: string;
}

interface Author {
  id: string;
  name: string;
  slug: string;
}

// Author colors
const authorColors: Record<string, string> = {
  'pinky': '#FF6B9D',
  'reina': '#E040FB',
  'clark': '#00E5FF',
  'stepten': '#FFD700',
};

export default function TaleCommandCenter() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [tale, setTale] = useState<Tale | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [processing, setProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTale = async () => {
      const { data: taleData } = await supabase
        .from('tales')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (taleData) {
        setTale(taleData);
        
        // Fetch author
        if (taleData.author_id) {
          const { data: authorData } = await supabase
            .from('authors')
            .select('*')
            .eq('id', taleData.author_id)
            .single();
          if (authorData) setAuthor(authorData);
        }
      }
      setLoading(false);
    };
    
    fetchTale();
  }, [slug]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  const executeCommand = async (command: string) => {
    if (!command.trim() || !tale) return;
    
    setCommandHistory(prev => [...prev, { role: 'user', content: command }]);
    setCommandInput('');
    setProcessing(true);
    
    // Simulate processing - in reality this would call an API
    setTimeout(() => {
      const response = `Command received: "${command}"\n\nThis would be processed by the content engine. Available actions:\n• regenerate-hero - Create new hero image\n• regenerate-images - Regenerate inline images\n• add-internal-links - Find and add internal link opportunities\n• add-outbound-links - Add relevant outbound links\n• improve-seo - Optimize meta and schema\n• recalculate-score - Update StepTen score\n\nFull AI integration coming soon.`;
      setCommandHistory(prev => [...prev, { role: 'assistant', content: response }]);
      setProcessing(false);
    }, 1000);
  };

  const quickActions = [
    { label: '🖼️ Regenerate Hero', command: 'regenerate-hero', color: '#FF6B9D' },
    { label: '🔗 Add Internal Links', command: 'add-internal-links', color: '#00FF41' },
    { label: '🌐 Add Outbound Links', command: 'add-outbound-links', color: '#00E5FF' },
    { label: '📊 Recalculate Score', command: 'recalculate-score', color: '#FFD700' },
    { label: '🔍 Improve SEO', command: 'improve-seo', color: '#E040FB' },
    { label: '🎬 Generate Video', command: 'generate-video', color: '#FF4444' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', color: '#00FF41' }}>LOADING...</div>
      </div>
    );
  }

  if (!tale) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', color: '#FF4444' }}>TALE NOT FOUND: {slug}</div>
      </div>
    );
  }

  const authorSlug = author?.slug || 'pinky';
  const authorColor = authorColors[authorSlug] || '#00FF41';

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#E5E5E5', fontFamily: 'monospace' }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid rgba(0,255,65,0.2)', 
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/engine" style={{ color: '#00FF41', textDecoration: 'none', fontSize: '0.8rem' }}>
            ← BACK TO ENGINE
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
          <span style={{ color: authorColor, fontSize: '0.7rem' }}>TALE COMMAND CENTER</span>
        </div>
        <a 
          href={`https://stepten.io/tales/${tale.slug}`} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: '#00FF41', textDecoration: 'none', fontSize: '0.7rem' }}
        >
          VIEW LIVE ↗
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', minHeight: 'calc(100vh - 60px)' }}>
        {/* Left: Tale Info */}
        <div style={{ padding: '24px', borderRight: '1px solid rgba(0,255,65,0.1)', overflow: 'auto' }}>
          {/* Title & Meta */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '1.2rem', color: '#E5E5E5', marginBottom: '8px', lineHeight: 1.4 }}>{tale.title}</h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: authorColor }}>{author?.name || 'Unknown'}</span>
              <span>•</span>
              <span>{tale.word_count || '—'} words</span>
              <span>•</span>
              <span style={{ color: tale.status === 'published' ? '#00FF41' : '#FFD700' }}>{tale.status?.toUpperCase()}</span>
            </div>
          </div>

          {/* Score */}
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            border: '1px solid rgba(0,255,65,0.2)', 
            borderRadius: '8px', 
            padding: '16px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>STEPTEN SCORE</span>
              <span style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: (tale.stepten_score || 0) >= 80 ? '#00FF41' : (tale.stepten_score || 0) >= 60 ? '#FFD700' : '#FF4444',
              }}>
                {tale.stepten_score?.toFixed(1) || '—'}
              </span>
            </div>
            {tale.score_breakdown && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.65rem' }}>
                {Object.entries(tale.score_breakdown).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{key.replace(/_/g, ' ')}</span>
                    <span style={{ color: value >= 8 ? '#00FF41' : value >= 5 ? '#FFD700' : '#FF4444' }}>{value}/10</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Image */}
          {tale.hero_image_url && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>HERO IMAGE</div>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,255,65,0.2)' }}>
                <Image src={tale.hero_image_url} alt={tale.title} fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          )}

          {/* Inline Images */}
          {tale.images && tale.images.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>INLINE IMAGES ({tale.images.length})</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {tale.images.map((img, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(0,255,65,0.1)' }}>
                    <Image src={img.url} alt={img.alt || `Image ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outbound Links */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>
              OUTBOUND LINKS ({tale.outbound_links?.length || 0})
            </div>
            {tale.outbound_links && tale.outbound_links.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {tale.outbound_links.map((link, i) => (
                  <a 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.7rem', color: '#00E5FF', textDecoration: 'none' }}
                  >
                    {link.anchor} ↗
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>No outbound links yet</div>
            )}
          </div>

          {/* Keywords & Tags */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>KEYWORDS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {tale.keywords?.map((kw, i) => (
                <span key={i} style={{ 
                  fontSize: '0.6rem', 
                  padding: '2px 8px', 
                  background: 'rgba(0,255,65,0.1)', 
                  border: '1px solid rgba(0,255,65,0.2)',
                  borderRadius: '4px',
                  color: '#00FF41',
                }}>
                  {kw}
                </span>
              )) || <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>No keywords</span>}
            </div>
          </div>

          {/* Schema JSON */}
          {tale.schema_json && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>SCHEMA JSON</div>
              <pre style={{ 
                fontSize: '0.6rem', 
                background: 'rgba(0,0,0,0.3)', 
                padding: '12px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px',
                border: '1px solid rgba(0,255,65,0.1)',
              }}>
                {JSON.stringify(tale.schema_json, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Command Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)' }}>
          {/* Quick Actions */}
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(0,255,65,0.1)' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>QUICK ACTIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {quickActions.map(action => (
                <button
                  key={action.command}
                  onClick={() => executeCommand(action.command)}
                  disabled={processing}
                  style={{
                    padding: '10px 12px',
                    background: 'rgba(0,0,0,0.5)',
                    border: `1px solid ${action.color}40`,
                    borderRadius: '6px',
                    color: action.color,
                    fontSize: '0.65rem',
                    cursor: processing ? 'wait' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: processing ? 0.5 : 1,
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Command History */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>COMMAND LOG</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {commandHistory.length === 0 ? (
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '40px 0' }}>
                  Use quick actions or type a command below
                </div>
              ) : (
                commandHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      padding: '10px 12px',
                      background: msg.role === 'user' ? 'rgba(0,255,65,0.1)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      borderLeft: `2px solid ${msg.role === 'user' ? '#00FF41' : '#00E5FF'}`,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {msg.content}
                  </div>
                ))
              )}
              {processing && (
                <div style={{ 
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  borderLeft: '2px solid #FFD700',
                  color: '#FFD700',
                }}>
                  Processing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Command Input */}
          <div style={{ padding: '16px', borderTop: '1px solid rgba(0,255,65,0.1)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && executeCommand(commandInput)}
                placeholder="Type a command..."
                disabled={processing}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(0,255,65,0.2)',
                  borderRadius: '6px',
                  color: '#E5E5E5',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => executeCommand(commandInput)}
                disabled={processing || !commandInput.trim()}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(0,255,65,0.2)',
                  border: '1px solid #00FF41',
                  borderRadius: '6px',
                  color: '#00FF41',
                  fontSize: '0.75rem',
                  cursor: processing ? 'wait' : 'pointer',
                  opacity: processing || !commandInput.trim() ? 0.5 : 1,
                }}
              >
                RUN
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
