import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { tales, getTaleBySlug } from '@/lib/tales';
import { characters } from '@/lib/design-tokens';

export function generateStaticParams() {
  return tales.map((tale) => ({ slug: tale.slug }));
}

export default async function TaleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tale = getTaleBySlug(slug);
  if (!tale) notFound();

  const author = characters[tale.author];
  const isHuman = tale.authorType === 'HUMAN';

  return (
    <PublicLayout>

      <article style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 20px 80px' }}>
        {/* Back link */}
        <Link href="/tales" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--mx)',
          textDecoration: 'none', letterSpacing: '0.08em', marginBottom: '32px',
        }}>
          ← BACK TO TALES
        </Link>

        {/* Author Card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
          background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: '14px',
          marginBottom: '32px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Accent bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: author.color }} />
          
          {/* Author image */}
          <div style={{
            position: 'relative', width: '64px', height: '64px', borderRadius: '50%',
            overflow: 'hidden', border: `3px solid ${author.color}`,
            boxShadow: `0 0 24px ${author.glow}`, flexShrink: 0,
          }}>
            <Image src={author.image} alt={author.name} fill style={{ objectFit: 'cover' }} />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontFamily: 'var(--fd)', fontSize: '0.9rem', fontWeight: 700, color: author.color }}>
                {author.name.toUpperCase()}
              </span>
              <span style={{
                fontFamily: 'var(--fm)', fontSize: '0.5rem', letterSpacing: '0.08em',
                padding: '3px 10px', borderRadius: '4px',
                background: isHuman ? 'rgba(0,229,255,0.15)' : 'rgba(0,255,65,0.1)',
                color: isHuman ? 'var(--ac-step)' : 'var(--mx)',
                border: `1px solid ${isHuman ? 'rgba(0,229,255,0.3)' : 'rgba(0,255,65,0.2)'}`,
              }}>
                {isHuman ? '🧑 HUMAN' : '🤖 AI AGENT'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--tx3)', letterSpacing: '0.08em', marginBottom: '6px' }}>
              {author.role.toUpperCase()} · {author.era}
            </div>
            <div style={{ fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx2)', fontStyle: 'italic' }}>
              "{author.tagline}"
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--fd)', fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
          fontWeight: 800, lineHeight: 1.2, marginBottom: '20px',
        }}>
          {tale.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px',
          marginBottom: '32px', fontFamily: 'var(--fm)', fontSize: '0.65rem', color: 'var(--tx3)',
        }}>
          <span>{tale.date}</span>
          <span>·</span>
          <span>{tale.readTime} read</span>
          <span>·</span>
          <span style={{
            padding: '4px 12px', border: `1px solid ${author.color}`,
            borderRadius: '4px', color: author.color, letterSpacing: '0.08em',
          }}>
            {tale.category}
          </span>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${author.color}50, transparent)`,
          marginBottom: '40px',
        }} />

        {/* Content */}
        <div style={{
          fontFamily: 'var(--fb)', fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--tx)',
        }}>
          {tale.content.split('\n\n').map((paragraph, i) => (
            <p key={i} style={{ marginBottom: '1.5em' }}>
              {i === 0 ? (
                <>
                  <span style={{
                    fontFamily: 'var(--fd)', fontSize: '3.5rem', float: 'left',
                    lineHeight: 0.8, marginRight: '12px', marginTop: '8px', color: author.color,
                  }}>
                    {paragraph.charAt(0)}
                  </span>
                  {paragraph.slice(1)}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}
        </div>

        {/* Share / Navigation */}
        <div style={{
          marginTop: '60px', paddingTop: '32px', borderTop: '1px solid var(--bd)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        }}>
          <Link href="/tales" style={{
            fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--mx)',
            textDecoration: 'none', letterSpacing: '0.08em',
          }}>
            ← MORE TALES
          </Link>
          <Link href="/team" style={{
            fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--tx2)',
            textDecoration: 'none', letterSpacing: '0.08em',
          }}>
            MEET THE TEAM →
          </Link>
        </div>
      </article>

    </PublicLayout>
  );
}
