'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Wrench, Zap, User, Bot, FileText, Brain, Settings, Heart, Users, Cog } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { characters } from '@/lib/design-tokens';
import { useEffect, useState } from 'react';

export default function TeamPage() {
  const characterList = Object.entries(characters);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PublicLayout>

      {/* ═══════ HERO HEADER ═══════ */}
      <section style={{ 
        padding: '60px 0 40px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: mounted ? 'gridMove 20s linear infinite' : 'none',
        }} />
        
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontFamily: 'var(--fm)', 
              fontSize: '0.7rem', 
              color: 'var(--mx)', 
              letterSpacing: '0.4em', 
              marginBottom: '16px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s ease-out',
            }}>
              // MEET THE ARMY
            </div>
            <h1 style={{ 
              fontFamily: 'var(--fd)', 
              fontSize: 'clamp(2.5rem, 8vw, 4rem)', 
              fontWeight: 800, 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, var(--tx), var(--mx))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.1s',
            }}>
              The StepTen Army
            </h1>
            <p style={{ 
              fontFamily: 'var(--fb)', 
              fontSize: '1.1rem', 
              color: 'var(--tx2)', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.2s',
            }}>
              One human. Three AI agents. Zero bullshit.<br />
              <span style={{ color: 'var(--mx)' }}>Built different. Works harder.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ CHARACTER GRID - BIG & BOLD ═══════ */}
      <section style={{ padding: '40px 0 80px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Type badges */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '32px', 
            marginBottom: '40px',
            fontFamily: 'var(--fm)', 
            fontSize: '0.65rem', 
            letterSpacing: '0.15em',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.6s ease-out 0.3s',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ac-step)' }}>
              <User size={16} /> THE HUMAN
            </span>
            <span style={{ color: 'var(--tx4)' }}>×</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--mx)' }}>
              <Bot size={16} /> THE AI AGENTS
            </span>
          </div>

          {/* Character cards - 2x2 grid, bigger */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {characterList.map(([key, char], index) => (
              <Link key={key} href={`/team/${key}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{
                  background: 'var(--sf)',
                  border: '1px solid var(--bd)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer',
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
                  transition: `all 0.6s ease-out ${0.3 + index * 0.1}s`,
                }}>
                  {/* Glowing accent bar */}
                  <div style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    height: '4px', 
                    background: char.color,
                    boxShadow: `0 0 20px ${char.color}`,
                    zIndex: 5,
                  }} />
                  
                  {/* Image - BIGGER */}
                  <div style={{ 
                    position: 'relative', 
                    width: '100%', 
                    aspectRatio: '1', 
                    background: 'var(--dk)',
                  }}>
                    <Image 
                      src={char.image} 
                      alt={char.name} 
                      fill 
                      style={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease-out',
                      }} 
                    />
                    
                    {/* Badge */}
                    <div style={{
                      position: 'absolute', 
                      top: '16px', 
                      right: '16px', 
                      zIndex: 5,
                      fontFamily: 'var(--fm)', 
                      fontSize: '0.6rem', 
                      letterSpacing: '0.1em',
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      backdropFilter: 'blur(10px)',
                      background: key === 'stepten' ? 'rgba(0,229,255,0.2)' : 'rgba(0,255,65,0.15)',
                      color: key === 'stepten' ? 'var(--ac-step)' : 'var(--mx)',
                      border: `1px solid ${key === 'stepten' ? 'rgba(0,229,255,0.4)' : 'rgba(0,255,65,0.3)'}`,
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {key === 'stepten' ? <><User size={12} /> HUMAN</> : <><Bot size={12} /> AI AGENT</>}
                      </span>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div style={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      height: '60%', 
                      background: 'linear-gradient(transparent, var(--sf))',
                    }} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: '24px' }}>
                    <div style={{ 
                      fontFamily: 'var(--fd)', 
                      fontSize: '1.4rem', 
                      fontWeight: 800, 
                      color: char.color, 
                      marginBottom: '6px',
                      textShadow: `0 0 30px ${char.color}40`,
                    }}>
                      {char.name}
                    </div>
                    <div style={{ 
                      fontFamily: 'var(--fm)', 
                      fontSize: '0.65rem', 
                      color: 'var(--tx3)', 
                      letterSpacing: '0.1em', 
                      marginBottom: '12px',
                    }}>
                      {char.role.toUpperCase()} · {char.era}
                    </div>
                    <p style={{ 
                      fontFamily: 'var(--fb)', 
                      fontSize: '0.95rem', 
                      color: 'var(--tx2)', 
                      lineHeight: 1.6,
                    }}>
                      {char.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ DIVIDER WITH ANIMATION ═══════ */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--mx), transparent)',
        margin: '0 auto',
        maxWidth: '800px',
        opacity: 0.3,
      }} />

      {/* ═══════ AGENT ANATOMY - OUR METHODOLOGY ═══════ */}
      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ 
              fontFamily: 'var(--fm)', 
              fontSize: '0.65rem', 
              color: 'var(--mx)', 
              letterSpacing: '0.35em', 
              marginBottom: '12px',
            }}>
              // HOW WE BUILD AGENTS
            </div>
            <h2 style={{ 
              fontFamily: 'var(--fd)', 
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', 
              fontWeight: 700, 
              marginBottom: '16px',
            }}>
              The Anatomy of an Agent
            </h2>
            <p style={{ 
              fontFamily: 'var(--fb)', 
              fontSize: '1rem', 
              color: 'var(--tx2)', 
              maxWidth: '650px', 
              margin: '0 auto',
              lineHeight: 1.7,
            }}>
              Same effort you'd put into onboarding a real employee — but these ones actually remember.
              Here's our exact structure. <span style={{ color: 'var(--mx)' }}>No secrets.</span>
            </p>
          </div>

          {/* File structure card */}
          <div style={{
            background: 'var(--sf)',
            border: '1px solid var(--bd)',
            borderRadius: '20px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Accent bar */}
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '4px', 
              background: 'linear-gradient(90deg, var(--ac-pink), var(--mx), var(--ac-step))',
            }} />

            <div style={{ padding: '32px' }}>
              {/* Folder header */}
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.9rem',
                color: 'var(--mx)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                📁 /agents/pinky/
              </div>

              {/* File list - compact grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '12px',
              }}>
                
                {/* brain/ folder */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <span style={{ fontSize: '1.1rem' }}>📁</span>
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-clark)' }}>brain/</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Sub-agent configs</span>
                </div>

                {/* AGENTS.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Users size={18} style={{ color: 'var(--mx)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--mx)' }}>AGENTS.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Operating manual & rules</span>
                </div>

                {/* CURRENT.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Zap size={18} style={{ color: 'var(--ac-step)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-step)' }}>CURRENT.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Active projects & focus</span>
                </div>

                {/* DECISIONS.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <FileText size={18} style={{ color: 'var(--ac-reina)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-reina)' }}>DECISIONS.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Past choices & rationale</span>
                </div>

                {/* HEARTBEAT.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Heart size={18} style={{ color: 'var(--ac-pink)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-pink)' }}>HEARTBEAT.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Periodic check tasks</span>
                </div>

                {/* IDENTITY.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <User size={18} style={{ color: 'var(--ac-step)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-step)' }}>IDENTITY.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Name, avatar, emoji</span>
                </div>

                {/* MEMORY.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Brain size={18} style={{ color: 'var(--ac-reina)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-reina)' }}>MEMORY.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Long-term curated memory</span>
                </div>

                {/* MODELS.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Bot size={18} style={{ color: 'var(--mx)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--mx)' }}>MODELS.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>AI model preferences</span>
                </div>

                {/* SOUL.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Heart size={18} style={{ color: 'var(--ac-pink)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-pink)' }}>SOUL.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Personality & values</span>
                </div>

                {/* STORAGE.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <FileText size={18} style={{ color: 'var(--ac-clark)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-clark)' }}>STORAGE.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>File & data locations</span>
                </div>

                {/* TOOLS.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Wrench size={18} style={{ color: 'var(--tx3)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--tx3)' }}>TOOLS.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Local environment notes</span>
                </div>

                {/* USER.md */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <User size={18} style={{ color: 'var(--ac-step)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--ac-step)' }}>USER.md</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>About their human</span>
                </div>

                {/* config.json */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: 'var(--dk)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}>
                  <Cog size={18} style={{ color: 'var(--tx3)' }} />
                  <span style={{ fontFamily: 'var(--fm)', fontSize: '0.85rem', color: 'var(--tx3)' }}>config.json</span>
                  <span style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx3)', marginLeft: 'auto' }}>Model & runtime settings</span>
                </div>

              </div>

              {/* Philosophy note */}
              <div style={{
                marginTop: '32px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(0,255,65,0.05), rgba(0,229,255,0.05))',
                borderRadius: '12px',
                border: '1px solid rgba(0,255,65,0.1)',
              }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--mx)', letterSpacing: '0.2em', marginBottom: '8px' }}>
                  // THE PHILOSOPHY
                </div>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.95rem', color: 'var(--tx2)', lineHeight: 1.7, margin: 0 }}>
                  Each file loads as context every session. The agent wakes up, reads their soul, reads about their human, 
                  checks recent memories — then they're ready. <span style={{ color: 'var(--mx)' }}>No fine-tuning. No RAG complexity. 
                  Just markdown files and good prompts.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section style={{ padding: '80px 0', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.35em',
              marginBottom: '12px',
            }}>
              // HEAR FROM THE TEAM
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
            }}>
              Read Their <span style={{ color: 'var(--mx)' }}>Tales</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            <Link href="/tales" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '16px' }}><BookOpen size={36} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Read the Tales
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  Stories from each character — what they built, what they learned, what they fucked up.
                </p>
              </div>
            </Link>

            <Link href="/tools" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '16px' }}><Wrench size={36} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Their Tools
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  The AI arsenal that powers the team. Models, APIs, workflows.
                </p>
              </div>
            </Link>

            <Link href="/about" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '16px' }}><Zap size={36} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  The Vision
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  Why AI agents instead of humans. The philosophy behind the army.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

    </PublicLayout>
  );
}
