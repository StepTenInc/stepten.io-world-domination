'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileDock } from '@/components/layout/MobileDock';
import { characters } from '@/lib/design-tokens';
import { tales } from '@/lib/tales';

const bootLines = [
  '> initializing stepten_universe v2.0...',
  '> loading soul files... ✓',
  '> deploying agents... ✓',
  '> simulation...',
];

export default function HomePage() {
  const [bootComplete, setBootComplete] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const characterList = Object.entries(characters);
  const latestTales = tales.slice(0, 3);

  // Boot sequence
  useEffect(() => {
    // Skip boot if already seen this session
    if (sessionStorage.getItem('boot_seen')) {
      setBootComplete(true);
      return;
    }

    const lineDelay = 400;
    bootLines.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), i * lineDelay);
    });

    setTimeout(() => {
      setBootComplete(true);
      sessionStorage.setItem('boot_seen', '1');
    }, bootLines.length * lineDelay + 600);
  }, []);

  return (
    <main>
      {/* ═══════════════════════════════════════════ */}
      {/* BOOT SEQUENCE OVERLAY                       */}
      {/* ═══════════════════════════════════════════ */}
      {!bootComplete && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '8px',
          animation: bootComplete ? 'fadeOut 0.5s ease forwards' : undefined,
        }}>
          <div style={{ padding: '20px' }}>
            {bootLines.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.75rem',
                  color: i === bootLines.length - 1 ? 'var(--mx)' : 'var(--tx3)',
                  letterSpacing: '0.05em',
                  animation: 'fadeIn 0.3s ease',
                  marginBottom: '6px',
                }}
              >
                {line}
                {i === visibleLines - 1 && i < bootLines.length - 1 && (
                  <span className="cursor-blink" style={{ marginLeft: '4px' }}>_</span>
                )}
              </div>
            ))}
            {visibleLines === bootLines.length && (
              <div style={{
                fontFamily: 'var(--fd)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--mx)',
                marginTop: '16px',
                animation: 'glowPulse 1s ease infinite',
              }}>
                LIVE
              </div>
            )}
          </div>
        </div>
      )}

      <Header />

      {/* ═══════════════════════════════════════════ */}
      {/* HERO — FULL SCREEN IMPACT                  */}
      {/* ═══════════════════════════════════════════ */}
      <section style={{
        position: 'relative',
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Hero Video Background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/images/hero-poster.jpg"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
            }}
          >
            <source src="/images/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.65) 50%, #0a0a0a 95%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 100%)',
          }} />
        </div>

        {/* Circuit pattern overlay */}
        <div className="circuit-grid" style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(var(--mx) 1px, transparent 1px),
            linear-gradient(90deg, var(--mx) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* Hero Content */}
        <div className="container" style={{ 
          position: 'relative', 
          zIndex: 10, 
          textAlign: 'center', 
          padding: '100px 16px 80px',
        }}>
          <div className="animate-slideUp" style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.55rem',
            color: 'var(--mx)',
            letterSpacing: '0.4em',
            marginBottom: '24px',
            opacity: 0.9,
          }}>
            // TALES FROM THE SIMULATION
          </div>
          
          <h1 className="animate-slideUp" style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.2rem, 10vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            marginBottom: '24px',
            textShadow: '0 4px 60px rgba(0,0,0,0.9)',
            animationDelay: '0.1s',
          }}>
            I BUILT AN <span style={{ 
              color: 'var(--mx)', 
              textShadow: '0 0 40px var(--mxg), 0 0 80px var(--mxg)',
              display: 'inline-block',
            }}>ARMY</span>.<br />
            <span style={{ fontSize: '0.65em', fontWeight: 700, color: 'var(--tx2)' }}>
              NOW I'M SHOWING YOU HOW.
            </span>
          </h1>
          
          <p className="animate-slideUp" style={{
            fontFamily: 'var(--fb)',
            fontSize: 'clamp(0.95rem, 3vw, 1.25rem)',
            fontWeight: 300,
            color: 'var(--tx2)',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 auto 32px',
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            animationDelay: '0.2s',
          }}>
            A solo founder's journey from real estate to AI agents. The tales, the tools, and the characters.
          </p>

          {/* CTA Buttons */}
          <div className="animate-slideUp" style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            marginBottom: '40px',
            animationDelay: '0.3s',
          }}>
            <Link href="/tales" className="btn btn-primary" style={{
              fontFamily: 'var(--fd)', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              letterSpacing: '0.1em',
              padding: '16px 32px',
              minHeight: '52px',
            }}>
              READ TALES
            </Link>
            <Link href="/tools" className="btn btn-secondary" style={{
              fontFamily: 'var(--fd)', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              letterSpacing: '0.1em',
              padding: '16px 28px',
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.05)',
              minHeight: '52px',
            }}>
              FREE TOOLS
            </Link>
          </div>

          {/* Character Orbs */}
          <div className="animate-slideUp" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px',
            animationDelay: '0.4s',
          }}>
            {characterList.map(([key, char], i) => (
              <Link key={key} href="/team" style={{ textDecoration: 'none' }}>
                <div className="character-orb" style={{
                  position: 'relative',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: `2px solid ${char.color}`,
                  boxShadow: `0 0 20px ${char.glow}`,
                  transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
                  cursor: 'pointer',
                }}>
                  <Image src={char.image} alt={char.name} fill style={{ objectFit: 'cover' }} sizes="56px" />
                  {/* Glow ring */}
                  <div style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '50%',
                    border: `1px solid ${char.color}`,
                    opacity: 0.3,
                    animation: `orbPulse 3s infinite ${i * 0.3}s`,
                  }} />
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.45rem',
                  color: char.color,
                  textAlign: 'center',
                  marginTop: '8px',
                  letterSpacing: '0.05em',
                }}>
                  {char.name.replace('™', '').split(' ')[0]}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}>
          <div className="animate-float" style={{
            width: '28px',
            height: '44px',
            border: '2px solid rgba(255,255,255,0.25)',
            borderRadius: '14px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '4px',
              height: '10px',
              background: 'var(--mx)',
              borderRadius: '2px',
              boxShadow: '0 0 10px var(--mx)',
              animation: 'scrollDot 1.5s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* LATEST TALES — FEATURED SECTION            */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--dk)', paddingTop: '60px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '10px' }}>
              // LATEST TALES
            </div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 800 }}>
              From the <span style={{ color: 'var(--mx)' }}>Simulation</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {latestTales.map((tale, i) => {
              const author = characters[tale.author];
              return (
                <Link 
                  key={tale.slug} 
                  href={`/tales/${tale.slug}`} 
                  className="tale-card"
                  style={{
                    display: 'flex',
                    background: 'var(--sf)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid var(--bd)',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Left accent */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: author.color,
                  }} />
                  
                  <div style={{ flex: 1, padding: '20px 20px 20px 24px' }}>
                    {/* Author */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ 
                        position: 'relative', 
                        width: '28px', 
                        height: '28px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        border: `2px solid ${author.color}`,
                        boxShadow: `0 0 10px ${author.glow}`,
                      }}>
                        <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} sizes="28px" />
                      </div>
                      <span style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: author.color, letterSpacing: '0.05em' }}>
                        {author.name.replace('™', '').split(' ')[0].toUpperCase()}
                      </span>
                      <span className="badge" style={{
                        background: tale.authorType === 'HUMAN' ? 'rgba(0,229,255,0.15)' : 'rgba(0,255,65,0.1)',
                        color: tale.authorType === 'HUMAN' ? 'var(--ac-step)' : 'var(--mx)',
                        border: `1px solid ${tale.authorType === 'HUMAN' ? 'rgba(0,229,255,0.3)' : 'rgba(0,255,65,0.2)'}`,
                      }}>
                        {tale.authorType}
                      </span>
                    </div>
                    
                    <h3 style={{ 
                      fontFamily: 'var(--fd)', 
                      fontSize: '1rem', 
                      fontWeight: 700, 
                      lineHeight: 1.3, 
                      marginBottom: '8px',
                    }}>
                      {tale.title}
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px', 
                      fontFamily: 'var(--fm)', 
                      fontSize: '0.5rem', 
                      color: 'var(--tx3)',
                    }}>
                      <span>{tale.readTime}</span>
                      <span style={{ 
                        padding: '2px 8px', 
                        border: `1px solid ${author.color}`, 
                        borderRadius: '3px', 
                        color: author.color,
                      }}>
                        {tale.category}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail placeholder */}
                  <div style={{
                    width: '100px',
                    background: 'var(--dk)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}>
                    {i === 0 ? '🧠' : i === 1 ? '🏝️' : '📚'}
                  </div>
                </Link>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/tales" className="btn btn-secondary" style={{ fontSize: '0.6rem', padding: '14px 28px' }}>
              ALL TALES →
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* THE CAST — FULL WIDTH CARDS                */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '10px' }}>
              // THE CAST
            </div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 800 }}>
              Meet the <span style={{ color: 'var(--mx)' }}>Team</span>
            </h2>
          </div>

          {/* Horizontal scroll on mobile */}
          <div className="scroll-row" style={{ display: 'flex', gap: '14px' }}>
            {characterList.map(([key, char]) => (
              <Link key={key} href="/team" style={{ textDecoration: 'none', color: 'inherit', minWidth: '160px', maxWidth: '180px' }}>
                <div className="card" style={{ position: 'relative', background: 'var(--sf)' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: char.color, zIndex: 5 }} />
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: 'var(--dk)' }}>
                    <Image src={char.image} alt={char.name} fill style={{ objectFit: 'cover' }} sizes="180px" />
                    <div className="badge" style={{
                      position: 'absolute', top: '8px', right: '8px', zIndex: 5,
                      background: key === 'stepten' ? 'rgba(0,229,255,0.2)' : 'rgba(0,255,65,0.15)',
                      color: key === 'stepten' ? 'var(--ac-step)' : 'var(--mx)',
                      border: `1px solid ${key === 'stepten' ? 'rgba(0,229,255,0.4)' : 'rgba(0,255,65,0.3)'}`,
                    }}>
                      {key === 'stepten' ? '🧑 HUMAN' : '🤖 AI'}
                    </div>
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, var(--sf))' }} />
                  </div>
                  <div style={{ padding: '14px' }}>
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '0.85rem', fontWeight: 700, color: char.color, marginBottom: '4px' }}>
                      {char.name.split(' ')[0]}
                    </div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '0.45rem', color: 'var(--tx3)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                      {char.role.toUpperCase()}
                    </div>
                    <p style={{ fontFamily: 'var(--fb)', fontSize: '0.75rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                      {char.tagline.length > 55 ? char.tagline.slice(0, 55) + '...' : char.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <Link href="/team" className="btn btn-secondary" style={{ fontSize: '0.6rem', padding: '14px 28px' }}>
              FULL PROFILES →
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* FREE TOOLS CTA                             */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--dk)' }}>
        <div className="container">
          <Link href="/tools" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card animate-glow" style={{
              background: 'linear-gradient(135deg, rgba(0,255,65,0.08), rgba(0,229,255,0.05))',
              border: '1px solid var(--mx)',
              padding: '40px 24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '20px',
            }}>
              {/* Top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--mx), var(--ac-step))' }} />
              
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '12px' }}>
                // FREE TOOLS
              </div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.3rem, 5vw, 2rem)', fontWeight: 700, marginBottom: '12px' }}>
                Try the <span style={{ color: 'var(--mx)' }}>Tools</span> We Built
              </h2>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', maxWidth: '400px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                Create your own cyberpunk character, analyze articles with AI, and more.
              </p>
              <span className="btn btn-primary" style={{ fontSize: '0.7rem', padding: '16px 32px' }}>
                EXPLORE TOOLS →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
      <MobileDock />

      <style jsx global>{`
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 20px var(--mx), 0 0 40px var(--mxg); }
          50% { text-shadow: 0 0 40px var(--mx), 0 0 60px var(--mxg); }
        }
        @keyframes scrollDot {
          0%, 100% { top: 8px; opacity: 1; }
          50% { top: 24px; opacity: 0.3; }
        }
        .cursor-blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .character-orb:hover {
          transform: scale(1.15) translateY(-4px);
          box-shadow: 0 0 30px currentColor !important;
        }
        .tale-card:hover {
          border-color: var(--mx) !important;
          transform: translateX(4px);
        }
      `}</style>
    </main>
  );
}
