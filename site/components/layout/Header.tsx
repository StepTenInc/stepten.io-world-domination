'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/tales', label: 'Tales' },
  { href: '/team', label: 'Team' },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'linear-gradient(to bottom, rgba(10,10,10,0.95), rgba(10,10,10,0.85))',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--bd)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '56px',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--fd)',
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
          }}>
            <span style={{ color: 'var(--mx)', textShadow: '0 0 20px var(--mxg)' }}>STEP</span>
            <span style={{ color: 'var(--tx)' }}>TEN</span>
            <span style={{ color: 'var(--tx3)', fontSize: '0.7rem', marginLeft: '2px' }}>™</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-only" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--mx)' : 'var(--tx2)',
                  textDecoration: 'none',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  background: isActive ? 'var(--mxs)' : 'transparent',
                  border: isActive ? '1px solid rgba(0,255,65,0.2)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>

        {/* Mobile: Just show small tag */}
        <div className="mobile-only" style={{
          fontFamily: 'var(--fm)',
          fontSize: '0.5rem',
          color: 'var(--tx3)',
          letterSpacing: '0.1em',
          padding: '6px 10px',
          border: '1px solid var(--bd)',
          borderRadius: '4px',
        }}>
          AI ARMY
        </div>
      </div>
    </header>
  );
}
