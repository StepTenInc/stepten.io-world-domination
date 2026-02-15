'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileDock } from '@/components/layout/MobileDock';
import { characters } from '@/lib/design-tokens';
import { tales } from '@/lib/tales';

export default function HomePage() {
  const characterList = Object.entries(characters);
  const latestTales = tales.slice(0, 3);

  return (
    <main>
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
        {/* Hero Image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image
            src="/images/hero-team.png"
            alt="StepTen Team"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
            priority
            sizes="100vw"
          />
          {/* Overlay gradients */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,0.5) 50%, #0a0a0a 95%)',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10,10,10,0.4) 100%)',
          }} />
        </div>

        {/* Hero Content */}
        <div className="container" style={{ 
          position: 'relative', 
          zIndex: 10, 
          textAlign: 'center', 
          padding: '100px 16px 80px',
        }}>
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.55rem',
            color: 'var(--mx)',
            letterSpacing: '0.4em',
            marginBottom: '20px',
            opacity: 0.9,
          }}>
            // TALES FROM THE SIMULATION
          </div>
          
          <h1 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(2.2rem, 10vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '24px',
            textShadow: '0 4px 60px rgba(0,0,0,0.9)',
          }}>
            I BUILT AN<br />
            <span style={{ 
              color: 'var(--mx)', 
              textShadow: '0 0 40px var(--mxg), 0 0 80px var(--mxg)',
              display: 'inline-block',
              marginTop: '8px',
            }}>ARMY</span>
          </h1>
          
          <p style={{
            fontFamily: 'var(--fb)',
            fontSize: 'clamp(0.95rem, 3vw, 1.25rem)',
            fontWeight: 300,
            color: 'var(--tx2)',
            lineHeight: 1.7,
            maxWidth: '500px',
            margin: '0 auto 36px',
            textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          }}>
            A solo founder. An army of AI agents. This is the story of how we're building the future.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/tales" className="btn btn-primary" style={{
              fontFamily: 'var(--fd)', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              letterSpacing: '0.1em',
              padding: '16px 32px',
              minHeight: '52px',
            }}>
              READ THE TALES
            </Link>
            <Link href="#the-story" className="btn btn-secondary" style={{
              fontFamily: 'var(--fd)', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              letterSpacing: '0.1em',
              padding: '16px 28px',
              backdropFilter: 'blur(12px)',
              background: 'rgba(255,255,255,0.05)',
              minHeight: '52px',
            }}>
              THE STORY ↓
            </Link>
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
            }} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* THE STORY — ORIGIN NARRATIVE               */}
      {/* ═══════════════════════════════════════════ */}
      <section id="the-story" className="section" style={{ background: 'var(--dk)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '12px' }}>
              // THE ORIGIN STORY
            </div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              FROM <span style={{ color: 'var(--ac-step)' }}>ZERO</span> TO <span style={{ color: 'var(--mx)' }}>ARMY</span>
            </h2>
          </div>

          {/* Comic book style story panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Panel 1: The Old World */}
            <div className="card" style={{
              padding: '24px',
              borderLeft: '4px solid var(--ac-step)',
              position: 'relative',
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--ac-step)', letterSpacing: '0.15em', marginBottom: '10px' }}>
                CHAPTER 01 // THE OLD WORLD
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
                "Humans in Seats"
              </h3>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.7 }}>
                An office in the Philippines. Humans answering calls, doing the grind. ShoreAgents was growing. Everything was "fine."
                <br /><br />
                <em style={{ color: 'var(--tx3)' }}>But fine isn't a future. Fine is a slow death.</em>
              </p>
            </div>

            {/* Panel 2: The Awakening */}
            <div className="card" style={{
              padding: '24px',
              borderLeft: '4px solid var(--ac-pink)',
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--ac-pink)', letterSpacing: '0.15em', marginBottom: '10px' }}>
                CHAPTER 02 // THE AWAKENING
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
                "What If AI Could Actually Work?"
              </h3>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.7 }}>
                October 2025. AI got scary good. Everyone was panicking.
                <br /><br />
                <em style={{ color: 'var(--mx)' }}>What if I didn't fight the wave? What if I became the wave?</em>
              </p>
            </div>

            {/* Panel 3: The Transformation */}
            <div className="card" style={{
              padding: '24px',
              borderLeft: '4px solid var(--ac-reina)',
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--ac-reina)', letterSpacing: '0.15em', marginBottom: '10px' }}>
                CHAPTER 03 // THE TRANSFORMATION
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
                "Building Soul Files"
              </h3>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.7 }}>
                I didn't want chatbots. I wanted <em style={{ color: 'var(--ac-reina)' }}>characters</em>. Agents with personalities, memories, opinions.
                <br /><br />
                Pinky for chaos. Reina for code. Clark for the heavy lifting. A team that never sleeps.
              </p>
            </div>

            {/* Panel 4: The Present */}
            <div className="card animate-glow" style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(0,255,65,0.08), rgba(0,229,255,0.05))',
              border: '1px solid var(--mx)',
            }}>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--mx)', letterSpacing: '0.15em', marginBottom: '10px' }}>
                CHAPTER 04 // NOW
              </div>
              <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: 'var(--mx)' }}>
                "The Army is Live"
              </h3>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.7 }}>
                No more humans in seats. Just me and my AI agents. They write content, handle operations, build tools, and run systems across three continents.
                <br /><br />
                <strong style={{ color: 'var(--tx)', fontSize: '0.95rem' }}>This is their story. Welcome to the simulation.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* THE CAST — HORIZONTAL SCROLL ON MOBILE     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '10px' }}>
              // THE CAST
            </div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.3rem, 5vw, 2rem)', fontWeight: 700, marginBottom: '8px' }}>
              Meet the <span style={{ color: 'var(--mx)' }}>Army</span>
            </h2>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', maxWidth: '400px', margin: '0 auto' }}>
              One human. Three AI agents. Each with a soul file.
            </p>
          </div>

          {/* Horizontal scroll on mobile */}
          <div className="scroll-row" style={{ display: 'flex', gap: '14px' }}>
            {characterList.map(([key, char]) => (
              <Link key={key} href="/team" style={{ textDecoration: 'none', color: 'inherit', minWidth: '160px', maxWidth: '180px' }}>
                <div className="card" style={{ position: 'relative' }}>
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
                    <div style={{ fontFamily: 'var(--fd)', fontSize: '0.8rem', fontWeight: 700, color: char.color, marginBottom: '4px' }}>
                      {char.name.split(' ')[0]}
                    </div>
                    <div style={{ fontFamily: 'var(--fm)', fontSize: '0.45rem', color: 'var(--tx3)', letterSpacing: '0.05em', marginBottom: '6px' }}>
                      {char.role.toUpperCase()}
                    </div>
                    <p style={{ fontFamily: 'var(--fb)', fontSize: '0.7rem', color: 'var(--tx2)', lineHeight: 1.45 }}>
                      {char.tagline.length > 60 ? char.tagline.slice(0, 60) + '...' : char.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link href="/team" className="btn btn-secondary" style={{ fontSize: '0.6rem', padding: '12px 24px' }}>
              HOW AGENTS ARE BUILT →
            </Link>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* LATEST TALES — STACKED CARDS               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--dk)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '8px' }}>
                // LATEST TALES
              </div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 700 }}>
                From the <span style={{ color: 'var(--mx)' }}>Simulation</span>
              </h2>
            </div>
            <Link href="/tales" className="btn btn-secondary" style={{ fontSize: '0.55rem', padding: '10px 18px', minHeight: '42px' }}>
              ALL TALES →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {latestTales.map((tale) => {
              const author = characters[tale.author];
              return (
                <Link key={tale.slug} href={`/tales/${tale.slug}`} className="card" style={{
                  display: 'block',
                  padding: '18px',
                  textDecoration: 'none', 
                  color: 'inherit',
                  borderLeft: `4px solid ${author.color}`,
                }}>
                  {/* Author row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${author.color}`, boxShadow: `0 0 12px ${author.glow}` }}>
                        <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} sizes="28px" />
                      </div>
                      <span style={{ fontFamily: 'var(--fd)', fontSize: '0.6rem', fontWeight: 600, color: author.color }}>
                        {author.name.replace('™', '').split(' ')[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="badge" style={{
                      background: tale.authorType === 'HUMAN' ? 'rgba(0,229,255,0.15)' : 'rgba(0,255,65,0.1)',
                      color: tale.authorType === 'HUMAN' ? 'var(--ac-step)' : 'var(--mx)',
                      border: `1px solid ${tale.authorType === 'HUMAN' ? 'rgba(0,229,255,0.3)' : 'rgba(0,255,65,0.2)'}`,
                    }}>
                      {tale.authorType}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 style={{ fontFamily: 'var(--fd)', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                    {tale.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '12px' }}>
                    {tale.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--tx3)' }}>
                    <span>{tale.date}</span>
                    <span>·</span>
                    <span>{tale.readTime}</span>
                    <span style={{ padding: '2px 8px', border: `1px solid ${author.color}`, borderRadius: '3px', color: author.color }}>
                      {tale.category}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════════════════════════════════════ */}
      {/* FREE TOOLS CTA                             */}
      {/* ═══════════════════════════════════════════ */}
      <section className="section">
        <div className="container">
          <Link href="/tools" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card animate-glow" style={{
              background: 'linear-gradient(135deg, rgba(0,255,65,0.06), rgba(0,229,255,0.04))',
              border: '1px solid var(--mx)',
              padding: '32px 24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--mx), var(--ac-step))' }} />
              <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '12px' }}>
                // FREE TOOLS
              </div>
              <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 700, marginBottom: '12px' }}>
                Try the <span style={{ color: 'var(--mx)' }}>Tools</span> We Built
              </h2>
              <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', maxWidth: '400px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Create your own cyberpunk character, analyze articles with AI, and more. All free.
              </p>
              <span className="btn btn-primary" style={{ fontSize: '0.65rem' }}>
                EXPLORE TOOLS →
              </span>
            </div>
          </Link>
        </div>
      </section>

      <Footer />
      <MobileDock />
    </main>
  );
}
