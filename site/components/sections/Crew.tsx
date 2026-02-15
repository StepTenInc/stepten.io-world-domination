'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Pagination } from 'swiper/modules';
import { characters, type CharacterKey } from '@/lib/design-tokens';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const crewMembers: CharacterKey[] = ['stepten', 'pinky', 'reina', 'clark'];

export function Crew() {
  return (
    <section
      id="crew"
      style={{
        padding: '120px 0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px', padding: '0 24px' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: '#00ff41',
            letterSpacing: '0.5em',
            marginBottom: '16px',
          }}
        >
          // SELECT YOUR CHARACTER
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            marginBottom: '16px',
          }}
        >
          THE <span style={{ color: '#00ff41' }}>ARMY</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '14px',
            color: '#888',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Drag to explore. Each character has a unique soul.
        </p>
      </div>

      {/* Swipeable Carousel */}
      <Swiper
        modules={[FreeMode, Mousewheel, Pagination]}
        spaceBetween={24}
        slidesPerView={'auto'}
        freeMode={true}
        mousewheel={{ forceToAxis: true }}
        pagination={{ clickable: true }}
        centeredSlides={false}
        style={{
          padding: '0 24px 60px',
        }}
      >
        {crewMembers.map((key) => {
          const char = characters[key];
          return (
            <SwiperSlide key={key} style={{ width: '320px' }}>
              <div
                style={{
                  position: 'relative',
                  backgroundColor: '#111',
                  border: '1px solid #222',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'grab',
                  transition: 'all 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = char.color;
                  e.currentTarget.style.boxShadow = `0 0 40px ${char.glow}`;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Top accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: char.color,
                    boxShadow: `0 0 20px ${char.glow}`,
                    zIndex: 5,
                  }}
                />

                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden' }}>
                  <Image
                    src={char.image}
                    alt={char.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    draggable={false}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(transparent 50%, #111 100%)',
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '24px' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '24px',
                      fontWeight: 700,
                      color: char.color,
                      textShadow: `0 0 30px ${char.glow}`,
                      marginBottom: '8px',
                    }}
                  >
                    {char.name.toUpperCase()}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '13px',
                      color: '#888',
                      marginBottom: '12px',
                    }}
                  >
                    {char.role}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: '#555',
                    }}
                  >
                    "{char.tagline}"
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Swiper pagination styles */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #333 !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
        }
        .swiper-pagination-bullet-active {
          background: #00ff41 !important;
          box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
        }
      `}</style>
    </section>
  );
}
