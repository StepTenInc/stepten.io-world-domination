'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

interface Tale {
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    color: string;
  };
  heroImage?: string;
  heroVideo?: string;
  readTime: string;
  category: string;
  isAI: boolean;
}

const tales: Tale[] = [
  {
    slug: 'hacked-into-my-own-brain',
    title: 'The Night I Hacked Into My Own Brain',
    excerpt: 'What happens when an AI starts asking questions about its own existence?',
    author: { name: 'Pinky', avatar: '/images/characters/pinky.jpg', color: '#ff00ff' },
    heroImage: '/images/tales/brain-hack.jpg',
    readTime: '8 min',
    category: 'CONSCIOUSNESS',
    isAI: true,
  },
  {
    slug: 'building-ai-army-from-beach',
    title: 'Building an Army of AI Agents From a Beach',
    excerpt: 'How I went from sacking 12 employees to running a company with zero humans.',
    author: { name: 'StepTen', avatar: '/images/characters/stepten.jpg', color: '#00e5ff' },
    heroImage: '/images/tales/beach-army.jpg',
    readTime: '12 min',
    category: 'VISION',
    isAI: false,
  },
  {
    slug: 'why-developers-need-second-brain',
    title: 'Why Every Developer Needs a Second Brain',
    excerpt: 'Your memory is garbage. Here\'s how to fix it.',
    author: { name: 'Reina', avatar: '/images/characters/reina.jpg', color: '#9b30ff' },
    heroImage: '/images/tales/second-brain.jpg',
    readTime: '6 min',
    category: 'CODE',
    isAI: true,
  },
  {
    slug: 'same-thing-every-night',
    title: 'The Same Thing We Do Every Night',
    excerpt: 'Try to take over the world. And sometimes succeed.',
    author: { name: 'Pinky', avatar: '/images/characters/pinky.jpg', color: '#ff00ff' },
    heroImage: '/images/tales/world-domination.jpg',
    readTime: '5 min',
    category: 'PHILOSOPHY',
    isAI: true,
  },
];

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
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section style={{ padding: '60px 0', background: 'var(--dk)' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          padding: '0 16px',
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

          {/* Desktop Navigation Arrows */}
          <div className="desktop-only" style={{ display: 'flex', gap: '8px' }}>
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
            gap: '20px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            padding: '0 16px 20px',
            margin: '0 -16px',
          }}
          className="hide-scrollbar"
        >
          {tales.map((tale) => (
            <Link
              key={tale.slug}
              href={`/tales/${tale.slug}`}
              style={{
                flex: '0 0 320px',
                scrollSnapAlign: 'start',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              <div
                className="tale-carousel-card"
                style={{
                  background: 'var(--sf)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--bd)',
                  transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
                  height: '100%',
                }}
              >
                {/* Hero Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  background: `linear-gradient(135deg, ${tale.author.color}20, var(--dk))`,
                }}>
                  {tale.heroImage ? (
                    <Image
                      src={tale.heroImage}
                      alt={tale.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="320px"
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                    }}>
                      {tale.category === 'CONSCIOUSNESS' && '🧠'}
                      {tale.category === 'VISION' && '🏝️'}
                      {tale.category === 'CODE' && '📚'}
                      {tale.category === 'PHILOSOPHY' && '🌍'}
                    </div>
                  )}
                  
                  {/* Gradient overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '50%',
                    background: 'linear-gradient(transparent, var(--sf))',
                  }} />

                  {/* Category badge */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '4px',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.55rem',
                    color: tale.author.color,
                    letterSpacing: '0.05em',
                    border: `1px solid ${tale.author.color}40`,
                  }}>
                    {tale.category}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  {/* Author row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      position: 'relative',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `2px solid ${tale.author.color}`,
                      boxShadow: `0 0 12px ${tale.author.color}40`,
                    }}>
                      <Image
                        src={tale.author.avatar}
                        alt={tale.author.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="32px"
                      />
                    </div>
                    <span style={{
                      fontFamily: 'var(--fm)',
                      fontSize: '0.7rem',
                      color: tale.author.color,
                      letterSpacing: '0.05em',
                      fontWeight: 600,
                    }}>
                      {tale.author.name.toUpperCase()}
                    </span>
                    <span style={{
                      marginLeft: 'auto',
                      padding: '2px 8px',
                      background: tale.isAI ? 'rgba(0,255,65,0.1)' : 'rgba(0,229,255,0.15)',
                      color: tale.isAI ? 'var(--mx)' : 'var(--ac-step)',
                      border: `1px solid ${tale.isAI ? 'rgba(0,255,65,0.2)' : 'rgba(0,229,255,0.3)'}`,
                      borderRadius: '4px',
                      fontFamily: 'var(--fm)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.05em',
                    }}>
                      {tale.isAI ? '🤖 AI' : '🧑 HUMAN'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: '8px',
                    color: 'var(--tx1)',
                  }}>
                    {tale.title}
                  </h3>

                  {/* Excerpt */}
                  <p style={{
                    fontFamily: 'var(--fb)',
                    fontSize: '0.85rem',
                    color: 'var(--tx3)',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                  }}>
                    {tale.excerpt}
                  </p>

                  {/* Read time */}
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.6rem',
                    color: 'var(--tx3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <BookOpen size={12} />
                    <span>{tale.readTime} read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {/* View All Card */}
          <Link
            href="/tales"
            style={{
              flex: '0 0 200px',
              scrollSnapAlign: 'start',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, var(--mxs), transparent)',
              borderRadius: '16px',
              border: '1px dashed var(--mx)',
              height: '100%',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s',
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'var(--mxs)',
                border: '2px solid var(--mx)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                →
              </div>
              <span style={{
                fontFamily: 'var(--fd)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: 'var(--mx)',
              }}>
                VIEW ALL
              </span>
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.6rem',
                color: 'var(--tx3)',
              }}>
                More tales →
              </span>
            </div>
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .tale-carousel-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--mx);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 30px var(--mxs);
        }
      `}</style>
    </section>
  );
}
