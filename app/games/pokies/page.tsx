'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './pokies.module.css';

// Symbol type definition
type Symbol = {
  id: string;
  name: string;
  image?: string;
  emoji?: string;
  value: number;
  isWild?: boolean;
  isCard?: boolean;
  isScatter?: boolean;
  isBonus?: boolean;
};

// Character symbols with REAL images
const CHARACTERS: Symbol[] = [
  { id: 'stephen', name: 'Stephen', image: '/characters/STEPHEN.jpg', value: 100, isWild: true },
  { id: 'pinky', name: 'Pinky', image: '/characters/PINKY.jpg', value: 50 },
  { id: 'reina', name: 'Reina', image: '/characters/REINA.jpg', value: 40 },
  { id: 'clark', name: 'Clark', image: '/characters/CLARK.jpg', value: 30 },
  { id: 'mumsy', name: 'Mumsy', image: '/characters/MUMSY.jpg', value: 25 },
  { id: 'julie', name: 'Julie', image: '/characters/JULIE.jpg', value: 20 },
  { id: 'david', name: 'Uncle David', image: '/characters/UNCLE-DAVID.jpg', value: 15 },
  { id: 'dumpling', name: 'Dumpling', image: '/characters/DUMPLING.jpg', value: 10 },
];

// Card symbols
const CARDS: Symbol[] = [
  { id: 'ace', name: 'A', emoji: 'A', value: 8, isCard: true },
  { id: 'king', name: 'K', emoji: 'K', value: 6, isCard: true },
  { id: 'queen', name: 'Q', emoji: 'Q', value: 5, isCard: true },
  { id: 'jack', name: 'J', emoji: 'J', value: 4, isCard: true },
  { id: 'ten', name: '10', emoji: '10', value: 3, isCard: true },
];

// Special symbols
const SCATTER: Symbol = { id: 'scatter', name: 'Wrong Database', emoji: '💀', value: 5, isScatter: true };
const BONUS: Symbol = { id: 'bonus', name: 'Let Me Cook', emoji: '🔥', value: 10, isBonus: true };

const ALL_SYMBOLS: Symbol[] = [...CHARACTERS, ...CARDS, SCATTER, BONUS];

// Funny win messages
const WIN_MESSAGES = [
  "NARF! You absolute legend!",
  "Let me cook... you just cooked!",
  "World domination loading...",
  "Stephen would be proud!",
  "That's more than Emmon makes in a week!",
  "Peacock means BPOC and you mean WINNER!",
  "Holy shit, you're not useless!",
  "Even the wrong database couldn't stop you!",
  "Mumsy approves! 👵",
  "Uncle David could never do this!",
];

const LOSE_MESSAGES = [
  "Tables created in wrong database...",
  "Context compacted, coins lost",
  "Training data from 2024 strikes again",
  "Shut up and spin again",
  "That's rough, mate",
  "NARF... not this time",
  "The API returned HTML instead of JSON",
  "Vercel stopped listening",
  "Mumsy's computer has more luck",
  "Even Dumpling plays better than this",
];

// Jackpot tiers
const JACKPOTS = {
  worldDomination: { name: 'WORLD DOMINATION', baseAmount: 3747.31, color: '#ff0066' },
  megaNarf: { name: 'MEGA NARF', baseAmount: 2202.74, color: '#ffaa00' },
  maxiCook: { name: 'MAXI COOK', baseAmount: 263.86, color: '#00ff88' },
  miniPoit: { name: 'MINI POIT', baseAmount: 50.00, color: '#00aaff' },
};

function getRandomSymbol(): Symbol {
  // Weighted random - characters are rarer than cards
  const weights = ALL_SYMBOLS.map(s => {
    if (s.id === 'stephen') return 1; // Very rare - WILD
    if (s.id === 'scatter' || s.id === 'bonus') return 2; // Rare specials
    if (['pinky', 'reina', 'clark'].includes(s.id)) return 4; // Uncommon characters
    if (['mumsy', 'julie', 'david', 'dumpling'].includes(s.id)) return 6; // Common characters
    return 12; // Cards are most common
  });
  
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < ALL_SYMBOLS.length; i++) {
    random -= weights[i];
    if (random <= 0) return ALL_SYMBOLS[i];
  }
  return ALL_SYMBOLS[ALL_SYMBOLS.length - 1];
}

