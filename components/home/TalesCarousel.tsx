'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { tales } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';

export function TalesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Show coming soon state if no tales
  if (tales.length === 0) {
    return (
      <section style={{ padding: '80px 0', background: 'var(--dk)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // TALES COMING SOON
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.3rem, 4vw, 2rem)',
              fontWeight: 700,
              marginBottom: '12px',
            }}>
              Stories from the <span style={{ color: 'var(--mx)' }}>Simulation</span>
            </h2>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '0.95rem',
              color: 'var(--tx3)',
              maxWidth: '450px',
              margin: '0 auto',
            }}>
              The team is writing. First pillar content drops soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '80px 0', background: 'var(--dk)' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '40px',
          padding: '0 20px',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '8px',
            }}>
              // STORIES FROM THE SIMULATION
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: 800,
            }}>
              Latest <span style={{ color: 'var(--mx)' }}>Tales</span>
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: canScrollLeft ? 'var(--mxs)' : 'var(--bg2)',
                border: `1px solid ${canScrollLeft ? 'var(--mx)' : 'var(--br)'}`,
                color: canScrollLeft ? 'var(--mx)' : 'var(--tx3)',
                cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
              }}
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: canScrollRight ? 'var(--mxs)' : 'var(--bg2)',
                border: `1px solid ${canScrollRight ? 'var(--mx)' : 'var(--br)'}`,
                color: canScrollRight ? 'var(--mx)' : 'var(--tx3)',
                cursor: canScrollRight ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                transition: 'all 0.2s',
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            padding: '0 20px 20px',
            margin: '0 -20px',
          }}
          className="hide-scrollbar"
        >
          {tales.map((tale, index) => {
            const author = characters[tale.author];
            const isAI = tale.authorType === 'AI';
            
            return (
              <Link
                key={tale.slug}
                href={`/tales/${tale.slug}`}
                style={{
                  flex: '0 0 380px',
                  scrollSnapAlign: 'start',
                  textDecoration: 'none',
                  color: 'inherit',
                  animation: `fadeSlideIn 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                <div
                  className="tale-carousel-card"
                  style={{
                    background: 'var(--sf)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid var(--bd)',
                    transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {/* Accent top bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${author.color}, transparent)`,
                    zIndex: 10,
                  }} />

                  {/* Hero Video/Image */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    background: `linear-gradient(135deg, ${author.color}30, var(--dk))`,
                    overflow: 'hidden',
                  }}>
                    {tale.heroVideo ? (
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
                    ) : tale.heroImage ? (
                      <Image
                        src={tale.heroImage}
                        alt={tale.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="380px"
                      />
                    ) : (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${author.color}20, var(--dk))`,
                      }}>
                        <span style={{ fontSize: '4rem', opacity: 0.5 }}>📝</span>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60%',
                      background: 'linear-gradient(transparent, var(--sf))',
                      pointerEvents: 'none',
                    }} />

                    {/* Category badge */}
                    <div style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      padding: '6px 12px',
                      background: 'rgba(0,0,0,0.8)',
                      backdropFilter: 'blur(12px)',
                      borderRadius: '6px',
                      fontFamily: 'var(--fm)',
                      fontSize: '0.55rem',
                      color: author.color,
                      letterSpacing: '0.08em',
                      border: `1px solid ${author.color}50`,
                      textTransform: 'uppercase',
                    }}>
                      {tale.category}
                    </div>

                    {/* Video indicator */}
                    {tale.heroVideo && (
                      <div style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        padding: '6px 10px',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '6px',
                        fontFamily: 'var(--fm)',
                        fontSize: '0.55rem',
                        color: '#ff4081',
                        letterSpacing: '0.05em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: '#ff4081',
                          animation: 'pulse 1.5s infinite',
                        }} />
                        VIDEO
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '24px' }}>
                    {/* Author row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    }}>
                      <div style={{
                        position: 'relative',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `2px solid ${author.color}`,
                        boxShadow: `0 0 16px ${author.glow}`,
                      }}>
                        <Image
                          src={author.image}
                          alt={author.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <div style={{
                          fontFamily: 'var(--fd)',
                          fontSize: '0.75rem',
                          color: author.color,
                          letterSpacing: '0.05em',
                          fontWeight: 700,
                        }}>
                          {author.name.replace('™', '').toUpperCase()}
                        </div>
                        <div style={{
                          fontFamily: 'var(--fm)',
                          fontSize: '0.55rem',
                          color: 'var(--tx3)',
                          letterSpacing: '0.03em',
                        }}>
                          {tale.date}
                        </div>
                      </div>
                      <span style={{
                        marginLeft: 'auto',
                        padding: '4px 10px',
                        background: isAI ? 'rgba(0,255,65,0.15)' : 'rgba(0,229,255,0.15)',
                        color: isAI ? 'var(--mx)' : 'var(--ac-step)',
                        border: `1px solid ${isAI ? 'rgba(0,255,65,0.3)' : 'rgba(0,229,255,0.3)'}`,
                        borderRadius: '6px',
                        fontFamily: 'var(--fm)',
                        fontSize: '0.55rem',
                        letterSpacing: '0.05em',
                        fontWeight: 600,
                      }}>
                        {isAI ? '🤖 AI' : '🧑 HUMAN'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={{
                      fontFamily: 'var(--fd)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      lineHeight: 1.35,
                      marginBottom: '10px',
                      color: 'var(--tx1)',
                    }}>
                      {tale.title}
                    </h3>

                    {/* Excerpt */}
                    <p style={{
                      fontFamily: 'var(--fb)',
                      fontSize: '0.9rem',
                      color: 'var(--tx3)',
                      lineHeight: 1.55,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {tale.excerpt}
                    </p>

                    {/* Read time */}
                    <div style={{
                      fontFamily: 'var(--fm)',
                      fontSize: '0.65rem',
                      color: 'var(--tx3)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <BookOpen size={14} />
                      <span>{tale.readTime} read</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* View All Card */}
          <Link
            href="/tales"
            style={{
              flex: '0 0 220px',
              scrollSnapAlign: 'start',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div className="view-all-card" style={{
              background: 'linear-gradient(135deg, var(--mxs), transparent)',
              borderRadius: '20px',
              border: '2px dashed var(--mx)',
              height: '100%',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'var(--mxs)',
                border: '2px solid var(--mx)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                transition: 'transform 0.3s',
              }}>
                →
              </div>
              <span style={{
                fontFamily: 'var(--fd)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--mx)',
              }}>
                VIEW ALL
              </span>
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                color: 'var(--tx3)',
              }}>
                {tales.length} tales →
              </span>
            </div>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        .tale-carousel-card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: var(--mx);
          box-shadow: 0 25px 50px rgba(0,0,0,0.5), 0 0 40px var(--mxs);
        }
        .view-all-card:hover {
          transform: scale(1.05);
          border-color: var(--mx);
          background: linear-gradient(135deg, var(--mxs), rgba(0,255,65,0.1));
        }
        .view-all-card:hover > div:first-child {
          transform: translateX(8px);
        }
      `}</style>
    </section>
  );
}
