'use client';

import { useEffect } from 'react';
import { MatrixRain } from '@/components/effects/MatrixRain';
import { CommandOrb } from '@/components/nav/CommandOrb';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSwipeNav } from '@/hooks/useSwipeNav';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Initialize navigation hooks
  const { showShortcuts, setShowShortcuts } = useKeyboardNav();
  useSwipeNav();

  // Idle detection for screensaver mode (future)
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    const IDLE_TIMEOUT = 60000; // 60 seconds

    const resetIdle = () => {
      clearTimeout(idleTimer);
      // Could trigger exit idle mode here
      idleTimer = setTimeout(() => {
        // Could trigger enter idle mode here
        console.log('User idle - could show screensaver');
      }, IDLE_TIMEOUT);
    };

    const events = ['mousemove', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
      document.addEventListener(event, resetIdle, { passive: true });
    });

    resetIdle();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetIdle);
      });
    };
  }, []);

  // Tab visibility - pause animations when hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.classList.add('paused');
      } else {
        document.body.classList.remove('paused');
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  return (
    <>
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Scanlines Overlay */}
      <div className="scanlines" />

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>

      {/* Command Orb (Mobile) */}
      <CommandOrb />

      {/* Keyboard Shortcuts Overlay */}
      {showShortcuts && (
        <div
          onClick={() => setShowShortcuts(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(4,4,4,0.95)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: 'var(--mx)',
            marginBottom: '24px',
          }}>
            KEYBOARD SHORTCUTS
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px 32px',
          }}>
            {[
              { key: 'H', action: 'Home' },
              { key: 'T', action: 'Tales' },
              { key: 'M', action: 'Team' },
              { key: 'O', action: 'Tools' },
              { key: 'C', action: 'Chat' },
              { key: 'A', action: 'About' },
              { key: '?', action: 'Shortcuts' },
              { key: 'ESC', action: 'Close' },
            ].map(({ key, action }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <kbd style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  padding: '4px 10px',
                  background: 'var(--sf)',
                  border: '1px solid var(--mx)',
                  borderRadius: '4px',
                  color: 'var(--mx)',
                  minWidth: '32px',
                  textAlign: 'center',
                }}>
                  {key}
                </kbd>
                <span style={{
                  fontFamily: 'var(--fb)',
                  fontSize: '0.8rem',
                  color: 'var(--tx2)',
                }}>
                  {action}
                </span>
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.5rem',
            color: 'var(--tx4)',
            marginTop: '32px',
            letterSpacing: '0.1em',
          }}>
            PRESS ESC OR CLICK TO CLOSE
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        body.paused * {
          animation-play-state: paused !important;
        }
      `}</style>
    </>
  );
}
