'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Tale } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';
import { Download, Clock, Calendar, ChevronUp, ExternalLink, Tag } from 'lucide-react';

interface TaleContentProps {
  tale: Tale;
  allTales: Tale[];
}

export function TaleContent({ tale, allTales }: TaleContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Create image map for insertion after sections
  const imageMap = new Map<string, { url: string; alt: string }>();
  tale.images?.forEach(img => {
    if (img.afterSection) {
      imageMap.set(img.afterSection, { url: img.url, alt: img.alt });
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((scrollTop / docHeight) * 100);
      setShowBackToTop(scrollTop > 500);
      
      // Update active section
      const sections = document.querySelectorAll('h2[id]');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 0) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render content with images
  const renderContent = () => {
    const blocks = tale.content.split('\n\n');
    const elements: React.ReactNode[] = [];
    let currentSectionTitle = '';
    
    blocks.forEach((block, i) => {
      // Horizontal rule
      if (block.trim() === '---') {
        elements.push(
          <div key={`hr-${i}`} style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${author.color}40, transparent)`,
            margin: '48px 0',
          }} />
        );
        return;
      }
      
      // H2 headers
      if (block.startsWith('## ')) {
        // Check if previous section had an image
        if (currentSectionTitle && imageMap.has(currentSectionTitle)) {
          const img = imageMap.get(currentSectionTitle)!;
          elements.push(
            <div key={`img-${currentSectionTitle}`} style={{
              margin: '40px 0',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--bd)',
              position: 'relative',
              aspectRatio: '16/9',
            }} className="tale-image">
              <Image src={img.url} alt={img.alt} fill style={{ objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 16px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                fontFamily: 'var(--fm)',
                fontSize: '0.7rem',
                color: 'var(--tx3)',
              }}>
                {img.alt}
              </div>
            </div>
          );
        }
        
        const text = block.slice(3);
        currentSectionTitle = text;
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h2 key={`h2-${i}`} id={id} style={{
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
          }} className="tale-heading">
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: '4px',
              height: '70%',
              background: author.color,
              borderRadius: '2px',
            }} />
            {text}
          </h2>
        );
        return;
      }
      
      // H3 headers
      if (block.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} style={{
            fontFamily: 'var(--fd)',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: author.color,
            marginTop: '40px',
            marginBottom: '16px',
          }}>
            {block.slice(4)}
          </h3>
        );
        return;
      }
      
      // Q&A blocks
      if (block.startsWith('**Q:')) {
        elements.push(
          <div key={`qa-${i}`} style={{
            background: 'var(--sf)',
            border: '1px solid var(--bd)',
            borderLeft: `3px solid ${author.color}`,
            borderRadius: '0 12px 12px 0',
            padding: '20px 24px',
            marginBottom: '20px',
          }}>
            <div 
              style={{
                fontFamily: 'var(--fd)',
                fontSize: '1rem',
                fontWeight: 600,
                color: author.color,
                marginBottom: '12px',
              }}
              dangerouslySetInnerHTML={{ __html: block.replace(/\*\*/g, '') }}
            />
          </div>
        );
        return;
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
        elements.push(
          <p key={`p-${i}`} style={{
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
              color: author.color,
              textShadow: `0 0 30px ${author.color}40`,
            }}>
              {firstChar}
            </span>
            <span dangerouslySetInnerHTML={{ __html: rest }} />
          </p>
        );
        return;
      }
      
      elements.push(
        <p key={`p-${i}`} style={{
          fontFamily: 'var(--fb)',
          fontSize: '1.1rem',
          lineHeight: 1.85,
          color: 'var(--tx2)',
          marginBottom: '24px',
        }} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
    
    // Check for image after last section
    if (currentSectionTitle && imageMap.has(currentSectionTitle)) {
      const img = imageMap.get(currentSectionTitle)!;
      elements.push(
        <div key={`img-final`} style={{
          margin: '40px 0',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--bd)',
          position: 'relative',
          aspectRatio: '16/9',
        }} className="tale-image">
          <Image src={img.url} alt={img.alt} fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '12px 16px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: 'var(--tx3)',
          }}>
            {img.alt}
          </div>
        </div>
      );
    }
    
    return elements;
  };

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

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(300px, 50vh, 500px)',
        overflow: 'hidden',
      }}>
        {tale.heroVideo ? (
          <video autoPlay loop muted playsInline style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          }}>
            <source src={tale.heroVideo} type="video/mp4" />
          </video>
        ) : tale.heroImage ? (
          <Image src={tale.heroImage} alt={tale.title} fill style={{ objectFit: 'cover' }} priority />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, var(--dk), ${author.color}20)`,
          }} />
        )}
        
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 30%, var(--bk) 100%)`,
        }} />
        
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px',
          maxWidth: '1400px', margin: '0 auto',
        }}>
          <div style={{
            display: 'inline-block', fontFamily: 'var(--fm)', fontSize: '0.6rem',
            letterSpacing: '0.15em', padding: '6px 14px',
            background: `${author.color}20`, border: `1px solid ${author.color}40`,
            borderRadius: '4px', color: author.color, marginBottom: '16px',
          }}>
            {tale.category.replace('_', ' ')}
          </div>
          
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 800, lineHeight: 1.15, color: 'var(--tx)',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)', maxWidth: '900px',
          }}>
            {tale.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: '1fr 320px', gap: '60px',
      }} className="tale-layout">
        
        {/* Article */}
        <article ref={contentRef} style={{ minWidth: 0 }}>
          
          {/* Author & Meta */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '20px', padding: '24px 0',
            borderBottom: '1px solid var(--bd)', marginBottom: '40px',
          }}>
            <Link href={`/team/${tale.author}`} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{
                position: 'relative', width: '52px', height: '52px', borderRadius: '50%',
                overflow: 'hidden', border: `2px solid ${author.color}`,
                boxShadow: `0 0 20px ${author.glow}`,
              }}>
                <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '0.9rem', fontWeight: 700, color: author.color }}>
                  {author.name}
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--tx3)' }}>
                  {isHuman ? '🧑 HUMAN' : '🤖 AI'} · {author.role}
                </div>
              </div>
            </Link>
            
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} /> {tale.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {tale.readTime}
              </span>
              {tale.isPillar && (
                <span style={{
                  padding: '4px 10px', background: 'rgba(255,215,0,0.15)',
                  border: '1px solid rgba(255,215,0,0.3)', borderRadius: '4px',
                  color: '#ffd700', fontSize: '0.6rem',
                }}>
                  PILLAR
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div style={{ paddingBottom: '60px' }}>
            {renderContent()}
          </div>

          {/* Tags */}
          {tale.tags && tale.tags.length > 0 && (
            <div style={{
              padding: '24px 0', borderTop: '1px solid var(--bd)',
              display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center',
            }}>
              <Tag size={16} style={{ color: 'var(--tx3)', marginRight: '8px' }} />
              {tale.tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)',
                  padding: '4px 12px', background: 'var(--sf)', border: '1px solid var(--bd)',
                  borderRadius: '16px',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{
            padding: '32px 0', borderTop: '1px solid var(--bd)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <Link href="/tales" style={{
              fontFamily: 'var(--fm)', fontSize: '0.75rem', color: 'var(--mx)',
              textDecoration: 'none', letterSpacing: '0.05em',
            }}>
              ← ALL TALES
            </Link>
            <Link href={`/team/${tale.author}`} style={{
              fontFamily: 'var(--fm)', fontSize: '0.75rem', color: author.color,
              textDecoration: 'none', letterSpacing: '0.05em',
            }}>
              MORE FROM {author.name.toUpperCase()} →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside style={{
          position: 'sticky', top: '100px', height: 'fit-content',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }} className="tale-sidebar">
          
          {/* TOC */}
          <div style={{
            background: 'var(--sf)', border: '1px solid var(--bd)',
            borderRadius: '16px', padding: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.15em',
              color: 'var(--mx)', marginBottom: '16px',
            }}>
              // ON THIS PAGE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {headings.map((h, i) => (
                <a key={i} href={`#${h.id}`} style={{
                  fontFamily: 'var(--fb)', fontSize: '0.85rem',
                  color: activeSection === h.id ? author.color : 'var(--tx3)',
                  textDecoration: 'none', padding: '8px 0 8px 12px',
                  borderLeft: `2px solid ${activeSection === h.id ? author.color : 'var(--bd)'}`,
                  transition: 'all 0.2s ease',
                  background: activeSection === h.id ? `${author.color}10` : 'transparent',
                }}>
                  {h.text}
                </a>
              ))}
            </div>
          </div>

          {/* Tools Mentioned */}
          {tale.tools && tale.tools.length > 0 && (
            <div style={{
              background: `linear-gradient(135deg, ${author.color}10, var(--sf))`,
              border: `1px solid ${author.color}30`, borderRadius: '16px', padding: '24px',
            }}>
              <div style={{
                fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.15em',
                color: author.color, marginBottom: '16px',
              }}>
                // TOOLS MENTIONED
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tale.tools.map((tool, i) => (
                  <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', background: 'var(--dk)', borderRadius: '8px',
                    textDecoration: 'none', color: 'var(--tx)', fontFamily: 'var(--fd)',
                    fontSize: '0.85rem', fontWeight: 600, transition: 'transform 0.2s ease',
                  }} className="tool-link">
                    {tool.name}
                    <ExternalLink size={14} style={{ color: 'var(--tx3)' }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Downloads */}
          <div style={{
            background: 'var(--sf)', border: '1px solid var(--bd)',
            borderRadius: '16px', padding: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.15em',
              color: 'var(--mx)', marginBottom: '16px',
            }}>
              // RESOURCES
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px', background: 'var(--dk)', borderRadius: '10px',
              cursor: 'pointer', opacity: 0.6,
            }}>
              <Download size={20} style={{ color: 'var(--mx)' }} />
              <div>
                <div style={{
                  fontFamily: 'var(--fd)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--tx)',
                }}>
                  AI Coding Roadmap
                </div>
                <div style={{
                  fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--tx3)',
                }}>
                  PDF Guide • Coming Soon
                </div>
              </div>
            </div>
          </div>

          {/* Related */}
          {relatedTales.length > 0 && (
            <div style={{
              background: 'var(--sf)', border: '1px solid var(--bd)',
              borderRadius: '16px', padding: '24px',
            }}>
              <div style={{
                fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.15em',
                color: 'var(--mx)', marginBottom: '16px',
              }}>
                // RELATED
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {relatedTales.map(rt => {
                  const rtAuthor = characters[rt.author];
                  return (
                    <Link key={rt.slug} href={`/tales/${rt.slug}`} style={{
                      display: 'flex', gap: '12px', textDecoration: 'none', color: 'inherit',
                    }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden',
                        flexShrink: 0, border: `1px solid ${rtAuthor.color}40`, background: 'var(--dk)',
                      }}>
                        {rt.heroImage && (
                          <Image src={rt.heroImage} alt={rt.title} width={48} height={48} style={{ objectFit: 'cover' }} />
                        )}
                      </div>
                      <div>
                        <div style={{
                          fontFamily: 'var(--fd)', fontSize: '0.8rem', fontWeight: 600,
                          color: 'var(--tx)', lineHeight: 1.3, marginBottom: '4px',
                        }}>
                          {rt.title.length > 50 ? rt.title.slice(0, 50) + '...' : rt.title}
                        </div>
                        <div style={{
                          fontFamily: 'var(--fm)', fontSize: '0.6rem', color: rtAuthor.color,
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
        </aside>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', width: '48px', height: '48px',
            borderRadius: '50%', background: author.color, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 20px ${author.glow}`, zIndex: 100,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <ChevronUp size={24} color="var(--bk)" />
        </button>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .tale-heading {
          animation: slideIn 0.5s ease;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .tale-image {
          animation: fadeIn 0.6s ease;
        }
        
        .tool-link:hover {
          transform: translateX(4px);
        }
        
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
