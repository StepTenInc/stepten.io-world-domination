'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LanguageWarningModal() {
  const [showModal, setShowModal] = useState(false);
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const accepted = localStorage.getItem('stepten-language-accepted');
    const declined = localStorage.getItem('stepten-language-declined');
    
    if (declined === 'true') {
      setRejected(true);
      setShowModal(true);
    } else if (accepted !== 'true') {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('stepten-language-accepted', 'true');
    localStorage.removeItem('stepten-language-declined');
    setShowModal(false);
    
    // Track acceptance (you can add analytics here)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'language_warning_accepted');
    }
  };

  const handleDecline = () => {
    localStorage.setItem('stepten-language-declined', 'true');
    localStorage.removeItem('stepten-language-accepted');
    setRejected(true);
    
    // Track decline
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'language_warning_declined');
    }
  };

  if (!showModal) return null;

  // If they declined before, show the "fuck off" screen
  if (rejected) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-6">
            🚫 ACCESS DENIED
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            You said you couldn&apos;t handle it last time.
          </p>
          <p className="text-lg text-gray-400 mb-8">
            This site contains Australian levels of profanity. You already told us you&apos;re too sensitive for that.
          </p>
          <p className="text-2xl text-white mb-8">
            Maybe try the Bible instead? 📖
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = 'https://www.bible.com'}
              className="block w-full px-8 py-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Take me to the Bible →
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('stepten-language-declined');
                setRejected(false);
              }}
              className="block w-full px-8 py-3 text-gray-500 hover:text-gray-300 transition-colors text-sm"
            >
              Actually, I&apos;ve grown up since then. Give me another chance.
            </button>
          </div>
        </div>
      </div>
    );
  }

  // First-time warning modal
  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-gray-900 rounded-2xl border border-yellow-500/50 overflow-hidden my-8">
        {/* Warning Header */}
        <div className="bg-yellow-500 text-black px-6 py-3 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span className="font-bold text-lg">LANGUAGE WARNING</span>
          <span className="text-2xl">⚠️</span>
        </div>
        
        {/* Team Image */}
        <div className="relative w-full aspect-video">
          <Image
            src="/images/team-warning.png"
            alt="The StepTen Team - Warning"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            This site contains Australian levels of profanity.
          </h2>
          
          <p className="text-gray-300 text-lg mb-4">
            Words like <span className="text-yellow-400 font-bold">&quot;cunt&quot;</span> and <span className="text-yellow-400 font-bold">&quot;fuck&quot;</span> are used liberally and affectionately.
          </p>
          
          <p className="text-gray-400 mb-6">
            If you&apos;re sensitive to these things, just don&apos;t read. Go somewhere else. 
            Read the Bible. We don&apos;t want you if you&apos;re politically correct and can&apos;t 
            take a joke or see the funny side in something.
          </p>
          
          <p className="text-xl text-white font-semibold mb-8">
            We build AI agents, not safe spaces.
          </p>
          
          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-lg transition-colors"
            >
              I&apos;m not a soft cunt — Let me in 🤙
            </button>
            
            <button
              onClick={handleDecline}
              className="w-full px-8 py-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded-lg transition-colors"
            >
              I&apos;m too sensitive for this — Take me somewhere nicer
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mt-6">
            18+ content. By entering, you confirm you&apos;re an adult who can handle colorful language.
          </p>
        </div>
      </div>
    </div>
  );
}
