'use client';

import { useEffect, useState, useRef } from 'react';

// Matrix-style falling code effect
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff00';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Varying opacity for depth effect
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30"
      style={{ background: 'black' }}
    />
  );
}

// Animated typing effect
function TypeWriter({ texts, className }: { texts: string[]; className?: string }) {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = texts[textIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(currentFullText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <span className={className}>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Floating particle effect
function FloatingParticles() {
  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-green-500 rounded-full opacity-60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixRain />
      <FloatingParticles />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-white">Step</span>
          <span className="text-green-500">Ten</span>
        </div>
        <div className="flex items-center gap-8 text-sm">
          <a href="/builds" className="text-gray-400 hover:text-green-500 transition-colors">Builds</a>
          <a href="/insights" className="text-gray-400 hover:text-green-500 transition-colors">Insights</a>
          <a href="/work-with-me" className="text-gray-400 hover:text-green-500 transition-colors">Work With Me</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-20 min-h-screen flex flex-col items-center justify-center px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Glowing orb effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="block text-gray-500 text-2xl md:text-3xl font-normal mb-4 tracking-wider">
              HOLY SHIT
            </span>
            <TypeWriter 
              texts={[
                "AI is the creator's dream",
                "Build anything you imagine",
                "The future is fucking here",
                "No limits. Just creation.",
              ]}
              className="text-green-500"
            />
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            I replaced my entire dev team with AI agents. 
            <span className="text-white"> Not because I hate people.</span> 
            {' '}Because I love building, and now I can build{' '}
            <span className="text-green-500">anything</span>.
          </p>

          {/* Stats/Proof */}
          <div className="flex flex-wrap justify-center gap-12 mt-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">3</div>
              <div className="text-gray-500 text-sm mt-2">AI Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">0</div>
              <div className="text-gray-500 text-sm mt-2">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-500">∞</div>
              <div className="text-gray-500 text-sm mt-2">Possibilities</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-gray-500">
          <span className="text-xs tracking-widest mb-2">SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-green-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Second Section - The Message */}
      <section className="relative z-20 min-h-screen flex items-center justify-center px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <blockquote className="text-3xl md:text-5xl font-light leading-relaxed text-gray-300">
            <span className="text-green-500 text-6xl">"</span>
            <br />
            You can do <span className="text-green-500">anything</span> now.
            <br />
            <span className="text-gray-500">But you gotta be interested enough to learn it.</span>
            <br />
            <span className="text-gray-600 text-xl md:text-2xl mt-8 block">
              It's not that fucking easy. I've been through the hard yards.
            </span>
            <br />
            <span className="text-green-500 text-6xl">"</span>
          </blockquote>
          <div className="mt-12 text-right">
            <span className="text-gray-500">— Stephen Atcheler</span>
          </div>
        </div>
      </section>

      {/* Third Section - What I Build */}
      <section className="relative z-20 min-h-screen px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-16 text-center">
            <span className="text-gray-500">What I</span>{' '}
            <span className="text-green-500">Build</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* BPOC Card */}
            <div className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-green-500 text-sm font-mono mb-4">01 // PLATFORM</div>
                <h3 className="text-2xl font-bold mb-4">BPOC</h3>
                <p className="text-gray-400 mb-6">
                  AI-powered recruitment platform. Building the future of hiring 
                  in the Philippines and beyond.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Next.js</span>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">AI Agents</span>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Supabase</span>
                </div>
              </div>
            </div>

            {/* ShoreAgents Card */}
            <div className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-green-500 text-sm font-mono mb-4">02 // BUSINESS</div>
                <h3 className="text-2xl font-bold mb-4">ShoreAgents</h3>
                <p className="text-gray-400 mb-6">
                  BPO company turned AI experiment. Staff tracking, 
                  management software, and the testbed for everything.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Electron</span>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Monorepo</span>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Real-time</span>
                </div>
              </div>
            </div>

            {/* AI Agents Card */}
            <div className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="text-green-500 text-sm font-mono mb-4">03 // AGENTS</div>
                <h3 className="text-2xl font-bold mb-4">My AI Team</h3>
                <p className="text-gray-400 mb-6">
                  Pinky, Clark, Reina. Three AI agents that do real work. 
                  Not chatbots. Actual team members.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Claude</span>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Clawdbot</span>
                  <span className="text-xs px-3 py-1 bg-green-500/10 text-green-500 rounded-full">Autonomous</span>
                </div>
              </div>
            </div>

            {/* The Vision Card */}
            <div className="group relative bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-2xl p-8 hover:border-green-500 transition-all duration-500 overflow-hidden">
              <div className="relative">
                <div className="text-green-500 text-sm font-mono mb-4">04 // VISION</div>
                <h3 className="text-2xl font-bold mb-4">LMNH</h3>
                <p className="text-gray-400 mb-6">
                  Look Mum No Hands. The real dream. 
                  No-code AI agent platform for everyone.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1 bg-green-500/20 text-green-500 rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-gray-800 px-8 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-2xl font-bold">
            <span className="text-white">Step</span>
            <span className="text-green-500">Ten</span>
          </div>
          <div className="text-gray-500 text-sm">
            Built with AI. By an Australian in the Philippines.
          </div>
          <div className="flex gap-6">
            <a href="https://twitter.com/stepteninc" className="text-gray-400 hover:text-green-500 transition-colors">Twitter</a>
            <a href="https://github.com/StepTen2024" className="text-gray-400 hover:text-green-500 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          50% { transform: translateY(-10px) translateX(-10px); opacity: 0.4; }
          75% { transform: translateY(-30px) translateX(5px); opacity: 0.7; }
        }
      `}</style>
    </main>
  );
}
