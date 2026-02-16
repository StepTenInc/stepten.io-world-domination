'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '#crew', label: 'CREW' },
  { href: '#story', label: 'STORY' },
  { href: '/issues', label: 'ISSUES' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 40px',
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 255, 65, 0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link href="/">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#00ff41',
              textShadow: '0 0 30px rgba(0, 255, 65, 0.5)',
            }}
          >
            STEPTEN
          </span>
          <span style={{ color: '#555', fontFamily: 'var(--font-display)', fontSize: '24px' }}>™</span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#888',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00ff41')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
            >
              {link.label}
            </Link>
          ))}
          
          {/* CTA Button */}
          <button
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              padding: '10px 24px',
              backgroundColor: 'transparent',
              border: '2px solid #00ff41',
              color: '#00ff41',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00ff41';
              e.currentTarget.style.color = '#0a0a0a';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#00ff41';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    </nav>
  );
}
