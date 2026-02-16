'use client';

import { useEffect, useState, useRef } from 'react';

// City coordinates (normalized for Asia-Pacific focus)
const cities: Record<string, { x: number; y: number; name: string; flag: string }> = {
  brisbane: { x: 88, y: 78, name: 'Brisbane', flag: '🇦🇺' },
  sydney: { x: 86, y: 82, name: 'Sydney', flag: '🇦🇺' },
  manila: { x: 58, y: 42, name: 'Manila', flag: '🇵🇭' },
  clark: { x: 56, y: 39, name: 'Clark', flag: '🇵🇭' },
  bangkok: { x: 42, y: 44, name: 'Bangkok', flag: '🇹🇭' },
  chiangmai: { x: 40, y: 36, name: 'Chiang Mai', flag: '🇹🇭' },
  hanoi: { x: 48, y: 32, name: 'Hanoi', flag: '🇻🇳' },
  danang: { x: 50, y: 42, name: 'Da Nang', flag: '🇻🇳' },
  saigon: { x: 48, y: 52, name: 'Saigon', flag: '🇻🇳' },
  bali: { x: 54, y: 68, name: 'Bali', flag: '🇮🇩' },
  mumbai: { x: 20, y: 40, name: 'Mumbai', flag: '🇮🇳' },
  chennai: { x: 24, y: 50, name: 'Chennai', flag: '🇮🇳' },
  amritsar: { x: 18, y: 28, name: 'Amritsar', flag: '🇮🇳' },
  kotakinabalu: { x: 54, y: 54, name: 'Kota Kinabalu', flag: '🇲🇾' },
};

interface Flight {
  id: number;
  from: string;
  to: string;
  year: number;
  month?: string;
  title: string;
  description: string;
}

const flights: Flight[] = [
  { id: 1, from: 'brisbane', to: 'manila', year: 2016, month: 'Jun', title: 'THE BIG MOVE', description: 'One-way ticket. No plan. Just a vision.' },
  { id: 2, from: 'manila', to: 'mumbai', year: 2016, month: 'Sep', title: 'MUMBAI MISSION', description: 'Visiting mate CB. Setting up Indigowa.' },
  { id: 3, from: 'mumbai', to: 'amritsar', year: 2016, month: 'Sep', title: 'PUNJAB TRIP', description: 'Flew to Amritsar. Drove around Punjab.' },
  { id: 4, from: 'amritsar', to: 'mumbai', year: 2016, month: 'Sep', title: 'BACK TO MUMBAI', description: 'Return flight.' },
  { id: 5, from: 'mumbai', to: 'brisbane', year: 2016, month: 'Sep', title: 'QUICK HOME RUN', description: 'Back to Oz briefly.' },
  { id: 6, from: 'brisbane', to: 'mumbai', year: 2016, month: 'Oct', title: 'POST-WEDDING INDIA', description: '3 weeks exploring after sisters wedding.' },
  { id: 7, from: 'mumbai', to: 'manila', year: 2016, month: 'Nov', title: 'BACK TO BASE', description: 'Philippines is home now.' },
  { id: 8, from: 'manila', to: 'bangkok', year: 2016, month: 'Dec', title: 'NYE WITH A GIRL', description: '11 days in Bangkok. Christmas & New Years.' },
  { id: 9, from: 'bangkok', to: 'manila', year: 2017, month: 'Jan', title: 'BACK FROM THAILAND', description: 'NYE done. Back to building.' },
  { id: 10, from: 'clark', to: 'chennai', year: 2017, month: 'Jul', title: 'CHENNAI TRIP #1', description: '4 days. Checking out dev talent.' },
  { id: 11, from: 'chennai', to: 'clark', year: 2017, month: 'Jul', title: 'RETURN FLIGHT', description: 'Back with insights.' },
  { id: 12, from: 'clark', to: 'chennai', year: 2017, month: 'Nov', title: 'CHENNAI TRIP #2', description: '6 days this time. Dev hunting.' },
  { id: 13, from: 'chennai', to: 'clark', year: 2017, month: 'Nov', title: 'WORK VISA SECURED', description: 'Pre-arranged Employee status granted.' },
  { id: 14, from: 'clark', to: 'bali', year: 2019, month: 'Feb', title: 'BALI ESCAPE', description: '3 days in paradise.' },
  { id: 15, from: 'bali', to: 'clark', year: 2019, month: 'Feb', title: 'BACK TO GRIND', description: 'Short but sweet.' },
  { id: 16, from: 'clark', to: 'kotakinabalu', year: 2019, month: 'Aug', title: 'SABAH ADVENTURE', description: 'Malaysian Borneo. 3 days.' },
  { id: 17, from: 'kotakinabalu', to: 'clark', year: 2019, month: 'Aug', title: 'SCWV INCOMING', description: 'Original work visa in December.' },
  { id: 18, from: 'clark', to: 'bali', year: 2022, month: 'Dec', title: 'COVID OVER', description: 'First travel post-pandemic. Christmas in Bali.' },
  { id: 19, from: 'bali', to: 'clark', year: 2023, month: 'Jan', title: 'NEW YEAR NEW BUILDS', description: 'Back to work.' },
  { id: 20, from: 'clark', to: 'bali', year: 2023, month: 'Mar', title: 'QUICK BALI FIX', description: '3 day weekend. Cant stay away.' },
  { id: 21, from: 'bali', to: 'clark', year: 2023, month: 'Mar', title: 'BUILDING SHOREAGENTS', description: 'Growing the team.' },
  { id: 22, from: 'clark', to: 'bali', year: 2024, month: 'Jan', title: 'NOMAD MODE: ON', description: '29 days working from Bali.' },
  { id: 23, from: 'bali', to: 'bangkok', year: 2024, month: 'Feb', title: 'THAILAND BOUND', description: 'Month in Thailand coming up.' },
  { id: 24, from: 'bangkok', to: 'chiangmai', year: 2024, month: 'Mar', title: 'NORTH TO CHIANG MAI', description: 'Digital nomad central.' },
  { id: 25, from: 'chiangmai', to: 'hanoi', year: 2024, month: 'Mar', title: 'VIETNAM BEGINS', description: 'First time in Vietnam.' },
  { id: 26, from: 'hanoi', to: 'clark', year: 2024, month: 'Apr', title: 'QUICK PH STOP', description: 'Handle some business.' },
  { id: 27, from: 'clark', to: 'bangkok', year: 2024, month: 'Jun', title: 'THAILAND ROUND 2', description: 'Back for more.' },
  { id: 28, from: 'bangkok', to: 'danang', year: 2024, month: 'Jun', title: '73 DAYS IN VIETNAM', description: 'Working from cafes. Living the dream.' },
  { id: 29, from: 'danang', to: 'clark', year: 2024, month: 'Sep', title: 'BACK TO BASE', description: 'Long trip done.' },
  { id: 30, from: 'clark', to: 'bali', year: 2024, month: 'Dec', title: 'CHRISTMAS BALI', description: '9 days in paradise.' },
  { id: 31, from: 'bali', to: 'saigon', year: 2024, month: 'Dec', title: 'TO SAIGON', description: 'More Vietnam time.' },
  { id: 32, from: 'saigon', to: 'danang', year: 2025, month: 'Mar', title: 'DA NANG QUICK STOP', description: '1 day transit.' },
  { id: 33, from: 'danang', to: 'clark', year: 2025, month: 'Mar', title: '2-YEAR VISA SECURED', description: 'Locked in til 2027.' },
  { id: 34, from: 'clark', to: 'brisbane', year: 2026, month: 'Feb', title: 'VISITING MUM', description: 'Currently in Australia.' },
];

