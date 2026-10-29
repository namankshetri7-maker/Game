/**
 * Mini-Game: Animal Sound Memory (World 4: Animal Kingdom & Science - Game #31)
 * Auditory & visual card matching game with procedural synthesized animal calls.
 *
 * Age Dynamic Difficulty:
 * - Easy (3–4): 4 cards (2 pairs), visual guidance, friendly creature icons.
 * - Medium (5–7): 6 cards (3 pairs), animal sounds played on flip.
 * - Hard (8–10): 8 cards (4 pairs), fast concentration grid with star score bonus.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Sparkles, Volume2, HelpCircle, Check, Home } from 'lucide-react';
import { AgeGroup, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface AnimalSoundMemoryProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: number;
  onHome: () => void;
  onNextGame: () => void;
}

interface AnimalCard {
  id: string;
  animalId: string;
  name: string;
  icon: string;
  soundType: 'cow' | 'duck' | 'frog' | 'lion' | 'sheep' | 'bird';
}

const ALL_ANIMALS: { animalId: string; name: string; icon: string; soundType: AnimalCard['soundType'] }[] = [
  { animalId: 'cow', name: 'Cow', icon: '🐮', soundType: 'cow' },
  { animalId: 'duck', name: 'Duck', icon: '🦆', soundType: 'duck' },
  { animalId: 'frog', name: 'Frog', icon: '🐸', soundType: 'frog' },
  { animalId: 'lion', name: 'Lion', icon: '🦁', soundType: 'lion' },
  { animalId: 'sheep', name: 'Sheep', icon: '🐑', soundType: 'sheep' },
  { animalId: 'bird', name: 'Songbird', icon: '🐦', soundType: 'bird' }
];

export const AnimalSoundMemory: React.FC<AnimalSoundMemoryProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onNextGame
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);

  // Progressive pair count based on level
  const pairCount = Math.min(6, Math.max(2, currentLevel + (ageGroup === '8-10' ? 1 : 0)));

  const [cards, setCards] = useState<AnimalCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedAnimalIds, setMatchedAnimalIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize randomized cards
  useEffect(() => {
    const selectedAnimals = ALL_ANIMALS.slice(0, pairCount);
    const deck: AnimalCard[] = [];
    selectedAnimals.forEach(a => {
      deck.push({ id: `${a.animalId}_1`, ...a });
      deck.push({ id: `${a.animalId}_2`, ...a });
    });
    // Shuffle
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMatchedAnimalIds([]);
  }, [pairCount]);

  // Procedural animal audio cue
  const playAnimalSound = (type: AnimalCard['soundType']) => {
    // Generate playful frequency bursts for each animal
    if (type === 'duck') {
      soundEngine.playSnap();
    } else if (type === 'cow') {
      soundEngine.playLetterTone('M');
    } else if (type === 'frog') {
      soundEngine.playLetterTone('R');
    } else if (type === 'lion') {
      soundEngine.playLetterTone('L');
    } else {
      soundEngine.playPop();
    }
  };

  const handleCardClick = (index: number) => {
    if (isProcessing || flippedIndices.includes(index)) return;
    const clickedCard = cards[index];
    if (matchedAnimalIds.includes(clickedCard.animalId)) return;

    soundEngine.playPop();
    playAnimalSound(clickedCard.soundType);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.animalId === secondCard.animalId) {
        // Matched pair!
        soundEngine.playSnap();
        setScore(prev => prev + 100);
        const updatedMatches = [...matchedAnimalIds, firstCard.animalId];
        setMatchedAnimalIds(updatedMatches);
        setFlippedIndices([]);
        setIsProcessing(false);

        // Check if all pairs matched
        if (updatedMatches.length === pairCount) {
          setTimeout(() => {
            let calculatedStars = 3;
            if (mistakes === 1) calculatedStars = 2;
            else if (mistakes > 1) calculatedStars = 1;

            setStars(calculatedStars);
            setGameState('LEVEL_COMPLETE');
            soundEngine.playVictory();

            try {
              confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
            } catch {}

            const timeSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
            storageService.recordGameResult(
              activeProfileId,
              'game_animal_sound_memory',
              'world_science',
              calculatedStars,
              score + 150,
              timeSec,
              true
            );

            const stickers = storageService.getUnlockedStickers(activeProfileId);
            if (stickers.length > 0) {
              setEarnedSticker(stickers[stickers.length - 1]);
            }
          }, 800);
        }
      } else {
        // Mismatch
        setMistakes(prev => prev + 1);
        soundEngine.playOops();
        setTimeout(() => {
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] bg-gradient-to-b from-rose-500 via-pink-400 to-amber-500 rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-rose-300 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Home Map Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-rose-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-rose-300 active:scale-95 transition flex items-center gap-1.5"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPaused(true);
              setGameState('PAUSED');
            }}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-rose-950 rounded-2xl shadow-md active:scale-95 border-2 border-rose-200 transition"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full shadow-sm">
                Level {currentLevel} of 5
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-white bg-black/20 px-2 py-0.5 rounded-full">
                Pairs: {matchedAnimalIds.length} / {pairCount}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-fun drop-shadow-md">
              Animal Sound Memory
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-rose-300 shadow-md">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span className="text-base sm:text-lg font-black text-slate-800 font-fun">{score} pts</span>
        </div>
      </div>

      {/* Main Play Grid */}
      <div className="flex-1 flex flex-col items-center justify-center my-2 sm:my-3 z-10">
        <div className="text-xs sm:text-sm font-bold text-white/90 mb-3 font-fun text-center drop-shadow">
          Tap two cards to find matching animal pairs and hear their friendly sounds!
        </div>

        {/* Card Grid */}
        <div className={`grid gap-2 sm:gap-4 max-w-xl w-full ${
          pairCount === 2 ? 'grid-cols-2 max-w-sm' : pairCount === 3 ? 'grid-cols-3' : 'grid-cols-4'
        }`}>
          {cards.map((card, idx) => {
            const isFlipped = flippedIndices.includes(idx) || matchedAnimalIds.includes(card.animalId);
            const isMatched = matchedAnimalIds.includes(card.animalId);

            return (
              <motion.button
                key={card.id}
                whileHover={!isFlipped ? { scale: 1.05 } : {}}
                whileTap={!isFlipped ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-2xl border-4 transition-all duration-300 flex flex-col items-center justify-center p-2 shadow-lg cursor-pointer ${
                  isMatched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950 ring-2 ring-emerald-300'
                    : isFlipped
                    ? 'bg-white border-amber-400 text-slate-900 shadow-amber-300/50'
                    : 'bg-gradient-to-tr from-amber-300 to-yellow-200 border-amber-400 text-amber-900 hover:brightness-105'
                }`}
              >
                {isFlipped ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center justify-center"
                  >
                    <span className="text-3xl sm:text-4xl drop-shadow">{card.icon}</span>
                    <span className="text-[11px] font-black font-fun mt-1 text-slate-800">{card.name}</span>
                    {isMatched && (
                      <span className="text-[9px] font-extrabold text-emerald-700 uppercase mt-0.5">Matched!</span>
                    )}
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl">🐾</span>
                    <span className="text-[10px] font-black uppercase text-amber-800/80 font-fun mt-1">Tap</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status */}
      <div className="flex items-center justify-between text-white text-xs font-bold z-10 px-2">
        <span className="bg-black/20 px-3 py-1 rounded-full">
          Mistakes: {mistakes}
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-full">
          Concentration & Auditory Memory
        </span>
      </div>

      {/* Universal Win Modal */}
      <WinModal
        isOpen={gameState === 'LEVEL_COMPLETE'}
        stars={stars}
        score={score}
        timeSpentSeconds={Math.max(1, Math.round((Date.now() - startTime) / 1000))}
        stickerEarned={earnedSticker}
        onRestart={() => {
          setGameState('PLAYING');
          setMatchedAnimalIds([]);
          setFlippedIndices([]);
          setScore(0);
          setMistakes(0);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => (prev + 1) as 1 | 2 | 3 | 4 | 5);
            setGameState('PLAYING');
            setMatchedAnimalIds([]);
            setFlippedIndices([]);
            setMistakes(0);
          } else {
            onNextGame();
          }
        }}
        onHome={onHome}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPaused}
        isMuted={soundEngine.getMuted()}
        onToggleMute={() => {
          soundEngine.setMuted(!soundEngine.getMuted());
        }}
        onResume={() => {
          setIsPaused(false);
          setGameState('PLAYING');
        }}
        onRestart={() => {
          setIsPaused(false);
          setGameState('PLAYING');
          setMatchedAnimalIds([]);
          setFlippedIndices([]);
          setScore(0);
          setMistakes(0);
        }}
        onHome={onHome}
      />
    </div>
  );
};
