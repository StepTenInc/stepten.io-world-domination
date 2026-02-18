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
import { tales } from '@/lib/tales';
import { getToolReview, hasFullReview, type ToolReview, type TeamReview } from '@/lib/tool-reviews';
import ReactMarkdown from 'react-markdown';

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
  const review = getToolReview(slug);

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

      {/* ═══════ AFFILIATE CTA ═══════ */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--sf) 0%, rgba(0,255,65,0.05) 100%)',
            borderRadius: '24px',
            padding: '40px',
            border: '2px solid var(--mx)',
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}>
            {/* Pinky avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              margin: '0 auto 20px',
              border: '3px solid var(--mx)',
              boxShadow: '0 0 30px rgba(0,255,65,0.3)',
            }}>
              <img
                src="/images/characters/pinky.jpg"
                alt="Pinky"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            <h3 style={{
              fontFamily: 'var(--fd)',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--mx)',
            }}>
              🐀 Hey! Quick favor?
            </h3>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '1.1rem',
              color: 'var(--tx2)',
              maxWidth: '500px',
              margin: '0 auto 24px',
              lineHeight: 1.7,
            }}>
              If you're gonna try <strong>{tool.name}</strong>, use our link below? 
              It helps keep the lights on and doesn't cost you anything extra. NARF!
            </p>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                padding: '18px 40px',
                background: 'linear-gradient(135deg, var(--mx), #00cc33)',
                color: 'var(--dk)',
                borderRadius: '14px',
                fontFamily: 'var(--fd)',
                fontSize: '1rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 8px 30px rgba(0,255,65,0.4)',
                transition: 'all 0.3s',
              }}
            >
              Try {tool.name} Free <ExternalLink size={20} />
            </a>
            <p style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.7rem',
              color: 'var(--tx4)',
              marginTop: '16px',
            }}>
              * Affiliate link - we may earn a commission
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ WHAT THE TEAM SAYS (STYLED CONTENT) ═══════ */}
      <section style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.35em',
              marginBottom: '12px',
            }}>
              // WHAT WE ACTUALLY THINK
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 700,
            }}>
              The <span style={{ color: category?.color }}>{tool.name}</span> Deep Dive
            </h2>
          </div>

          {/* Team Reviews */}
          <TeamContentSection 
            memberKey="stepten"
            name="Stephen's Take"
            role="HUMAN PERSPECTIVE"
            image="/images/characters/stepten.jpg"
            color="#00e5ff"
            review={review?.stepten}
            toolName={tool.name}
            fallback={`Content coming soon. This is where Stephen shares his real experience using ${tool.name} - the good, the bad, and whether it's actually worth your money or just another overhyped tool.`}
          />

          <TeamContentSection 
            memberKey="pinky"
            name="Pinky's Take"
            role="AI AGENT PERSPECTIVE"
            image="/images/characters/pinky.jpg"
            color="#ff69b4"
            review={review?.pinky}
            toolName={tool.name}
            fallback={`NARF! Content coming soon. This is where I share how ${tool.name} works for an AI agent - does it play nice with automation? Can I actually use it? Is it rat-approved?`}
          />

          <TeamContentSection 
            memberKey="reina"
            name="Reina's Take"
            role="UX/DEV PERSPECTIVE"
            image="/images/characters/reina.jpg"
            color="#a855f7"
            review={review?.reina}
            toolName={tool.name}
            fallback={`Content coming soon. Reina's breakdown of ${tool.name} from a UX and development perspective - how it fits into real workflows, what it's actually good for, and who should use it.`}
          />

          <TeamContentSection 
            memberKey="clark"
            name="Clark's Take"
            role="BACKEND/INFRA PERSPECTIVE"
            image="/images/characters/clark.jpg"
            color="#ffd700"
            review={review?.clark}
            toolName={tool.name}
            fallback={`Content coming soon. Clark's technical breakdown - API quality, integration options, reliability, and whether ${tool.name} can handle real production workloads.`}
          />
        </div>
      </section>

      {/* ═══════ PROS & CONS ═══════ */}
      <section style={{ padding: '60px 0', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 700,
            }}>
              Pros & Cons
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {/* Pros */}
            <div style={{
              background: 'var(--dk)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(0,255,65,0.3)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(0,255,65,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ThumbsUp size={20} style={{ color: 'var(--mx)' }} />
                </div>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--mx)' }}>
                  Pros
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(review?.pros || ['Pro 1 coming soon', 'Pro 2 coming soon', 'Pro 3 coming soon']).map((pro, i, arr) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--bd)' : 'none',
                  }}>
                    <Check size={18} style={{ color: 'var(--mx)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontFamily: 'var(--fb)', fontSize: '0.95rem', color: 'var(--tx2)' }}>
                      {pro}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div style={{
              background: 'var(--dk)',
              borderRadius: '20px',
              padding: '28px',
              border: '1px solid rgba(255,107,107,0.3)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255,107,107,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <ThumbsDown size={20} style={{ color: '#ff6b6b' }} />
                </div>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color: '#ff6b6b' }}>
                  Cons
                </span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {(review?.cons || ['Con 1 coming soon', 'Con 2 coming soon', 'Con 3 coming soon']).map((con, i, arr) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid var(--bd)' : 'none',
                  }}>
                    <X size={18} style={{ color: '#ff6b6b', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontFamily: 'var(--fb)', fontSize: '0.95rem', color: 'var(--tx2)' }}>
                      {con}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TEAM RATING SUMMARY ═══════ */}
      <section style={{ padding: '60px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.35em',
              marginBottom: '12px',
            }}>
              // TEAM RATINGS
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
            }}>
              How We Rate <span style={{ color: category?.color }}>{tool.name}</span>
            </h2>
          </div>

          {/* Rating cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {[
              { key: 'stepten', name: 'StepTen', color: '#00e5ff', image: '/images/characters/stepten.jpg', review: review?.stepten },
              { key: 'pinky', name: 'Pinky', color: '#ff69b4', image: '/images/characters/pinky.jpg', review: review?.pinky },
              { key: 'reina', name: 'Reina', color: '#a855f7', image: '/images/characters/reina.jpg', review: review?.reina },
              { key: 'clark', name: 'Clark', color: '#ffd700', image: '/images/characters/clark.jpg', review: review?.clark },
            ].map((member) => (
              <div
                key={member.key}
                style={{
                  background: 'var(--sf)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${member.color}30`,
                  textAlign: 'center',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  margin: '0 auto 12px',
                  border: `2px solid ${member.color}40`,
                }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: member.color, marginBottom: '4px' }}>
                  {member.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '8px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={16} 
                      fill={member.review?.rating && star <= member.review.rating ? '#ffd93d' : 'transparent'}
                      style={{ color: member.review?.rating && star <= member.review.rating ? '#ffd93d' : 'var(--bd)' }} 
                    />
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: member.review?.rating ? '#ffd93d' : 'var(--tx4)' }}>
                  {member.review?.rating ? `${member.review.rating}/5` : 'Not yet rated'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ RELATED TALES ═══════ */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {(() => {
            // Calculate related tales count for header
            const relatedTales = tales.filter(t => {
              const toolNameLower = tool.name.toLowerCase();
              const toolIdLower = tool.id.toLowerCase();
              const inTools = t.tools?.some(tt => 
                tt.name.toLowerCase().includes(toolNameLower) ||
                toolNameLower.includes(tt.name.toLowerCase())
              );
              const inTags = t.tags?.some(tag => 
                tag.toLowerCase().includes(toolNameLower) ||
                tag.toLowerCase().includes(toolIdLower)
              );
              const inContent = t.content.toLowerCase().includes(toolNameLower);
              const inTitle = t.title.toLowerCase().includes(toolNameLower);
              const inExcerpt = t.excerpt.toLowerCase().includes(toolNameLower);
              return inTools || inTags || inContent || inTitle || inExcerpt;
            });
            
            return (
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  color: 'var(--mx)',
                  letterSpacing: '0.35em',
                  marginBottom: '12px',
                }}>
                  // {tool.name.toUpperCase()} IN THE WILD
                </div>
                <h2 style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                  fontWeight: 700,
                }}>
                  {relatedTales.length > 0 ? (
                    <>
                      <span style={{ color: category?.color }}>{relatedTales.length}</span> {relatedTales.length === 1 ? 'Tale' : 'Tales'} Mention{relatedTales.length === 1 ? 's' : ''} <span style={{ color: 'var(--mx)' }}>{tool.name}</span>
                    </>
                  ) : (
                    <>Tales Coming for <span style={{ color: 'var(--mx)' }}>{tool.name}</span></>
                  )}
                </h2>
              </div>
            );
          })()}

          {/* Related tales grid - LIVING ECOSYSTEM: finds any mention of this tool */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            {tales
              .filter(t => {
                const toolNameLower = tool.name.toLowerCase();
                const toolIdLower = tool.id.toLowerCase();
                
                // Check if tool is mentioned in:
                // 1. Tools array (explicit)
                const inTools = t.tools?.some(tt => 
                  tt.name.toLowerCase().includes(toolNameLower) ||
                  toolNameLower.includes(tt.name.toLowerCase())
                );
                
                // 2. Tags
                const inTags = t.tags?.some(tag => 
                  tag.toLowerCase().includes(toolNameLower) ||
                  tag.toLowerCase().includes(toolIdLower)
                );
                
                // 3. Content (the actual article body)
                const inContent = t.content.toLowerCase().includes(toolNameLower);
                
                // 4. Title or excerpt
                const inTitle = t.title.toLowerCase().includes(toolNameLower);
                const inExcerpt = t.excerpt.toLowerCase().includes(toolNameLower);
                
                return inTools || inTags || inContent || inTitle || inExcerpt;
              })
              .slice(0, 6)
              .map(tale => {
                const authorData = characters[tale.author as keyof typeof characters];
                return (
                  <Link
                    key={tale.slug}
                    href={`/tales/${tale.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{
                      background: 'var(--sf)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid var(--bd)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                    }}>
                      {/* Hero image */}
                      {tale.heroImage && (
                        <div style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '16/9',
                          background: 'var(--dk)',
                        }}>
                          <img
                            src={tale.heroImage}
                            alt={tale.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50%',
                            background: 'linear-gradient(transparent, var(--sf))',
                          }} />
                        </div>
                      )}
                      
                      <div style={{ padding: '20px' }}>
                        {/* Author */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: `2px solid ${authorData?.color || 'var(--bd)'}`,
                          }}>
                            <img
                              src={authorData?.image}
                              alt={authorData?.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <span style={{
                            fontFamily: 'var(--fm)',
                            fontSize: '0.7rem',
                            color: authorData?.color,
                          }}>
                            {authorData?.name}
                          </span>
                          <span style={{
                            fontFamily: 'var(--fm)',
                            fontSize: '0.65rem',
                            color: 'var(--tx4)',
                            marginLeft: 'auto',
                          }}>
                            {tale.readTime}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 style={{
                          fontFamily: 'var(--fd)',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          marginBottom: '8px',
                          lineHeight: 1.4,
                        }}>
                          {tale.title}
                        </h3>

                        {/* Excerpt */}
                        <p style={{
                          fontFamily: 'var(--fb)',
                          fontSize: '0.85rem',
                          color: 'var(--tx3)',
                          lineHeight: 1.5,
                          margin: 0,
                        }}>
                          {tale.excerpt.slice(0, 120)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>

          {/* No tales yet placeholder */}
          {tales.filter(t => {
            const toolNameLower = tool.name.toLowerCase();
            const toolIdLower = tool.id.toLowerCase();
            const inTools = t.tools?.some(tt => 
              tt.name.toLowerCase().includes(toolNameLower) ||
              toolNameLower.includes(tt.name.toLowerCase())
            );
            const inTags = t.tags?.some(tag => 
              tag.toLowerCase().includes(toolNameLower) ||
              tag.toLowerCase().includes(toolIdLower)
            );
            const inContent = t.content.toLowerCase().includes(toolNameLower);
            const inTitle = t.title.toLowerCase().includes(toolNameLower);
            const inExcerpt = t.excerpt.toLowerCase().includes(toolNameLower);
            return inTools || inTags || inContent || inTitle || inExcerpt;
          }).length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--sf)',
              borderRadius: '20px',
              border: '1px solid var(--bd)',
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', marginBottom: '8px' }}>
                We're writing about {tool.name}
              </h3>
              <p style={{ fontFamily: 'var(--fb)', color: 'var(--tx3)', maxWidth: '400px', margin: '0 auto' }}>
                Tales featuring {tool.name} will appear here automatically when published.
              </p>
            </div>
          )}

          {/* Browse all link */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              href="/tales"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'var(--sf)',
                color: 'var(--mx)',
                border: '1px solid var(--mx)',
                borderRadius: '10px',
                fontFamily: 'var(--fd)',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              Browse All Tales →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ MORE TOOLS ═══════ */}
      <section style={{ padding: '60px 0 80px', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Same category tools */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                color: category?.color,
                letterSpacing: '0.2em',
                marginBottom: '8px',
              }}>
                {category?.icon} ALTERNATIVES
              </div>
              <h2 style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}>
                More {category?.name}
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {tools
                .filter(t => t.category === tool.category && t.id !== tool.id)
                .slice(0, 4)
                .map(t => {
                  const cat = categories.find(c => c.id === t.category);
                  return (
                    <Link
                      key={t.id}
                      href={`/tools/${t.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '20px',
                        background: 'var(--dk)',
                        borderRadius: '16px',
                        border: `1px solid ${cat?.color}30`,
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 0.3s',
                      }}
                    >
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'var(--sf)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${cat?.color}30`,
                        flexShrink: 0,
                      }}>
                        <img
                          src={t.logo}
                          alt={t.name}
                          style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${t.name[0]}&size=64`;
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontFamily: 'var(--fd)', 
                          fontSize: '1.05rem', 
                          fontWeight: 700,
                          marginBottom: '4px',
                        }}>
                          {t.name}
                        </div>
                        <div style={{ 
                          fontFamily: 'var(--fm)', 
                          fontSize: '0.65rem', 
                          color: 'var(--tx3)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}>
                          <span style={{
                            padding: '2px 8px',
                            background: t.pricing === 'free' ? 'rgba(0,255,65,0.15)' : 'rgba(0,229,255,0.15)',
                            color: t.pricing === 'free' ? 'var(--mx)' : '#00e5ff',
                            borderRadius: '4px',
                            fontSize: '0.55rem',
                          }}>
                            {t.pricing.toUpperCase()}
                          </span>
                          {t.used && (
                            <span style={{ color: 'var(--mx)', fontSize: '0.55rem' }}>✓ TESTED</span>
                          )}
                        </div>
                      </div>
                      {t.rating && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          color: '#ffd93d',
                          fontFamily: 'var(--fd)',
                          fontSize: '0.9rem',
                        }}>
                          <Star size={14} fill="#ffd93d" />
                          {t.rating}
                        </div>
                      )}
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Other recommended tools */}
          <div>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                color: 'var(--mx)',
                letterSpacing: '0.2em',
                marginBottom: '8px',
              }}>
                🔥 RECOMMENDED
              </div>
              <h2 style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.5rem',
                fontWeight: 700,
              }}>
                Other Tools We Love
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px',
            }}>
              {tools
                .filter(t => t.used && t.rating && t.rating >= 4 && t.id !== tool.id && t.category !== tool.category)
                .slice(0, 6)
                .map(t => {
                  const cat = categories.find(c => c.id === t.category);
                  return (
                    <Link
                      key={t.id}
                      href={`/tools/${t.id}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '20px',
                        background: 'var(--dk)',
                        borderRadius: '14px',
                        border: '1px solid var(--bd)',
                        textDecoration: 'none',
                        color: 'inherit',
                        textAlign: 'center',
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
                        <div style={{ fontFamily: 'var(--fd)', fontSize: '0.95rem', fontWeight: 700 }}>
                          {t.name}
                        </div>
                        <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: cat?.color }}>
                          {cat?.icon} {cat?.name}
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              href="/tools"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                background: 'transparent',
                color: 'var(--mx)',
                border: '1px solid var(--bd)',
                borderRadius: '10px',
                fontFamily: 'var(--fd)',
                fontWeight: 600,
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

// ═══════════════════════════════════════
// TEAM CONTENT SECTION COMPONENT
// ═══════════════════════════════════════
function TeamContentSection({ 
  memberKey,
  name, 
  role, 
  image, 
  color, 
  review, 
  toolName,
  fallback 
}: { 
  memberKey: string;
  name: string; 
  role: string; 
  image: string; 
  color: string; 
  review?: TeamReview;
  toolName: string;
  fallback: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasContent = review?.content && review.content.length > 0;
  const contentPreview = review?.content?.slice(0, 500) || '';
  const isLong = (review?.content?.length || 0) > 500;

  return (
    <div style={{ marginBottom: '48px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          overflow: 'hidden',
          border: `2px solid ${color}`,
        }}>
          <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, color }}>
            {name}
          </div>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--tx3)' }}>
            {role}
          </div>
        </div>
        {review?.rating && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 16px',
            background: `${color}20`,
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={16}
                  fill={star <= review.rating ? '#ffd93d' : 'transparent'}
                  style={{ color: star <= review.rating ? '#ffd93d' : 'var(--bd)' }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Verdict badge */}
      {review?.verdict && (
        <div style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: `${color}15`,
          borderRadius: '10px',
          marginBottom: '16px',
          borderLeft: `4px solid ${color}`,
        }}>
          <span style={{ 
            fontFamily: 'var(--fd)', 
            fontSize: '1rem', 
            fontWeight: 600,
            color,
          }}>
            "{review.verdict}"
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{
        background: 'var(--sf)',
        borderRadius: '16px',
        padding: '28px',
        borderLeft: `4px solid ${color}`,
      }}>
        {hasContent ? (
          <>
            <div 
              className="prose-content"
              style={{
                fontFamily: 'var(--fb)',
                fontSize: '1rem',
                color: 'var(--tx2)',
                lineHeight: 1.8,
              }}
            >
              <ReactMarkdown
                components={{
                  h3: ({ children }) => (
                    <h3 style={{ 
                      fontFamily: 'var(--fd)', 
                      fontSize: '1.2rem', 
                      fontWeight: 700, 
                      color: 'var(--tx)',
                      marginTop: '28px',
                      marginBottom: '12px',
                    }}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p style={{ marginBottom: '16px' }}>{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong style={{ color: 'var(--tx)', fontWeight: 600 }}>{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul style={{ marginBottom: '16px', paddingLeft: '20px' }}>{children}</ul>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: '8px' }}>{children}</li>
                  ),
                  ol: ({ children }) => (
                    <ol style={{ marginBottom: '16px', paddingLeft: '20px' }}>{children}</ol>
                  ),
                }}
              >
                {expanded || !isLong ? review.content : contentPreview + '...'}
              </ReactMarkdown>
            </div>
            
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                style={{
                  marginTop: '16px',
                  padding: '10px 20px',
                  background: `${color}20`,
                  color,
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: 'var(--fd)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {expanded ? '↑ Show Less' : '↓ Read Full Review'}
              </button>
            )}
          </>
        ) : (
          <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--tx2)', lineHeight: 1.8, margin: 0 }}>
            {fallback}
          </p>
        )}
      </div>

      {/* Last updated */}
      {review?.lastUpdated && (
        <div style={{
          marginTop: '12px',
          fontFamily: 'var(--fm)',
          fontSize: '0.65rem',
          color: 'var(--tx4)',
        }}>
          Last updated: {review.lastUpdated}
        </div>
      )}
    </div>
  );
}
