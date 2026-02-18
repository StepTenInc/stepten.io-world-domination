'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Character {
  id: string;
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  color: string;
  isAI: boolean;
}

const characters: Character[] = [
  {
    id: 'stepten',
    name: 'StepTen™',
    title: 'THE ARCHITECT',
    tagline: 'Enjoy life. Make money. Get loose.',
    avatar: '/images/characters/stepten.jpg',
    color: '#00e5ff',
    isAI: false,
  },
  {
    id: 'pinky',
    name: 'Pinky',
    title: 'THE SCHEMER',
    tagline: 'NARF! What are we doing tonight?',
    avatar: '/images/characters/pinky.jpg',
    color: '#ff00ff',
    isAI: true,
  },
  {
    id: 'reina',
    name: 'Reina',
    title: 'THE GAMER',
    tagline: 'Speaks in code. Dreams in pixels.',
    avatar: '/images/characters/reina.jpg',
    color: '#9b30ff',
    isAI: true,
  },
  {
    id: 'clark',
    name: 'Clark',
    title: 'THE HERO',
    tagline: "I've got you. Who's got me?",
    avatar: '/images/characters/clark.jpg',
    color: '#ffd700',
    isAI: true,
  },
];

export function TeamGrid() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.6rem',
            color: 'var(--mx)',
            letterSpacing: '0.3em',
            marginBottom: '12px',
          }}>
            // THE CAST
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.8rem, 6vw, 3rem)',
            fontWeight: 800,
            marginBottom: '16px',
          }}>
            Meet the <span style={{ color: 'var(--mx)' }}>Team</span>
          </h2>
          <p style={{
            fontFamily: 'var(--fb)',
            fontSize: '1rem',
            color: 'var(--tx2)',
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            One human. Three AI agents. Building the future from Clark Freeport Zone.
          </p>
        </div>

        {/* Grid - responsive, wider cards */}
        <div
          className="team-grid-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          {characters.map((char) => (
            <Link
              key={char.id}
              href={`/team/${char.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                className="team-card"
                style={{
                  position: 'relative',
                  background: 'var(--sf)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid var(--bd)',
                  transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
                  cursor: 'pointer',
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: char.color,
                  zIndex: 5,
                }} />

                {/* Image container */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  background: `linear-gradient(135deg, ${char.color}10, var(--dk))`,
                }}>
                  <Image
                    src={char.avatar}
                    alt={char.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 260px"
                  />

                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 5,
                    padding: '6px 12px',
                    background: char.isAI ? 'rgba(0,255,65,0.15)' : 'rgba(0,229,255,0.2)',
                    color: char.isAI ? 'var(--mx)' : char.color,
                    border: `1px solid ${char.isAI ? 'rgba(0,255,65,0.3)' : `${char.color}40`}`,
                    borderRadius: '6px',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.05em',
                    backdropFilter: 'blur(8px)',
                  }}>
                    {char.isAI ? '🤖 AI' : '🧑 HUMAN'}
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

                  {/* Glow effect on hover */}
                  <div
                    className="team-card-glow"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at center, ${char.color}20 0%, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s',
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: char.color,
                    marginBottom: '4px',
                    textShadow: `0 0 20px ${char.color}40`,
                  }}>
                    {char.name}
                  </div>

                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.6rem',
                    color: 'var(--tx3)',
                    letterSpacing: '0.1em',
                    marginBottom: '12px',
                  }}>
                    {char.title}
                  </div>

                  <p style={{
                    fontFamily: 'var(--fb)',
                    fontSize: '0.95rem',
                    color: 'var(--tx2)',
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                  }}>
                    "{char.tagline}"
                  </p>

                  {/* Hover indicator */}
                  <div style={{
                    marginTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: 'var(--fm)',
                    fontSize: '0.65rem',
                    color: char.color,
                    opacity: 0.7,
                  }}>
                    <span>VIEW PROFILE</span>
                    <span style={{ transition: 'transform 0.3s' }} className="arrow">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            href="/team"
            className="btn btn-secondary"
            style={{
              fontSize: '0.75rem',
              padding: '16px 32px',
            }}
          >
            FULL PROFILES →
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .team-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.4);
        }
        .team-card:hover .team-card-glow {
          opacity: 1;
        }
        .team-card:hover .arrow {
          transform: translateX(4px);
        }
        @media (max-width: 640px) {
          .team-grid-container {
            grid-template-columns: 1fr !important;
            padding: 0 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
