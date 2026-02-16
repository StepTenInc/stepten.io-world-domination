'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{
      background: 'var(--dk)',
      borderTop: '1px solid var(--bd)',
      padding: '48px 20px 32px',
      marginTop: '60px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '40px',
          marginBottom: '40px',
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px' }}>
              <span style={{ color: 'var(--mx)' }}>STEP</span>
              <span style={{ color: 'var(--tx)' }}>TEN™</span>
            </div>
            <p style={{
              fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx2)',
              lineHeight: 1.65, maxWidth: '280px',
            }}>
              I built an army of AI agents. This is their story — and the tools to build your own. 
              No products to sell. Just a founder sharing the journey.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 style={{
              fontFamily: 'var(--fd)', fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--tx3)', marginBottom: '16px',
            }}>
              EXPLORE
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="/tales">Tales</FooterLink>
              <FooterLink href="/team">The Team</FooterLink>
              <FooterLink href="/tools">Free Tools</FooterLink>
              <FooterLink href="/travel">Travel</FooterLink>
            </nav>
          </div>

          {/* About */}
          <div>
            <h4 style={{
              fontFamily: 'var(--fd)', fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--tx3)', marginBottom: '16px',
            }}>
              ABOUT
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="/about">The Story</FooterLink>
              <FooterLink href="/travel">The Journey</FooterLink>
              <FooterLink href="https://shoreagents.com" external>ShoreAgents</FooterLink>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 style={{
              fontFamily: 'var(--fd)', fontSize: '0.6rem', fontWeight: 700,
              letterSpacing: '0.12em', color: 'var(--tx3)', marginBottom: '16px',
            }}>
              CONNECT
            </h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <FooterLink href="https://twitter.com/StephenAtcheler" external>X / Twitter</FooterLink>
              <FooterLink href="https://github.com/StepTen2024" external>GitHub</FooterLink>
              <FooterLink href="https://linkedin.com/in/stephen-atcheler-b6004662" external>LinkedIn</FooterLink>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--bd)', marginBottom: '24px' }} />

        {/* Bottom */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'center', gap: '20px',
        }}>
          <div>
            <p style={{
              fontFamily: 'var(--fm)', fontSize: '0.55rem', color: 'var(--tx3)',
              letterSpacing: '0.05em', marginBottom: '4px',
            }}>
              © 2025-2026 STEPTEN™ · Part of the ShoreAgents ecosystem
            </p>
            <p style={{
              fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--tx4)',
              letterSpacing: '0.05em',
            }}>
              Built with Next.js · Supabase · AI Agents · From Clark Freeport Zone, Philippines 🇵🇭
            </p>
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <SocialLink href="https://twitter.com/StephenAtcheler" label="X/Twitter">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </SocialLink>
            <SocialLink href="https://github.com/StepTen2024" label="GitHub">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </SocialLink>
            <SocialLink href="https://linkedin.com/in/stephen-atcheler-b6004662" label="LinkedIn">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const Component = external ? 'a' : Link;
  return (
    <Component
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        fontFamily: 'var(--fb)', fontSize: '0.8rem', color: 'var(--tx2)',
        textDecoration: 'none', transition: 'color 0.2s',
      }}
    >
      {children}
    </Component>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ color: 'var(--tx3)', transition: 'color 0.2s' }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
        {children}
      </svg>
    </a>
  );
}
