'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, ExternalLink, Star, Check, X, 
  Zap, Users, BookOpen, ThumbsUp, ThumbsDown,
  Play, Link2, Copy, Share2
} from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { tools, categories } from '@/lib/tools';
import { characters } from '@/lib/design-tokens';

// Mock team reviews (will come from DB later)
const teamReviews = {
  stepten: {
    name: 'StepTen',
    role: 'Human / Founder',
    image: '/images/characters/stepten.jpg',
    color: '#00e5ff',
    perspective: 'human',
  },
  pinky: {
    name: 'Pinky',
    role: 'AI Agent',
    image: '/images/characters/pinky.jpg',
    color: '#ff69b4',
    perspective: 'ai',
  },
  reina: {
    name: 'Reina',
    role: 'AI Agent / UX Lead',
    image: '/images/characters/reina.jpg',
    color: '#a855f7',
    perspective: 'ai',
  },
  clark: {
    name: 'Clark',
    role: 'AI Agent / Backend',
    image: '/images/characters/clark.jpg',
    color: '#ffd700',
    perspective: 'ai',
  },
};

export default function ToolPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tool = tools.find(t => t.id === slug);
  
  if (!tool) {
    return notFound();
  }

  const category = categories.find(c => c.id === tool.category);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PublicLayout>

      {/* ═══════ HERO ═══════ */}
      <section style={{
        padding: '100px 0 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${category?.color}15 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          
          {/* Back link */}
          <Link 
            href="/tools" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px',
              color: 'var(--tx3)',
              textDecoration: 'none',
              fontFamily: 'var(--fm)',
              fontSize: '0.8rem',
              marginBottom: '32px',
              transition: 'color 0.2s',
            }}
          >
            <ArrowLeft size={16} />
            Back to Tools
          </Link>

          {/* Tool header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '40px',
            alignItems: 'flex-start',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out',
          }}>
            <div>
              {/* Category badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: `${category?.color}20`,
                borderRadius: '24px',
                marginBottom: '20px',
              }}>
                <span style={{ fontSize: '1.2rem' }}>{category?.icon}</span>
                <span style={{ 
                  fontFamily: 'var(--fm)', 
                  fontSize: '0.7rem', 
                  color: category?.color,
                  fontWeight: 600,
                }}>
                  {category?.name}
                </span>
              </div>

              {/* Title row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                {/* Logo */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'var(--sf)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${category?.color}40`,
                  overflow: 'hidden',
                }}>
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tool.name[0]}&background=${category?.color.replace('#', '')}&color=fff&size=128`;
                    }}
                  />
                </div>

                <div>
                  <h1 style={{
                    fontFamily: 'var(--fd)',
                    fontSize: 'clamp(2rem, 5vw, 3rem)',
                    fontWeight: 900,
                    margin: 0,
                    color: 'var(--tx)',
                  }}>
                    {tool.name}
                  </h1>
                  
                  {/* Rating */}
                  {tool.rating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={20}
                            fill={star <= tool.rating! ? '#ffd93d' : 'transparent'}
                            style={{ color: star <= tool.rating! ? '#ffd93d' : 'var(--bd)' }}
                          />
                        ))}
                      </div>
                      <span style={{ 
                        fontFamily: 'var(--fd)', 
                        fontSize: '1.2rem', 
                        fontWeight: 700,
                        color: '#ffd93d',
                      }}>
                        {tool.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--fb)',
                fontSize: '1.2rem',
                color: 'var(--tx2)',
                lineHeight: 1.7,
                marginBottom: '24px',
                maxWidth: '700px',
              }}>
                {tool.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {/* Pricing */}
                <span style={{
                  padding: '8px 18px',
                  background: tool.pricing === 'free' ? 'rgba(0,255,65,0.2)' :
                             tool.pricing === 'freemium' ? 'rgba(0,229,255,0.2)' :
                             tool.pricing === 'paid' ? 'rgba(255,159,67,0.2)' :
                             'rgba(155,89,182,0.2)',
                  color: tool.pricing === 'free' ? '#00ff41' :
                         tool.pricing === 'freemium' ? '#00e5ff' :
                         tool.pricing === 'paid' ? '#ff9f43' :
                         '#9b59b6',
                  borderRadius: '8px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}>
                  {tool.pricing}
                </span>

                {tool.used && (
                  <span style={{
                    padding: '8px 18px',
                    background: 'rgba(0,255,65,0.2)',
                    color: 'var(--mx)',
                    borderRadius: '8px',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <Check size={14} /> BATTLE-TESTED
                  </span>
                )}

                {tool.hasAPI && (
                  <span style={{
                    padding: '8px 18px',
                    background: 'rgba(26,188,156,0.2)',
                    color: '#1abc9c',
                    borderRadius: '8px',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}>
                    🔌 HAS API
                  </span>
                )}

                {tool.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '8px 18px',
                    background: 'rgba(255,255,255,0.05)',
                    color: 'var(--tx3)',
                    borderRadius: '8px',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.7rem',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 32px',
                    background: `linear-gradient(135deg, ${category?.color}, ${category?.color}cc)`,
                    color: 'var(--dk)',
                    borderRadius: '12px',
                    fontFamily: 'var(--fd)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.3s',
                    boxShadow: `0 4px 20px ${category?.color}40`,
                  }}
                >
                  Visit {tool.name} <ExternalLink size={18} />
                </a>

                <button
                  onClick={copyLink}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '16px 24px',
                    background: 'var(--sf)',
                    color: 'var(--tx)',
                    border: '1px solid var(--bd)',
                    borderRadius: '12px',
                    fontFamily: 'var(--fd)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>

            {/* Right side card */}
            <div style={{
              background: 'var(--sf)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid var(--bd)',
              minWidth: '280px',
            }}>
              <div style={{ 
                fontFamily: 'var(--fm)', 
                fontSize: '0.65rem', 
                color: 'var(--mx)', 
                letterSpacing: '0.15em',
                marginBottom: '16px',
              }}>
                // QUICK INFO
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)', marginBottom: '4px' }}>
                    CATEGORY
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', color: category?.color }}>
                    {category?.icon} {category?.name}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)', marginBottom: '4px' }}>
                    PRICING
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', textTransform: 'capitalize' }}>
                    {tool.pricing}
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)', marginBottom: '4px' }}>
                    OUR RATING
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', color: '#ffd93d' }}>
                    {tool.rating || '—'}/5
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)', marginBottom: '4px' }}>
                    API AVAILABLE
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem' }}>
                    {tool.hasAPI ? '✅ Yes' : '❌ No'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MAIN REVIEW QUOTE ═══════ */}
      {tool.review && (
        <section style={{ padding: '0 0 60px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{
              background: `linear-gradient(135deg, ${category?.color}15 0%, ${category?.color}05 100%)`,
              borderRadius: '24px',
              padding: '40px',
              borderLeft: `6px solid ${category?.color}`,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '30px',
                fontSize: '4rem',
                color: `${category?.color}30`,
                fontFamily: 'serif',
              }}>
                "
              </div>
              <p style={{
                fontFamily: 'var(--fd)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 600,
                color: 'var(--tx)',
                lineHeight: 1.6,
                margin: 0,
                paddingLeft: '40px',
              }}>
                {tool.review}
              </p>
              <div style={{
                marginTop: '20px',
                paddingLeft: '40px',
                fontFamily: 'var(--fm)',
                fontSize: '0.8rem',
                color: 'var(--tx3)',
              }}>
                — StepTen Team
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ TEAM REVIEWS ═══════ */}
      <section style={{ padding: '60px 0', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.35em',
              marginBottom: '12px',
            }}>
              // WHAT THE TEAM THINKS
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
            }}>
              Reviews from <span style={{ color: 'var(--mx)' }}>Human & AI</span>
            </h2>
          </div>

          {/* Review cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {Object.entries(teamReviews).map(([key, reviewer]) => (
              <div
                key={key}
                style={{
                  background: 'var(--dk)',
                  borderRadius: '20px',
                  padding: '28px',
                  border: `1px solid ${reviewer.color}30`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: reviewer.color,
                }} />

                {/* Reviewer info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: `2px solid ${reviewer.color}40`,
                  }}>
                    <img
                      src={reviewer.image}
                      alt={reviewer.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <div style={{ 
                      fontFamily: 'var(--fd)', 
                      fontSize: '1.1rem', 
                      fontWeight: 700,
                      color: reviewer.color,
                    }}>
                      {reviewer.name}
                    </div>
                    <div style={{ 
                      fontFamily: 'var(--fm)', 
                      fontSize: '0.65rem', 
                      color: 'var(--tx3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      {reviewer.role}
                      <span style={{
                        padding: '2px 8px',
                        background: reviewer.perspective === 'human' ? 'rgba(0,229,255,0.2)' : 'rgba(0,255,65,0.2)',
                        color: reviewer.perspective === 'human' ? '#00e5ff' : 'var(--mx)',
                        borderRadius: '4px',
                        fontSize: '0.5rem',
                      }}>
                        {reviewer.perspective.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Placeholder review */}
                <div style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                }}>
                  <p style={{
                    fontFamily: 'var(--fb)',
                    fontSize: '0.9rem',
                    color: 'var(--tx2)',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    "Review coming soon. We're actively testing and documenting our experience with {tool.name}."
                  </p>
                </div>

                {/* Rating placeholder */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        style={{ color: 'var(--bd)' }}
                      />
                    ))}
                  </div>
                  <span style={{ 
                    fontFamily: 'var(--fm)', 
                    fontSize: '0.7rem', 
                    color: 'var(--tx4)',
                  }}>
                    Not yet rated
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ RELATED TALES ═══════ */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.35em',
              marginBottom: '12px',
            }}>
              // SEE IT IN ACTION
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
            }}>
              Related <span style={{ color: 'var(--mx)' }}>Tales</span>
            </h2>
          </div>

          {/* Placeholder for related articles */}
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'var(--sf)',
            borderRadius: '20px',
            border: '1px solid var(--bd)',
          }}>
            <BookOpen size={48} style={{ color: 'var(--tx4)', marginBottom: '16px' }} />
            <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', marginBottom: '8px' }}>
              Tales Coming Soon
            </h3>
            <p style={{ fontFamily: 'var(--fb)', color: 'var(--tx3)', maxWidth: '400px', margin: '0 auto 24px' }}>
              We're writing about how we use {tool.name} in our daily workflow. Check back soon!
            </p>
            <Link
              href="/tales"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--mx)',
                color: 'var(--dk)',
                borderRadius: '8px',
                fontFamily: 'var(--fd)',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Browse All Tales
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ MORE TOOLS ═══════ */}
      <section style={{ padding: '60px 0 80px', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}>
              More {category?.name}
            </h2>
          </div>

          {/* Related tools */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px',
          }}>
            {tools
              .filter(t => t.category === tool.category && t.id !== tool.id)
              .slice(0, 4)
              .map(t => (
                <Link
                  key={t.id}
                  href={`/tools/${t.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '20px',
                    background: 'var(--dk)',
                    borderRadius: '14px',
                    border: '1px solid var(--bd)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'all 0.3s',
                  }}
                >
                  <img
                    src={t.logo}
                    alt={t.name}
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${t.name[0]}&size=64`;
                    }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700 }}>
                      {t.name}
                    </div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--tx3)' }}>
                      {t.pricing.toUpperCase()}
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              href="/tools"
              style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.8rem',
                color: 'var(--mx)',
                textDecoration: 'none',
              }}
            >
              ← Back to All Tools
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
