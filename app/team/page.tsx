import Image from 'next/image';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { characters } from '@/lib/design-tokens';

export default function TeamPage() {
  const characterList = Object.entries(characters);

  return (
    <PublicLayout>

      {/* Header section */}
      <section className="section" style={{ paddingBottom: '24px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--mx)', letterSpacing: '0.3em', marginBottom: '8px' }}>
            // THE TEAM
          </div>
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 700, marginBottom: '8px' }}>
            The Army
          </h1>
          <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', maxWidth: '500px', margin: '0 auto' }}>
            Humans, AI agents, and legends. Each one built with purpose.
          </p>
        </div>
      </section>

      {/* ═══════ AGENT ANATOMY ═══════ */}
      <section style={{ paddingBottom: '48px' }}>
        <div className="container">
          <div style={{
            background: 'var(--sf)',
            border: '1px solid var(--bd)',
            borderRadius: '16px',
            padding: '28px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--mx)' }} />
            
            <div style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--mx)', letterSpacing: '0.25em', marginBottom: '12px' }}>
              // HOW AN AGENT IS BUILT
            </div>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              The Anatomy of an Agent
            </h2>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '0.9rem', color: 'var(--tx2)', lineHeight: 1.65, marginBottom: '20px', maxWidth: '600px' }}>
              It's the same effort you'd put into a real employee — but these ones actually remember. 
              They don't get burnt out. They don't forget. Put the work in, and they become exactly what you need.
            </p>

            {/* File structure */}
            <div style={{
              background: 'var(--dk)',
              border: '1px solid var(--bd)',
              borderRadius: '10px',
              padding: '20px',
              fontFamily: 'var(--fm)',
              fontSize: '0.8rem',
              lineHeight: 2,
            }}>
              <div style={{ color: 'var(--tx3)', marginBottom: '8px' }}>/agents/pinky/</div>
              <div>📄 <span style={{ color: 'var(--mx)' }}>.soul</span> <span style={{ color: 'var(--tx3)' }}>— personality, values, voice, identity</span></div>
              <div>⚡ <span style={{ color: 'var(--ac-step)' }}>.agent</span> <span style={{ color: 'var(--tx3)' }}>— capabilities, tools, permissions</span></div>
              <div>🧠 <span style={{ color: 'var(--ac-pink)' }}>.memory</span> <span style={{ color: 'var(--tx3)' }}>— context retention, learning</span></div>
              <div>🎨 <span style={{ color: 'var(--ac-reina)' }}>.design</span> <span style={{ color: 'var(--tx3)' }}>— visual identity, accent color</span></div>
              <div>⚙️ <span style={{ color: 'var(--ac-clark)' }}>.config</span> <span style={{ color: 'var(--tx3)' }}>— model, temperature, settings</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* Character grid */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontFamily: 'var(--fd)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              The Characters
            </h2>
            <p style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--tx3)', letterSpacing: '0.1em' }}>
              🧑 HUMAN · 🤖 AI AGENTS · ⚡ LEGENDS
            </p>
          </div>

          <div className="grid-4" style={{ gap: '20px' }}>
            {characterList.map(([key, char]) => (
              <div key={key} style={{
                background: 'var(--sf)',
                border: '1px solid var(--bd)',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                {/* Accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: char.color, zIndex: 5 }} />
                
                {/* Image */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', background: 'var(--dk)' }}>
                  <Image src={char.image} alt={char.name} fill style={{ objectFit: 'cover' }} />
                  {/* Badge */}
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 5,
                    fontFamily: 'var(--fm)', fontSize: '0.5rem', letterSpacing: '0.08em',
                    padding: '4px 8px', borderRadius: '4px', backdropFilter: 'blur(8px)',
                    background: key === 'stepten' ? 'rgba(0,229,255,0.15)' : 'rgba(0,255,65,0.1)',
                    color: key === 'stepten' ? 'var(--ac-step)' : 'var(--mx)',
                    border: `1px solid ${key === 'stepten' ? 'rgba(0,229,255,0.3)' : 'rgba(0,255,65,0.2)'}`,
                  }}>
                    {key === 'stepten' ? '🧑 HUMAN' : '🤖 AI AGENT'}
                  </div>
                  {/* Gradient */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(transparent, var(--sf))' }} />
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '0.9rem', fontWeight: 700, color: char.color, marginBottom: '4px' }}>
                    {char.name}
                  </div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--tx3)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {char.role.toUpperCase()} · {char.era}
                  </div>
                  <p style={{ fontFamily: 'var(--fb)', fontSize: '0.75rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                    {char.tagline}
                  </p>
                </div>
              </div>
            ))}

            {/* Legends placeholder */}
            <div style={{
              background: 'var(--sf)',
              border: '1px solid var(--bd)',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--ac-clark)', zIndex: 5 }} />
              <div style={{
                width: '100%', aspectRatio: '1', background: 'var(--dk)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}>
                <span style={{ fontFamily: 'var(--fd)', fontSize: '2rem', color: 'var(--tx3)' }}>86–00</span>
                <span style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--tx4)', marginTop: '8px', letterSpacing: '0.15em' }}>LEGENDS COMING</span>
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  fontFamily: 'var(--fm)', fontSize: '0.5rem', letterSpacing: '0.08em',
                  padding: '4px 8px', borderRadius: '4px',
                  background: 'rgba(255,215,0,0.1)', color: 'var(--ac-clark)', border: '1px solid rgba(255,215,0,0.2)',
                }}>
                  ⚡ LEGEND
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--ac-clark)', marginBottom: '4px' }}>
                  Coming Soon
                </div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--tx3)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  HE-MAN · CAPTAIN PLANET · MORE
                </div>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.75rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  Heroes from '86 to 2000, reimagined as cyberpunk entities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
