'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './pokies.module.css';

// Symbol definitions with our characters
const SYMBOLS = [
  { id: 'stephen', name: 'Stephen', emoji: '🎩', value: 100, isWild: true },
  { id: 'pinky', name: 'Pinky', emoji: '🐀', value: 50 },
  { id: 'reina', name: 'Reina', emoji: '👩‍💻', value: 40 },
  { id: 'clark', name: 'Clark', emoji: '🔧', value: 30 },
  { id: 'mumsy', name: 'Mumsy', emoji: '👵', value: 25 },
  { id: 'julie', name: 'Julie', emoji: '😈', value: 20 },
  { id: 'david', name: 'Uncle David', emoji: '👴', value: 15 },
  { id: 'dumpling', name: 'Dumpling', emoji: '🏓', value: 10 },
  { id: 'ace', name: 'A', emoji: 'A', value: 8, isCard: true },
  { id: 'king', name: 'K', emoji: 'K', value: 6, isCard: true },
  { id: 'queen', name: 'Q', emoji: 'Q', value: 5, isCard: true },
  { id: 'jack', name: 'J', emoji: 'J', value: 4, isCard: true },
  { id: 'ten', name: '10', emoji: '10', value: 3, isCard: true },
];

// Special symbols
const SCATTER = { id: 'scatter', name: 'Wrong Database', emoji: '💀', isScatter: true };
const BONUS = { id: 'bonus', name: 'Let Me Cook', emoji: '🔥', isBonus: true };

const ALL_SYMBOLS = [...SYMBOLS, SCATTER, BONUS];

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
];

// Jackpot tiers
const JACKPOTS = {
  worldDomination: { name: 'WORLD DOMINATION', baseAmount: 3747.31, color: '#ff0066' },
  megaNarf: { name: 'MEGA NARF', baseAmount: 2202.74, color: '#ffaa00' },
  maxiCook: { name: 'MAXI COOK', baseAmount: 263.86, color: '#00ff88' },
  miniPoit: { name: 'MINI POIT', baseAmount: 50.00, color: '#00aaff' },
};

function getRandomSymbol() {
  // Weighted random - characters are rarer
  const weights = ALL_SYMBOLS.map(s => {
    if (s.id === 'stephen') return 1; // Very rare
    if (s.id === 'scatter' || s.id === 'bonus') return 2; // Rare
    if (['pinky', 'reina', 'clark'].includes(s.id)) return 3;
    if (['mumsy', 'julie', 'david', 'dumpling'].includes(s.id)) return 5;
    return 10; // Cards are common
  });
  
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < ALL_SYMBOLS.length; i++) {
    random -= weights[i];
    if (random <= 0) return ALL_SYMBOLS[i];
  }
  return ALL_SYMBOLS[ALL_SYMBOLS.length - 1];
}

type Symbol = {
  id: string;
  name: string;
  emoji: string;
  value?: number;
  isWild?: boolean;
  isCard?: boolean;
  isScatter?: boolean;
  isBonus?: boolean;
};

function checkWins(reels: Symbol[][]) {
  const wins: { line: number; symbols: Symbol[]; payout: number }[] = [];
  
  // Check middle row (simplest payline)
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
  
  // Check for scatter (any 3+)
  const scatterCount = reels.flat().filter(s => s.id === 'scatter').length;
  if (scatterCount >= 3) {
    wins.push({
      line: -1, // Scatter
      symbols: Array(scatterCount).fill(SCATTER),
      payout: scatterCount * 5, // Small payout but triggers "feature"
    });
  }
  
  // Check for bonus (any 3+)
  const bonusCount = reels.flat().filter(s => s.id === 'bonus').length;
  if (bonusCount >= 3) {
    wins.push({
      line: -2, // Bonus
      symbols: Array(bonusCount).fill(BONUS),
      payout: bonusCount * 10,
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
  const [message, setMessage] = useState("Press SPIN to play!");
  const [jackpots, setJackpots] = useState(JACKPOTS);
  const [showBonus, setShowBonus] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  
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
      setMessage("Not enough credits, ya broke cunt!");
      return;
    }
    
    setSpinning(true);
    setLastWin(0);
    
    if (freeSpins > 0) {
      setFreeSpins(prev => prev - 1);
      setMessage(`Free spin! ${freeSpins - 1} remaining...`);
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
      
      if (spinCount >= 20) {
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
          
          // Check for bonus feature
          if (wins.some(w => w.line === -2)) {
            setShowBonus(true);
            setFreeSpins(prev => prev + 5);
            setTimeout(() => setShowBonus(false), 2000);
          }
        } else {
          setMessage(LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)]);
        }
        
        setSpinning(false);
      }
    }, 50);
  }, [spinning, credits, bet, freeSpins]);
  
  const changeBet = (delta: number) => {
    setBet(prev => Math.max(1, Math.min(100, prev + delta)));
  };
  
  return (
    <div className={styles.container}>
      {/* Header with jackpots */}
      <div className={styles.header}>
        <h1 className={styles.title}>STEPTEN & CHAOS</h1>
        <div className={styles.subtitle}>LINK</div>
      </div>
      
      <div className={styles.jackpots}>
        {Object.entries(jackpots).map(([key, jackpot]) => (
          <div key={key} className={styles.jackpot} style={{ '--jackpot-color': jackpot.color } as any}>
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
                  key={`${reelIndex}-${symbolIndex}`}
                  className={`${styles.symbol} ${symbol.isCard ? styles.cardSymbol : styles.characterSymbol}`}
                  animate={spinning ? { y: [0, -20, 0] } : {}}
                  transition={{ duration: 0.1, repeat: spinning ? Infinity : 0 }}
                >
                  <span className={styles.symbolEmoji}>{symbol.emoji}</span>
                  {!symbol.isCard && (
                    <span className={styles.symbolName}>{symbol.name}</span>
                  )}
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Payline indicator */}
        <div className={styles.payline} />
      </div>
      
      {/* Message display */}
      <div className={styles.messageBar}>
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={styles.message}
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
          <div className={`${styles.value} ${lastWin > 0 ? styles.winning : ''}`}>
            ${lastWin.toLocaleString()}
          </div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        This is NOT real gambling. No real money. Just vibes and NARFcoins.
        <br />
        If you're losing fake money, imagine how bad you'd be at real pokies.
      </div>
    </div>
  );
}
