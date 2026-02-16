'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FlightGlobe, flights, cities } from '@/components/travel';

const years = [2016, 2017, 2019, 2022, 2023, 2024, 2025, 2026];

const stats = {
  countries: 7,
  flights: 40,
  years: 10,
  visas: 5,
};

const countryStats = [
  { country: '🇵🇭 Philippines', visits: '50+', note: 'Home base since 2016' },
  { country: '🇹🇭 Thailand', visits: '4', note: 'Bangkok, Chiang Mai' },
  { country: '🇻🇳 Vietnam', visits: '6+', note: 'Hanoi, Da Nang, Saigon' },
  { country: '🇮🇩 Indonesia', visits: '6', note: 'Bali every time' },
  { country: '🇮🇳 India', visits: '4', note: 'Mumbai, Chennai' },
  { country: '🇲🇾 Malaysia', visits: '1', note: 'Kota Kinabalu, Sabah' },
  { country: '🇦🇺 Australia', visits: '5', note: 'Home visits' },
];

export default function TravelPage() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const filteredFlights = selectedYear
    ? flights.filter(f => f.year === selectedYear)
    : flights;

  return (
    <main>
      <Header />

      {/* Hero */}
      <section style={{
        minHeight: '100dvh',
        paddingTop: '100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
              From Brisbane to Clark. Every flight. Every stamp. Every country.
            </p>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            maxWidth: '600px',
            margin: '0 auto 40px',
          }}>
            {[
              { label: 'COUNTRIES', value: stats.countries },
              { label: 'FLIGHTS', value: `${stats.flights}+` },
              { label: 'YEARS', value: stats.years },
              { label: 'WORK VISAS', value: stats.visas },
            ].map((stat) => (
              <div key={stat.label} style={{
                background: 'var(--sf)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid var(--bd)',
              }}>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: 'var(--mx)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.5rem',
                  color: 'var(--tx3)',
                  letterSpacing: '0.1em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Year Filter */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '24px',
          }}>
            <button
              onClick={() => setSelectedYear(null)}
              style={{
                padding: '8px 16px',
                background: selectedYear === null ? 'var(--mx)' : 'var(--sf)',
                color: selectedYear === null ? 'var(--dk)' : 'var(--tx2)',
                border: '1px solid var(--bd)',
                borderRadius: '8px',
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              ALL
            </button>
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                style={{
                  padding: '8px 16px',
                  background: selectedYear === year ? 'var(--mx)' : 'var(--sf)',
                  color: selectedYear === year ? 'var(--dk)' : 'var(--tx2)',
                  border: '1px solid var(--bd)',
                  borderRadius: '8px',
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Globe */}
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid var(--bd)',
            boxShadow: '0 0 60px rgba(0,255,65,0.1)',
          }}>
            <FlightGlobe selectedYear={selectedYear} />
            
            {/* Legend */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              background: 'rgba(0,0,0,0.8)',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--bd)',
            }}>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.5rem',
                color: 'var(--tx3)',
                marginBottom: '8px',
              }}>
                FLIGHT PATHS BY YEAR
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[
                  { year: '2016', color: '#ff6b6b' },
                  { year: '2017', color: '#ffd93d' },
                  { year: '2019', color: '#4d96ff' },
                  { year: '2022-23', color: '#00d4ff' },
                  { year: '2024', color: '#00ff41' },
                  { year: '2025-26', color: '#ffffff' },
                ].map((item) => (
                  <div key={item.year} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '12px',
                      height: '3px',
                      background: item.color,
                      borderRadius: '2px',
                    }} />
                    <span style={{
                      fontFamily: 'var(--fm)',
                      fontSize: '0.55rem',
                      color: 'var(--tx2)',
                    }}>
                      {item.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Flight count */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0,0,0,0.8)',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid var(--bd)',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--mx)',
              }}>
                {filteredFlights.length}
              </div>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.5rem',
                color: 'var(--tx3)',
              }}>
                {selectedYear ? `FLIGHTS IN ${selectedYear}` : 'TOTAL FLIGHTS'}
              </div>
            </div>
          </div>
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
              // COUNTRIES VISITED
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            maxWidth: '900px',
            margin: '0 auto',
          }}>
            {countryStats.map((c) => (
              <div
                key={c.country}
                style={{
                  background: 'var(--sf)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid var(--bd)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div style={{
                  fontSize: '2rem',
                }}>
                  {c.country.split(' ')[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}>
                    {c.country.split(' ').slice(1).join(' ')}
                  </div>
                  <div style={{
                    fontFamily: 'var(--fm)',
                    fontSize: '0.6rem',
                    color: 'var(--tx3)',
                  }}>
                    {c.note}
                  </div>
                </div>
                <div style={{
                  fontFamily: 'var(--fd)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: 'var(--mx)',
                }}>
                  {c.visits}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              // FLIGHT LOG
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
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {filteredFlights.map((flight, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  background: 'var(--sf)',
                  borderRadius: '10px',
                  border: '1px solid var(--bd)',
                }}
              >
                <div style={{
                  fontFamily: 'var(--fm)',
                  fontSize: '0.65rem',
                  color: 'var(--tx3)',
                  minWidth: '40px',
                }}>
                  {flight.year}
                </div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getYearColor(flight.year),
                  boxShadow: `0 0 10px ${getYearColor(flight.year)}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--fd)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}>
                    {cities[flight.from]?.country} {cities[flight.from]?.name} → {cities[flight.to]?.country} {cities[flight.to]?.name}
                  </div>
                  {flight.label && (
                    <div style={{
                      fontFamily: 'var(--fm)',
                      fontSize: '0.55rem',
                      color: 'var(--tx3)',
                    }}>
                      {flight.label}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function getYearColor(year: number): string {
  const colors: Record<number, string> = {
    2016: '#ff6b6b',
    2017: '#ffd93d',
    2018: '#6bcb77',
    2019: '#4d96ff',
    2020: '#845ec2',
    2021: '#ff9671',
    2022: '#00d4ff',
    2023: '#ff00ff',
    2024: '#00ff41',
    2025: '#00e5ff',
    2026: '#ffffff',
  };
  return colors[year] || '#00ff41';
}
