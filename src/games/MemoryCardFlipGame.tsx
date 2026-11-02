import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, RotateCcw, Trophy, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import confetti from 'canvas-confetti';

interface MemoryCardFlipGameProps {
  currentLevel: 1 | 2 | 3 | 4 | 5;
  onCorrect: (points?: number) => void;
  onIncorrect?: (hint?: string) => void;
}

interface CardItem {
  uid: string; // unique card id in the deck
  pairId: string; // identifier of the matching pair
  icon: string;
  name: string;
}

// Level themes and card pool sets
const THEMES_BY_LEVEL: Record<number, { title: string; subtitle: string; pairs: Array<{ id: string; icon: string; name: string }>; gridCols: string }> = {
  // Level 1: 6 cards (3 pairs) - 3x2 grid
  1: {
    title: 'Farm Friends',
    subtitle: 'Match 3 cute pet pairs!',
    gridCols: 'grid-cols-3',
    pairs: [
      { id: 'dog', icon: '🐶', name: 'Puppy' },
      { id: 'cat', icon: '🐱', name: 'Kitten' },
      { id: 'bunny', icon: '🐰', name: 'Bunny' }
    ]
  },
  // Level 2: 8 cards (4 pairs) - 4x2 grid
  2: {
    title: 'Safari Adventures',
    subtitle: 'Match 4 wild safari animal pairs!',
    gridCols: 'grid-cols-4',
    pairs: [
      { id: 'lion', icon: '🦁', name: 'Lion' },
      { id: 'elephant', icon: '🐘', name: 'Elephant' },
      { id: 'panda', icon: '🐼', name: 'Panda' },
      { id: 'giraffe', icon: '🦒', name: 'Giraffe' }
    ]
  },
  // Level 3: 12 cards (6 pairs) - 4x3 grid
  3: {
    title: 'Ocean Explorers',
    subtitle: 'Match 6 undersea ocean creature pairs!',
    gridCols: 'grid-cols-4',
    pairs: [
      { id: 'dolphin', icon: '🐬', name: 'Dolphin' },
      { id: 'octopus', icon: '🐙', name: 'Octopus' },
      { id: 'turtle', icon: '🐢', name: 'Turtle' },
      { id: 'crab', icon: '🦀', name: 'Crab' },
      { id: 'fish', icon: '🐠', name: 'Tropical Fish' },
      { id: 'whale', icon: '🐳', name: 'Whale' }
    ]
  },
  // Level 4: 16 cards (8 pairs) - 4x4 grid
  4: {
    title: 'Cosmic Quest',
    subtitle: 'Match 8 cosmic galaxy pairs!',
    gridCols: 'grid-cols-4',
    pairs: [
      { id: 'rocket', icon: '🚀', name: 'Rocket' },
      { id: 'star', icon: '⭐', name: 'Star' },
      { id: 'saturn', icon: '🪐', name: 'Saturn' },
      { id: 'ufo', icon: '🛸', name: 'UFO' },
      { id: 'moon', icon: '🌙', name: 'Moon' },
      { id: 'rainbow', icon: '🌈', name: 'Rainbow' },
      { id: 'diamond', icon: '💎', name: 'Diamond' },
      { id: 'sun', icon: '☀️', name: 'Sun' }
    ]
  },
  // Level 5: 20 cards (10 pairs) - 5x4 grid
  5: {
    title: 'Master Kingdom',
    subtitle: 'Master memory challenge! Match 10 royal treasures!',
    gridCols: 'grid-cols-5',
    pairs: [
      { id: 'crown', icon: '👑', name: 'Crown' },
      { id: 'castle', icon: '🏰', name: 'Castle' },
      { id: 'unicorn', icon: '🦄', name: 'Unicorn' },
      { id: 'dragon', icon: '🐉', name: 'Dragon' },
      { id: 'crystal', icon: '🔮', name: 'Crystal' },
      { id: 'key', icon: '🗝️', name: 'Golden Key' },
      { id: 'compass', icon: '🧭', name: 'Compass' },
      { id: 'lightning', icon: '⚡', name: 'Thunder' },
      { id: 'chest', icon: '🪙', name: 'Treasure' },
      { id: 'gem', icon: '💠', name: 'Jewel' }
    ]
  }
};

// True unbiased Fisher-Yates Shuffle
function shuffleDeck(pairs: Array<{ id: string; icon: string; name: string }>): CardItem[] {
  const cards: CardItem[] = [];
  pairs.forEach((p, idx) => {
    cards.push({ uid: `${p.id}_a_${idx}`, pairId: p.id, icon: p.icon, name: p.name });
    cards.push({ uid: `${p.id}_b_${idx}`, pairId: p.id, icon: p.icon, name: p.name });
  });

  // Fisher-Yates
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards;
}

