"use client";

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FloatingParticles({ count = 50 }: { count?: number }) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    size: number;
    initialX: number;
    initialY: number;
    duration: number;
    delay: number;
    moveX: number;
  }>>([]);

  useEffect(() => {
    // Generate particles only on client-side to prevent hydration mismatch
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      moveX: Math.random() * 50 - 25,
    }));
    setParticles(newParticles);
  }, [count]);

  if (particles.length === 0) {
    return null; // Return null on server and initial client render
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            filter: 'blur(1px)',
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.moveX, 0],
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
