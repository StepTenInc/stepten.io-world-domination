'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Globe, Plane, Calendar, FileText, BookOpen, Users, Wrench } from 'lucide-react';
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
        {/* Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(0,255,65,0.08) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // 10 YEARS OF PASSPORT STAMPS
            </div>
            <h1 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              fontWeight: 900,
              marginBottom: '16px',
            }}>
              The <span style={{ color: 'var(--mx)' }}>Journey</span>
            </h1>
            <p style={{
              fontFamily: 'var(--fb)',
              fontSize: '1.1rem',
              color: 'var(--tx2)',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              From Brisbane to Clark. Every flight. Every stamp. 40+ flights across 7 countries.
            </p>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            maxWidth: '500px',
            margin: '0 auto 32px',
          }}>
            {[
              { label: 'COUNTRIES', value: stats.countries, icon: Globe },
              { label: 'FLIGHTS', value: `${stats.flights}+`, icon: Plane },
              { label: 'YEARS', value: stats.years, icon: Calendar },
              { label: 'WORK VISAS', value: stats.visas, icon: FileText },
            ].map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} style={{
                  background: 'var(--sf)',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  border: '1px solid var(--bd)',
                }}>
                  <div style={{ color: 'var(--mx)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                    <IconComponent size={24} />
                  </div>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--mx)',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.45rem',
                    color: 'var(--tx3)',
                    letterSpacing: '0.1em',
                  }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated Flight Map */}
          <FlightMap />
        </div>
      </section>

      {/* Countries Section */}
      <section style={{ padding: '80px 0', background: 'var(--dk)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // COUNTRIES CONQUERED
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: 800,
            }}>
              7 Countries, <span style={{ color: 'var(--mx)' }}>1 Passport</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {countryStats.map((c) => (
              <div
                key={c.country}
                style={{
                  background: 'var(--sf)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid var(--bd)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Accent bar */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: c.color,
                }} />
                
                <div style={{
                  fontSize: '2.5rem',
                }}>
                  {c.country.split(' ')[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                  }}>
                    {c.country.split(' ').slice(1).join(' ')}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.7rem',
                    color: 'var(--tx3)',
                  }}>
                    {c.note}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: c.color,
                  textShadow: `0 0 20px ${c.color}40`,
                }}>
                  {c.visits}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // KEY MILESTONES
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              fontWeight: 800,
            }}>
              The <span style={{ color: 'var(--mx)' }}>Timeline</span>
            </h2>
          </div>

          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
            position: 'relative',
          }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(180deg, var(--mx), var(--mx)40)',
            }} />

            {[
              { year: '2016', title: 'The Big Move', desc: 'Left Australia with a one-way ticket to Manila. No plan, just a vision.' },
              { year: '2017', title: 'Work Visa', desc: 'Converted to Pre-arranged Employee. Officially working in Clark Freeport Zone.' },
              { year: '2019', title: 'SCWV Original', desc: 'Got the Subic-Clark Work Visa. President of ShoreAgents Inc.' },
              { year: '2020', title: 'COVID Lockdown', desc: 'Stuck in Philippines. No travel. Built the business.' },
              { year: '2022', title: 'Travel Returns', desc: 'First international trip post-COVID. Bali for Christmas.' },
              { year: '2024', title: 'Nomad Year', desc: 'Bali → Thailand → Vietnam → repeat. 6+ months traveling.' },
              { year: '2025', title: '2-Year Visa', desc: 'SCWV renewed for 2 years. Locked in until May 2027.' },
              { year: '2026', title: 'Current', desc: 'Visiting mum in Australia. Building the AI empire remotely.' },
            ].map((item, i) => (
              <div
                key={item.year}
                style={{
                  display: 'flex',
                  gap: '24px',
                  marginBottom: '32px',
                  paddingLeft: '50px',
                  position: 'relative',
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--mx)',
                  border: '3px solid var(--dk)',
                  boxShadow: '0 0 15px var(--mxg)',
                }} />

                <div style={{
                  background: 'var(--sf)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid var(--bd)',
                  flex: 1,
                }}>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: 'var(--mx)',
                    marginBottom: '8px',
                  }}>
                    {item.year}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    marginBottom: '6px',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fb)',
                    fontSize: '0.9rem',
                    color: 'var(--tx2)',
                    lineHeight: 1.6,
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
      <section style={{ padding: '80px 0', background: 'var(--sf)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.6rem',
              color: 'var(--mx)',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}>
              // KEEP EXPLORING
            </div>
            <h2 style={{
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: 800,
            }}>
              More from the <span style={{ color: 'var(--mx)' }}>Simulation</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            <Link href="/tales" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '12px' }}><BookOpen size={32} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Read the Tales
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  Stories from 30 years of fuckups, compressed into lessons.
                </p>
              </div>
            </Link>

            <Link href="/team" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '12px' }}><Users size={32} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Meet the Team
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  The AI army that runs the empire while I travel.
                </p>
              </div>
            </Link>

            <Link href="/tools" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dk)',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--bd)',
                transition: 'all 0.3s',
                cursor: 'pointer',
              }}>
                <div style={{ color: 'var(--mx)', marginBottom: '12px' }}><Wrench size={32} /></div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--tx)' }}>
                  Free Tools
                </h3>
                <p style={{ fontFamily: 'var(--fb)', fontSize: '0.85rem', color: 'var(--tx2)', lineHeight: 1.5 }}>
                  The actual AI tools I use to run everything remotely.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