export const MemoryCardFlipGame: React.FC<MemoryCardFlipGameProps> = ({
  currentLevel,
  onCorrect
}) => {
  const theme = THEMES_BY_LEVEL[currentLevel] || THEMES_BY_LEVEL[1];
  
  // Game Deck state
  const [deck, setDeck] = useState<CardItem[]>(() => shuffleDeck(theme.pairs));
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedUids, setMatchedUids] = useState<string[]>([]);
  const [movesCount, setMovesCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [peekAvailable, setPeekAvailable] = useState(true);

  // Initialize fresh random deck on level change
  useEffect(() => {
    setDeck(shuffleDeck(theme.pairs));
    setFlippedUids([]);
    setMatchedUids([]);
    setMovesCount(0);
    setIsChecking(false);
    setIsPeeking(false);
    setPeekAvailable(true);
  }, [currentLevel, theme]);

  // Restart / reshuffle current level
  const handleRestart = () => {
    soundEngine.playPop();
    setDeck(shuffleDeck(theme.pairs));
    setFlippedUids([]);
    setMatchedUids([]);
    setMovesCount(0);
    setIsChecking(false);
    setIsPeeking(false);
    setPeekAvailable(true);
  };

  // Peek Hint: reveals all cards for 2.5 seconds
  const handlePeekHint = () => {
    if (!peekAvailable || isChecking) return;
    soundEngine.playStar();
    setIsPeeking(true);
    setPeekAvailable(false);
    setTimeout(() => {
      setIsPeeking(false);
    }, 2400);
  };

  // Card click handler
  const handleCardClick = (card: CardItem) => {
    // Prevent clicking if busy checking or card is already flipped or matched
    if (isChecking || isPeeking) return;
    if (flippedUids.includes(card.uid) || matchedUids.includes(card.uid)) return;

    soundEngine.playPop();
    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    // If second card is flipped
    if (nextFlipped.length === 2) {
      setMovesCount(prev => prev + 1);
      setIsChecking(true);

      const [firstUid, secondUid] = nextFlipped;
      const firstCard = deck.find(c => c.uid === firstUid);
      const secondCard = deck.find(c => c.uid === secondUid);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // MATCH!
        soundEngine.playSnap();
        const nextMatched = [...matchedUids, firstUid, secondUid];
        setMatchedUids(nextMatched);
        setFlippedUids([]);
        setIsChecking(false);

        // Check if all pairs are found!
        if (nextMatched.length === deck.length) {
          setTimeout(() => {
            soundEngine.playVictory();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            } catch {}
            onCorrect(150 + Math.max(0, 100 - movesCount * 5));
          }, 600);
        }
      } else {
        // MISMATCH - Keep visible for 1.2s so kids can memorize before flipping back
        soundEngine.playOops();
        setTimeout(() => {
          setFlippedUids([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  };

  const totalPairs = theme.pairs.length;
  const foundPairs = matchedUids.length / 2;
  const progressPercent = Math.round((foundPairs / totalPairs) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-between p-3 sm:p-5 rounded-3xl bg-gradient-to-b from-purple-950/40 via-slate-900/50 to-indigo-950/40 border-4 border-purple-400/40 shadow-2xl font-body select-none">
      
      {/* Level Header Bar */}
      <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-3 bg-slate-900/90 p-3 rounded-2xl border border-purple-400/30">
        <div className="flex items-center gap-2">
          <span className="text-3xl animate-bounce">🃏</span>
          <div>
            <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider block font-fun">
              Memory Flip • Level {currentLevel} of 5 ({theme.title})
            </span>
            <h2 className="text-sm sm:text-base font-black text-white font-fun">
              {theme.subtitle}
            </h2>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2">
          {peekAvailable && (
            <button
              onClick={handlePeekHint}
              className="px-2.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black font-fun flex items-center gap-1 shadow-md active:scale-95 transition cursor-pointer"
              title="Peek all cards for 2 seconds"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Peek 👀</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-fun shadow-sm transition active:scale-95 cursor-pointer"
            title="Reshuffle & restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-xs font-black font-fun text-purple-200">
            Pairs: {foundPairs} / {totalPairs}
          </span>

          <span className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold font-fun text-slate-300">
            Moves: {movesCount}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950/80 rounded-full h-2.5 mb-3 border border-purple-400/30 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Main Memory Cards Grid Stage */}
      <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 rounded-3xl border-4 border-purple-400/30 shadow-2xl min-h-[340px]">
        <div className={`grid ${theme.gridCols} gap-2.5 sm:gap-3.5 max-w-2xl w-full justify-items-center`}>
          {deck.map((card) => {
            const isFlipped = isPeeking || flippedUids.includes(card.uid);
            const isMatched = matchedUids.includes(card.uid);
            const isRevealed = isFlipped || isMatched;

            return (
              <motion.button
                key={card.uid}
                whileHover={!isRevealed ? { scale: 1.05 } : {}}
                whileTap={!isRevealed ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(card)}
                className={`relative w-16 h-22 sm:w-22 sm:h-28 md:w-26 md:h-32 rounded-2xl cursor-pointer transition-all duration-300 shadow-md ${
                  isMatched
                    ? 'ring-4 ring-emerald-400 border-3 border-emerald-300 scale-95 opacity-95 bg-white'
                    : isRevealed
                    ? 'ring-4 ring-purple-400 border-3 border-white scale-100 shadow-xl bg-white'
                    : 'border-3 border-purple-300/80 hover:border-amber-400 shadow-lg bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-600'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isRevealed ? (
                    <motion.div
                      key="front"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-2 relative"
                    >
                      <span className="text-3xl sm:text-4xl md:text-5xl drop-shadow select-none">
                        {card.icon}
                      </span>
                      <span className="text-[10px] sm:text-xs font-black text-slate-800 font-fun uppercase mt-1 leading-none text-center">
                        {card.name}
                      </span>
                      {isMatched && (
                        <span className="absolute top-1.5 right-1.5 text-emerald-500">
                          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-100" />
                        </span>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="back"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full rounded-2xl flex flex-col items-center justify-center border border-white/20"
                    >
                      <span className="text-2xl sm:text-3xl text-amber-300 font-black font-fun animate-pulse">
                        ❓
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-bold text-purple-200 uppercase font-fun mt-1 tracking-wider">
                        Flip
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Helpful Hint Footer */}
      <div className="w-full flex items-center justify-between mt-3 px-2 text-xs font-bold text-purple-200 font-fun">
        <span>💡 Tap any card to flip it over and find its matching friend!</span>
        <span className="text-amber-300 font-black">⭐ +150 Points on Match</span>
      </div>
    </div>
  );
};