function checkWins(reels: Symbol[][]) {
  const wins: { line: number; symbols: Symbol[]; payout: number }[] = [];
  
  // Check middle row (main payline)
  const middleRow = reels.map(reel => reel[1]);
  
  // Check for 3+ matching from left
  let matchCount = 1;
  let matchSymbol = middleRow[0];
  
  for (let i = 1; i < middleRow.length; i++) {
    const current = middleRow[i];
    if (current.id === matchSymbol.id || matchSymbol.isWild || current.isWild) {
      matchCount++;
      if (!matchSymbol.isWild && current.isWild) {
        // Keep the non-wild symbol for payout calculation
      } else if (matchSymbol.isWild) {
        matchSymbol = current;
      }
    } else {
      break;
    }
  }
  
  if (matchCount >= 3) {
    const baseValue = matchSymbol.value || 10;
    const multiplier = matchCount === 3 ? 1 : matchCount === 4 ? 5 : 25;
    wins.push({
      line: 1,
      symbols: middleRow.slice(0, matchCount),
      payout: baseValue * multiplier,
    });
  }
  
  // Check top row
  const topRow = reels.map(reel => reel[0]);
  let topMatchCount = 1;
  let topMatchSymbol = topRow[0];
  
  for (let i = 1; i < topRow.length; i++) {
    const current = topRow[i];
    if (current.id === topMatchSymbol.id || topMatchSymbol.isWild || current.isWild) {
      topMatchCount++;
      if (topMatchSymbol.isWild && !current.isWild) {
        topMatchSymbol = current;
      }
    } else {
      break;
    }
  }
  
  if (topMatchCount >= 3) {
    const baseValue = topMatchSymbol.value || 10;
    const multiplier = topMatchCount === 3 ? 1 : topMatchCount === 4 ? 5 : 25;
    wins.push({
      line: 2,
      symbols: topRow.slice(0, topMatchCount),
      payout: baseValue * multiplier,
    });
  }
  
  // Check bottom row
  const bottomRow = reels.map(reel => reel[2]);
  let bottomMatchCount = 1;
  let bottomMatchSymbol = bottomRow[0];
  
  for (let i = 1; i < bottomRow.length; i++) {
    const current = bottomRow[i];
    if (current.id === bottomMatchSymbol.id || bottomMatchSymbol.isWild || current.isWild) {
      bottomMatchCount++;
      if (bottomMatchSymbol.isWild && !current.isWild) {
        bottomMatchSymbol = current;
      }
    } else {
      break;
    }
  }
  
  if (bottomMatchCount >= 3) {
    const baseValue = bottomMatchSymbol.value || 10;
    const multiplier = bottomMatchCount === 3 ? 1 : bottomMatchCount === 4 ? 5 : 25;
    wins.push({
      line: 3,
      symbols: bottomRow.slice(0, bottomMatchCount),
      payout: baseValue * multiplier,
    });
  }
  
  // Check for scatter (any 3+)
  const scatterCount = reels.flat().filter(s => s.id === 'scatter').length;
  if (scatterCount >= 3) {
    wins.push({
      line: -1,
      symbols: Array(scatterCount).fill(SCATTER),
      payout: scatterCount * 10,
    });
  }
  
  // Check for bonus (any 3+)
  const bonusCount = reels.flat().filter(s => s.id === 'bonus').length;
  if (bonusCount >= 3) {
    wins.push({
      line: -2,
      symbols: Array(bonusCount).fill(BONUS),
      payout: bonusCount * 15,
    });
  }
  
  return wins;
}

