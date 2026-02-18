'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LanguageWarningModal() {
  const [showModal, setShowModal] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('stepten-language-accepted');
    const blockedUser = localStorage.getItem('stepten-language-blocked');
    
    if (blockedUser === 'true') {
      setBlocked(true);
      setShowModal(true);
      setTimeout(() => setIsVisible(true), 50);
    } else if (accepted !== 'true') {
      setShowModal(true);
      setTimeout(() => setIsVisible(true), 50);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('stepten-language-accepted', 'true');
    localStorage.removeItem('stepten-language-blocked');
    setIsVisible(false);
    setTimeout(() => setShowModal(false), 300);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'language_warning_accepted');
    }
  };

  const handleDecline = () => {
    localStorage.setItem('stepten-language-blocked', 'true');
    localStorage.removeItem('stepten-language-accepted');
    setBlocked(true);
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'language_warning_blocked');
    }
  };

  if (!showModal) return null;

  // BLOCKED STATE
  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
        <div className={`max-w-2xl text-center transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="text-8xl mb-6 animate-bounce">🚫</div>
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-6">
            BLOCKED
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            You said this wasn&apos;t for you. Fair enough.
          </p>
          <p className="text-gray-500 mb-8">
            There&apos;s plenty of corporate-friendly AI content out there.<br/>
            This just ain&apos;t it.
          </p>
          <a
            href="https://www.google.com"
            className="inline-block px-8 py-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Take me somewhere else →
          </a>
          <p className="text-gray-700 text-sm mt-8">
            Changed your mind? Clear your browser data.
          </p>
        </div>
      </div>
    );
  }

  // WELCOME MODAL
  return (
    <div className={`fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`max-w-3xl w-full bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-yellow-500 overflow-hidden my-8 shadow-2xl shadow-yellow-500/20 transition-all duration-500 ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>
        
        {/* Animated Warning Header */}
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black px-6 py-3 flex items-center justify-center gap-3 animate-pulse">
          <span className="text-2xl">⚠️</span>
          <span className="font-bold text-lg tracking-wider">HEADS UP</span>
          <span className="text-2xl">⚠️</span>
        </div>
        
        {/* Team Image with glow effect */}
        <div className="relative w-full aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
          <Image
            src="/images/team-warning.png"
            alt="The StepTen Team"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8 -mt-12 relative z-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
            Hey! Welcome to StepTen 👋
          </h2>
          
          <div className="space-y-4 text-gray-300 text-lg mb-8">
            <p className="text-center text-xl">
              This is a <span className="text-cyan-400 font-semibold">fun fucking site</span> about AI, 
              coding, and building cool shit.
            </p>
            
            <p className="text-center">
              It&apos;s basically a <span className="text-yellow-400 font-semibold">hobby project</span> — 
              just me learning and documenting my journey. Not a serious business (yet). 
              Just content, experiments, and a lot of swearing.
            </p>
            
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-center italic text-gray-400">
                &quot;I&apos;m going through this shit and you can learn too. 
                Come along, have a laugh, feel my pain, celebrate the wins.&quot;
              </p>
            </div>
            
            <p className="text-center text-lg">
              <span className="text-green-400">If you want to learn?</span> Great, you&apos;re in the right place.<br/>
              <span className="text-red-400">If colorful language offends you?</span> Just fuck off, honestly. 
              There&apos;s plenty of polished corporate content out there.
            </p>
          </div>
          
          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-green-500/25"
            >
              🤙 Yeah let&apos;s go — I&apos;m here to learn and laugh
            </button>
            
            <button
              onClick={handleDecline}
              className="w-full px-8 py-3 bg-gray-800/50 hover:bg-red-900/50 text-gray-500 hover:text-red-300 rounded-xl transition-all duration-300 border border-gray-700 hover:border-red-700"
            >
              Nah, not for me
            </button>
          </div>
          
          <p className="text-gray-600 text-xs mt-6 text-center">
            This site contains explicit language. 18+ vibes.
          </p>
        </div>
      </div>
    </div>
  );
}
