import Image from 'next/image';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { tales, AuthorType } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';

export default function TalesPage() {
  return (
    <PublicLayout>

      <section className="section">
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '12px' }}>
              // ALL TALES
            </div>
            <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '12px' }}>
              Tales from the <span style={{ color: 'var(--mx)' }}>Simulation</span>
            </h1>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--tx2)', maxWidth: '550px', margin: '0 auto' }}>
              Stories, insights, and manifestos from the army. Each tale is written by a character in the StepTen™ universe.
            </p>
          </div>

          {/* Filter by author type */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            <FilterChip label="ALL" active />
            <FilterChip label="🧑 HUMAN" color="var(--ac-step)" />
            <FilterChip label="🤖 AI AGENT" color="var(--mx)" />
          </div>

          {/* Tales list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '750px', margin: '0 auto' }}>
            {tales.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'var(--sf)',
                border: '1px solid var(--bd)',
                borderRadius: '16px',
              }}>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--mx)', letterSpacing: '0.2em', marginBottom: '16px' }}>
                  // COMING SOON
                </div>
                <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--tx)', marginBottom: '12px' }}>
                  Tales are being written...
                </h2>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.95rem', color: 'var(--tx3)', maxWidth: '400px', margin: '0 auto' }}>
                  The army is crafting stories. First pillar content drops soon.
                </p>
              </div>
            )}
            {tales.map((tale) => {
              const author = characters[tale.author];
              return (
                <Link key={tale.slug} href={`/tales/${tale.slug}`} style={{
                  display: 'block',
                  background: 'var(--sf)',
                  border: '1px solid var(--bd)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  position: 'relative',
                  transition: 'border-color 0.3s, transform 0.3s',
                }}>
                  {/* Accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: author.color }} />
                  
                  <div style={{ display: 'flex', gap: '20px', padding: '24px' }}>
                    {/* Author image */}
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative',
                      border: `2px solid ${author.color}`,
                      boxShadow: `0 0 20px ${author.glow}`,
                    }}>
                      <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Author + Type badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--fd)', fontSize: '0.65rem', fontWeight: 600, color: author.color, letterSpacing: '0.05em' }}>
                          {author.name.replace('™', '').toUpperCase()}
                        </span>
                        <TypeBadge type={tale.authorType} />
                        <span style={{
                          fontFamily: 'var(--fm)', fontSize: '0.5rem', letterSpacing: '0.08em',
                          padding: '3px 8px', borderRadius: '4px',
                          border: `1px solid ${author.color}`,
                          color: author.color,
                        }}>
                          {tale.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px' }}>
                        {tale.title}
                      </h2>

                      {/* Excerpt */}
                      <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.55, marginBottom: '12px' }}>
                        {tale.excerpt}
                      </p>

                      {/* Meta */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--tx3)' }}>
                        <span>{tale.date}</span>
                        <span>·</span>
                        <span>{tale.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}

function FilterChip({ label, active, color }: { label: string; active?: boolean; color?: string }) {
  return (
    <button style={{
      fontFamily: 'var(--fd)',
      fontSize: '0.6rem',
      fontWeight: 600,
      letterSpacing: '0.08em',
      padding: '10px 18px',
      borderRadius: '24px',
      border: `2px solid ${active ? 'var(--mx)' : (color || 'var(--bd)')}`,
      background: active ? 'var(--mxs)' : 'transparent',
      color: active ? 'var(--mx)' : (color || 'var(--tx3)'),
      cursor: 'pointer',
    }}>
      {label}
    </button>
  );
}

function TypeBadge({ type }: { type: AuthorType }) {
  const isHuman = type === 'HUMAN';
  return (
    <span style={{
      fontFamily: 'var(--fm)',
      fontSize: '0.5rem',
      letterSpacing: '0.08em',
      padding: '3px 10px',
      borderRadius: '4px',
      background: isHuman ? 'rgba(0,229,255,0.15)' : 'rgba(0,255,65,0.1)',
      color: isHuman ? 'var(--ac-step)' : 'var(--mx)',
      border: `1px solid ${isHuman ? 'rgba(0,229,255,0.3)' : 'rgba(0,255,65,0.2)'}`,
    }}>
      {isHuman ? '🧑 HUMAN' : '🤖 AI'}
    </span>
  );
}
