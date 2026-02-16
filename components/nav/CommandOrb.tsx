'use client';

import { useState, useEffect, ComponentType } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Home, BookOpen, Users, Wrench, MessageCircle, Zap } from 'lucide-react';

interface Page {
  id: string;
  href: string;
  icon: ComponentType<{ size?: number }>;
  name: string;
  hint: string;
}

const pages: Page[] = [
  { id: 'home', href: '/', icon: Home, name: 'HOME', hint: 'THE HUB' },
  { id: 'tales', href: '/tales', icon: BookOpen, name: 'TALES', hint: 'STORIES' },
  { id: 'team', href: '/team', icon: Users, name: 'TEAM', hint: 'THE ARMY' },
  { id: 'tools', href: '/tools', icon: Wrench, name: 'TOOLS', hint: 'FREE SHIT' },
  { id: 'chat', href: '/chat', icon: MessageCircle, name: 'CHAT', hint: 'AGENTS' },
  { id: 'about', href: '/about', icon: Zap, name: 'ABOUT', hint: 'THE STORY' },
];

export function CommandOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = pages.find(p => p.href === pathname) || pages[0];

  const haptic = (pattern: number[] = [10]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const openCmd = () => {
    setIsOpen(true);
    haptic([10]);
  };

  const closeCmd = () => {
    setIsOpen(false);
    haptic([5]);
  };

  const navTo = (href: string) => {
    closeCmd();
    setTimeout(() => {
      router.push(href);
      haptic([6]);
    }, 200);
  };

  // Keyboard shortcut to close
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeCmd();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  return (
    <>
      {/* Command Orb Button */}
      <button
        onClick={openCmd}
        className="mobile-only"
        style={{
          position: 'fixed',
          bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          right: '16px',
          zIndex: 500,
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(10,10,10,0.92)',
          border: '2px solid var(--mx)',
          display: isOpen ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 24px rgba(0,0,0,.5), 0 0 16px var(--mxs)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'transform 0.4s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ display: 'block', height: '2px', width: '18px', background: 'var(--mx)', borderRadius: '1px' }} />
          <span style={{ display: 'block', height: '2px', width: '12px', background: 'var(--mx)', borderRadius: '1px' }} />
          <span style={{ display: 'block', height: '2px', width: '6px', background: 'var(--mx)', borderRadius: '1px' }} />
        </div>
        {/* Pulse ring */}
        <div style={{
          position: 'absolute',
          inset: '-5px',
          borderRadius: '50%',
          border: '1px solid var(--mxb)',
          animation: 'orbPulse 3s infinite',
        }} />
      </button>

      {/* Command Center Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(4,4,4,0.97)',
            backdropFilter: 'blur(50px)',
            WebkitBackdropFilter: 'blur(50px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={(e) => e.target === e.currentTarget && closeCmd()}
        >
          {/* Expanding Rings */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            border: '1px solid rgba(0,255,65,0.08)',
            transform: 'translate(-50%, -50%)',
            animation: 'ringExpand 0.5s ease forwards 0.05s',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            border: '1px solid rgba(0,255,65,0.05)',
            transform: 'translate(-50%, -50%)',
            animation: 'ringExpand 0.5s ease forwards 0.12s',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            border: '1px solid rgba(0,255,65,0.03)',
            transform: 'translate(-50%, -50%)',
            animation: 'ringExpand 0.5s ease forwards 0.18s',
          }} />

          {/* Close Button */}
          <button
            onClick={closeCmd}
            style={{
              position: 'absolute',
              top: '14px',
              right: '16px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--sf)',
              border: '1px solid var(--bd)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--tx3)',
              zIndex: 5,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Current Location */}
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.5rem',
            color: 'var(--mx)',
            letterSpacing: '0.3em',
            marginBottom: '20px',
            animation: 'slideUp 0.35s ease forwards 0.15s',
            opacity: 0,
          }}>
            // CURRENTLY: {currentPage.name}
          </div>

          {/* Nav Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            maxWidth: '320px',
            width: '100%',
            padding: '0 16px',
            position: 'relative',
            zIndex: 5,
          }}>
            {pages.map((page, i) => {
              const isHere = page.href === pathname;
              return (
                <button
                  key={page.id}
                  onClick={() => navTo(page.href)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '14px 6px 12px',
                    borderRadius: '14px',
                    background: isHere ? 'var(--mxs)' : 'var(--sf)',
                    border: `1px solid ${isHere ? 'var(--mx)' : 'var(--bd)'}`,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: `btnIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards ${0.1 + i * 0.04}s`,
                    opacity: 0,
                    transform: 'scale(0.6) translateY(16px)',
                  }}
                >
                  {isHere && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'var(--mx)',
                    }} />
                  )}
                  <page.icon size={24} />
                  <span style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '0.55rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    color: isHere ? 'var(--mx)' : 'var(--tx)',
                  }}>
                    {page.name}
                  </span>
                  <span style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.38rem',
                    color: 'var(--tx4)',
                    letterSpacing: '0.04em',
                  }}>
                    {page.hint}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tag */}
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.45rem',
            color: 'var(--tx4)',
            letterSpacing: '0.2em',
            marginTop: '24px',
            animation: 'fadeIn 0.4s ease forwards 0.4s',
            opacity: 0,
          }}>
            86 → 2000 → ∞
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ringExpand {
          from { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes btnIn {
          from { opacity: 0; transform: scale(0.6) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
