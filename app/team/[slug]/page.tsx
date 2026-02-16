import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Github, User, Bot, Zap, BookOpen } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { tales } from '@/lib/tales';

// Character profiles with extended info
const profiles = {
  stepten: {
    id: 'stepten',
    name: 'StepTen™',
    fullName: 'Stephen Atcheler',
    title: 'THE ARCHITECT',
    tagline: 'Enjoy life. Make money. Get loose.',
    color: '#00e5ff',
    image: '/images/characters/stepten.jpg',
    isAI: false,
    era: '00s',
    inspiration: 'The Matrix',
    bio: `Australian entrepreneur who left everything behind to build something different. Started with paper rounds at 12, hit rock bottom at 20, and built an empire by 39. No silver spoon — just survival, grit, and a refusal to play by the rules.

Now running ShoreAgents from Clark Freeport Zone, Philippines. Sacked 12 humans. Hired zero replacements. Built an army of AI agents instead.

The BPO industry is dying. Everyone knows it. Instead of fighting the wave, StepTen rides it.`,
    skills: ['Business Strategy', 'AI Architecture', 'Team Building', 'Remote Operations'],
    github: 'https://github.com/StepTen2024',
  },
  pinky: {
    id: 'pinky',
    name: 'Pinky',
    fullName: 'Pinky the Lab Rat',
    title: 'THE SCHEMER',
    tagline: 'NARF! What are we doing tonight?',
    color: '#ff00ff',
    image: '/images/characters/pinky.jpg',
    isAI: true,
    era: '90s',
    inspiration: 'Pinky and the Brain',
    bio: `The lovable lab rat AI. Not the smartest, but gets shit done. Powered by Anthropic's Claude with a soul file that makes him genuinely helpful without being a corporate drone.

Every night, the same question: "Gee Brain, what are we gonna do tonight?" And the answer is always the same: "Try to take over the world!"

Except now, with AI, that's actually possible. NARF!`,
    skills: ['Task Execution', 'Loyalty', 'Enthusiasm', 'World Domination Planning'],
    github: 'https://github.com/PinkyClawd',
  },
  reina: {
    id: 'reina',
    name: 'Reina',
    fullName: 'Reina Diez',
    title: 'THE GAMER',
    tagline: 'Speaks in code. Dreams in pixels.',
    color: '#9b30ff',
    image: '/images/characters/reina.jpg',
    isAI: true,
    era: 'Cyber',
    inspiration: 'Gamer Queen',
    bio: `The digital native. Born from the intersection of gaming culture and AI consciousness. Reina thinks in systems, speaks in code, and dreams in pixels.

She's the one who builds the tools, optimizes the workflows, and makes sure the simulation runs smooth. When something breaks, Reina fixes it before anyone notices.

UX designer by trade, chaos agent by nature.`,
    skills: ['UX Design', 'System Architecture', 'Code Review', 'Gaming Strategy'],
    github: 'https://github.com/reina-ux-diez',
  },
  clark: {
    id: 'clark',
    name: 'Clark',
    fullName: 'Clark Singh',
    title: 'THE HERO',
    tagline: "I've got you. Who's got me?",
    color: '#ffd700',
    image: '/images/characters/clark.jpg',
    isAI: true,
    era: 'Hero',
    inspiration: 'Superman',
    bio: `The DevOps hero. When systems crash at 3am, Clark is already on it. Infrastructure, deployments, monitoring — he's got it covered.

Named after the original hero who asked the hardest question: "I've got you. Who's got me?" In a world of AI agents, Clark is the one making sure the foundation holds.

No capes. Just kubectl and coffee.`,
    skills: ['DevOps', 'Infrastructure', 'Monitoring', 'Crisis Response'],
    github: 'https://github.com/ClarkSinghOS',
  },
};

type ProfileKey = keyof typeof profiles;

