'use client';

import { useEffect, useState, useRef } from 'react';

// City coordinates (normalized 0-100 for SVG viewBox)
// Based on a cropped Asia-Pacific view
const cities: Record<string, { x: number; y: number; name: string; flag: string }> = {
  brisbane: { x: 88, y: 75, name: 'Brisbane', flag: '🇦🇺' },
  sydney: { x: 86, y: 80, name: 'Sydney', flag: '🇦🇺' },
  manila: { x: 58, y: 42, name: 'Manila', flag: '🇵🇭' },
  clark: { x: 57, y: 40, name: 'Clark', flag: '🇵🇭' },
  bangkok: { x: 42, y: 42, name: 'Bangkok', flag: '🇹🇭' },
  chiangmai: { x: 40, y: 36, name: 'Chiang Mai', flag: '🇹🇭' },
  hanoi: { x: 48, y: 34, name: 'Hanoi', flag: '🇻🇳' },
  danang: { x: 50, y: 42, name: 'Da Nang', flag: '🇻🇳' },
  saigon: { x: 48, y: 50, name: 'Saigon', flag: '🇻🇳' },
  bali: { x: 54, y: 65, name: 'Bali', flag: '🇮🇩' },
  mumbai: { x: 22, y: 38, name: 'Mumbai', flag: '🇮🇳' },
  chennai: { x: 26, y: 48, name: 'Chennai', flag: '🇮🇳' },
  kotakinabalu: { x: 54, y: 52, name: 'Kota Kinabalu', flag: '🇲🇾' },
};

interface Flight {
  id: number;
  from: string;
  to: string;
  year: number;
  month?: string;
  title: string;
  description: string;
  color: string;
}