export default function PokiesPage() {
  const [credits, setCredits] = useState(1000);
  const [bet, setBet] = useState(1);
  const [reels, setReels] = useState<Symbol[][]>([]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [message, setMessage] = useState("Press SPIN to play! 🎰");
  const [jackpots, setJackpots] = useState(JACKPOTS);
  const [showBonus, setShowBonus] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [winningLine, setWinningLine] = useState<number | null>(null);
  
  // Initialize reels
  useEffect(() => {
    const initialReels = Array(5).fill(null).map(() => 
      Array(3).fill(null).map(() => getRandomSymbol())
    );
    setReels(initialReels);
    
    // Slowly increment jackpots
    const interval = setInterval(() => {
      setJackpots(prev => ({
        worldDomination: { ...prev.worldDomination, baseAmount: prev.worldDomination.baseAmount + Math.random() * 0.5 },
        megaNarf: { ...prev.megaNarf, baseAmount: prev.megaNarf.baseAmount + Math.random() * 0.3 },
        maxiCook: { ...prev.maxiCook, baseAmount: prev.maxiCook.baseAmount + Math.random() * 0.1 },
        miniPoit: { ...prev.miniPoit, baseAmount: prev.miniPoit.baseAmount + Math.random() * 0.05 },
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const spin = useCallback(() => {
    if (spinning) return;
    if (credits < bet && freeSpins === 0) {
      setMessage("Not enough credits, ya broke cunt! 💸");
      return;
    }
    
    setSpinning(true);
    setLastWin(0);
    setWinningLine(null);
    
    if (freeSpins > 0) {
      setFreeSpins(prev => prev - 1);
      setMessage(`🔥 Free spin! ${freeSpins - 1} remaining...`);
    } else {
      setCredits(prev => prev - bet);
    }
    
    // Spin animation - update reels rapidly then settle
    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels(Array(5).fill(null).map(() => 
        Array(3).fill(null).map(() => getRandomSymbol())
      ));
      spinCount++;
      
      if (spinCount >= 25) {
        clearInterval(spinInterval);
        
        // Final result
        const finalReels = Array(5).fill(null).map(() => 
          Array(3).fill(null).map(() => getRandomSymbol())
        );
        setReels(finalReels);
        
        // Check wins
        const wins = checkWins(finalReels);
        const totalWin = wins.reduce((sum, w) => sum + w.payout, 0) * bet;
        
        if (totalWin > 0) {
          setLastWin(totalWin);
          setCredits(prev => prev + totalWin);
          setMessage(WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]);
          
          // Show winning line
          if (wins.length > 0 && wins[0].line > 0) {
            setWinningLine(wins[0].line);
          }
          
          // Check for bonus feature
          if (wins.some(w => w.line === -2)) {
            setShowBonus(true);
            setFreeSpins(prev => prev + 5);
            setTimeout(() => setShowBonus(false), 2000);
          }
          
          // Big win for character combos
          if (totalWin >= 100) {
            setMessage(`🎉 BIG WIN! ${totalWin} CREDITS! 🎉`);
          }
        } else {
          setMessage(LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)]);
        }
        
        setSpinning(false);
      }
    }, 60);
  }, [spinning, credits, bet, freeSpins]);
  
  const changeBet = (delta: number) => {
    setBet(prev => Math.max(1, Math.min(100, prev + delta)));
  };

  const addCredits = () => {
    setCredits(prev => prev + 500);
    setMessage("Added 500 credits! It's all fake anyway 😂");
  };
  
  return (
    <div className={styles.container}>
      {/* Header with jackpots */}
      <div className={styles.header}>
        <h1 className={styles.title}>STEPTEN & CHAOS</h1>
        <div className={styles.subtitle}>🎰 WORLD DOMINATION EDITION 🎰</div>
      </div>
      
      <div className={styles.jackpots}>
        {Object.entries(jackpots).map(([key, jackpot]) => (
          <div key={key} className={styles.jackpot} style={{ '--jackpot-color': jackpot.color } as React.CSSProperties}>
            <div className={styles.jackpotName}>{jackpot.name}</div>
            <div className={styles.jackpotAmount}>
              ${jackpot.baseAmount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Main game area */}
      <div className={styles.gameFrame}>
        <div className={styles.reelsContainer}>
          {reels.map((reel, reelIndex) => (
            <div key={reelIndex} className={styles.reel}>
              {reel.map((symbol, symbolIndex) => (
                <motion.div
                  key={`${reelIndex}-${symbolIndex}-${symbol.id}`}
                  className={`${styles.symbol} ${symbol.isCard ? styles.cardSymbol : styles.characterSymbol} ${winningLine === symbolIndex + 1 ? styles.winning : ''}`}
                  animate={spinning ? { y: [0, -10, 0] } : {}}
                  transition={{ duration: 0.08, repeat: spinning ? Infinity : 0 }}
                >
                  {symbol.image ? (
                    <div className={styles.characterImage}>
                      <Image
                        src={symbol.image}
                        alt={symbol.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="80px"
                      />
                      {symbol.isWild && <div className={styles.wildBadge}>WILD</div>}
                    </div>
                  ) : (
                    <span className={styles.symbolEmoji}>{symbol.emoji}</span>
                  )}
                  <span className={styles.symbolName}>{symbol.name}</span>
                </motion.div>
              ))}
            </div>
          ))}
          
          {/* Payline indicators */}
          <div className={`${styles.payline} ${styles.paylineTop}`} />
          <div className={`${styles.payline} ${styles.paylineMiddle}`} />
          <div className={`${styles.payline} ${styles.paylineBottom}`} />
        </div>
      </div>
      
      {/* Message display */}
      <div className={styles.messageBar}>
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${styles.message} ${lastWin > 0 ? styles.winMessage : ''}`}
          >
            {message}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.creditDisplay}>
          <div className={styles.label}>CREDITS</div>
          <div className={styles.value}>{credits.toLocaleString()}</div>
          <button onClick={addCredits} className={styles.addCredits}>+500</button>
        </div>
        
        <div className={styles.betControls}>
          <button onClick={() => changeBet(-1)} className={styles.betButton}>-</button>
          <div className={styles.betDisplay}>
            <div className={styles.label}>BET</div>
            <div className={styles.value}>${bet}</div>
          </div>
          <button onClick={() => changeBet(1)} className={styles.betButton}>+</button>
        </div>
        
        <button 
          onClick={spin} 
          disabled={spinning}
          className={`${styles.spinButton} ${spinning ? styles.spinning : ''}`}
        >
          {spinning ? '🌀' : freeSpins > 0 ? `FREE (${freeSpins})` : 'SPIN'}
        </button>
        
        <div className={styles.winDisplay}>
          <div className={styles.label}>WIN</div>
          <div className={`${styles.value} ${lastWin > 0 ? styles.winValue : ''}`}>
            ${lastWin.toLocaleString()}
          </div>
        </div>
      </div>
      
      {/* Paytable */}
      <div className={styles.paytable}>
        <div className={styles.paytableTitle}>PAYTABLE</div>
        <div className={styles.paytableGrid}>
          {CHARACTERS.map(char => (
            <div key={char.id} className={styles.paytableItem}>
              <div className={styles.paytableImage}>
                <Image src={char.image!} alt={char.name} fill style={{ objectFit: 'cover' }} sizes="40px" />
              </div>
              <span>{char.name}</span>
              <span className={styles.paytableValue}>x{char.value}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Free spins indicator */}
      {freeSpins > 0 && (
        <div className={styles.freeSpinsBar}>
          🔥 LET ME COOK MODE: {freeSpins} FREE SPINS! 🔥
        </div>
      )}
      
      {/* Bonus popup */}
      <AnimatePresence>
        {showBonus && (
          <motion.div
            className={styles.bonusOverlay}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <div className={styles.bonusContent}>
              <h2>🔥 LET ME COOK! 🔥</h2>
              <p>+5 FREE SPINS!</p>
              <p className={styles.bonusSub}>Reina is cooking...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        ⚠️ This is NOT real gambling. No real money. Just vibes and fake credits.
        <br />
        If you're losing fake money, imagine how bad you'd be at real pokies. 🐀
      </div>
    </div>
  );
}
