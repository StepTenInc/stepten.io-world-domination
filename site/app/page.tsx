'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileDock } from '@/components/layout/MobileDock';
import { TalesCarousel, TeamGrid, ToolsMarquee } from '@/components/home';
import { characters } from '@/lib/design-tokens';

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
            // PAPER ROUNDS AT 12. GUN IN MY MOUTH AT 20. AI EMPIRE AT 39.
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
            I DID IT <span style={{ 
              color: 'var(--mx)', 
              textShadow: '0 0 40px var(--mxg), 0 0 80px var(--mxg)',
              display: 'inline-block',
            }}>WRONG</span>.<br />
            <span style={{ fontSize: '0.65em', fontWeight: 700, color: 'var(--tx2)' }}>
              SO YOU DON'T HAVE TO.
            </span>
          </h1>
          
          <p className="animate-slideUp" style={{
            fontFamily: 'var(--fb)',
            fontSize: 'clamp(0.95rem, 3vw, 1.25rem)',
            fontWeight: 300,
            color: 'var(--tx2)',
            lineHeight: 1.7,
            maxWidth: '550px',
            margin: '0 auto 32px',
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
            animationDelay: '0.2s',
          }}>
            30 years of fuckups compressed into tools and tales. No silver spoon. Just survival.
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
      {/* TALES CAROUSEL                              */}
      {/* ═══════════════════════════════════════════ */}
      <TalesCarousel />

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* TEAM GRID                                   */}
      {/* ═══════════════════════════════════════════ */}
      <TeamGrid />

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* TOOLS MARQUEE                               */}
      {/* ═══════════════════════════════════════════ */}
      <ToolsMarquee />

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
