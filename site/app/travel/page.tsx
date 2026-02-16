'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// Your actual passport data
const journeys = [
  {
    id: 1,
    date: '2016-06',
    from: { city: 'Brisbane', country: 'Australia', code: 'AU', lat: -27.47, lng: 153.02 },
    to: { city: 'Manila', country: 'Philippines', code: 'PH', lat: 14.60, lng: 120.98 },
    type: 'flight',
    title: 'The Big Move',
    description: 'Left Australia. Started the 10-year journey.',
    color: '#00ff88',
  },
  {
    id: 2,
    date: '2016-11',
    from: { city: 'Manila', country: 'Philippines', code: 'PH', lat: 14.60, lng: 120.98 },
    to: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    type: 'move',
    title: 'Clark Freeport Zone',
    description: 'Set up base. ShoreAgents HQ.',
    color: '#00ff88',
  },
  {
    id: 3,
    date: '2017-07',
    from: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    to: { city: 'Chennai', country: 'India', code: 'IN', lat: 13.08, lng: 80.27 },
    type: 'flight',
    title: 'India Trip',
    description: 'Business exploration. Dev team hunting.',
    color: '#ff6b6b',
  },
  {
    id: 4,
    date: '2017-07',
    from: { city: 'Chennai', country: 'India', code: 'IN', lat: 13.08, lng: 80.27 },
    to: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    type: 'flight',
    title: 'Back to Base',
    description: '',
    color: '#00ff88',
  },
  {
    id: 5,
    date: '2019-08',
    from: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    to: { city: 'Kota Kinabalu', country: 'Malaysia', code: 'MY', lat: 5.98, lng: 116.07 },
    type: 'flight',
    title: 'Sabah Adventure',
    description: 'Quick trip to Malaysian Borneo.',
    color: '#ffd93d',
  },
  {
    id: 6,
    date: '2019-08',
    from: { city: 'Kota Kinabalu', country: 'Malaysia', code: 'MY', lat: 5.98, lng: 116.07 },
    to: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    type: 'flight',
    title: 'Back to Base',
    description: '',
    color: '#00ff88',
  },
  {
    id: 7,
    date: '2022-11',
    from: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    to: { city: 'Bali', country: 'Indonesia', code: 'ID', lat: -8.34, lng: 115.09 },
    type: 'flight',
    title: 'Bali Break',
    description: 'End of year escape. Surfing disasters.',
    color: '#6bcb77',
  },
  {
    id: 8,
    date: '2023-01',
    from: { city: 'Bali', country: 'Indonesia', code: 'ID', lat: -8.34, lng: 115.09 },
    to: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    type: 'flight',
    title: 'Back to Grind',
    description: '',
    color: '#00ff88',
  },
  {
    id: 9,
    date: '2024-01',
    from: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    to: { city: 'Bali', country: 'Indonesia', code: 'ID', lat: -8.34, lng: 115.09 },
    type: 'flight',
    title: 'The Big Travel Year Begins',
    description: 'Extended Indonesia stay.',
    color: '#6bcb77',
  },
  {
    id: 10,
    date: '2024-02',
    from: { city: 'Bali', country: 'Indonesia', code: 'ID', lat: -8.34, lng: 115.09 },
    to: { city: 'Bangkok', country: 'Thailand', code: 'TH', lat: 13.76, lng: 100.50 },
    type: 'flight',
    title: 'Thailand',
    description: 'Bangkok vibes.',
    color: '#ff9f43',
  },
  {
    id: 11,
    date: '2024-03',
    from: { city: 'Bangkok', country: 'Thailand', code: 'TH', lat: 13.76, lng: 100.50 },
    to: { city: 'Hanoi', country: 'Vietnam', code: 'VN', lat: 21.03, lng: 105.85 },
    type: 'flight',
    title: 'Vietnam Exploration',
    description: 'Noi Bai arrival.',
    color: '#ee5a24',
  },
  {
    id: 12,
    date: '2024-06',
    from: { city: 'Vietnam', country: 'Vietnam', code: 'VN', lat: 16.05, lng: 108.22 },
    to: { city: 'Da Nang', country: 'Vietnam', code: 'VN', lat: 16.05, lng: 108.22 },
    type: 'move',
    title: 'Da Nang Base',
    description: 'Had a surfboard shaped here.',
    color: '#ee5a24',
  },
  {
    id: 13,
    date: '2024-09',
    from: { city: 'Da Nang', country: 'Vietnam', code: 'VN', lat: 16.05, lng: 108.22 },
    to: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    type: 'flight',
    title: 'Back to Fix ShoreAgents',
    description: 'Time to sort out business.',
    color: '#00ff88',
  },
  {
    id: 14,
    date: '2024-10',
    from: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    to: { city: 'Da Nang', country: 'Vietnam', code: 'VN', lat: 16.05, lng: 108.22 },
    type: 'flight',
    title: 'More Vietnam',
    description: '',
    color: '#ee5a24',
  },
  {
    id: 15,
    date: '2024-12',
    from: { city: 'Vietnam', country: 'Vietnam', code: 'VN', lat: 16.05, lng: 108.22 },
    to: { city: 'Bali', country: 'Indonesia', code: 'ID', lat: -8.34, lng: 115.09 },
    type: 'flight',
    title: 'Christmas in Bali',
    description: 'Discovered Replit. Changed everything.',
    color: '#6bcb77',
  },
  {
    id: 16,
    date: '2025-03',
    from: { city: 'Vietnam', country: 'Vietnam', code: 'VN', lat: 16.05, lng: 108.22 },
    to: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    type: 'flight',
    title: 'Return to Fix Everything',
    description: 'ShoreAgents needed work.',
    color: '#00ff88',
  },
  {
    id: 17,
    date: '2026-02',
    from: { city: 'Clark', country: 'Philippines', code: 'PH', lat: 15.19, lng: 120.54 },
    to: { city: 'Brisbane', country: 'Australia', code: 'AU', lat: -27.47, lng: 153.02 },
    type: 'flight',
    title: 'Home to See Mum',
    description: 'Passport renewal. Family time.',
    color: '#00d4ff',
  },
];

