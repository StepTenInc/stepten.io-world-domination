'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LanguageWarningModal() {
  const [showModal, setShowModal] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const accepted = localStorage.getItem('stepten-language-accepted');
    const blockedUser = localStorage.getItem('stepten-language-blocked');
    
    if (blockedUser === 'true') {
      setBlocked(true);
      setShowModal(true);
    } else if (accepted !== 'true') {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('stepten-language-accepted', 'true');
    localStorage.removeItem('stepten-language-blocked');
    setShowModal(false);
    
    // Track acceptance
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'language_warning_accepted');
    }
  };

  const handleDecline = () => {
    localStorage.setItem('stepten-language-blocked', 'true');
    localStorage.removeItem('stepten-language-accepted');
    setBlocked(true);
    
    // Track decline
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'language_warning_blocked');
    }
  };

  if (!showModal) return null;

  // BLOCKED - They declined, they're done
  if (blocked) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-red-500 mb-6">
            🚫 BLOCKED
          </h1>
          <p className="text-2xl md:text-3xl text-white mb-4">
            You said you couldn&apos;t handle it.
          </p>
          <p className="text-lg text-gray-400 mb-6">
            This browser has been blocked from accessing StepTen.io.
          </p>
          <p className="text-xl text-gray-300 mb-8">
            There&apos;s plenty of other places to learn from.<br/>
            Go find one that doesn&apos;t offend your delicate sensibilities.
          </p>
          <div className="space-y-4">
            <a
              href="https://www.google.com/search?q=ai+tutorials+for+beginners"
              className="block w-full px-8 py-4 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Find somewhere else to learn →
            </a>
            <p className="text-gray-600 text-sm mt-8">
              Changed your mind? Clear your browser data and come back when you&apos;ve grown a thicker skin.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // FIRST TIME - Warning modal
  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-gray-900 rounded-2xl border-2 border-yellow-500 overflow-hidden my-8">
        {/* Warning Header */}
        <div className="bg-yellow-500 text-black px-6 py-4 flex items-center justify-center gap-3">
          <span className="text-3xl">⚠️</span>
          <span className="font-bold text-xl md:text-2xl tracking-wide">EXPLICIT LANGUAGE WARNING</span>
          <span className="text-3xl">⚠️</span>
        </div>
        
        {/* Team Image */}
        <div className="relative w-full aspect-video">
          <Image
            src="/images/team-warning.png"
            alt="The StepTen Team"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
            Before you enter...
          </h2>
          
          <div className="space-y-4 text-gray-300 text-lg mb-8">
            <p>
              This site is for <span className="text-cyan-400 font-semibold">educating people about AI</span>. 
              It&apos;s fun, it&apos;s real, and it&apos;s uncensored.
            </p>
            
            <p>
              The CEO likes to use the <span className="text-yellow-400 font-bold">f-bomb</span> and 
              some <span className="text-yellow-400 font-bold">colorful fucking language</span>. 
              That&apos;s just how we communicate here.
            </p>
            
            <p>
              <span className="text-green-400 font-semibold">If you want to learn and really grow yourself</span> — 
              if you want to understand AI, automation, and building shit that actually works — 
              then this is the place for you.
            </p>
            
            <p>
              If you&apos;re going to get <span className="text-red-400">pissed off by a bit of bad language</span>, 
              then there&apos;s plenty of other people to go and learn from. This isn&apos;t for you.
            </p>
            
            <p className="border-l-4 border-cyan-500 pl-4 italic text-gray-400">
              &quot;The reason this site is good is BECAUSE it&apos;s got colorful language. 
              If you go on this learning journey, I can guarantee you&apos;re going to be using 
              fucking colorful language too — out of frustration, excitement, and breakthrough moments. 
              Feel my pain and laugh with me.&quot;
              <br/><span className="text-cyan-400 not-italic">— Stephen, CEO</span>
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-8">
            <p className="text-center text-white font-semibold">
              Do you accept that you will not be offended by any language you see on this site?
            </p>
          </div>
          
          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-lg transition-colors"
            >
              ✅ Yes, I Accept — Let&apos;s fucking go!
            </button>
            
            <button
              onClick={handleDecline}
              className="w-full px-8 py-3 bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-red-100 rounded-lg transition-colors border border-red-700"
            >
              ❌ No, I&apos;m too sensitive — Block me from this site
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mt-6 text-center">
            ⚠️ If you decline, your browser will be blocked from accessing this site.
          </p>
        </div>
      </div>
    </div>
  );
}
