'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Tale } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';
import { Download, Clock, Calendar, ChevronUp } from 'lucide-react';

// Markdown-style renderer
function renderContent(content: string, authorColor: string) {
  const blocks = content.split('\n\n');
  
  return blocks.map((block, i) => {
    // Horizontal rule
    if (block.trim() === '---') {
      return (
        <div key={i} style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${authorColor}40, transparent)`,
          margin: '48px 0',
        }} />
      );
    }
    
    // H2 headers
    if (block.startsWith('## ')) {
      const text = block.slice(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return (
        <h2 key={i} id={id} style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
          fontWeight: 700,
          color: 'var(--tx)',
          marginTop: '56px',
          marginBottom: '24px',
          lineHeight: 1.3,
          position: 'relative',
          paddingLeft: '20px',
          scrollMarginTop: '100px',
        }}>
          <span style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: '4px',
            height: '70%',
            background: authorColor,
            borderRadius: '2px',
          }} />
          {text}
        </h2>
      );
    }
    
    // H3 headers
    if (block.startsWith('### ')) {
      return (
        <h3 key={i} style={{
          fontFamily: 'var(--fd)',
          fontSize: '1.2rem',
          fontWeight: 600,
          color: authorColor,
          marginTop: '40px',
          marginBottom: '16px',
        }}>
          {block.slice(4)}
        </h3>
      );
    }
    
    // Q&A blocks
    if (block.startsWith('**Q:')) {
      return (
        <div key={i} style={{
          background: 'var(--sf)',
          border: '1px solid var(--bd)',
          borderLeft: `3px solid ${authorColor}`,
          borderRadius: '0 12px 12px 0',
          padding: '20px 24px',
          marginBottom: '20px',
        }}>
          <div 
            style={{
              fontFamily: 'var(--fd)',
              fontSize: '1rem',
              fontWeight: 600,
              color: authorColor,
              marginBottom: '12px',
            }}
            dangerouslySetInnerHTML={{ __html: block.replace(/\*\*/g, '') }}
          />
        </div>
      );
    }
    
    // Regular paragraph with inline formatting
    const formatted = block
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--tx); font-weight: 600;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, `<code style="background: rgba(0,255,65,0.1); color: var(--mx); padding: 2px 8px; border-radius: 4px; font-family: var(--fm); font-size: 0.9em;">$1</code>`);
    
    // First paragraph gets drop cap
    if (i === 0) {
      const firstChar = block.charAt(0);
      const rest = block.slice(1)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, `<code style="background: rgba(0,255,65,0.1); color: var(--mx); padding: 2px 8px; border-radius: 4px; font-family: var(--fm); font-size: 0.9em;">$1</code>`);
      return (
        <p key={i} style={{
          fontFamily: 'var(--fb)',
          fontSize: '1.15rem',
          lineHeight: 1.9,
          color: 'var(--tx2)',
          marginBottom: '28px',
        }}>
          <span style={{
            fontFamily: 'var(--fd)',
            fontSize: '4rem',
            float: 'left',
            lineHeight: 0.8,
            marginRight: '16px',
            marginTop: '10px',
            color: authorColor,
            textShadow: `0 0 30px ${authorColor}40`,
          }}>
            {firstChar}
          </span>
          <span dangerouslySetInnerHTML={{ __html: rest }} />
        </p>
      );
    }
    
    return (
      <p key={i} style={{
        fontFamily: 'var(--fb)',
        fontSize: '1.1rem',
        lineHeight: 1.85,
        color: 'var(--tx2)',
        marginBottom: '24px',
      }} dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });
}

interface TaleContentProps {
  tale: Tale;
  allTales: Tale[];
}

export function TaleContent({ tale, allTales }: TaleContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const author = characters[tale.author];
  const isHuman = tale.authorType === 'HUMAN';
  
  // Related tales
  const relatedTales = allTales.filter(t => 
    t.slug !== tale.slug && (t.silo === tale.silo || t.category === tale.category)
  ).slice(0, 3);

  // Table of contents
  const headings = tale.content.split('\n\n').filter(b => b.startsWith('## ')).map(h => ({
    text: h.slice(3),
    id: h.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrollTop / docHeight) * 100);
      setShowBackToTop(scrollTop > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PublicLayout>
      {/* Progress bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${scrollProgress}%`,
        background: `linear-gradient(90deg, ${author.color}, var(--mx))`,
        zIndex: 1000,
        transition: 'width 50ms linear',
      }} />

      {/* Hero Section - Full Width */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(300px, 50vh, 500px)',
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
              inset: 0,
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
            priority
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, var(--dk), ${author.color}20)`,
          }} />
        )}
        
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, transparent 30%, var(--bk) 100%)`,
        }} />
        
        {/* Hero content */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '40px',
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'inline-block',
            fontFamily: 'var(--fm)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            padding: '6px 14px',
            background: `${author.color}20`,
            border: `1px solid ${author.color}40`,
            borderRadius: '4px',
            color: author.color,
            marginBottom: '16px',
          }}>
            {tale.category.replace('_', ' ')}
          </div>
          
          <h1 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--tx)',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            maxWidth: '900px',
          }}>
            {tale.title}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '60px',
        position: 'relative',
      }} className="tale-layout">
        
        {/* Article Column */}
        <article style={{ minWidth: 0 }}>
          
          {/* Author & Meta Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '24px 0',
            borderBottom: '1px solid var(--bd)',
            marginBottom: '40px',
          }}>
            <Link href={`/team/${tale.author}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              textDecoration: 'none',
              color: 'inherit',
            }}>
              <div style={{
                position: 'relative',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `2px solid ${author.color}`,
                boxShadow: `0 0 20px ${author.glow}`,
              }}>
                <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: author.color,
                }}>
                  {author.name}
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  color: 'var(--tx3)',
                }}>
                  {isHuman ? '🧑 HUMAN' : '🤖 AI'} · {author.role}
                </div>
              </div>
            </Link>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontFamily: 'var(--fm)',
              fontSize: '0.7rem',
              color: 'var(--tx3)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {tale.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {tale.readTime}
              </span>
              {tale.isPillar && (
                <span style={{
                  padding: '4px 10px',
                  background: 'rgba(255,215,0,0.15)',
                  border: '1px solid rgba(255,215,0,0.3)',
                  borderRadius: '4px',
                  color: '#ffd700',
                  fontSize: '0.6rem',
                }}>
                  PILLAR
                </span>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div style={{ paddingBottom: '60px' }}>
            {renderContent(tale.content, author.color)}
          </div>

          {/* Navigation */}
          <div style={{
            padding: '32px 0',
            borderTop: '1px solid var(--bd)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <Link href="/tales" style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.75rem',
              color: 'var(--mx)',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}>
              ← ALL TALES
            </Link>
            <Link href={`/team/${tale.author}`} style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.75rem',
              color: author.color,
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}>
              MORE FROM {author.name.toUpperCase()} →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{
          position: 'sticky',
          top: '100px',
          height: 'fit-content',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }} className="tale-sidebar">
          
          {/* Table of Contents */}
          <div style={{
            background: 'var(--sf)',
            border: '1px solid var(--bd)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'var(--mx)',
              marginBottom: '16px',
            }}>
              // ON THIS PAGE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {headings.map((h, i) => (
                <a key={i} href={`#${h.id}`} style={{
                  fontFamily: 'var(--fb)',
                  fontSize: '0.85rem',
                  color: 'var(--tx3)',
                  textDecoration: 'none',
                  padding: '6px 0 6px 12px',
                  borderLeft: '2px solid var(--bd)',
                  transition: 'all 0.2s ease',
                }}>
                  {h.text}
                </a>
              ))}
            </div>
          </div>

          {/* Downloads */}
          <div style={{
            background: `linear-gradient(135deg, ${author.color}10, var(--sf))`,
            border: `1px solid ${author.color}30`,
            borderRadius: '16px',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: author.color,
              marginBottom: '16px',
            }}>
              // RESOURCES
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px',
              background: 'var(--dk)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}>
              <Download size={20} style={{ color: author.color }} />
              <div>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--tx)',
                }}>
                  AI Coding Roadmap
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  color: 'var(--tx3)',
                }}>
                  PDF Guide • Coming Soon
                </div>
              </div>
            </div>
          </div>

          {/* Related Tales */}
          {relatedTales.length > 0 && (
            <div style={{
              background: 'var(--sf)',
              border: '1px solid var(--bd)',
              borderRadius: '16px',
              padding: '24px',
            }}>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                color: 'var(--mx)',
                marginBottom: '16px',
              }}>
                // RELATED TALES
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {relatedTales.map(rt => {
                  const rtAuthor = characters[rt.author];
                  return (
                    <Link key={rt.slug} href={`/tales/${rt.slug}`} style={{
                      display: 'flex',
                      gap: '12px',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: `1px solid ${rtAuthor.color}40`,
                        background: 'var(--dk)',
                      }}>
                        {rt.heroImage && (
                          <Image src={rt.heroImage} alt={rt.title} width={48} height={48} style={{ objectFit: 'cover' }} />
                        )}
                      </div>
                      <div>
                        <div style={{
                          fontFamily: 'var(--fd)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'var(--tx)',
                          lineHeight: 1.3,
                          marginBottom: '4px',
                        }}>
                          {rt.title.length > 50 ? rt.title.slice(0, 50) + '...' : rt.title}
                        </div>
                        <div style={{
                          fontFamily: 'var(--fm)',
                          fontSize: '0.6rem',
                          color: rtAuthor.color,
                        }}>
                          {rtAuthor.name} · {rt.readTime}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Newsletter */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,255,65,0.05), var(--sf))',
            border: '1px solid rgba(0,255,65,0.2)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--fd)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--tx)',
              marginBottom: '8px',
            }}>
              Stay in the Loop
            </div>
            <div style={{
              fontFamily: 'var(--fb)',
              fontSize: '0.85rem',
              color: 'var(--tx3)',
              marginBottom: '16px',
            }}>
              New tales and tools delivered weekly.
            </div>
            <div style={{
              padding: '12px 20px',
              background: 'var(--mx)',
              borderRadius: '8px',
              fontFamily: 'var(--fd)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--bk)',
              cursor: 'pointer',
            }}>
              SUBSCRIBE
            </div>
          </div>
        </aside>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: author.color,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${author.glow}`,
            zIndex: 100,
          }}
        >
          <ChevronUp size={24} color="var(--bk)" />
        </button>
      )}

      <style jsx global>{`
        @media (max-width: 1024px) {
          .tale-layout {
            grid-template-columns: 1fr !important;
          }
          .tale-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}
