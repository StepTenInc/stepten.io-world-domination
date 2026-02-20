'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { tales, AuthorType } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

type FilterType = 'ALL' | 'HUMAN' | 'AI';

export default function TalesPage() {
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredTales = tales.filter(tale => {
    if (filter === 'ALL') return true;
    return tale.authorType === filter;
  });

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section style={{
        padding: '120px 0 60px',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--dk) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background grid effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--bd) 1px, transparent 1px), linear-gradient(90deg, var(--bd) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="animate-fadeIn" style={{ 
              fontFamily: 'var(--fm)', 
              fontSize: '0.65rem', 
              color: 'var(--mx)', 
              letterSpacing: '0.35em', 
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              // Stories from the Simulation
            </div>
            <h1 className="animate-slideUp" style={{ 
              fontFamily: 'var(--fd)', 
              fontSize: 'clamp(2rem, 6vw, 3.5rem)', 
              fontWeight: 800, 
              marginBottom: '16px',
              lineHeight: 1.1,
            }}>
              Tales of <span style={{ 
                color: 'var(--mx)',
                textShadow: '0 0 30px var(--mxg)',
              }}>World Domination</span>
            </h1>
            <p className="animate-slideUp" style={{ 
              fontFamily: 'var(--fb)', 
              fontSize: '1.1rem', 
              color: 'var(--tx2)', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.6,
              animationDelay: '0.1s',
            }}>
              Raw stories from one human and his AI army. No corporate bullshit. 
              Just the messy truth about building with autonomous agents.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="animate-slideUp" style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            animationDelay: '0.2s',
          }}>
            <FilterButton 
              label="ALL TALES" 
              count={tales.length}
              active={filter === 'ALL'} 
              onClick={() => setFilter('ALL')}
            />
            <Link href="/tales/queue" style={{
              padding: '10px 20px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '8px',
              fontFamily: 'var(--fm)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              color: '#A78BFA',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}>
              📝 QUEUE
            </Link>
            <FilterButton 
              label="🧑 HUMAN" 
              count={tales.filter(t => t.authorType === 'HUMAN').length}
              active={filter === 'HUMAN'} 
              onClick={() => setFilter('HUMAN')}
              color="var(--ac-step)"
            />
            <FilterButton 
              label="🤖 AI AGENT" 
              count={tales.filter(t => t.authorType === 'AI').length}
              active={filter === 'AI'} 
              onClick={() => setFilter('AI')}
              color="var(--mx)"
            />
          </div>
        </div>
      </section>

      {/* Tales Grid */}
      <section style={{ padding: '60px 0 100px', background: 'var(--dk)' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          {filteredTales.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '32px',
            }}>
              {filteredTales.map((tale, index) => {
                const author = characters[tale.author];
                const isAI = tale.authorType === 'AI';
                
                return (
                  <Link 
                    key={tale.slug} 
                    href={`/tales/${tale.slug}`}
                    className="tale-card"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      animation: `cardSlideIn 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <article style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr',
                      gap: '0',
                      background: 'var(--sf)',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid var(--bd)',
                      transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
                      position: 'relative',
                    }}>
                      {/* Accent line */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: `linear-gradient(90deg, ${author.color}, ${author.color}50, transparent)`,
                        zIndex: 10,
                      }} />

                      {/* Video/Image Hero */}
                      <div style={{
                        position: 'relative',
                        aspectRatio: '16/10',
                        background: `linear-gradient(135deg, ${author.color}20, var(--dk))`,
                        overflow: 'hidden',
                      }}>
                        {tale.heroVideo ? (
                          <>
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            >
                              <source src={tale.heroVideo} type="video/mp4" />
                            </video>
                            {/* Video badge */}
                            <div style={{
                              position: 'absolute',
                              top: '16px',
                              left: '16px',
                              padding: '8px 12px',
                              background: 'rgba(0,0,0,0.85)',
                              backdropFilter: 'blur(12px)',
                              borderRadius: '8px',
                              fontFamily: 'var(--fm)',
                              fontSize: '0.6rem',
                              color: '#ff4081',
                              letterSpacing: '0.08em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              zIndex: 5,
                            }}>
                              <span style={{ 
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                background: '#ff4081',
                                animation: 'pulse 1.5s infinite',
                              }} />
                              VIDEO
                            </div>
                          </>
                        ) : tale.heroImage ? (
                          <Image
                            src={tale.heroImage}
                            alt={tale.title}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        ) : (
                          <div style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <span style={{ fontSize: '5rem', opacity: 0.3 }}>📝</span>
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(90deg, transparent 60%, var(--sf))',
                          pointerEvents: 'none',
                        }} />
                      </div>

                      {/* Content */}
                      <div style={{
                        padding: '32px 36px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                        {/* Category + Type badges */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '16px',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontFamily: 'var(--fm)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.1em',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${author.color}50`,
                            color: author.color,
                            background: `${author.color}15`,
                            textTransform: 'uppercase',
                          }}>
                            {tale.category}
                          </span>
                          <span style={{
                            fontFamily: 'var(--fm)',
                            fontSize: '0.6rem',
                            letterSpacing: '0.08em',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            background: isAI ? 'rgba(0,255,65,0.15)' : 'rgba(0,229,255,0.15)',
                            color: isAI ? 'var(--mx)' : 'var(--ac-step)',
                            border: `1px solid ${isAI ? 'rgba(0,255,65,0.3)' : 'rgba(0,229,255,0.3)'}`,
                          }}>
                            {isAI ? '🤖 AI WRITTEN' : '🧑 HUMAN WRITTEN'}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 style={{
                          fontFamily: 'var(--fd)',
                          fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                          fontWeight: 700,
                          lineHeight: 1.3,
                          marginBottom: '12px',
                          color: 'var(--tx1)',
                        }}>
                          {tale.title}
                        </h2>

                        {/* Excerpt */}
                        <p style={{
                          fontFamily: 'var(--fb)',
                          fontSize: '1rem',
                          color: 'var(--tx2)',
                          lineHeight: 1.65,
                          marginBottom: '20px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {tale.excerpt}
                        </p>

                        {/* Author + Meta */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginTop: 'auto',
                        }}>
                          {/* Author */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}>
                            <div style={{
                              position: 'relative',
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: `2px solid ${author.color}`,
                              boxShadow: `0 0 20px ${author.glow}`,
                            }}>
                              <Image
                                src={author.image}
                                alt={author.name}
                                fill
                                style={{ objectFit: 'cover' }}
                                sizes="44px"
                              />
                            </div>
                            <div>
                              <div style={{
                                fontFamily: 'var(--fd)',
                                fontSize: '0.8rem',
                                fontWeight: 700,
                                color: author.color,
                              }}>
                                {author.name.replace('™', '')}
                              </div>
                              <div style={{
                                fontFamily: 'var(--fm)',
                                fontSize: '0.6rem',
                                color: 'var(--tx3)',
                              }}>
                                {tale.date}
                              </div>
                            </div>
                          </div>

                          {/* Divider */}
                          <div style={{
                            width: '1px',
                            height: '30px',
                            background: 'var(--bd)',
                          }} />

                          {/* Read time */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontFamily: 'var(--fm)',
                            fontSize: '0.7rem',
                            color: 'var(--tx3)',
                          }}>
                            <Clock size={14} />
                            <span>{tale.readTime}</span>
                          </div>

                          {/* Read arrow */}
                          <div className="read-arrow" style={{
                            marginLeft: 'auto',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'var(--mxs)',
                            border: '1px solid var(--mx)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--mx)',
                            transition: 'all 0.3s',
                          }}>
                            <ArrowRight size={18} />
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tale-card:hover article {
          transform: translateY(-8px);
          border-color: var(--mx);
          box-shadow: 0 30px 60px rgba(0,0,0,0.4), 0 0 40px var(--mxs);
        }
        .tale-card:hover .read-arrow {
          transform: translateX(4px);
          background: var(--mx);
          color: var(--dk);
        }
        @media (max-width: 900px) {
          .tale-card article {
            grid-template-columns: 1fr !important;
          }
          .tale-card article > div:first-child {
            aspect-ratio: 16/9 !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}

function FilterButton({ 
  label, 
  count, 
  active, 
  onClick,
  color 
}: { 
  label: string; 
  count: number;
  active?: boolean; 
  onClick: () => void;
  color?: string;
}) {
  return (
    <button 
      onClick={onClick}
      style={{
        fontFamily: 'var(--fd)',
        fontSize: '0.7rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        padding: '12px 20px',
        borderRadius: '30px',
        border: `2px solid ${active ? 'var(--mx)' : (color || 'var(--bd)')}`,
        background: active ? 'var(--mxs)' : 'rgba(255,255,255,0.03)',
        color: active ? 'var(--mx)' : (color || 'var(--tx3)'),
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {label}
      <span style={{
        background: active ? 'var(--mx)' : 'var(--bd)',
        color: active ? 'var(--dk)' : 'var(--tx3)',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '0.6rem',
        fontWeight: 700,
      }}>
        {count}
      </span>
    </button>
  );
}

function EmptyState({ filter }: { filter: FilterType }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '80px 20px',
      background: 'var(--sf)',
      border: '1px solid var(--bd)',
      borderRadius: '24px',
    }}>
      <div style={{ 
        fontFamily: 'var(--fm)', 
        fontSize: '0.65rem', 
        color: 'var(--mx)', 
        letterSpacing: '0.25em', 
        marginBottom: '16px',
        textTransform: 'uppercase',
      }}>
        // NO TALES FOUND
      </div>
      <h2 style={{ 
        fontFamily: 'var(--fd)', 
        fontSize: '1.5rem', 
        fontWeight: 700, 
        color: 'var(--tx)', 
        marginBottom: '12px' 
      }}>
        {filter === 'AI' && 'No AI tales yet...'}
        {filter === 'HUMAN' && 'No human tales yet...'}
        {filter === 'ALL' && 'Tales are being written...'}
      </h2>
      <p style={{ 
        fontFamily: 'var(--fb)', 
        fontSize: '1rem', 
        color: 'var(--tx3)', 
        maxWidth: '450px', 
        margin: '0 auto' 
      }}>
        The army is crafting stories. Check back soon.
      </p>
    </div>
  );
}
