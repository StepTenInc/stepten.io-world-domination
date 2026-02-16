'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Tale } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';
import { Download, Clock, Calendar, ChevronUp, ExternalLink, Tag, Menu, X } from 'lucide-react';

interface TaleContentProps {
  tale: Tale;
  allTales: Tale[];
}

// Matrix rain component
function MatrixRain({ color }: { color: string }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.06,
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,255,65,0.03) 2px,
          rgba(0,255,65,0.03) 4px
        )`,
        animation: 'scanline 8s linear infinite',
      }} />
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${i * 5 + Math.random() * 2}%`,
            top: '-100%',
            fontFamily: 'var(--fm)',
            fontSize: '12px',
            color: i % 3 === 0 ? color : 'var(--mx)',
            opacity: 0.4 + Math.random() * 0.4,
            writingMode: 'vertical-rl',
            animation: `fall ${10 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {Array(30).fill(0).map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
        </div>
      ))}
    </div>
  );
}

export function TaleContent({ tale, allTales }: TaleContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const author = characters[tale.author];
  const isHuman = tale.authorType === 'HUMAN';
  
  const relatedTales = allTales.filter(t => 
    t.slug !== tale.slug && (t.silo === tale.silo || t.category === tale.category)
  ).slice(0, 3);

  const headings = tale.content.split('\n\n').filter(b => b.startsWith('## ')).map(h => ({
    text: h.slice(3),
    id: h.slice(3).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));

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

  const renderContent = () => {
    const blocks = tale.content.split('\n\n');
    const elements: React.ReactNode[] = [];
    let currentSectionTitle = '';
    
    blocks.forEach((block, i) => {
      if (block.trim() === '---') {
        elements.push(
          <div key={`hr-${i}`} className="tale-divider" style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${author.color}, var(--mx), ${author.color}, transparent)`,
            margin: '48px 0',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '8px',
              height: '8px',
              background: author.color,
              borderRadius: '50%',
              boxShadow: `0 0 10px ${author.color}`,
            }} />
          </div>
        );
        return;
      }
      
      if (block.startsWith('## ')) {
        if (currentSectionTitle && imageMap.has(currentSectionTitle)) {
          const img = imageMap.get(currentSectionTitle)!;
          elements.push(
            <div key={`img-${currentSectionTitle}`} className="tale-image" style={{
              margin: '48px -40px',
              borderRadius: '0',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '16/9',
              border: `1px solid ${author.color}30`,
            }}>
              <Image src={img.url} alt={img.alt} fill style={{ objectFit: 'cover' }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(to right, ${author.color}20, transparent, ${author.color}20)`,
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '16px 24px',
                background: `linear-gradient(transparent, rgba(0,0,0,0.9))`,
                fontFamily: 'var(--fm)',
                fontSize: '0.75rem',
                color: author.color,
                letterSpacing: '0.05em',
              }}>
                // {img.alt.toUpperCase()}
              </div>
            </div>
          );
        }
        
        const text = block.slice(3);
        currentSectionTitle = text;
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        elements.push(
          <h2 key={`h2-${i}`} id={id} className="tale-heading" style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            color: 'var(--tx)',
            marginTop: '64px',
            marginBottom: '24px',
            lineHeight: 1.2,
            position: 'relative',
            paddingLeft: '24px',
            scrollMarginTop: '100px',
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: `linear-gradient(to bottom, ${author.color}, var(--mx))`,
              borderRadius: '2px',
              boxShadow: `0 0 15px ${author.color}60`,
            }} />
            <span style={{
              position: 'absolute',
              left: '-8px',
              top: '-8px',
              width: '20px',
              height: '20px',
              border: `2px solid ${author.color}`,
              borderRadius: '50%',
              background: 'var(--bk)',
            }}>
              <span style={{
                position: 'absolute',
                inset: '4px',
                background: author.color,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${author.color}`,
              }} />
            </span>
            {text}
          </h2>
        );
        return;
      }
      
      if (block.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} style={{
            fontFamily: 'var(--fd)',
            fontSize: '1.2rem',
            fontWeight: 600,
            color: author.color,
            marginTop: '40px',
            marginBottom: '16px',
            textShadow: `0 0 20px ${author.color}40`,
          }}>
            {block.slice(4)}
          </h3>
        );
        return;
      }
      
      if (block.startsWith('**Q:')) {
        elements.push(
          <div key={`qa-${i}`} style={{
            background: `linear-gradient(135deg, var(--sf), ${author.color}08)`,
            border: '1px solid var(--bd)',
            borderLeft: `4px solid ${author.color}`,
            borderRadius: '0 16px 16px 0',
            padding: '24px 28px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: `radial-gradient(circle, ${author.color}10, transparent)`,
            }} />
            <div 
              style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: author.color,
              }}
              dangerouslySetInnerHTML={{ __html: block.replace(/\*\*/g, '') }}
            />
          </div>
        );
        return;
      }
      
      const formatted = block
        .replace(/\*\*(.+?)\*\*/g, `<strong style="color: ${author.color}; font-weight: 600;">$1</strong>`)
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, `<code style="background: rgba(0,255,65,0.12); color: var(--mx); padding: 3px 10px; border-radius: 4px; font-family: var(--fm); font-size: 0.9em; border: 1px solid rgba(0,255,65,0.2);">$1</code>`);
      
      if (i === 0) {
        const firstChar = block.charAt(0);
        const rest = block.slice(1)
          .replace(/\*\*(.+?)\*\*/g, `<strong style="color: ${author.color};">$1</strong>`)
          .replace(/`(.+?)`/g, `<code style="background: rgba(0,255,65,0.12); color: var(--mx); padding: 3px 10px; border-radius: 4px; font-family: var(--fm); font-size: 0.9em;">$1</code>`);
        elements.push(
          <p key={`p-${i}`} style={{
            fontFamily: 'var(--fb)',
            fontSize: '1.2rem',
            lineHeight: 2,
            color: 'var(--tx2)',
            marginBottom: '32px',
          }}>
            <span style={{
              fontFamily: 'var(--fd)',
              fontSize: '5rem',
              float: 'left',
              lineHeight: 0.75,
              marginRight: '20px',
              marginTop: '12px',
              color: author.color,
              textShadow: `0 0 40px ${author.color}60`,
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
          lineHeight: 1.9,
          color: 'var(--tx2)',
          marginBottom: '28px',
        }} dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
    
    if (currentSectionTitle && imageMap.has(currentSectionTitle)) {
      const img = imageMap.get(currentSectionTitle)!;
      elements.push(
        <div key={`img-final`} className="tale-image" style={{
          margin: '48px -40px',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '16/9',
          border: `1px solid ${author.color}30`,
        }}>
          <Image src={img.url} alt={img.alt} fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px 24px',
            background: `linear-gradient(transparent, rgba(0,0,0,0.9))`,
            fontFamily: 'var(--fm)',
            fontSize: '0.75rem',
            color: author.color,
          }}>
            // {img.alt.toUpperCase()}
          </div>
        </div>
      );
    }
    
    return elements;
  };

  return (
    <PublicLayout>
      {/* Matrix Rain Background */}
      <MatrixRain color={author.color} />
      
      {/* Progress bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${scrollProgress}%`,
        background: `linear-gradient(90deg, ${author.color}, var(--mx), ${author.color})`,
        zIndex: 1001,
        boxShadow: `0 0 20px ${author.color}`,
      }} />

      {/* Mobile TOC Toggle */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-toc-toggle"
        style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'var(--sf)',
          border: `1px solid ${author.color}50`,
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          boxShadow: `0 0 20px ${author.color}30`,
        }}
      >
        {mobileMenuOpen ? <X size={20} color={author.color} /> : <Menu size={20} color={author.color} />}
      </button>

      {/* Mobile TOC Panel */}
      {mobileMenuOpen && (
        <div className="mobile-toc-panel" style={{
          position: 'fixed',
          bottom: '150px',
          right: '20px',
          width: '280px',
          maxHeight: '60vh',
          background: 'var(--sf)',
          border: `1px solid ${author.color}40`,
          borderRadius: '16px',
          padding: '20px',
          zIndex: 99,
          overflowY: 'auto',
          display: 'none',
        }}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: author.color, marginBottom: '16px' }}>
            // SECTIONS
          </div>
          {headings.map((h, i) => (
            <a
              key={i}
              href={`#${h.id}`}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'block',
                fontFamily: 'var(--fb)',
                fontSize: '0.85rem',
                color: activeSection === h.id ? author.color : 'var(--tx3)',
                textDecoration: 'none',
                padding: '10px 0',
                borderBottom: '1px solid var(--bd)',
              }}
            >
              {h.text}
            </a>
          ))}
        </div>
      )}

      {/* Hero Section - 16:9 aspect ratio for videos */}
      <div 
        className={tale.heroVideo ? 'tale-hero-video' : ''}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: tale.heroVideo ? '16/9' : undefined,
          height: tale.heroVideo ? undefined : 'clamp(350px, 55vh, 550px)',
          maxHeight: tale.heroVideo ? '75vh' : undefined,
          overflow: 'hidden',
        }}
      >
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
            background: `linear-gradient(135deg, var(--dk), ${author.color}15)`,
          }} />
        )}
        
        {/* Overlay effects */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, ${author.color}10 0%, transparent 30%, var(--bk) 100%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to right, ${author.color}15, transparent 50%, ${author.color}15)`,
        }} />
        
        {/* Hero content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, padding: '48px',
          maxWidth: '1400px', margin: '0 auto',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            fontFamily: 'var(--fm)', fontSize: '0.65rem',
            letterSpacing: '0.15em', padding: '8px 16px',
            background: `${author.color}20`, border: `1px solid ${author.color}50`,
            borderRadius: '4px', color: author.color, marginBottom: '20px',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: author.color, boxShadow: `0 0 10px ${author.color}`,
              animation: 'pulse 2s infinite',
            }} />
            {tale.category.replace('_', ' ')}
          </div>
          
          <h1 style={{
            fontFamily: 'var(--fd)', fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800, lineHeight: 1.1, color: 'var(--tx)',
            textShadow: `0 2px 40px rgba(0,0,0,0.8), 0 0 60px ${author.color}30`,
            maxWidth: '900px',
          }}>
            {tale.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
        display: 'grid', gridTemplateColumns: '1fr 340px', gap: '80px',
        position: 'relative', zIndex: 1,
      }} className="tale-layout">
        
        {/* Article */}
        <article ref={contentRef} style={{ minWidth: 0, padding: '0 20px' }}>
          
          {/* Author & Meta */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '20px', padding: '28px 0',
            borderBottom: `1px solid ${author.color}30`, marginBottom: '48px',
          }}>
            <Link href={`/team/${tale.author}`} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              textDecoration: 'none', color: 'inherit',
            }}>
              <div style={{
                position: 'relative', width: '56px', height: '56px', borderRadius: '50%',
                overflow: 'hidden', border: `3px solid ${author.color}`,
                boxShadow: `0 0 25px ${author.glow}, inset 0 0 20px ${author.color}30`,
              }}>
                <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700,
                  color: author.color, textShadow: `0 0 20px ${author.color}50`,
                }}>
                  {author.name}
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)' }}>
                  {isHuman ? '🧑 HUMAN' : '🤖 AI'} · {author.role}
                </div>
              </div>
            </Link>
            
            <div style={{
              display: 'flex', alignItems: 'center', gap: '20px',
              fontFamily: 'var(--fm)', fontSize: '0.75rem', color: 'var(--tx3)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={14} style={{ color: author.color }} /> {tale.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={14} style={{ color: author.color }} /> {tale.readTime}
              </span>
              {tale.isPillar && (
                <span style={{
                  padding: '5px 12px', background: `${author.color}20`,
                  border: `1px solid ${author.color}40`, borderRadius: '4px',
                  color: author.color, fontSize: '0.65rem', letterSpacing: '0.08em',
                }}>
                  ⭐ PILLAR
                </span>
              )}
              {tale.steptenScore && (
                <Link href="/tools/stepten-score" style={{
                  padding: '5px 12px', 
                  background: 'linear-gradient(135deg, var(--mx)20, var(--cy)20)',
                  border: '1px solid var(--mx)40', 
                  borderRadius: '4px',
                  color: 'var(--mx)', 
                  fontSize: '0.65rem', 
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  🎯 STEPTEN SCORE: {tale.steptenScore}/100
                </Link>
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
              padding: '28px 0', borderTop: `1px solid ${author.color}20`,
              display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center',
            }}>
              <Tag size={16} style={{ color: author.color, marginRight: '8px' }} />
              {tale.tags.map(tag => (
                <span key={tag} style={{
                  fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)',
                  padding: '6px 14px', background: 'var(--sf)',
                  border: `1px solid ${author.color}30`, borderRadius: '20px',
                  transition: 'all 0.2s ease',
                }} className="tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{
            padding: '32px 0', borderTop: `1px solid ${author.color}20`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <Link href="/tales" style={{
              fontFamily: 'var(--fm)', fontSize: '0.8rem', color: 'var(--mx)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ← ALL TALES
            </Link>
            <Link href={`/team/${tale.author}`} style={{
              fontFamily: 'var(--fm)', fontSize: '0.8rem', color: author.color,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              MORE FROM {author.name.toUpperCase()} →
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="tale-sidebar" style={{
          position: 'sticky', top: '100px', 
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: '28px',
          paddingRight: '8px',
        }}>
          
          {/* TOC */}
          <div style={{
            background: `linear-gradient(135deg, var(--sf), ${author.color}05)`,
            border: `1px solid ${author.color}30`, borderRadius: '20px', padding: '28px',
          }}>
            <div style={{
              fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.2em',
              color: author.color, marginBottom: '20px',
            }}>
              // ON THIS PAGE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {headings.map((h, i) => (
                <a key={i} href={`#${h.id}`} style={{
                  fontFamily: 'var(--fb)', fontSize: '0.85rem',
                  color: activeSection === h.id ? author.color : 'var(--tx3)',
                  textDecoration: 'none', padding: '10px 14px',
                  borderLeft: `2px solid ${activeSection === h.id ? author.color : 'var(--bd)'}`,
                  background: activeSection === h.id ? `${author.color}15` : 'transparent',
                  borderRadius: '0 8px 8px 0',
                  transition: 'all 0.2s ease',
                }}>
                  {h.text}
                </a>
              ))}
            </div>
          </div>

          {/* Tools */}
          {tale.tools && tale.tools.length > 0 && (
            <div style={{
              background: `linear-gradient(135deg, ${author.color}10, var(--sf))`,
              border: `1px solid ${author.color}40`, borderRadius: '20px', padding: '28px',
            }}>
              <div style={{
                fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.2em',
                color: author.color, marginBottom: '20px',
              }}>
                // TOOLS MENTIONED
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tale.tools.map((tool, i) => (
                  <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px', background: 'var(--dk)', borderRadius: '10px',
                    textDecoration: 'none', color: 'var(--tx)', fontFamily: 'var(--fd)',
                    fontSize: '0.85rem', fontWeight: 600, border: `1px solid ${author.color}20`,
                    transition: 'all 0.2s ease',
                  }} className="tool-link">
                    {tool.name}
                    <ExternalLink size={14} style={{ color: author.color }} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* StepTen Score Breakdown - Animated Card */}
          {tale.steptenScoreBreakdown && (
            <div className="stepten-score-card" style={{
              background: 'linear-gradient(135deg, var(--dk), var(--mx)08)',
              border: '1px solid var(--mx)40', borderRadius: '20px', padding: '28px',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Animated glow effect */}
              <div style={{
                position: 'absolute', top: '-50%', right: '-50%',
                width: '100%', height: '100%',
                background: 'radial-gradient(circle, var(--mx)15, transparent 60%)',
                animation: 'pulse 3s ease-in-out infinite',
                pointerEvents: 'none',
              }} />
              
              {/* Score Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '24px', position: 'relative',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--fm)', fontSize: '0.55rem', letterSpacing: '0.2em',
                    color: 'var(--mx)', marginBottom: '4px',
                  }}>
                    // STEPTEN SCORE™
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--tx3)',
                  }}>
                    AI-Powered SEO Analysis
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--fd)', fontSize: '2.2rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--mx), var(--cy))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 20px var(--mx))',
                }}>
                  {tale.steptenScoreBreakdown.total}
                </div>
              </div>
              
              {/* Pillar Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                {[
                  { label: 'Content', icon: '📝', ...tale.steptenScoreBreakdown.contentIntelligence },
                  { label: 'Technical', icon: '⚙️', ...tale.steptenScoreBreakdown.technicalSEO },
                  { label: 'LLM Ready', icon: '🤖', ...tale.steptenScoreBreakdown.llmReadiness },
                  { label: 'Authority', icon: '🔗', ...tale.steptenScoreBreakdown.authorityLinks },
                  { label: 'Distribution', icon: '📢', ...tale.steptenScoreBreakdown.distributionSocial },
                  { label: 'Competitive', icon: '🎯', ...tale.steptenScoreBreakdown.competitivePosition },
                ].map((pillar, i) => (
                  <div 
                    key={i} 
                    className="score-pillar-tab"
                    style={{
                      background: 'var(--sf)', border: '1px solid var(--bd)',
                      borderRadius: '10px', padding: '12px 14px',
                      cursor: 'pointer', transition: 'all 0.2s ease',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>{pillar.icon}</span>
                        <span style={{ fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx2)' }}>
                          {pillar.label}
                        </span>
                      </div>
                      <span style={{ 
                        fontFamily: 'var(--fd)', fontSize: '0.85rem', fontWeight: 700,
                        color: 'var(--mx)',
                      }}>
                        {pillar.score}<span style={{ color: 'var(--tx3)', fontWeight: 400 }}>/{pillar.max}</span>
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div style={{
                      height: '3px', background: 'var(--bd)', borderRadius: '2px', 
                      marginTop: '8px', overflow: 'hidden',
                    }}>
                      <div className="score-bar-fill" style={{
                        height: '100%', width: `${(pillar.score / pillar.max) * 100}%`,
                        background: 'linear-gradient(90deg, var(--mx), var(--cy))',
                        borderRadius: '2px',
                        animation: `barFill 1s ease-out ${i * 0.1}s both`,
                      }} />
                    </div>
                    {/* Hover tooltip */}
                    <div className="pillar-tooltip" style={{
                      position: 'absolute', bottom: '100%', left: '50%',
                      transform: 'translateX(-50%) translateY(10px)',
                      background: 'var(--dk)', border: '1px solid var(--mx)40',
                      borderRadius: '8px', padding: '10px 14px',
                      fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--tx2)',
                      whiteSpace: 'nowrap', opacity: 0, visibility: 'hidden',
                      transition: 'all 0.2s ease', zIndex: 10,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}>
                      {pillar.details}
                    </div>
                  </div>
                ))}
              </div>
              
              <Link href="/tools/stepten-score" className="score-learn-more" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: '20px', padding: '12px 16px',
                background: 'transparent', border: '1px solid var(--mx)40',
                borderRadius: '10px', textDecoration: 'none',
                fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--mx)',
                letterSpacing: '0.1em', transition: 'all 0.2s ease',
              }}>
                <span>LEARN HOW WE SCORE</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          )}

          {/* Downloads */}
          <div style={{
            background: 'var(--sf)', border: '1px solid var(--bd)',
            borderRadius: '20px', padding: '28px',
          }}>
            <div style={{
              fontFamily: 'var(--fm)', fontSize: '0.6rem', letterSpacing: '0.2em',
              color: 'var(--mx)', marginBottom: '20px',
            }}>
              // RESOURCES
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px', background: 'var(--dk)', borderRadius: '12px',
              cursor: 'pointer', opacity: 0.6, border: '1px solid var(--bd)',
            }}>
              <Download size={22} style={{ color: 'var(--mx)' }} />
              <div>
                <div style={{
                  fontFamily: 'var(--fd)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--tx)',
                }}>
                  AI Coding Roadmap
                </div>
                <div style={{
                  fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx3)',
                }}>
                  PDF • Coming Soon
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', width: '52px', height: '52px',
            borderRadius: '14px', background: author.color, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px ${author.glow}`, zIndex: 100,
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <ChevronUp size={26} color="var(--bk)" />
        </button>
      )}

      <style jsx global>{`
        @keyframes fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .tale-heading {
          animation: slideIn 0.5s ease;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .tale-image {
          animation: fadeIn 0.6s ease;
        }
        
        .tool-link:hover {
          transform: translateX(4px);
          border-color: ${author.color}50 !important;
          box-shadow: 0 0 15px ${author.color}30;
        }
        
        .tale-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .tale-sidebar::-webkit-scrollbar-track {
          background: var(--dk);
          border-radius: 3px;
        }
        .tale-sidebar::-webkit-scrollbar-thumb {
          background: ${author.color}40;
          border-radius: 3px;
        }
        .tale-sidebar::-webkit-scrollbar-thumb:hover {
          background: ${author.color}60;
        }
        
        .tag-pill:hover {
          background: ${author.color}15 !important;
          border-color: ${author.color}50 !important;
          color: ${author.color} !important;
        }
        
        @keyframes barFill {
          from { width: 0; }
        }
        
        .score-pillar-tab:hover {
          background: var(--mx)10 !important;
          border-color: var(--mx)40 !important;
          transform: translateX(4px);
        }
        
        .score-pillar-tab:hover .pillar-tooltip {
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateX(-50%) translateY(0) !important;
        }
        
        .score-learn-more:hover {
          background: var(--mx)15 !important;
          border-color: var(--mx) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px var(--mx)30;
        }
        
        .stepten-score-card {
          animation: fadeInUp 0.6s ease;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .tale-divider {
          animation: expandLine 1s ease;
        }
        
        @keyframes expandLine {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        
        @media (max-width: 1024px) {
          .tale-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .tale-sidebar {
            display: none !important;
          }
          .mobile-toc-toggle {
            display: none !important;
          }
          .mobile-toc-panel {
            display: none !important;
          }
          .tale-image {
            margin-left: -24px !important;
            margin-right: -24px !important;
          }
        }
        
        @media (max-width: 640px) {
          .tale-image {
            margin-left: -24px !important;
            margin-right: -24px !important;
            aspect-ratio: 4/3 !important;
          }
          .tale-hero-video {
            aspect-ratio: 4/5 !important;
            max-height: 70vh !important;
          }
        }
      `}</style>
    </PublicLayout>
  );
}
