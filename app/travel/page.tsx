'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Plane, Calendar, FileText, BookOpen, Users, Wrench, MapPin, Sparkles } from 'lucide-react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { FlightMap } from '@/components/travel';

const stats = {
  countries: 7,
  flights: 40,
  years: 10,
  visas: 5,
};

const countryStats = [
  { country: '🇵🇭 Philippines', visits: '50+', note: 'Home base since 2016', color: '#00ff41' },
  { country: '🇹🇭 Thailand', visits: '4', note: 'Bangkok, Chiang Mai', color: '#ffd93d' },
  { country: '🇻🇳 Vietnam', visits: '6+', note: 'Hanoi, Da Nang, Saigon', color: '#ff6b6b' },
  { country: '🇮🇩 Indonesia', visits: '6', note: 'Bali every time', color: '#00d4ff' },
  { country: '🇮🇳 India', visits: '4', note: 'Mumbai, Chennai', color: '#ff9f43' },
  { country: '🇲🇾 Malaysia', visits: '1', note: 'Kota Kinabalu, Sabah', color: '#4d96ff' },
  { country: '🇦🇺 Australia', visits: '5', note: 'Home visits', color: '#ffffff' },
];

export default function TravelPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <PublicLayout>

      {/* Hero */}
      <section style={{
        minHeight: '100dvh',
        paddingTop: '100px',
        paddingBottom: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(0,255,65,0.12) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: mounted ? 'float 8s ease-in-out infinite' : 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,107,107,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: mounted ? 'float 10s ease-in-out infinite reverse' : 'none',
        }} />

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              background: 'rgba(0,255,65,0.1)',
              borderRadius: '30px',
              marginBottom: '20px',
              border: '1px solid rgba(0,255,65,0.3)',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
              transition: 'all 0.6s ease-out',
            }}>
              <Plane size={16} style={{ color: 'var(--mx)' }} />
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.7rem',
                color: 'var(--mx)',
                letterSpacing: '0.2em',
              }}>
                10 YEARS OF PASSPORT STAMPS
              </span>
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2.5rem, 10vw, 5rem)',
              fontWeight: 900,
              marginBottom: '20px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease-out 0.1s',
            }}>
              The <span style={{ 
                color: 'var(--mx)',
                textShadow: '0 0 40px rgba(0,255,65,0.5)',
              }}>Journey</span>
            </h1>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '1.25rem',
              color: 'var(--tx2)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.7,
              opacity: mounted ? 1 : 0,
              transition: 'opacity 0.6s ease-out 0.2s',
            }}>
              From Brisbane to Clark. Every flight. Every stamp. 
              <span style={{ color: 'var(--mx)' }}> 40+ flights</span> across 
              <span style={{ color: '#00e5ff' }}> 7 countries</span>.
            </p>
          </div>

          {/* Stats Row - BIGGER */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s ease-out 0.3s',
          }}>
            {[
              { label: 'COUNTRIES', value: stats.countries, icon: Globe, color: '#00e5ff' },
              { label: 'FLIGHTS', value: `${stats.flights}+`, icon: Plane, color: '#00ff41' },
              { label: 'YEARS', value: stats.years, icon: Calendar, color: '#ffd93d' },
              { label: 'WORK VISAS', value: stats.visas, icon: FileText, color: '#ff6b6b' },
            ].map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} style={{
                  background: 'linear-gradient(135deg, var(--sf) 0%, rgba(15,15,20,1) 100%)',
                  borderRadius: '20px',
                  padding: '28px 20px',
                  textAlign: 'center',
                  border: `1px solid ${stat.color}30`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Glow */}
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: `radial-gradient(circle at center, ${stat.color}10 0%, transparent 50%)`,
                    pointerEvents: 'none',
                  }} />
                  <div style={{ 
                    color: stat.color, 
                    marginBottom: '12px', 
                    display: 'flex', 
                    justifyContent: 'center',
                    filter: `drop-shadow(0 0 10px ${stat.color})`,
                  }}>
                    <IconComponent size={32} />
                  </div>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: stat.color,
                    textShadow: `0 0 30px ${stat.color}60`,
                    lineHeight: 1,
                    marginBottom: '8px',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.6rem',
                    color: 'var(--tx3)',
                    letterSpacing: '0.15em',
                  }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated Flight Map */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease-out 0.4s',
          }}>
            <FlightMap />
          </div>
        </div>
      </section>

      {/* Countries Section - WIDER */}
      <section style={{ padding: '100px 0', background: 'var(--dk)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(0,255,65,0.1)',
              borderRadius: '20px',
              marginBottom: '16px',
            }}>
              <MapPin size={14} style={{ color: 'var(--mx)' }} />
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                color: 'var(--mx)',
                letterSpacing: '0.2em',
              }}>
                COUNTRIES CONQUERED
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 900,
            }}>
              7 Countries, <span style={{ 
                color: 'var(--mx)',
                textShadow: '0 0 30px rgba(0,255,65,0.4)',
              }}>1 Passport</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '20px',
          }}>
            {countryStats.map((c, i) => (
              <div
                key={c.country}
                style={{
                  background: 'linear-gradient(135deg, var(--sf) 0%, rgba(20,20,25,1) 100%)',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  border: `1px solid ${c.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '5px',
                  background: `linear-gradient(180deg, ${c.color}, ${c.color}60)`,
                  boxShadow: `0 0 20px ${c.color}`,
                }} />
                
                <div style={{
                  fontSize: '3.5rem',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                }}>
                  {c.country.split(' ')[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    marginBottom: '6px',
                  }}>
                    {c.country.split(' ').slice(1).join(' ')}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.8rem',
                    color: 'var(--tx3)',
                  }}>
                    {c.note}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: c.color,
                  textShadow: `0 0 30px ${c.color}60`,
                }}>
                  {c.visits}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Milestones - WIDER */}
      <section style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(0,255,65,0.1)',
              borderRadius: '20px',
              marginBottom: '16px',
            }}>
              <Sparkles size={14} style={{ color: 'var(--mx)' }} />
              <span style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                color: 'var(--mx)',
                letterSpacing: '0.2em',
              }}>
                KEY MILESTONES
              </span>
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              fontWeight: 900,
            }}>
              The <span style={{ 
                color: 'var(--mx)',
                textShadow: '0 0 30px rgba(0,255,65,0.4)',
              }}>Timeline</span>
            </h2>
          </div>

          <div style={{
            position: 'relative',
          }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: 0,
              bottom: 0,
              width: '3px',
              background: 'linear-gradient(180deg, var(--mx), var(--mx)20)',
              borderRadius: '2px',
            }} />

            {[
              { year: '2016', title: 'The Big Move', desc: 'Left Australia with a one-way ticket to Manila. No plan, just a vision.', color: '#00ff41' },
              { year: '2017', title: 'Work Visa', desc: 'Converted to Pre-arranged Employee. Officially working in Clark Freeport Zone.', color: '#00e5ff' },
              { year: '2019', title: 'SCWV Original', desc: 'Got the Subic-Clark Work Visa. President of ShoreAgents Inc.', color: '#ffd93d' },
              { year: '2020', title: 'COVID Lockdown', desc: 'Stuck in Philippines. No travel. Built the business.', color: '#ff6b6b' },
              { year: '2022', title: 'Travel Returns', desc: 'First international trip post-COVID. Bali for Christmas.', color: '#4d96ff' },
              { year: '2024', title: 'Nomad Year', desc: 'Bali → Thailand → Vietnam → repeat. 6+ months traveling.', color: '#ff9f43' },
              { year: '2025', title: '2-Year Visa', desc: 'SCWV renewed for 2 years. Locked in until May 2027.', color: '#a855f7' },
              { year: '2026', title: 'Current', desc: 'Visiting mum in Australia. Building the AI empire remotely.', color: '#00ff41' },
            ].map((item, i) => (
              <div
                key={item.year}
                style={{
                  display: 'flex',
                  gap: '28px',
                  marginBottom: '36px',
                  paddingLeft: '60px',
                  position: 'relative',
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '14px',
                  top: '8px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: item.color,
                  border: '4px solid var(--dk)',
                  boxShadow: `0 0 20px ${item.color}`,
                }} />

                <div style={{
                  background: 'linear-gradient(135deg, var(--sf) 0%, rgba(15,15,20,1) 100%)',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  border: `1px solid ${item.color}30`,
                  flex: 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Year badge */}
                  <div style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    background: `${item.color}20`,
                    borderRadius: '8px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontFamily: 'var(--fd)',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: item.color,
                    }}>
                      {item.year}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    marginBottom: '8px',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fb)',
                    fontSize: '1rem',
                    color: 'var(--tx2)',
                    lineHeight: 1.7,
                  }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 0', background: 'var(--sf)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.65rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '16px',
            }}>
              // KEEP EXPLORING
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: 900,
            }}>
              More from the <span style={{ 
                color: 'var(--mx)',
                textShadow: '0 0 30px rgba(0,255,65,0.4)',
              }}>Simulation</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}>
            <Link href="/tales" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '20px',
                padding: '36px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                height: '100%',
              }}>
                <div style={{ 
                  color: 'var(--mx)', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 0 10px rgba(0,255,65,0.5))',
                }}>
                  <BookOpen size={40} />
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--tx)' }}>
                  Read the Tales
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  Stories from 30 years of fuckups, compressed into lessons.
                </p>
              </div>
            </Link>

            <Link href="/team" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '20px',
                padding: '36px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                height: '100%',
              }}>
                <div style={{ 
                  color: 'var(--mx)', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 0 10px rgba(0,255,65,0.5))',
                }}>
                  <Users size={40} />
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--tx)' }}>
                  Meet the Team
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  The AI army that runs the empire while I travel.
                </p>
              </div>
            </Link>

            <Link href="/tools" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '20px',
                padding: '36px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                height: '100%',
              }}>
                <div style={{ 
                  color: 'var(--mx)', 
                  marginBottom: '16px',
                  filter: 'drop-shadow(0 0 10px rgba(0,255,65,0.5))',
                }}>
                  <Wrench size={40} />
                </div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px', color: 'var(--tx)' }}>
                  AI Tools
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '1rem', color: 'var(--tx2)', lineHeight: 1.6 }}>
                  The actual AI tools I use to run everything remotely.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
      `}</style>

    </PublicLayout>
  );
}
