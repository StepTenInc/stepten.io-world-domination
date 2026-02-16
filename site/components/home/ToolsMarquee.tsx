'use client';

import Link from 'next/link';

interface Tool {
  name: string;
  category: 'ide' | 'ai' | 'deploy' | 'design' | 'media' | 'backend';
  url?: string;
}

const tools: Tool[] = [
  // AI
  { name: 'Claude', category: 'ai', url: 'https://claude.ai' },
  { name: 'ChatGPT', category: 'ai', url: 'https://chat.openai.com' },
  { name: 'Grok', category: 'ai', url: 'https://grok.x.ai' },
  { name: 'Perplexity', category: 'ai', url: 'https://perplexity.ai' },
  
  // IDEs & Builders
  { name: 'Cursor', category: 'ide', url: 'https://cursor.sh' },
  { name: 'Replit', category: 'ide', url: 'https://replit.com' },
  { name: 'Windsurf', category: 'ide', url: 'https://codeium.com/windsurf' },
  { name: 'v0', category: 'ide', url: 'https://v0.dev' },
  { name: 'Bolt', category: 'ide', url: 'https://bolt.new' },
  { name: 'Lovable', category: 'ide', url: 'https://lovable.dev' },
  
  // Deploy & Backend
  { name: 'Vercel', category: 'deploy', url: 'https://vercel.com' },
  { name: 'Supabase', category: 'backend', url: 'https://supabase.com' },
  { name: 'GitHub', category: 'deploy', url: 'https://github.com' },
  { name: 'Cloudflare', category: 'deploy', url: 'https://cloudflare.com' },
  
  // Media
  { name: 'Midjourney', category: 'media', url: 'https://midjourney.com' },
  { name: 'DALL-E', category: 'media', url: 'https://openai.com/dall-e' },
  { name: 'Runway', category: 'media', url: 'https://runwayml.com' },
  { name: 'ElevenLabs', category: 'media', url: 'https://elevenlabs.io' },
  { name: 'Leonardo', category: 'media', url: 'https://leonardo.ai' },
  
  // Design
  { name: 'Figma', category: 'design', url: 'https://figma.com' },
  
  // Agents
  { name: 'Clawdbot', category: 'ai', url: 'https://clawd.bot' },
];

const categoryColors: Record<string, string> = {
  ai: '#00ff41',
  ide: '#00e5ff',
  deploy: '#ff9f43',
  backend: '#6bcb77',
  media: '#ff00ff',
  design: '#9b30ff',
};

export function ToolsMarquee() {
  // Double the tools for seamless loop
  const allTools = [...tools, ...tools];

  return (
    <section style={{
      padding: '60px 0',
      background: 'linear-gradient(180deg, var(--dk) 0%, var(--bg1) 50%, var(--dk) 100%)',
      overflow: 'hidden',
    }}>
      <div className="container" style={{ marginBottom: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.6rem',
            color: 'var(--mx)',
            letterSpacing: '0.3em',
            marginBottom: '12px',
          }}>
            // TOOLS WE ACTUALLY USE
          </div>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '8px',
          }}>
            The <span style={{ color: 'var(--mx)' }}>Stack</span>
          </h2>
          <p style={{
            fontFamily: 'var(--fb)',
            fontSize: '0.95rem',
            color: 'var(--tx3)',
          }}>
            If it exists, we've probably tried it.
          </p>
        </div>
      </div>

      {/* Marquee Row 1 - Left to Right */}
      <div style={{
        position: 'relative',
        marginBottom: '16px',
      }}>
        {/* Fade edges */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to right, var(--dk), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to left, var(--dk), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        <div
          className="marquee-track"
          style={{
            display: 'flex',
            gap: '16px',
            animation: 'marquee 30s linear infinite',
          }}
        >
          {allTools.map((tool, i) => (
            <ToolPill key={`${tool.name}-${i}`} tool={tool} />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Right to Left */}
      <div style={{ position: 'relative' }}>
        {/* Fade edges */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to right, var(--dk), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '100px',
          background: 'linear-gradient(to left, var(--dk), transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        <div
          className="marquee-track"
          style={{
            display: 'flex',
            gap: '16px',
            animation: 'marquee-reverse 35s linear infinite',
          }}
        >
          {[...allTools].reverse().map((tool, i) => (
            <ToolPill key={`${tool.name}-rev-${i}`} tool={tool} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link
          href="/tools"
          className="btn btn-primary"
          style={{
            fontSize: '0.75rem',
            padding: '16px 32px',
          }}
        >
          EXPLORE TOOLS →
        </Link>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function ToolPill({ tool }: { tool: Tool }) {
  const color = categoryColors[tool.category] || 'var(--tx2)';
  
  const content = (
    <div
      className="tool-pill"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 20px',
        background: 'var(--sf)',
        border: `1px solid ${color}30`,
        borderRadius: '12px',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
    >
      {/* Colored dot */}
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }} />
      
      <span style={{
        fontFamily: 'var(--fd)',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: 'var(--tx1)',
      }}>
        {tool.name}
      </span>

      <span style={{
        fontFamily: 'var(--fm)',
        fontSize: '0.5rem',
        color: color,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {tool.category}
      </span>
    </div>
  );

  if (tool.url) {
    return (
      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        {content}
      </a>
    );
  }

  return content;
}