const flights: Flight[] = [
  // 2016
  { id: 1, from: 'brisbane', to: 'manila', year: 2016, month: 'Jun', title: 'The Big Move', description: 'Left Australia. Started the 10-year journey. No plan, just a one-way ticket.', color: '#ff6b6b' },
  { id: 2, from: 'manila', to: 'mumbai', year: 2016, month: 'Sep', title: 'Visit CB in Mumbai', description: 'Flew to India to see my mate CB. First time in India. Culture shock.', color: '#ff6b6b' },
  { id: 3, from: 'mumbai', to: 'brisbane', year: 2016, month: 'Sep', title: 'Quick Home Visit', description: 'Back to Oz briefly before returning to PH.', color: '#ff6b6b' },
  { id: 4, from: 'brisbane', to: 'mumbai', year: 2016, month: 'Oct', title: 'Sister\'s Wedding Trip', description: 'Back to India for 3 weeks after my sister\'s wedding. Exploring.', color: '#ff6b6b' },
  { id: 5, from: 'mumbai', to: 'manila', year: 2016, month: 'Nov', title: 'Back to Base', description: 'Returned to Philippines. This is home now.', color: '#ff6b6b' },
  { id: 6, from: 'manila', to: 'bangkok', year: 2016, month: 'Dec', title: 'NYE with a Girl', description: 'Took a Filipina to Thailand for Christmas & New Years. 11 days in Bangkok.', color: '#ff6b6b' },
  
  // 2017
  { id: 7, from: 'bangkok', to: 'manila', year: 2017, month: 'Jan', title: 'Back from Thailand', description: 'NYE done. Back to work building the business.', color: '#ffd93d' },
  { id: 8, from: 'clark', to: 'chennai', year: 2017, month: 'Jul', title: 'Chennai Trip #1', description: 'Flew to India to check out dev talent. 4 days in Chennai.', color: '#ffd93d' },
  { id: 9, from: 'chennai', to: 'clark', year: 2017, month: 'Jul', title: 'Back to Clark', description: 'Returned with insights. Building the team.', color: '#ffd93d' },
  { id: 10, from: 'clark', to: 'chennai', year: 2017, month: 'Nov', title: 'Chennai Trip #2', description: 'Second India trip. 6 days this time. Dev hunting.', color: '#ffd93d' },
  { id: 11, from: 'chennai', to: 'clark', year: 2017, month: 'Nov', title: 'Back to Base', description: 'Got the SCWV work visa. Now legally working in Clark.', color: '#ffd93d' },
  
  // 2019
  { id: 12, from: 'clark', to: 'bali', year: 2019, month: 'Feb', title: 'Bali Getaway', description: '3 days in Bali. Quick escape from work.', color: '#4d96ff' },
  { id: 13, from: 'bali', to: 'clark', year: 2019, month: 'Feb', title: 'Back to Work', description: 'Short but sweet. Bali will become a regular.', color: '#4d96ff' },
  { id: 14, from: 'clark', to: 'kotakinabalu', year: 2019, month: 'Aug', title: 'Sabah Adventure', description: '3 days in Malaysian Borneo. Kota Kinabalu.', color: '#4d96ff' },
  { id: 15, from: 'kotakinabalu', to: 'clark', year: 2019, month: 'Aug', title: 'Back to Clark', description: 'Got the original SCWV in December. Official now.', color: '#4d96ff' },
  
  // 2022-2023
  { id: 16, from: 'clark', to: 'bali', year: 2022, month: 'Dec', title: 'Christmas in Bali', description: 'First real travel post-COVID. A week in Bali.', color: '#00d4ff' },
  { id: 17, from: 'bali', to: 'clark', year: 2023, month: 'Jan', title: 'Back to Clark', description: 'New year, back to building.', color: '#ff00ff' },
  { id: 18, from: 'clark', to: 'bali', year: 2023, month: 'Mar', title: 'Quick Bali Trip', description: '3 day weekend in Bali. Can\'t stay away.', color: '#ff00ff' },
  { id: 19, from: 'bali', to: 'clark', year: 2023, month: 'Mar', title: 'Back to Work', description: 'Building ShoreAgents. Growing the team.', color: '#ff00ff' },
  
  // 2024 - The Big Travel Year
  { id: 20, from: 'clark', to: 'bali', year: 2024, month: 'Jan', title: 'January Bali', description: '29 days in Bali. Working remotely. Living the dream.', color: '#00ff41' },
  { id: 21, from: 'bali', to: 'bangkok', year: 2024, month: 'Feb', title: 'To Thailand', description: 'Left Bali, headed to Bangkok. Month in Thailand coming up.', color: '#00ff41' },
  { id: 22, from: 'bangkok', to: 'chiangmai', year: 2024, month: 'Mar', title: 'North to Chiang Mai', description: 'Explored northern Thailand. Digital nomad vibes.', color: '#00ff41' },
  { id: 23, from: 'chiangmai', to: 'hanoi', year: 2024, month: 'Mar', title: 'Vietnam Begins', description: 'Flew to Hanoi. First time in Vietnam.', color: '#00ff41' },
  { id: 24, from: 'hanoi', to: 'clark', year: 2024, month: 'Apr', title: 'Quick PH Stop', description: 'Back to handle some business.', color: '#00ff41' },
  { id: 25, from: 'clark', to: 'bangkok', year: 2024, month: 'Jun', title: 'Back to Thailand', description: 'Round 2 in Thailand.', color: '#00ff41' },
  { id: 26, from: 'bangkok', to: 'danang', year: 2024, month: 'Jun', title: 'To Da Nang', description: '73 days in Vietnam. Working from cafes.', color: '#00ff41' },
  { id: 27, from: 'danang', to: 'clark', year: 2024, month: 'Sep', title: 'Back to PH', description: 'Long Vietnam trip done. Back to base.', color: '#00ff41' },
  { id: 28, from: 'clark', to: 'bali', year: 2024, month: 'Dec', title: 'Christmas Bali', description: '9 days in Bali for Christmas.', color: '#00ff41' },
  { id: 29, from: 'bali', to: 'saigon', year: 2024, month: 'Dec', title: 'To Saigon', description: 'Flew to Ho Chi Minh City. More Vietnam.', color: '#00ff41' },
  
  // 2025
  { id: 30, from: 'saigon', to: 'danang', year: 2025, month: 'Mar', title: 'Da Nang Again', description: 'Quick 1-day trip through Da Nang.', color: '#00e5ff' },
  { id: 31, from: 'danang', to: 'clark', year: 2025, month: 'Mar', title: 'Back to Clark', description: 'Renewed SCWV. 2-year visa now. Locked in til 2027.', color: '#00e5ff' },
  
  // 2026
  { id: 32, from: 'clark', to: 'brisbane', year: 2026, month: 'Feb', title: 'Visiting Mum', description: 'Currently in Australia. First home visit in a while.', color: '#ffffff' },
];

