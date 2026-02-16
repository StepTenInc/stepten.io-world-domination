'use client';

import Image from 'next/image';
import { characters, type CharacterKey } from '@/lib/design-tokens';

interface CharacterCardProps {
  character: CharacterKey;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const data = characters[character];

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: '#111',
        border: '1px solid #222',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.borderColor = data.color;
        e.currentTarget.style.boxShadow = `0 0 30px ${data.glow}, 0 20px 60px rgba(0,0,0,0.5)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#222';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: data.color,
          boxShadow: `0 0 20px ${data.glow}`,
          zIndex: 5,
        }}
      />

      {/* Image */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          backgroundColor: '#0a0a0a',
          overflow: 'hidden',
        }}
      >
        <Image
          src={data.image}
          alt={data.name}
          fill
          style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(transparent, #111)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Info */}
      <div style={{ padding: '20px 24px 24px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 700,
            color: data.color,
            textShadow: `0 0 20px ${data.glow}`,
            marginBottom: '4px',
          }}
        >
          {data.name.toUpperCase()}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '12px',
            color: '#888',
            letterSpacing: '0.05em',
            marginBottom: '12px',
          }}
        >
          {data.role} · {data.era}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          "{data.tagline}"
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              padding: '4px 10px',
              border: `1px solid ${data.color}`,
              color: data.color,
              borderRadius: '4px',
              letterSpacing: '0.1em',
            }}
          >
            {data.era}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              padding: '4px 10px',
              border: '1px solid #00ff41',
              color: '#00ff41',
              borderRadius: '4px',
              letterSpacing: '0.1em',
            }}
          >
            AGENT
          </span>
        </div>
      </div>
    </div>
  );
}