const yearColors: Record<number, string> = {
  2016: '#ff6b6b',
  2017: '#ffd93d',
  2019: '#4d96ff',
  2022: '#00d4ff',
  2023: '#ff00ff',
  2024: '#00ff41',
  2025: '#00e5ff',
  2026: '#ffffff',
};

export function FlightMap() {
  const [currentFlight, setCurrentFlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<{ x: number; y: number; age: number }[]>([]);
  const [showLanding, setShowLanding] = useState(false);

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setShowLanding(true);
          setTimeout(() => {
            setShowLanding(false);
            setCurrentFlight((f) => (f + 1) % flights.length);
          }, 800);
          return 100;
        }
        return p + 1.5;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isPlaying, currentFlight]);

  // Reset progress when flight changes
  useEffect(() => {
    setProgress(0);
  }, [currentFlight]);

  // Particle trail
  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const flight = flights[currentFlight];
      const from = cities[flight.from];
      const to = cities[flight.to];
      const t = progress / 100;
      
      // Quadratic bezier calculation
      const mx = (from.x + to.x) / 2;
      const my = Math.min(from.y, to.y) - 15;
      const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*mx + t*t*to.x;
      const y = (1-t)*(1-t)*from.y + 2*(1-t)*t*my + t*t*to.y;
      
      setParticles(prev => [...prev.slice(-20), { x, y, age: 0 }]);
    }
  }, [progress, currentFlight]);

  // Age particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({ ...p, age: p.age + 1 })).filter(p => p.age < 15));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const flight = flights[currentFlight];
  const from = cities[flight.from];
  const to = cities[flight.to];
  const color = yearColors[flight.year] || '#00ff41';

  // Bezier curve calculation
  const t = progress / 100;
  const mx = (from.x + to.x) / 2;
  const my = Math.min(from.y, to.y) - 15;
  const planeX = (1-t)*(1-t)*from.x + 2*(1-t)*t*mx + t*t*to.x;
  const planeY = (1-t)*(1-t)*from.y + 2*(1-t)*t*my + t*t*to.y;
  
  // Plane rotation
  const dx = 2*(1-t)*(mx-from.x) + 2*t*(to.x-mx);
  const dy = 2*(1-t)*(my-from.y) + 2*t*(to.y-my);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div style={{ position: 'relative' }}>
      {/* HUD Frame */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(0,20,40,0.95) 0%, rgba(5,5,15,0.98) 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '2px solid rgba(0,255,65,0.3)',
        boxShadow: '0 0 80px rgba(0,255,65,0.15), inset 0 0 100px rgba(0,255,65,0.03)',
      }}>
        {/* Scanline effect */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.02) 2px, rgba(0,255,65,0.02) 4px)',
          pointerEvents: 'none',
          zIndex: 100,
        }} />

        {/* Corner brackets */}
        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
          <div
            key={corner}
            style={{
              position: 'absolute',
              width: '40px',
              height: '40px',
              [corner.includes('top') ? 'top' : 'bottom']: '10px',
              [corner.includes('left') ? 'left' : 'right']: '10px',
              borderTop: corner.includes('top') ? '2px solid rgba(0,255,65,0.5)' : 'none',
              borderBottom: corner.includes('bottom') ? '2px solid rgba(0,255,65,0.5)' : 'none',
              borderLeft: corner.includes('left') ? '2px solid rgba(0,255,65,0.5)' : 'none',
              borderRight: corner.includes('right') ? '2px solid rgba(0,255,65,0.5)' : 'none',
              zIndex: 50,
            }}
          />
        ))}

        {/* Top HUD Bar */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '60px',
          right: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 50,
        }}>
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.6rem',
            color: 'rgba(0,255,65,0.7)',
            letterSpacing: '0.2em',
          }}>
            FLIGHT TRACKER v2.0
          </div>
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.7rem',
            color: color,
            letterSpacing: '0.1em',
          }}>
            {flight.year} {flight.month && `// ${flight.month.toUpperCase()}`}
          </div>
          <div style={{
            fontFamily: 'var(--fm)',
            fontSize: '0.6rem',
            color: 'rgba(0,255,65,0.7)',
          }}>
            {String(currentFlight + 1).padStart(2, '0')}/{flights.length}
          </div>
        </div>

        {/* SVG Map */}
        <svg
          viewBox="0 0 100 100"
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: '16/9',
          }}
        >
          <defs>
            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Big glow */}
            <filter id="bigGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Grid pattern */}
            <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(0,255,65,0.08)" strokeWidth="0.1"/>
            </pattern>

            {/* Radial gradient for landing effect */}
            <radialGradient id="landingGlow">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid background */}
          <rect width="100" height="100" fill="url(#grid)" />

          {/* All completed flight paths */}
          {flights.slice(0, currentFlight).map((f, i) => {
            const fromC = cities[f.from];
            const toC = cities[f.to];
            const midX = (fromC.x + toC.x) / 2;
            const midY = Math.min(fromC.y, toC.y) - 12;
            const c = yearColors[f.year] || '#00ff41';
            return (
              <path
                key={i}
                d={`M ${fromC.x} ${fromC.y} Q ${midX} ${midY} ${toC.x} ${toC.y}`}
                fill="none"
                stroke={c}
                strokeWidth="0.3"
                opacity="0.15"
              />
            );
          })}

          {/* Current flight path background */}
          <path
            d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            strokeDasharray="1,0.5"
            opacity="0.3"
          />

          {/* Animated flight path */}
          <path
            d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            strokeLinecap="round"
            style={{
              strokeDasharray: 50,
              strokeDashoffset: 50 - (progress / 2),
              filter: 'url(#glow)',
            }}
          />

          {/* Particle trail */}
          {particles.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={0.8 - p.age * 0.05}
              fill={color}
              opacity={0.6 - p.age * 0.04}
            />
          ))}

          {/* City markers */}
          {Object.entries(cities).map(([id, city]) => {
            const isFrom = id === flight.from;
            const isTo = id === flight.to;
            const isActive = isFrom || isTo;
            
            return (
              <g key={id}>
                {/* Outer pulse for active cities */}
                {isActive && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="3"
                    fill="none"
                    stroke={color}
                    strokeWidth="0.3"
                  >
                    <animate
                      attributeName="r"
                      from="1"
                      to="5"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.8"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                
                {/* City dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isActive ? 1.2 : 0.6}
                  fill={isActive ? color : '#00ff41'}
                  opacity={isActive ? 1 : 0.4}
                  style={{ filter: isActive ? 'url(#glow)' : undefined }}
                />

                {/* City label for active */}
                {isActive && (
                  <g>
                    <text
                      x={city.x}
                      y={city.y + (isFrom ? 4 : -2.5)}
                      textAnchor="middle"
                      fill={color}
                      fontSize="2.2"
                      fontWeight="bold"
                      fontFamily="system-ui"
                      style={{ filter: 'url(#glow)' }}
                    >
                      {city.name.toUpperCase()}
                    </text>
                    <text
                      x={city.x}
                      y={city.y + (isFrom ? 6.5 : -5)}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.5)"
                      fontSize="1.5"
                      fontFamily="system-ui"
                    >
                      {city.flag}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Landing explosion effect */}
          {showLanding && (
            <circle
              cx={to.x}
              cy={to.y}
              r="8"
              fill="url(#landingGlow)"
            >
              <animate
                attributeName="r"
                from="0"
                to="12"
                dur="0.8s"
                fill="freeze"
              />
              <animate
                attributeName="opacity"
                from="1"
                to="0"
                dur="0.8s"
                fill="freeze"
              />
            </circle>
          )}

          {/* Plane */}
          {progress < 100 && (
            <g transform={`translate(${planeX}, ${planeY})`}>
              {/* Plane glow */}
              <circle r="2" fill={color} opacity="0.3" style={{ filter: 'url(#bigGlow)' }} />
              
              {/* Plane icon */}
              <g transform={`rotate(${angle})`}>
                <polygon
                  points="-1.5,0 1.5,-0.8 1.5,0.8"
                  fill={color}
                  style={{ filter: 'url(#glow)' }}
                />
                <rect x="-0.5" y="-1.5" width="1" height="3" fill={color} opacity="0.7" />
              </g>
            </g>
          )}
        </svg>

        {/* Bottom Info Panel */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'stretch',
        }}>
          {/* Route Card */}
          <div style={{
            flex: 1,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 20px',
            border: `1px solid ${color}30`,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}>
              <span style={{ fontSize: '1.5rem' }}>{from.flag}</span>
              <div style={{
                flex: 1,
                height: '2px',
                background: `linear-gradient(90deg, ${color}, ${color}50)`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: `${progress}%`,
                  top: '-4px',
                  fontSize: '0.6rem',
                }}>
                  ✈️
                </div>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{to.flag}</span>
            </div>
            <div style={{
              fontFamily: 'var(--fd)',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.5)',
            }}>
              {from.name} → {to.name}
            </div>
          </div>

          {/* Title Card */}
          <div style={{
            flex: 2,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 20px',
            border: `1px solid ${color}30`,
          }}>
            <div style={{
              fontFamily: 'var(--fd)',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: color,
              marginBottom: '4px',
              textShadow: `0 0 20px ${color}`,
            }}>
              {flight.title}
            </div>
            <div style={{
              fontFamily: 'var(--fb)',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.7)',
            }}>
              {flight.description}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(0,255,65,0.1)',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: color,
            boxShadow: `0 0 10px ${color}`,
            transition: 'width 0.04s linear',
          }} />
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '24px',
      }}>
        <button
          onClick={() => { setCurrentFlight((f) => (f - 1 + flights.length) % flights.length); setProgress(0); }}
          className="flight-btn"
        >
          ⏮
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flight-btn-main"
          style={{ background: isPlaying ? color : 'transparent', borderColor: color }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button
          onClick={() => { setCurrentFlight((f) => (f + 1) % flights.length); setProgress(0); }}
          className="flight-btn"
        >
          ⏭
        </button>
      </div>

      {/* Year Pills */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '16px',
        flexWrap: 'wrap',
      }}>
        {Object.entries(yearColors).map(([year, c]) => {
          const isActive = flight.year === parseInt(year);
          const yearIndex = flights.findIndex(f => f.year === parseInt(year));
          return (
            <button
              key={year}
              onClick={() => { setCurrentFlight(yearIndex); setProgress(0); }}
              style={{
                padding: '6px 14px',
                background: isActive ? c : 'transparent',
                color: isActive ? '#000' : c,
                border: `1px solid ${c}`,
                borderRadius: '20px',
                fontFamily: 'var(--fm)',
                fontSize: '0.6rem',
                fontWeight: isActive ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 15px ${c}50` : 'none',
              }}
            >
              {year}
            </button>
          );
        })}
      </div>

      <style jsx global>{`
        .flight-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(0,255,65,0.1);
          border: 1px solid rgba(0,255,65,0.3);
          color: #00ff41;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .flight-btn:hover {
          background: rgba(0,255,65,0.2);
          box-shadow: 0 0 15px rgba(0,255,65,0.3);
        }
        .flight-btn-main {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 2px solid;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .flight-btn-main:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