export function FlightMap() {
  const [currentFlight, setCurrentFlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [progress, setProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // Auto-play through flights
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setCurrentFlight((f) => (f + 1) % flights.length);
          return 0;
        }
        return p + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const flight = flights[currentFlight];
  const fromCity = cities[flight.from];
  const toCity = cities[flight.to];

  // Calculate plane position along path
  const planeX = fromCity.x + (toCity.x - fromCity.x) * (progress / 100);
  const planeY = fromCity.y + (toCity.y - fromCity.y) * (progress / 100);
  
  // Add arc to path (curve upward)
  const midX = (fromCity.x + toCity.x) / 2;
  const midY = (fromCity.y + toCity.y) / 2 - 10; // Arc upward

  // Calculate rotation angle for plane
  const angle = Math.atan2(toCity.y - fromCity.y, toCity.x - fromCity.x) * (180 / Math.PI);

  return (
    <div style={{ position: 'relative' }}>
      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => setCurrentFlight((f) => (f - 1 + flights.length) % flights.length)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--sf)',
            border: '1px solid var(--bd)',
            color: 'var(--tx1)',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          style={{
            padding: '12px 32px',
            borderRadius: '30px',
            background: isPlaying ? 'var(--mx)' : 'var(--sf)',
            border: '1px solid var(--mx)',
            color: isPlaying ? 'var(--dk)' : 'var(--mx)',
            fontFamily: 'var(--fd)',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
        </button>
        
        <button
          onClick={() => setCurrentFlight((f) => (f + 1) % flights.length)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--sf)',
            border: '1px solid var(--bd)',
            color: 'var(--tx1)',
            fontSize: '1.2rem',
            cursor: 'pointer',
          }}
        >
          →
        </button>
      </div>

      {/* Flight Counter */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <span style={{
          fontFamily: 'var(--fm)',
          fontSize: '0.65rem',
          color: 'var(--tx3)',
        }}>
          FLIGHT {currentFlight + 1} OF {flights.length}
        </span>
      </div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #0a1628 0%, #0d0d0d 100%)',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--bd)',
        boxShadow: '0 0 60px rgba(0,255,65,0.1)',
      }}>
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '16/10',
          }}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,255,65,0.05)" strokeWidth="0.1"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* All previous flight paths (faded) */}
          {flights.slice(0, currentFlight).map((f, i) => {
            const from = cities[f.from];
            const to = cities[f.to];
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2 - 8;
            return (
              <path
                key={i}
                d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                fill="none"
                stroke={f.color}
                strokeWidth="0.3"
                opacity="0.2"
              />
            );
          })}

          {/* Current flight path */}
          <path
            d={`M ${fromCity.x} ${fromCity.y} Q ${midX} ${midY} ${toCity.x} ${toCity.y}`}
            fill="none"
            stroke={flight.color}
            strokeWidth="0.5"
            strokeDasharray="2,1"
            opacity="0.6"
          />

          {/* Animated flight path (fills in) */}
          <path
            d={`M ${fromCity.x} ${fromCity.y} Q ${midX} ${midY} ${toCity.x} ${toCity.y}`}
            fill="none"
            stroke={flight.color}
            strokeWidth="0.8"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            style={{
              filter: `drop-shadow(0 0 3px ${flight.color})`,
            }}
          />

          {/* City dots */}
          {Object.entries(cities).map(([id, city]) => {
            const isActive = id === flight.from || id === flight.to;
            return (
              <g key={id}>
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? 1.5 : 0.8}
                  fill={isActive ? flight.color : '#00ff41'}
                  opacity={isActive ? 1 : 0.4}
                  style={{
                    filter: isActive ? `drop-shadow(0 0 4px ${flight.color})` : undefined,
                  }}
                />
                {isActive && (
                  <>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="3"
                      fill="none"
                      stroke={flight.color}
                      strokeWidth="0.2"
                      opacity="0.5"
                    >
                      <animate
                        attributeName="r"
                        from="1.5"
                        to="4"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.6"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <text
                      x={city.x}
                      y={city.y - 3}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="2.5"
                      fontFamily="system-ui"
                    >
                      {city.flag} {city.name}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Plane icon */}
          <g transform={`translate(${planeX}, ${planeY}) rotate(${angle})`}>
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="4"
              style={{
                filter: `drop-shadow(0 0 3px ${flight.color})`,
              }}
            >
              ✈️
            </text>
          </g>
        </svg>

        {/* Flight Info Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px 20px',
          border: `1px solid ${flight.color}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              padding: '8px 12px',
              background: `${flight.color}20`,
              borderRadius: '8px',
              border: `1px solid ${flight.color}40`,
            }}>
              <div style={{
                fontFamily: 'var(--fd)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: flight.color,
              }}>
                {flight.year}
              </div>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.55rem',
                color: 'var(--tx3)',
              }}>
                {flight.month || ''}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--fd)',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '4px',
              }}>
                {flight.title}
              </div>
              <div style={{
                fontFamily: 'var(--fm)',
                fontSize: '0.7rem',
                color: flight.color,
                marginBottom: '6px',
              }}>
                {fromCity.flag} {fromCity.name} → {toCity.flag} {toCity.name}
              </div>
              <div style={{
                fontFamily: 'var(--fb)',
                fontSize: '0.8rem',
                color: 'var(--tx2)',
                lineHeight: 1.5,
              }}>
                {flight.description}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            marginTop: '12px',
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: flight.color,
              transition: 'width 0.05s linear',
            }} />
          </div>
        </div>
      </div>

      {/* Year Jump Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '24px',
        flexWrap: 'wrap',
      }}>
        {[2016, 2017, 2019, 2022, 2023, 2024, 2025, 2026].map((year) => {
          const yearIndex = flights.findIndex(f => f.year === year);
          const isActive = flight.year === year;
          const color = flights.find(f => f.year === year)?.color || '#00ff41';
          return (
            <button
              key={year}
              onClick={() => {
                setCurrentFlight(yearIndex);
                setProgress(0);
              }}
              style={{
                padding: '8px 16px',
                background: isActive ? color : 'var(--sf)',
                color: isActive ? 'var(--dk)' : 'var(--tx2)',
                border: `1px solid ${isActive ? color : 'var(--bd)'}`,
                borderRadius: '8px',
                fontFamily: 'var(--fm)',
                fontSize: '0.65rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {year}
            </button>
          );
        })}
      </div>
    </div>
  );
}
