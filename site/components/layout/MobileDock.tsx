'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', icon: '⚡', label: 'HOME' },
  { href: '/tales', icon: '📖', label: 'TALES' },
  { href: '/team', icon: '👥', label: 'TEAM' },
  { href: '/tools', icon: '🔧', label: 'TOOLS' },
  { href: '/chat', icon: '💬', label: 'CHAT' },
];

export function MobileDock() {
  const pathname = usePathname();

  return (
    <nav className="mobile-only" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.95) 100%)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--bd)',
      paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)',
      paddingTop: '8px',
    }}>
      {/* Glow line at top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '10%',
        right: '10%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, var(--mx), transparent)',
        opacity: 0.5,
      }} />
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '0 8px',
      }}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px 16px',
                textDecoration: 'none',
                borderRadius: '12px',
                transition: 'all 0.2s',
                position: 'relative',
                minWidth: '56px',
              }}
            >
              {/* Active indicator glow */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'var(--mxs)',
                  borderRadius: '12px',
                  border: '1px solid rgba(0,255,65,0.2)',
                }} />
              )}
              
              {/* Icon */}
              <span style={{
                fontSize: '1.3rem',
                filter: isActive ? 'drop-shadow(0 0 8px var(--mx))' : 'none',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s',
                position: 'relative',
                zIndex: 1,
              }}>
                {tab.icon}
              </span>
              
              {/* Label */}
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.45rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: isActive ? 'var(--mx)' : 'var(--tx3)',
                textShadow: isActive ? '0 0 10px var(--mxg)' : 'none',
                transition: 'all 0.2s',
                position: 'relative',
                zIndex: 1,
              }}>
                {tab.label}
              </span>
              
              {/* Active dot */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '12px',
                  width: '4px',
                  height: '4px',
                  background: 'var(--mx)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px var(--mx)',
                }} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
