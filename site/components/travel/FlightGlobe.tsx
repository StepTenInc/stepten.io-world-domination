'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// City coordinates
const cities: Record<string, { lat: number; lng: number; name: string; country: string }> = {
  // Australia
  brisbane: { lat: -27.4698, lng: 153.0251, name: 'Brisbane', country: '🇦🇺' },
  sydney: { lat: -33.8688, lng: 151.2093, name: 'Sydney', country: '🇦🇺' },
  
  // Philippines
  manila: { lat: 14.5995, lng: 120.9842, name: 'Manila', country: '🇵🇭' },
  clark: { lat: 15.1860, lng: 120.5460, name: 'Clark', country: '🇵🇭' },
  
  // Thailand
  bangkok: { lat: 13.6900, lng: 100.7501, name: 'Bangkok', country: '🇹🇭' },
  chiangmai: { lat: 18.7883, lng: 98.9853, name: 'Chiang Mai', country: '🇹🇭' },
  
  // Vietnam
  hanoi: { lat: 21.0285, lng: 105.8542, name: 'Hanoi', country: '🇻🇳' },
  danang: { lat: 16.0544, lng: 108.2022, name: 'Da Nang', country: '🇻🇳' },
  saigon: { lat: 10.8231, lng: 106.6297, name: 'Ho Chi Minh', country: '🇻🇳' },
  
  // Indonesia
  bali: { lat: -8.3405, lng: 115.0920, name: 'Bali', country: '🇮🇩' },
  
  // India
  mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai', country: '🇮🇳' },
  chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai', country: '🇮🇳' },
  
  // Malaysia
  kotakinabalu: { lat: 5.9804, lng: 116.0735, name: 'Kota Kinabalu', country: '🇲🇾' },
};

// All flights chronologically (simplified major routes)
const flights = [
  // 2016
  { from: 'brisbane', to: 'manila', year: 2016, label: 'First PH trip' },
  { from: 'manila', to: 'mumbai', year: 2016, label: 'Visit CB' },
  { from: 'mumbai', to: 'brisbane', year: 2016, label: 'Back home' },
  { from: 'brisbane', to: 'mumbai', year: 2016, label: 'Post-wedding India' },
  { from: 'mumbai', to: 'manila', year: 2016, label: 'Back to PH' },
  { from: 'manila', to: 'bangkok', year: 2016, label: 'NYE with girl' },
  
  // 2017
  { from: 'bangkok', to: 'manila', year: 2017, label: 'Back from Thailand' },
  { from: 'manila', to: 'chennai', year: 2017, label: 'Chennai trip 1' },
  { from: 'chennai', to: 'manila', year: 2017, label: 'Back to PH' },
  { from: 'manila', to: 'chennai', year: 2017, label: 'Chennai trip 2' },
  { from: 'chennai', to: 'manila', year: 2017, label: 'Back to PH' },
  
  // 2019
  { from: 'clark', to: 'bali', year: 2019, label: 'Bali getaway' },
  { from: 'bali', to: 'clark', year: 2019, label: 'Back to Clark' },
  { from: 'clark', to: 'kotakinabalu', year: 2019, label: 'Sabah trip' },
  { from: 'kotakinabalu', to: 'clark', year: 2019, label: 'Back to Clark' },
  
  // 2022-2023
  { from: 'clark', to: 'bali', year: 2022, label: 'Christmas Bali' },
  { from: 'bali', to: 'clark', year: 2023, label: 'Back to Clark' },
  { from: 'clark', to: 'bali', year: 2023, label: 'Quick Bali trip' },
  { from: 'bali', to: 'clark', year: 2023, label: 'Back to Clark' },
  
  // 2024 - Big travel year
  { from: 'clark', to: 'bali', year: 2024, label: 'Jan Bali' },
  { from: 'bali', to: 'bangkok', year: 2024, label: 'To Thailand' },
  { from: 'bangkok', to: 'chiangmai', year: 2024, label: 'North to Chiang Mai' },
  { from: 'chiangmai', to: 'hanoi', year: 2024, label: 'Vietnam begins' },
  { from: 'hanoi', to: 'clark', year: 2024, label: 'Quick PH stop' },
  { from: 'clark', to: 'bangkok', year: 2024, label: 'Back to Thailand' },
  { from: 'bangkok', to: 'danang', year: 2024, label: 'To Da Nang' },
  { from: 'danang', to: 'clark', year: 2024, label: 'Back to PH' },
  { from: 'clark', to: 'bali', year: 2024, label: 'Christmas Bali' },
  { from: 'bali', to: 'saigon', year: 2024, label: 'To Saigon' },
  
  // 2025
  { from: 'saigon', to: 'danang', year: 2025, label: 'Da Nang' },
  { from: 'danang', to: 'clark', year: 2025, label: 'Back to PH' },
  
  // 2026
  { from: 'clark', to: 'brisbane', year: 2026, label: 'Visiting Mum' },
];