const countries = [
  { code: 'AU', name: 'Australia', emoji: '🇦🇺', color: '#00d4ff' },
  { code: 'PH', name: 'Philippines', emoji: '🇵🇭', color: '#00ff88' },
  { code: 'IN', name: 'India', emoji: '🇮🇳', color: '#ff6b6b' },
  { code: 'MY', name: 'Malaysia', emoji: '🇲🇾', color: '#ffd93d' },
  { code: 'ID', name: 'Indonesia', emoji: '🇮🇩', color: '#6bcb77' },
  { code: 'TH', name: 'Thailand', emoji: '🇹🇭', color: '#ff9f43' },
  { code: 'VN', name: 'Vietnam', emoji: '🇻🇳', color: '#ee5a24' },
];

const stats = {
  yearsAbroad: 10,
  countries: 7,
  flights: 30,
  homeBase: 'Clark, Philippines',
};

export default function TravelPage() {
  const [selectedJourney, setSelectedJourney] = useState<number | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <Header />
      
      {/* Hero */}
      <section style={{
        padding: '120px 16px 60px',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(0,255,136,0.05) 0%, transparent 100%)',
      }}>
        <div style={{
          fontFamily: 'var(--fm)',
          fontSize: '0.65rem',
          color: 'var(--mx)',
          letterSpacing: '0.3em',
          marginBottom: '16px',
        }}>
          // 10 YEARS. 7 COUNTRIES. 1 MISSION.
        </div>
        <h1 style={{
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(2rem, 8vw, 4rem)',
          fontWeight: 900,
          marginBottom: '16px',
        }}>
          THE <span style={{ color: 'var(--mx)' }}>PASSPORT</span> JOURNEY
        </h1>
        <p style={{
          fontFamily: 'var(--fm)',
          fontSize: '1rem',
          color: 'var(--tx2)',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Left Australia in 2016 with a one-way ticket. Every stamp tells a story.
        </p>
      </section>

      {/* Stats Bar */}
      <section style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
        padding: '20px 16px 40px',
        borderBottom: '1px solid var(--br)',
      }}>
        {[
          { label: 'Years Abroad', value: stats.yearsAbroad, suffix: '+' },
          { label: 'Countries', value: stats.countries, suffix: '' },
          { label: 'Flights', value: stats.flights, suffix: '+' },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--fd)',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: 'var(--mx)',
            }}>
              {stat.value}{stat.suffix}
            </div>
            <div style={{
              fontFamily: 'var(--fm)',
              fontSize: '0.7rem',
              color: 'var(--tx3)',
              letterSpacing: '0.1em',
            }}>
              {stat.label.toUpperCase()}
            </div>
          </div>
        ))}
      </section>

      {/* Countries Grid */}
      <section style={{ padding: '40px 16px' }}>
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: 'var(--tx3)',
            letterSpacing: '0.2em',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            COUNTRIES STAMPED
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            {countries.map((country) => (
              <div
                key={country.code}
                onMouseEnter={() => setHoveredCountry(country.code)}
                onMouseLeave={() => setHoveredCountry(null)}
                style={{
                  padding: '12px 20px',
                  background: hoveredCountry === country.code ? country.color + '20' : 'var(--bg2)',
                  border: `1px solid ${hoveredCountry === country.code ? country.color : 'var(--br)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{country.emoji}</span>
                <span style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.8rem',
                  color: hoveredCountry === country.code ? country.color : 'var(--tx2)',
                }}>
                  {country.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '40px 16px 80px' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: 'var(--tx3)',
            letterSpacing: '0.2em',
            marginBottom: '40px',
            textAlign: 'center',
          }}>
            FLIGHT PATH
          </h2>
          
          {/* Timeline Line */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: '20px',
              top: 0,
              bottom: 0,
              width: '2px',
              background: 'linear-gradient(to bottom, var(--mx), var(--ac1), var(--ac2))',
              opacity: 0.3,
            }} />
            
            {/* Journey Cards */}
            {journeys.filter(j => j.title && j.description).map((journey, index) => (
              <div
                key={journey.id}
                onClick={() => setSelectedJourney(selectedJourney === journey.id ? null : journey.id)}
                style={{
                  position: 'relative',
                  marginBottom: '24px',
                  paddingLeft: '50px',
                  cursor: 'pointer',
                }}
              >
                {/* Node */}
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '8px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: journey.color,
                  boxShadow: `0 0 20px ${journey.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {journey.type === 'flight' ? (
                    <span style={{ fontSize: '10px' }}>✈️</span>
                  ) : (
                    <span style={{ fontSize: '8px' }}>📍</span>
                  )}
                </div>
                
                {/* Card */}
                <div style={{
                  background: selectedJourney === journey.id ? 'var(--bg2)' : 'var(--bg1)',
                  border: `1px solid ${selectedJourney === journey.id ? journey.color : 'var(--br)'}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  transition: 'all 0.2s ease',
                }}>
                  {/* Date */}
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.65rem',
                    color: journey.color,
                    letterSpacing: '0.1em',
                    marginBottom: '4px',
                  }}>
                    {journey.date}
                  </div>
                  
                  {/* Route */}
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{countries.find(c => c.code === journey.from.code)?.emoji}</span>
                    <span style={{ color: 'var(--tx2)' }}>{journey.from.city}</span>
                    <span style={{ color: journey.color }}>→</span>
                    <span>{countries.find(c => c.code === journey.to.code)?.emoji}</span>
                    <span style={{ color: 'var(--tx2)' }}>{journey.to.city}</span>
                  </div>
                  
                  {/* Title */}
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--tx1)',
                    marginBottom: '8px',
                  }}>
                    {journey.title}
                  </div>
                  
                  {/* Description */}
                  {journey.description && (
                    <div style={{
                      fontFamily: 'var(--fm)',
                      fontSize: '0.85rem',
                      color: 'var(--tx3)',
                      lineHeight: 1.5,
                    }}>
                      {journey.description}
                    </div>
                  )}
                  
                  {/* Expanded content placeholder */}
                  {selectedJourney === journey.id && (
                    <div style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: 'var(--bg1)',
                      borderRadius: '8px',
                      border: '1px dashed var(--br)',
                    }}>
                      <div style={{
                        fontFamily: 'var(--fm)',
                        fontSize: '0.75rem',
                        color: 'var(--tx3)',
                        fontStyle: 'italic',
                      }}>
                        📝 Story content coming soon...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '60px 16px',
        textAlign: 'center',
        borderTop: '1px solid var(--br)',
      }}>
        <h2 style={{
          fontFamily: 'var(--fd)',
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '16px',
        }}>
          Want to visualize <span style={{ color: 'var(--mx)' }}>your</span> passport journey?
        </h2>
        <p style={{
          fontFamily: 'var(--fm)',
          fontSize: '0.9rem',
          color: 'var(--tx3)',
          marginBottom: '24px',
        }}>
          Upload your passport stamps and we'll build your timeline.
        </p>
        <button style={{
          padding: '14px 32px',
          background: 'transparent',
          border: '2px solid var(--mx)',
          color: 'var(--mx)',
          fontFamily: 'var(--fd)',
          fontSize: '0.85rem',
          fontWeight: 700,
          borderRadius: '8px',
          cursor: 'pointer',
          letterSpacing: '0.05em',
        }}>
          COMING SOON
        </button>
      </section>

      <Footer />
    </main>
  );
}
