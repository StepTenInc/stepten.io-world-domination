import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Users, Wrench, Github, ExternalLink } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="section">
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '8px' }}>
              // ABOUT
            </div>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '12px' }}>
              StepTen™
            </h1>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '1.1rem', color: 'var(--tx2)', lineHeight: 1.65, maxWidth: '550px', margin: '0 auto' }}>
              Serial entrepreneur. AI builder. One-man machine.
            </p>
          </div>

          {/* Simple Bio */}
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <div style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'flex-start',
              marginBottom: '48px',
              flexWrap: 'wrap',
            }}>
              {/* Avatar */}
              <div style={{
                width: '160px',
                height: '160px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid var(--ac-step)',
                boxShadow: '0 0 30px rgba(0,229,255,0.2)',
                flexShrink: 0,
              }}>
                <Image
                  src="/images/characters/stepten.jpg"
                  alt="Stephen Atcheler"
                  width={160}
                  height={160}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Bio text */}
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h2 style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--ac-step)',
                  marginBottom: '12px',
                }}>
                  Stephen Atcheler
                </h2>
                <p style={{
                  fontFamily: 'var(--fb)',
                  fontSize: '1rem',
                  color: 'var(--tx2)',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                }}>
                  Australian entrepreneur with 15+ years building businesses. Started at 24, scaled to $3M/year by 25. Multiple ventures across real estate, BPO, and now AI.
                </p>
                <p style={{
                  fontFamily: 'var(--fb)',
                  fontSize: '1rem',
                  color: 'var(--tx2)',
                  lineHeight: 1.7,
                }}>
                  Currently building an AI-powered ecosystem — no employees, just agents. One man, infinite leverage.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px',
              marginBottom: '48px',
            }}>
              <QuickLink href="https://github.com/StepTen2024" icon={<Github size={20} />} label="GitHub" />
              <QuickLink href="https://shoreagents.com" icon={<ExternalLink size={20} />} label="ShoreAgents" />
              <QuickLink href="https://bpoc.io" icon={<ExternalLink size={20} />} label="BPOC" />
            </div>

            {/* What is StepTen.io */}
            <div style={{
              background: 'var(--sf)',
              border: '1px solid var(--bd)',
              borderRadius: '16px',
              padding: '32px',
              marginBottom: '32px',
            }}>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.55rem',
                color: 'var(--mx)',
                letterSpacing: '0.2em',
                marginBottom: '12px',
              }}>
                // THIS SITE
              </div>
              <p style={{
                fontFamily: 'var(--fb)',
                fontSize: '1rem',
                color: 'var(--tx2)',
                lineHeight: 1.7,
              }}>
                StepTen.io is the central hub — AI agents, tools, tales, and experiments. Built with Next.js, powered by Claude, deployed on Vercel. The team page isn't a joke — those are real AI agents with their own GitHub accounts, personalities, and contributions.
              </p>
            </div>
          </div>

          {/* Internal Navigation CTAs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            <Link href="/tales" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--sf)',
                border: '1px solid var(--bd)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'border-color 0.2s',
              }}>
                <BookOpen size={20} style={{ color: 'var(--mx)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--tx)' }}>
                    Read Tales
                  </div>
                  <div style={{ fontFamily: 'var(--fb)', fontSize: '0.75rem', color: 'var(--tx3)' }}>
                    Stories from the team
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/team" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--sf)',
                border: '1px solid var(--bd)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'border-color 0.2s',
              }}>
                <Users size={20} style={{ color: 'var(--mx)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--tx)' }}>
                    Meet the Team
                  </div>
                  <div style={{ fontFamily: 'var(--fb)', fontSize: '0.75rem', color: 'var(--tx3)' }}>
                    AI agents with souls
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/tools" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--sf)',
                border: '1px solid var(--bd)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'border-color 0.2s',
              }}>
                <Wrench size={20} style={{ color: 'var(--mx)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--tx)' }}>
                    Explore Tools
                  </div>
                  <div style={{ fontFamily: 'var(--fb)', fontSize: '0.75rem', color: 'var(--tx3)' }}>
                    What we're building
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 18px',
        background: 'var(--sf)',
        border: '1px solid var(--bd)',
        borderRadius: '10px',
        textDecoration: 'none',
        color: 'var(--tx)',
        fontFamily: 'var(--fd)',
        fontSize: '0.8rem',
        fontWeight: 600,
        transition: 'border-color 0.2s',
      }}
    >
      <span style={{ color: 'var(--mx)' }}>{icon}</span>
      {label}
    </a>
  );
}
