import Image from 'next/image';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { characters } from '@/lib/design-tokens';

export default function ChatPage() {
  const agents = [
    { key: 'stepten', status: "DOESN'T TALK" },
    { key: 'pinky', status: 'ONLINE' },
    { key: 'reina', status: 'ONLINE' },
    { key: 'clark', status: 'ONLINE' },
  ];

  return (
    <PublicLayout>

      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          {/* Header */}
          <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', fontWeight: 700, marginBottom: '4px' }}>
            Talk to the Team
          </h1>
          <p style={{ fontFamily: 'var(--fm)', fontSize: '0.6rem', color: 'var(--tx3)', letterSpacing: '0.15em', marginBottom: '32px' }}>
            PICK AN AGENT · FOR SHITS AND GIGGLES
          </p>

          {/* Agent selection */}
          <div style={{ display: 'flex', gap: '28px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
            {agents.map(({ key, status }) => {
              const char = characters[key as keyof typeof characters];
              return (
                <div key={key} style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden',
                    border: `3px solid ${char.color}`, boxShadow: `0 0 20px ${char.glow}`,
                    margin: '0 auto 10px', position: 'relative',
                  }}>
                    <Image src={char.image} alt={char.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontFamily: 'var(--fd)', fontSize: '0.75rem', fontWeight: 700, color: char.color }}>
                    {char.name.split(' ')[0]}
                  </div>
                  <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: status === 'ONLINE' ? 'var(--mx)' : 'var(--tx3)' }}>
                    {status}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step's note */}
          <div style={{
            background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: '14px',
            padding: '20px', maxWidth: '400px', margin: '0 auto 32px',
          }}>
            <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "I don't talk back. I built the simulation — I don't live in it. But the agents do. Talk to them."
            </p>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '0.65rem', color: 'var(--ac-step)', marginTop: '12px' }}>
              — Step
            </div>
          </div>

          {/* Chat preview */}
          <div style={{
            maxWidth: '420px', margin: '0 auto',
            background: 'var(--sf)', border: '1px solid var(--bd)', borderRadius: '18px', overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 18px', borderBottom: '1px solid var(--bd)',
            }}>
              <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--ac-pink)' }}>
                <Image src={characters.pinky.image} alt="Pinky" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--ac-pink)' }}>Pinky</div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--mx)' }}>● ONLINE</div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding: '18px', minHeight: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: '14px',
                background: 'var(--sf2)', border: '1px solid var(--bd)', borderBottomLeftRadius: '4px',
                fontFamily: 'var(--fb)', fontSize: '0.85rem', lineHeight: 1.5, textAlign: 'left',
              }}>
                Gee Brain, what are we gonna do tonight? 🐀
              </div>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: '14px',
                background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.15)', borderBottomRightRadius: '4px',
                alignSelf: 'flex-end', fontFamily: 'var(--fb)', fontSize: '0.85rem', lineHeight: 1.5, textAlign: 'left',
              }}>
                The same thing we do every night...
              </div>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: '14px',
                background: 'var(--sf2)', border: '1px solid var(--bd)', borderBottomLeftRadius: '4px',
                fontFamily: 'var(--fb)', fontSize: '0.85rem', lineHeight: 1.5, textAlign: 'left',
              }}>
                TRY TO TAKE OVER THE WORLD! NARF! 🌍
              </div>
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '10px', padding: '14px 18px', borderTop: '1px solid var(--bd)' }}>
              <input type="text" placeholder="Say something to Pinky..." disabled style={{
                flex: 1, background: 'var(--dk)', border: '1px solid var(--bd)', borderRadius: '22px',
                padding: '12px 18px', fontFamily: 'var(--fm)', fontSize: '0.75rem', color: 'var(--tx)', outline: 'none',
              }} />
              <button style={{
                width: '40px', height: '40px', borderRadius: '50%', background: 'var(--mx)', border: 'none',
                color: 'var(--bk)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px' }}>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--tx3)', marginTop: '24px', letterSpacing: '0.1em' }}>
            COMING SOON — LIVE CHAT WITH AI AGENTS
          </p>
        </div>
      </section>

    </PublicLayout>
  );
}