interface FlightGlobeProps {
  selectedYear?: number | null;
}

function FlightGlobeInner({ selectedYear }: FlightGlobeProps) {
  const globeEl = useRef<HTMLDivElement>(null);
  const [Globe, setGlobe] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamic import for globe.gl (client-side only)
    import('globe.gl').then((mod) => {
      setGlobe(() => mod.default);
    });
  }, []);

  useEffect(() => {
    if (!Globe || !globeEl.current || !isClient) return;

    // Filter flights by year if selected
    const filteredFlights = selectedYear 
      ? flights.filter(f => f.year === selectedYear)
      : flights;

    // Convert to arc data
    const arcsData = filteredFlights.map((flight, i) => ({
      startLat: cities[flight.from].lat,
      startLng: cities[flight.from].lng,
      endLat: cities[flight.to].lat,
      endLng: cities[flight.to].lng,
      color: getYearColor(flight.year),
      label: flight.label,
      year: flight.year,
    }));

    // Get unique cities from flights
    const citySet = new Set<string>();
    filteredFlights.forEach(f => {
      citySet.add(f.from);
      citySet.add(f.to);
    });
    const pointsData = Array.from(citySet).map(cityId => ({
      lat: cities[cityId].lat,
      lng: cities[cityId].lng,
      name: cities[cityId].name,
      country: cities[cityId].country,
    }));

    const globe = Globe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .width(globeEl.current.clientWidth)
      .height(globeEl.current.clientHeight)
      // Arcs
      .arcsData(arcsData)
      .arcColor('color')
      .arcDashLength(0.5)
      .arcDashGap(0.2)
      .arcDashAnimateTime(2000)
      .arcStroke(0.5)
      .arcAltitudeAutoScale(0.3)
      // Points
      .pointsData(pointsData)
      .pointAltitude(0.01)
      .pointColor(() => '#00ff41')
      .pointRadius(0.5)
      // Labels
      .labelsData(pointsData)
      .labelLat((d: any) => d.lat)
      .labelLng((d: any) => d.lng)
      .labelText((d: any) => `${d.country} ${d.name}`)
      .labelSize(1.2)
      .labelColor(() => '#ffffff')
      .labelDotRadius(0.4)
      .labelAltitude(0.02)
      // Atmosphere
      .atmosphereColor('#00ff41')
      .atmosphereAltitude(0.15)
      (globeEl.current);

    // Set initial position to show Asia-Pacific
    globe.pointOfView({ lat: 10, lng: 115, altitude: 2.5 }, 0);

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;
    globe.controls().enableZoom = true;

    // Cleanup
    return () => {
      if (globeEl.current) {
        globeEl.current.innerHTML = '';
      }
    };
  }, [Globe, isClient, selectedYear]);

  if (!isClient) {
    return (
      <div style={{
        width: '100%',
        height: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--dk)',
        borderRadius: '20px',
      }}>
        <div style={{ color: 'var(--mx)', fontFamily: 'var(--fm)' }}>
          Loading globe...
        </div>
      </div>
    );
  }

  return (
    <div
      ref={globeEl}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '20px',
        overflow: 'hidden',
        background: '#000',
      }}
    />
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

// Export with dynamic import to disable SSR
export const FlightGlobe = dynamic(
  () => Promise.resolve(FlightGlobeInner),
  { ssr: false }
);

export { flights, cities };