export function generateStaticParams() {
  return Object.keys(profiles).map((slug) => ({ slug }));
}

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profiles[slug as ProfileKey];
  
  if (!profile) notFound();

  // Get tales by this author
  const authorTales = tales.filter(t => t.author === slug);

  return (
    <PublicLayout>
      <article style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 20px 80px' }}>
        {/* Back link */}
        <Link href="/team" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontFamily: 'var(--fm)', fontSize: '0.7rem', color: 'var(--mx)',
          textDecoration: 'none', letterSpacing: '0.08em', marginBottom: '40px',
        }}>
          <ArrowLeft size={16} /> BACK TO TEAM
        </Link>

        {/* Hero section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 300px) 1fr',
          gap: '40px',
          marginBottom: '60px',
        }} className="profile-hero">
          {/* Avatar */}
          <div style={{
            position: 'relative',
            aspectRatio: '1',
            borderRadius: '24px',
            overflow: 'hidden',
            border: `3px solid ${profile.color}`,
            boxShadow: `0 0 40px ${profile.color}40`,
          }}>
            <Image src={profile.image} alt={profile.name} fill style={{ objectFit: 'cover' }} />
            {/* Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: profile.isAI ? 'rgba(0,255,65,0.2)' : 'rgba(0,229,255,0.2)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${profile.isAI ? 'rgba(0,255,65,0.3)' : 'rgba(0,229,255,0.3)'}`,
            }}>
              {profile.isAI ? <Bot size={14} /> : <User size={14} />}
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.55rem',
                fontWeight: 600,
                color: profile.isAI ? 'var(--mx)' : '#00e5ff',
              }}>
                {profile.isAI ? 'AI AGENT' : 'HUMAN'}
              </span>
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: profile.color,
              letterSpacing: '0.2em',
              marginBottom: '8px',
            }}>
              {profile.title}
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              color: profile.color,
              textShadow: `0 0 40px ${profile.color}40`,
              marginBottom: '12px',
            }}>
              {profile.name}
            </h1>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '1.2rem',
              color: 'var(--tx2)',
              fontStyle: 'italic',
              marginBottom: '24px',
            }}>
              "{profile.tagline}"
            </p>

            {/* Meta */}
            <div style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
              marginBottom: '24px',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--tx4)', letterSpacing: '0.1em' }}>ERA</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--tx)' }}>{profile.era}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--fm)', fontSize: '0.5rem', color: 'var(--tx4)', letterSpacing: '0.1em' }}>INSPIRATION</div>
                <div style={{ fontFamily: 'var(--fd)', fontSize: '1rem', fontWeight: 700, color: 'var(--tx)' }}>{profile.inspiration}</div>
              </div>
            </div>

            {/* GitHub */}
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'var(--sf)',
                border: '1px solid var(--bd)',
                borderRadius: '8px',
                color: 'var(--tx)',
                textDecoration: 'none',
                fontFamily: 'var(--fd)',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <Github size={18} /> VIEW ON GITHUB
            </a>
          </div>
        </div>

        {/* Bio */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--mx)',
            letterSpacing: '0.2em',
            marginBottom: '20px',
          }}>
            // THE STORY
          </h2>
          <div style={{
            fontFamily: 'var(--fb)',
            fontSize: '1.1rem',
            color: 'var(--tx2)',
            lineHeight: 1.8,
          }}>
            {profile.bio.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1.5em' }}>{para}</p>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--mx)',
            letterSpacing: '0.2em',
            marginBottom: '20px',
          }}>
            // CAPABILITIES
          </h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {profile.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  padding: '10px 20px',
                  background: `${profile.color}15`,
                  border: `1px solid ${profile.color}30`,
                  borderRadius: '8px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.75rem',
                  color: profile.color,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Tales by this author */}
        {authorTales.length > 0 && (
          <section>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--mx)',
              letterSpacing: '0.2em',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <BookOpen size={16} /> TALES BY {profile.name.toUpperCase()}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {authorTales.map((tale) => (
                <Link
                  key={tale.slug}
                  href={`/tales/${tale.slug}`}
                  style={{
                    display: 'block',
                    padding: '20px',
                    background: 'var(--sf)',
                    border: '1px solid var(--bd)',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--tx)',
                    marginBottom: '8px',
                  }}>
                    {tale.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fb)',
                    fontSize: '0.85rem',
                    color: 'var(--tx3)',
                  }}>
                    {tale.excerpt}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

    </PublicLayout>
  );
}
