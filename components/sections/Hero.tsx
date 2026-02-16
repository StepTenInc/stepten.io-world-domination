'use client';

import { useEffect, useRef } from 'react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'アイウエオカキクケコ0123456789STEPTEN';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.3 + 0.1;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        ctx.globalAlpha = 1;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Matrix Rain */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
        }}
      />

      {/* Center glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 255, 65, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 24px' }}>
        {/* Label */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: '#00ff41',
            letterSpacing: '0.5em',
            marginBottom: '24px',
          }}
        >
          // INITIALIZING UNIVERSE
        </p>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 10vw, 120px)',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          <span style={{ color: '#00ff41', textShadow: '0 0 60px rgba(0, 255, 65, 0.5)' }}>STEP</span>
          <span style={{ color: '#f0f0f0' }}>TEN</span>
          <span style={{ color: '#555' }}>™</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: 'clamp(14px, 2vw, 18px)',
            fontWeight: 300,
            color: '#888',
            letterSpacing: '0.15em',
            marginBottom: '12px',
          }}
        >
          UNIVERSE & CHARACTER SYSTEM
        </p>

        {/* Tags */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            color: '#555',
            letterSpacing: '0.3em',
            marginBottom: '48px',
          }}
        >
          CYBERPUNK · COMIC ART · MATRIX · GTA · 86–2000
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              padding: '16px 32px',
              backgroundColor: '#00ff41',
              border: 'none',
              color: '#0a0a0a',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 65, 0.5)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ENTER SIMULATION
          </button>
          <button
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              padding: '16px 32px',
              backgroundColor: 'transparent',
              border: '2px solid #888',
              color: '#888',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#00ff41';
              e.currentTarget.style.color = '#00ff41';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#888';
              e.currentTarget.style.color = '#888';
            }}
          >
            MEET THE ARMY
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '40px',
            border: '2px solid rgba(0, 255, 65, 0.3)',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '8px',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '8px',
              backgroundColor: '#00ff41',
              borderRadius: '2px',
              animation: 'scroll-bounce 2s infinite',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}
