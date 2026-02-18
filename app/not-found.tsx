'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404');
  
  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        const pos = Math.floor(Math.random() * 3);
        const newText = '404'.split('');
        newText[pos] = randomChar;
        setGlitchText(newText.join(''));
        setTimeout(() => setGlitchText('404'), 100);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{
      minHeight: '100dvh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Matrix rain background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.05,
        backgroundImage: `linear-gradient(var(--mx) 1px, transparent 1px),
          linear-gradient(90deg, var(--mx) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        pointerEvents: 'none',
      }} />
      
      {/* Hero Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '900px',
        aspectRatio: '16/9',
        marginBottom: '32px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '2px solid rgba(0, 255, 65, 0.3)',
        boxShadow: '0 0 60px rgba(0, 255, 65, 0.2), 0 20px 60px rgba(0, 0, 0, 0.5)',
      }}>
        <Image
          src="/images/404-hero.png"
          alt="Lost in the digital void - 404"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        {/* Scanline overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Glitchy 404 text */}
      <h1 style={{
        fontFamily: 'var(--fd)',
        fontSize: 'clamp(4rem, 15vw, 10rem)',
        fontWeight: 900,
        color: 'var(--mx)',
        textShadow: `
          0 0 20px var(--mx),
          0 0 40px var(--mx),
          0 0 80px var(--mxg),
          3px 3px 0 #ff00ff,
          -3px -3px 0 #00e5ff
        `,
        letterSpacing: '0.1em',
        marginBottom: '16px',
        animation: 'glitchPulse 3s infinite',
      }}>
        {glitchText}
      </h1>

      {/* Message */}
      <div style={{
        fontFamily: 'var(--fm)',
        fontSize: '0.7rem',
        color: 'var(--mx)',
        letterSpacing: '0.3em',
        marginBottom: '12px',
        textTransform: 'uppercase',
      }}>
        // SIMULATION ERROR
      </div>

      <h2 style={{
        fontFamily: 'var(--fd)',
        fontSize: 'clamp(1.2rem, 4vw, 2rem)',
        fontWeight: 700,
        color: 'var(--tx1)',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        You&apos;ve Fallen Out of the Matrix
      </h2>

      <p style={{
        fontFamily: 'var(--fb)',
        fontSize: '1rem',
        color: 'var(--tx2)',
        maxWidth: '500px',
        textAlign: 'center',
        lineHeight: 1.6,
        marginBottom: '32px',
      }}>
        This page doesn&apos;t exist anymore. Either it never did, or reality glitched. 
        The team is searching the void, but honestly? It&apos;s probably gone forever.
      </p>

      {/* CTA Button */}
      <Link 
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'var(--fd)',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: '#0a0a0a',
          background: 'var(--mx)',
          padding: '16px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          textTransform: 'uppercase',
          boxShadow: '0 0 30px var(--mxg)',
          transition: 'all 0.3s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        <span>←</span>
        <span>Return to Base</span>
      </Link>

      {/* Tales link */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '24px',
      }}>
        <Link
          href="/tales"
          style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: 'var(--tx3)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            transition: 'color 0.2s',
          }}
        >
          Read Tales →
        </Link>
        <Link
          href="/team"
          style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: 'var(--tx3)',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            transition: 'color 0.2s',
          }}
        >
          Meet the Team →
        </Link>
      </div>

      <style jsx global>{`
        @keyframes glitchPulse {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.8; transform: translateX(-2px); }
          94% { opacity: 1; transform: translateX(2px); }
          95% { opacity: 0.9; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}
