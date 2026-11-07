/**
 * Universal Mini-Game Engine Runner
 * Powers all 45 mini-games across the 5 thematic worlds:
 * Math, Phonics, Geography, Science, and Logic.
 *
 * Fully supports:
 * - 5 Difficulty Levels per game
 * - Interactive custom mechanics tailored to each specific game
 * - 100% Offline procedural Web Audio effects
 * - Drag/tap responsive interactions with positive reinforcement
 * - Direct 1-tap "World Map" navigation button
 * - Stars, time, score tracking, stickers, and Universal WinModal
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  RotateCcw,
  Pause,
  Sparkles,
  HelpCircle,
  Check,
  Star,
  Award,
  ArrowRight,
  ArrowLeft,
  Volume2,
  ChevronRight,
  Shield,
  Layers,
  Compass,
  Heart,
  Palette,
  Crosshair,
  Feather
} from 'lucide-react';
import { MINI_GAMES_MATRIX, WORLDS } from '../data/gameMatrix';
import { AgeGroup, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { FootprintDetectiveGame } from './FootprintDetectiveGame';
import { BunnyMazeRunnerGame } from './BunnyMazeRunnerGame';
import { PixelArtColoringGame } from './PixelArtColoringGame';
import { AbcLetterTraceGame } from './AbcLetterTraceGame';
import { GreaterDragonScalesGame } from './GreaterDragonScalesGame';
import { MemoryCardFlipGame } from './MemoryCardFlipGame';
import confetti from 'canvas-confetti';

interface UniversalMiniGameRunnerProps {
  gameId: string;
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  onHome: () => void;
  onBackToWorld?: () => void;
  onNextGame: () => void;
  isDemoMode?: boolean;
}

// Stable deterministic shuffle helper to prevent option jumping during gameplay
function stableShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.abs((seed * 37 + i * 19 + 7) % (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const UniversalMiniGameRunner: React.FC<UniversalMiniGameRunnerProps> = ({
  gameId,
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onBackToWorld,
  onNextGame,
  isDemoMode = false
}) => {
  const gameMeta = MINI_GAMES_MATRIX.find(g => g.id === gameId) || MINI_GAMES_MATRIX[0];
  const worldMeta = WORLDS.find(w => w.id === gameMeta.worldId) || WORLDS[0];

  // Core Game State
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | 4 | 5>(initialLevel);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [startTime, setStartTime] = useState(Date.now());
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; positive: boolean } | null>(null);

  // Sub-game specific state variables
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [countedCount, setCountedCount] = useState(0);
  const [eatenCount, setEatenCount] = useState(0);
  const [mazePlayerPos, setMazePlayerPos] = useState({ x: 0, y: 0 });
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [paintedPixels, setPaintedPixels] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [sentenceWords, setSentenceWords] = useState<string[]>([]);
  const [selectedWordTileIds, setSelectedWordTileIds] = useState<number[]>([]);
  const [unscrambledLetters, setUnscrambledLetters] = useState<string[]>([]);
  const [spellingUsedIndices, setSpellingUsedIndices] = useState<number[]>([]);
  const [clinicStep, setClinicStep] = useState(0);
  const [petExamHistory, setPetExamHistory] = useState<string[]>([]);
  const [camouflageFound, setCamouflageFound] = useState(false);
  const [activeMagnifierItem, setActiveMagnifierItem] = useState<string | null>(null);

  // Reset or initialize question on level or game change
  useEffect(() => {
    setCurrentLevel(initialLevel);
    resetGameState(initialLevel);
  }, [gameId, initialLevel]);

  const resetGameState = (lvl: 1 | 2 | 3 | 4 | 5) => {
    setGameState('PLAYING');
    setScore(0);
    setMistakes(0);
    setStars(3);
    setStartTime(Date.now());
    setFeedbackMsg(null);
    setSelectedItems([]);
    setCountedCount(0);
    setEatenCount(0);
    setMazePlayerPos({ x: 0, y: 0 });
    setConnectedDots([]);
    setPaintedPixels({});
    setSelectedColor('#EF4444');
    setFlippedCards([]);
    setMatchedPairs([]);
    setSentenceWords([]);
    setSelectedWordTileIds([]);
    setUnscrambledLetters([]);
    setSpellingUsedIndices([]);
    setClinicStep(0);
    setPetExamHistory([]);
    setCamouflageFound(false);
    setActiveMagnifierItem(null);
  };

  const handleCorrect = (points = 100) => {
    soundEngine.playCorrect();
    setScore(prev => prev + points);
    setFeedbackMsg({ text: 'Wonderful job! ⭐', positive: true });

    setTimeout(() => {
      setFeedbackMsg(null);
      triggerWin();
    }, 800);
  };

  const handleIncorrect = (hint?: string) => {
    soundEngine.playError();
    setMistakes(prev => prev + 1);
    setFeedbackMsg({ text: hint || 'Oops! Try again 🌱', positive: false });
    setTimeout(() => setFeedbackMsg(null), 1200);
  };

  const triggerWin = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    soundEngine.playCelebration();
    const finalStars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    setStars(finalStars);
    setGameState('LEVEL_COMPLETE');

    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    storageService.recordGameResult(
      activeProfileId,
      gameMeta.id,
      gameMeta.worldId,
      finalStars,
      score + 150,
      timeSpent,
      true
    );

    const stickers = storageService.getUnlockedStickers(activeProfileId);
    if (stickers.length > 0) {
      setEarnedSticker(stickers[stickers.length - 1]);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 5) {
      const nextLvl = (currentLevel + 1) as 1 | 2 | 3 | 4 | 5;
      setCurrentLevel(nextLvl);
      resetGameState(nextLvl);
    } else {
      onNextGame();
    }
  };

  // =========================================================================
  // GAME CONTENT GENERATOR BASED ON GAME ID & LEVEL
  // =========================================================================
  const renderGameContent = () => {
    // -----------------------------------------------------------------------
    // MATH 2: NUMBER SAFARI (Counting animals)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_number_safari') {
      const targetCount = currentLevel * 2 + 3; // 5, 7, 9, 11, 13
      const animals = ['🦓', '🦒', '🦁', '🐘', '🦏'];
      const animalIcon = animals[(currentLevel - 1) % animals.length];
      const options = stableShuffle([targetCount - 1, targetCount, targetCount + 1], currentLevel * 3);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-black font-fun text-slate-800">
              Count the {animalIcon} Safari Animals!
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Tap animals to count, then tap the right number!</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-md p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200 min-h-[140px] items-center mb-5 shadow-sm">
            {Array.from({ length: targetCount }).map((_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 1.25 }}
                onClick={() => {
                  soundEngine.playPop();
                  setCountedCount(prev => prev + 1);
                }}
                className="text-3xl sm:text-4xl p-2 bg-white rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-100 transition active:scale-95"
              >
                {animalIcon}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {options.map((num, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (num === targetCount) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Count carefully!');
                  }
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-600 text-white font-fun font-black text-2xl shadow-md border-2 border-white hover:scale-105 active:scale-95 transition"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 3: SUBTRACTION BAKERY (Cupcakes)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_subtraction_bakery') {
      const initialCupcakes = currentLevel * 2 + 3; // 5, 7, 9, 11, 13
      const toEat = Math.min(initialCupcakes - 1, currentLevel + 1);
      const remaining = initialCupcakes - toEat;
      const options = stableShuffle([remaining, remaining + 1, Math.max(1, remaining - 1)], currentLevel * 5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-black font-fun text-slate-800">
              Chef baked {initialCupcakes} cupcakes! Tap {toEat} to eat them!
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              Equation: {initialCupcakes} - {eatenCount} = {initialCupcakes - eatenCount} left
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 mb-5 shadow-sm">
            {Array.from({ length: initialCupcakes }).map((_, i) => {
              const isEaten = i < eatenCount;
              return (
                <button
                  key={i}
                  disabled={isEaten}
                  onClick={() => {
                    soundEngine.playCrunch();
                    setEatenCount(prev => Math.min(toEat, prev + 1));
                  }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition border ${
                    isEaten
                      ? 'bg-slate-200 border-slate-300 opacity-30 cursor-not-allowed'
                      : 'bg-white border-pink-200 hover:scale-110 shadow-sm active:scale-95'
                  }`}
                >
                  {isEaten ? '✨' : '🧁'}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === remaining && eatenCount === toEat) {
                    handleCorrect();
                  } else if (eatenCount < toEat) {
                    handleIncorrect(`Tap ${toEat - eatenCount} more cupcakes first!`);
                  } else {
                    handleIncorrect('Check how many cupcakes are left!');
                  }
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-b from-pink-500 to-rose-600 text-white font-fun font-black text-2xl shadow-md border-2 border-white hover:scale-105 active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 5: MULTIPLICATION BLITZ (Monster zap)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_multiplication_blitz') {
      const numA = currentLevel + 1;
      const numB = (currentLevel * 2) % 6 + 2;
      const product = numA * numB;
      const options = stableShuffle([product, product + numA, Math.max(1, product - numB)], currentLevel * 7);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="text-5xl mb-2 animate-bounce">👾</div>
          <div className="mb-3">
            <span className="text-xs uppercase font-extrabold text-purple-600 block tracking-wider">Monster Equation</span>
            <span className="text-3xl font-black font-fun text-slate-800">
              {numA} × {numB} = ?
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Zap the crystal with the right answer!</p>

          <div className="flex gap-4">
            {options.map((ans, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (ans === product) {
                    soundEngine.playLaser();
                    handleCorrect();
                  } else {
                    handleIncorrect('Try multiplying again!');
                  }
                }}
                className="px-6 py-4 rounded-2xl bg-gradient-to-b from-purple-600 to-indigo-700 text-white font-fun font-black text-2xl shadow-md border-2 border-purple-300 hover:scale-105 active:scale-95 transition"
              >
                ⚡ {ans}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 6: FRACTION PIZZA PARTY
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_fraction_pizza_party') {
      const fractions = [
        { label: '1/2 (Half)', total: 2, required: 1 },
        { label: '3/4 (Three Quarters)', total: 4, required: 3 },
        { label: '2/3 (Two Thirds)', total: 3, required: 2 },
        { label: '1/4 (One Quarter)', total: 4, required: 1 },
        { label: '5/6 (Five Sixths)', total: 6, required: 5 }
      ];
      const currentFrac = fractions[(currentLevel - 1) % fractions.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="mb-3">
            <h3 className="text-lg font-black font-fun text-slate-800">
              Serve {currentFrac.label} of the pizza! 🍕
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Tap {currentFrac.required} of {currentFrac.total} slices!</p>
          </div>

          <div className="flex gap-2 mb-6">
            {Array.from({ length: currentFrac.total }).map((_, idx) => {
              const isSelected = selectedItems.includes(`slice_${idx}`);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    soundEngine.playPop();
                    if (isSelected) {
                      setSelectedItems(prev => prev.filter(s => s !== `slice_${idx}`));
                    } else {
                      setSelectedItems(prev => [...prev, `slice_${idx}`]);
                    }
                  }}
                  className={`w-14 h-20 rounded-2xl flex flex-col items-center justify-center text-3xl border-2 transition ${
                    isSelected
                      ? 'bg-amber-200 border-amber-500 scale-105 shadow-md'
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  🍕
                  <span className="text-[10px] font-bold text-slate-500 mt-1">{isSelected ? '✓' : ''}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (selectedItems.length === currentFrac.required) {
                handleCorrect();
              } else {
                handleIncorrect(`Select exactly ${currentFrac.required} slices!`);
              }
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-fun font-bold text-sm shadow-md active:scale-95 transition"
          >
            Serve Pizza ({selectedItems.length}/{currentFrac.required}) 🍽️
          </button>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 7: CLOCKWORK OWL
    // -----------------------------------------------------------------------
    // MATH 7: CLOCKWORK OWL (Accurate SVG Analog Clock)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_clockwork_owl') {
      const clockLevels = [
        { hour: 3, minute: 0, time: '3:00', options: ['3:00', '6:00', '12:00'], hint: 'Hour hand is on 3 and minute hand points straight up at 12!' },
        { hour: 6, minute: 30, time: '6:30', options: ['6:30', '7:30', '6:00'], hint: 'Minute hand points down at 6 (30 mins), hour hand is past 6!' },
        { hour: 9, minute: 15, time: '9:15', options: ['9:15', '9:45', '3:15'], hint: 'Minute hand points to 3 (quarter past 15 mins)!' },
        { hour: 1, minute: 45, time: '1:45', options: ['1:45', '2:45', '1:15'], hint: 'Minute hand points to 9 (45 mins), hour hand is nearing 2!' },
        { hour: 10, minute: 20, time: '10:20', options: ['10:20', '10:40', '4:50'], hint: 'Minute hand points to 4 (20 mins past 10)!' }
      ];
      const targetClock = clockLevels[(currentLevel - 1) % clockLevels.length];
      const hourAngle = (targetClock.hour % 12 + targetClock.minute / 60) * 30;
      const minuteAngle = targetClock.minute * 6;
      const shuffledOptions = stableShuffle(targetClock.options, currentLevel * 17);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-4xl animate-bounce">🦉</span>
            <div className="text-left">
              <span className="text-[10px] font-black uppercase text-amber-500 font-fun tracking-wider block">
                Professor Owl's Academy
              </span>
              <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
                What time does the clock show?
              </h3>
            </div>
          </div>

          {/* Accurate Analog SVG Clock Face */}
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 my-3 bg-white rounded-full border-4 border-indigo-400 shadow-xl flex items-center justify-center">
            <svg className="w-full h-full p-2 select-none" viewBox="0 0 100 100">
              {/* Outer dial ring */}
              <circle cx="50" cy="50" r="46" fill="#F8FAFC" stroke="#6366F1" strokeWidth="3" />
              
              {/* Hour tick marks & Numbers */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => {
                const angleRad = (num * 30 - 90) * (Math.PI / 180);
                const x = 50 + 34 * Math.cos(angleRad);
                const y = 50 + 34 * Math.sin(angleRad);
                return (
                  <text
                    key={num}
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    className="text-[9px] font-black font-fun fill-slate-800 font-bold"
                  >
                    {num}
                  </text>
                );
              })}

              {/* Red Hour Hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="28"
                stroke="#EF4444"
                strokeWidth="4.5"
                strokeLinecap="round"
                transform={`rotate(${hourAngle} 50 50)`}
              />

              {/* Blue Minute Hand */}
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="18"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
                transform={`rotate(${minuteAngle} 50 50)`}
              />

              {/* Gold Center Pin */}
              <circle cx="50" cy="50" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            </svg>

            {/* Hand Color Guide legend */}
            <div className="absolute -bottom-2 flex items-center gap-2 bg-slate-900/90 text-[10px] text-white px-2.5 py-0.5 rounded-full border border-slate-700 shadow font-fun">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Hour</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Minute</span>
            </div>
          </div>

          {/* Time Options */}
          <div className="flex gap-2.5 sm:gap-3 flex-wrap justify-center mt-3">
            {shuffledOptions.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (t === targetClock.time) {
                    handleCorrect();
                  } else {
                    handleIncorrect(targetClock.hint);
                  }
                }}
                className="px-5 py-2.5 rounded-2xl bg-white border-2 border-indigo-300 hover:border-indigo-600 hover:bg-indigo-50 text-indigo-950 font-fun font-black text-lg sm:text-xl shadow-md active:scale-95 transition cursor-pointer"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 8: PATTERN TRAIN
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_pattern_train') {
      const patterns = [
        { seq: ['🔴', '🟦', '🔴', '🟦'], next: '🔴', options: ['🔴', '🟦', '⭐'] },
        { seq: ['⭐', '🌙', '⭐', '🌙'], next: '⭐', options: ['⭐', '🌙', '☀️'] },
        { seq: ['🍎', '🍌', '🍇', '🍎', '🍌'], next: '🍇', options: ['🍇', '🍎', '🍌'] },
        { seq: ['🔺', '🔺', '🔷', '🔺', '🔺'], next: '🔷', options: ['🔷', '🔺', '🟢'] },
        { seq: ['2', '4', '6', '8'], next: '10', options: ['10', '9', '12'] }
      ];
      const currentPattern = patterns[(currentLevel - 1) % patterns.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🚂</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-2">
            Complete the Pattern Train!
          </h3>

          <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-2xl border border-slate-200 mb-5 overflow-x-auto">
            {currentPattern.seq.map((item, idx) => (
              <div key={idx} className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl font-bold font-fun">
                {item}
              </div>
            ))}
            <div className="w-12 h-12 bg-amber-200 border-2 border-dashed border-amber-500 rounded-xl flex items-center justify-center text-xl font-bold text-amber-800">
              ?
            </div>
          </div>

          <div className="flex gap-3">
            {currentPattern.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === currentPattern.next) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look closely at the pattern order!');
                  }
                }}
                className="w-14 h-14 bg-white rounded-2xl border-2 border-indigo-200 hover:border-indigo-500 text-2xl flex items-center justify-center shadow-sm active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 9: COIN COUNTER MARKET
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_coin_counter_market') {
      const items = [
        { name: 'Apple 🍎', price: 15 },
        { name: 'Teddy Bear 🧸', price: 30 },
        { name: 'Toy Car 🚗', price: 45 },
        { name: 'Book 📚', price: 60 },
        { name: 'Rocket 🚀', price: 75 }
      ];
      const marketItem = items[(currentLevel - 1) % items.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Buy {marketItem.name} for {marketItem.price}¢
            </h3>
            <p className="text-xs text-slate-500 font-semibold">Cash in hand: {countedCount}¢</p>
          </div>

          <div className="flex gap-2 sm:gap-3 mb-5">
            {[
              { label: 'Penny 1¢', val: 1, icon: '🪙' },
              { label: 'Nickel 5¢', val: 5, icon: '🪙' },
              { label: 'Dime 10¢', val: 10, icon: '🪙' },
              { label: 'Quarter 25¢', val: 25, icon: '🪙' }
            ].map((coin, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playCoin();
                  setCountedCount(prev => prev + coin.val);
                }}
                className="p-2 sm:p-3 bg-white rounded-2xl border border-amber-200 hover:bg-amber-50 shadow-sm active:scale-95 transition flex flex-col items-center"
              >
                <span className="text-2xl">{coin.icon}</span>
                <span className="text-[10px] font-bold text-slate-700 mt-1">+{coin.val}¢</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (countedCount === marketItem.price) {
                  handleCorrect();
                } else if (countedCount > marketItem.price) {
                  handleIncorrect(`That is too much (${countedCount}¢). Reset and try exact change!`);
                } else {
                  handleIncorrect(`Need ${marketItem.price - countedCount}¢ more!`);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-fun font-bold text-sm shadow-md active:scale-95 transition"
            >
              Pay {marketItem.price}¢
            </button>
            <button
              onClick={() => setCountedCount(0)}
              className="px-3 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // MATH 10: GREATER DRAGON SCALES (<, >, =)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_greater_dragon_scales') {
      return (
        <GreaterDragonScalesGame
          currentLevel={currentLevel}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 12: PHONICS POPSICLE (Pop letter sounds)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_phonics_popsicle') {
      const sounds = [
        { letter: 'B', sound: '/b/ as in Bear 🐻' },
        { letter: 'M', sound: '/m/ as in Monkey 🐒' },
        { letter: 'S', sound: '/s/ as in Sun ☀️' },
        { letter: 'T', sound: '/t/ as in Tiger 🐯' },
        { letter: 'F', sound: '/f/ as in Fox 🦊' }
      ];
      const target = sounds[(currentLevel - 1) % sounds.length];
      const popsicles = stableShuffle([target.letter, 'P', 'R', 'K'], currentLevel * 13);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🍧</span>
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Pop the popsicle for sound {target.sound}!
            </h3>
          </div>

          <div className="flex gap-3">
            {popsicles.map((lettr, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  if (lettr === target.letter) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Listen carefully to the sound!');
                  }
                }}
                className="w-16 h-24 rounded-3xl bg-gradient-to-b from-pink-400 to-rose-500 text-white font-fun font-black text-3xl shadow-md border-2 border-white flex flex-col items-center justify-center"
              >
                <span>{lettr}</span>
                <span className="text-xs">🍧</span>
              </motion.button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 13: ABC LETTER TRACE
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_abc_letter_trace') {
      return (
        <AbcLetterTraceGame
          currentLevel={currentLevel}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 14: RHYME TIME ROCKET
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_rhyme_time_rocket') {
      const rhymes = [
        { word: 'CAT', target: 'HAT', options: ['HAT', 'DOG', 'SUN'] },
        { word: 'STAR', target: 'CAR', options: ['CAR', 'TREE', 'MOON'] },
        { word: 'FROG', target: 'LOG', options: ['LOG', 'FISH', 'BUG'] },
        { word: 'BOAT', target: 'COAT', options: ['COAT', 'SHIP', 'RAIN'] },
        { word: 'RING', target: 'KING', options: ['KING', 'GOLD', 'BELL'] }
      ];
      const pair = rhymes[(currentLevel - 1) % rhymes.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🚀</span>
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Fuel the rocket! What rhymes with <span className="underline font-black text-indigo-600">{pair.word}</span>?
            </h3>
          </div>

          <div className="flex gap-3">
            {pair.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === pair.target) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Listen to the ending sounds!');
                  }
                }}
                className="px-6 py-4 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-500 font-fun font-black text-xl text-indigo-900 shadow-sm active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 15: SIGHT WORD TREASURE HUNT
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_sight_word_treasure_hunt') {
      const sightWords = ['THE', 'AND', 'YOU', 'WAS', 'PLAY'];
      const targetWord = sightWords[(currentLevel - 1) % sightWords.length];
      const chests = stableShuffle([targetWord, 'FOR', 'ARE', 'WITH'], currentLevel * 17);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🗝️</span>
          <div className="mb-4">
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Dig open the chest containing: <span className="font-black underline text-amber-600">{targetWord}</span>!
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs">
            {chests.map((w, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (w === targetWord) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look for the matching letters!');
                  }
                }}
                className="p-4 bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-500 shadow-sm font-fun font-black text-lg text-amber-950 flex flex-col items-center justify-center active:scale-95 transition"
              >
                <span>📦</span>
                <span>{w}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 16: VOWEL VOYAGE (Short vs Long Vowels Cargo)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_vowel_voyage') {
      const quests = [
        { word: 'CAT', isLong: false, label: 'Short /æ/ sound' },
        { word: 'CAKE', isLong: true, label: 'Long /eɪ/ sound' },
        { word: 'BED', isLong: false, label: 'Short /e/ sound' },
        { word: 'BIKE', isLong: true, label: 'Long /aɪ/ sound' },
        { word: 'SUN', isLong: false, label: 'Short /ʌ/ sound' }
      ];
      const currentQuest = quests[(currentLevel - 1) % quests.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">⛵</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Vowel Voyage: <span className="text-indigo-600 font-black">{currentQuest.word}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Which boat should this word cargo board?</p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (!currentQuest.isLong) {
                  handleCorrect();
                } else {
                  handleIncorrect('Listen to the vowel sound: is it short or long?');
                }
              }}
              className="p-4 w-36 rounded-2xl bg-white border-2 border-teal-300 hover:border-teal-500 shadow-sm flex flex-col items-center active:scale-95 transition"
            >
              <span className="text-3xl mb-1">⛵</span>
              <span className="text-sm font-black font-fun text-teal-800">Short Vowel</span>
              <span className="text-[10px] text-slate-400 font-bold">Quick sound</span>
            </button>

            <button
              onClick={() => {
                if (currentQuest.isLong) {
                  handleCorrect();
                } else {
                  handleIncorrect('Listen to the vowel sound: does it say its name?');
                }
              }}
              className="p-4 w-36 rounded-2xl bg-white border-2 border-indigo-300 hover:border-indigo-500 shadow-sm flex flex-col items-center active:scale-95 transition"
            >
              <span className="text-3xl mb-1">🚢</span>
              <span className="text-sm font-black font-fun text-indigo-800">Long Vowel</span>
              <span className="text-[10px] text-slate-400 font-bold">Says its letter name</span>
            </button>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 17: GRAMMAR SAFARI (Nouns, Verbs, Adjectives in Rich Story Context)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_grammar_safari') {
      const safariStories = [
        {
          targetWord: 'MONKEY',
          type: 'Noun',
          emoji: '🐒',
          sentenceBefore: 'The playful',
          sentenceAfter: 'swings happily through the tall jungle vines!',
          question: 'What kind of word is "MONKEY"?',
          explanation: 'A monkey is an animal friend! Animal and object names are Nouns.',
          hint: 'Is it an animal/thing (Noun), an action (Verb), or a description (Adjective)?'
        },
        {
          targetWord: 'SWIMS',
          type: 'Verb',
          emoji: '🏊',
          sentenceBefore: 'A friendly river dolphin',
          sentenceAfter: 'swiftly across the blue lagoon waters!',
          question: 'What kind of word is "SWIMS"?',
          explanation: '"Swims" is something an animal DOES! Action words are Verbs.',
          hint: 'Think of an action you can do with your body!'
        },
        {
          targetWord: 'GOLDEN',
          type: 'Adjective',
          emoji: '✨',
          sentenceBefore: 'The brave lion wears a',
          sentenceAfter: 'mane that shines brightly in the sun!',
          question: 'What kind of word is "GOLDEN"?',
          explanation: '"Golden" describes what the lion\'s mane looks like! Describing words are Adjectives.',
          hint: 'Does it describe what something looks or feels like?'
        },
        {
          targetWord: 'SPRINTS',
          type: 'Verb',
          emoji: '⚡',
          sentenceBefore: 'The spotted cheetah',
          sentenceAfter: 'faster than the wind across the savanna grass!',
          question: 'What kind of word is "SPRINTS"?',
          explanation: '"Sprints" means running super fast! That is an action, so it is a Verb.',
          hint: 'Sprint is a fast movement! What do you call action words?'
        },
        {
          targetWord: 'GIGANTIC',
          type: 'Adjective',
          emoji: '🦕',
          sentenceBefore: 'Under the baobab tree stands a',
          sentenceAfter: 'elephant waving its huge flapping ears!',
          question: 'What kind of word is "GIGANTIC"?',
          explanation: '"Gigantic" describes the huge size of the elephant! Size and look words are Adjectives.',
          hint: 'It describes how big the elephant is!'
        }
      ];

      const curStory = safariStories[(currentLevel - 1) % safariStories.length];

      const speakSentence = () => {
        soundEngine.playPop();
        if ('speechSynthesis' in window && !soundEngine.getMuted()) {
          try {
            window.speechSynthesis.cancel();
            const text = `${curStory.sentenceBefore} ${curStory.targetWord} ${curStory.sentenceAfter}`;
            const utt = new SpeechSynthesisUtterance(text);
            utt.rate = 0.9;
            window.speechSynthesis.speak(utt);
          } catch {}
        }
      };

      const grammarOptions = [
        {
          type: 'Noun',
          badge: '🦁 NOUN',
          title: 'Person, Place, Thing',
          desc: 'Names an animal, friend, or place',
          bg: 'hover:bg-amber-50 border-amber-300 text-amber-950'
        },
        {
          type: 'Verb',
          badge: '⚡ VERB',
          title: 'Action Word',
          desc: 'Something you can jump, run, or do!',
          bg: 'hover:bg-emerald-50 border-emerald-300 text-emerald-950'
        },
        {
          type: 'Adjective',
          badge: '🎨 ADJECTIVE',
          title: 'Describing Word',
          desc: 'Tells size, color, or feeling',
          bg: 'hover:bg-purple-50 border-purple-300 text-purple-950'
        }
      ];

      return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 h-full text-center max-w-xl mx-auto">
          {/* Safari Header Banner */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-fun font-bold mb-3 shadow-sm">
            <span>🌿 Safari Field Notes</span>
            <button
              onClick={speakSentence}
              className="ml-1 p-1 bg-white hover:bg-emerald-50 rounded-full shadow-sm text-emerald-700 active:scale-95 transition"
              title="Read sentence aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Contextual Story Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm mb-3 w-full text-slate-800">
            <span className="text-4xl mb-1 block">{curStory.emoji}</span>
            <p className="text-sm sm:text-base font-medium leading-relaxed">
              <span>{curStory.sentenceBefore} </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-fun font-black shadow-sm inline-block scale-105">
                {curStory.targetWord}
              </span>
              <span> {curStory.sentenceAfter}</span>
            </p>
          </div>

          <h3 className="text-sm sm:text-base font-black font-fun text-slate-800 mb-1">
            {curStory.question}
          </h3>
          <p className="text-xs text-slate-500 mb-3 font-semibold">
            Tap the matching badge to log this word in your Safari Guide!
          </p>

          {/* Grammar Badge Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
            {grammarOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  if (opt.type === curStory.type) {
                    handleCorrect();
                  } else {
                    handleIncorrect(curStory.hint);
                  }
                }}
                className={`p-3 rounded-2xl bg-white border-2 shadow-sm transition active:scale-95 flex flex-col items-center text-center ${opt.bg}`}
              >
                <span className="font-fun font-black text-sm mb-0.5">{opt.badge}</span>
                <span className="font-bold text-xs text-slate-700">{opt.title}</span>
                <span className="text-[10px] text-slate-400 mt-1">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 18: OPPOSITE ANIMALS (Antonyms)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_opposite_animals') {
      const antonyms = [
        { prompt: 'BIG 🐘', answer: 'SMALL 🐁', options: ['SMALL 🐁', 'TALL 🦒', 'FAST 🐆'] },
        { prompt: 'FAST 🐆', answer: 'SLOW 🐢', options: ['SLOW 🐢', 'LOUD 🦁', 'BIG 🐘'] },
        { prompt: 'HOT ☀️', answer: 'COLD ❄️', options: ['COLD ❄️', 'DRY 🏜️', 'WET 🌧️'] },
        { prompt: 'HEAVY 🦏', answer: 'LIGHT 🪶', options: ['LIGHT 🪶', 'HARD 🪨', 'SOFT ☁️'] },
        { prompt: 'HIGH 🦅', answer: 'LOW 🦔', options: ['LOW 🦔', 'WIDE 🌊', 'DARK 🌑'] }
      ];
      const cur = antonyms[(currentLevel - 1) % antonyms.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🦒</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Opposite of: <span className="text-purple-700 underline">{cur.prompt}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Find the antonym animal pair!</p>

          <div className="flex gap-3">
            {cur.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === cur.answer) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look for the direct opposite!');
                  }
                }}
                className="px-4 py-3 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-500 font-fun font-black text-slate-800 text-sm shadow-sm active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 19: SENTENCE BUILDER EXPRESS (Jumbled Words with Train Carriages)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_sentence_builder_express') {
      const trainPackages = [
        {
          id: 1,
          icon: '🐶',
          theme: 'Happy Puppy',
          correctSequence: ['The', 'friendly', 'dog', 'wags', 'its', 'tail'],
          jumbled: ['tail', 'friendly', 'wags', 'The', 'its', 'dog']
        },
        {
          id: 2,
          icon: '🐸',
          theme: 'Pond Jumpers',
          correctSequence: ['Green', 'frogs', 'hop', 'over', 'the', 'log'],
          jumbled: ['hop', 'Green', 'the', 'frogs', 'log', 'over']
        },
        {
          id: 3,
          icon: '⭐',
          theme: 'Starry Sky',
          correctSequence: ['Bright', 'stars', 'twinkle', 'in', 'night', 'sky'],
          jumbled: ['twinkle', 'sky', 'Bright', 'stars', 'night', 'in']
        },
        {
          id: 4,
          icon: '🐬',
          theme: 'Ocean Waves',
          correctSequence: ['Playful', 'dolphins', 'leap', 'through', 'high', 'waves'],
          jumbled: ['waves', 'Playful', 'leap', 'through', 'dolphins', 'high']
        },
        {
          id: 5,
          icon: '🚀',
          theme: 'Space Explorer',
          correctSequence: ['Brave', 'explorers', 'zoom', 'to', 'the', 'moon'],
          jumbled: ['moon', 'explorers', 'the', 'zoom', 'Brave', 'to']
        }
      ];

      const currentSentence = trainPackages[(currentLevel - 1) % trainPackages.length];
      const targetLength = currentSentence.correctSequence.length;

      const speakSentence = () => {
        soundEngine.playPop();
        if ('speechSynthesis' in window && !soundEngine.getMuted()) {
          try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(currentSentence.correctSequence.join(' '));
            utt.rate = 0.85;
            window.speechSynthesis.speak(utt);
          } catch {}
        }
      };

      const handleAddWord = (word: string, tileId: number) => {
        soundEngine.playPop();
        const nextWords = [...sentenceWords, word];
        const nextTileIds = [...selectedWordTileIds, tileId];
        setSentenceWords(nextWords);
        setSelectedWordTileIds(nextTileIds);

        if (nextWords.length === targetLength) {
          if (nextWords.join(' ') === currentSentence.correctSequence.join(' ')) {
            handleCorrect();
          } else {
            handleIncorrect('Check the word sequence! Tap any carriage to unhitch it.');
          }
        }
      };

      const handleRemoveWord = (slotIdx: number) => {
        soundEngine.playPop();
        const nextWords = sentenceWords.filter((_, idx) => idx !== slotIdx);
        const nextTileIds = selectedWordTileIds.filter((_, idx) => idx !== slotIdx);
        setSentenceWords(nextWords);
        setSelectedWordTileIds(nextTileIds);
      };

      return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 h-full text-center max-w-xl mx-auto">
          {/* Top Train Header */}
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚂</span>
              <span className="font-fun font-black text-sm text-indigo-900">
                Sentence Express: {currentSentence.theme} {currentSentence.icon}
              </span>
            </div>
            <button
              onClick={speakSentence}
              className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-full text-xs font-fun font-bold flex items-center gap-1 active:scale-95 transition"
              title="Hear sentence"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Hear Sentence</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-3 font-semibold">
            Tap the scrambled word blocks to hitch them to the train in order! Tap a carriage to remove it.
          </p>

          {/* Interactive Train Track & Carriages */}
          <div className="w-full bg-slate-900/90 p-3 sm:p-4 rounded-3xl border-3 border-indigo-400 shadow-xl mb-4 overflow-x-auto">
            {/* Railroad Track Visual */}
            <div className="flex items-center gap-2 min-w-max pb-1">
              {/* Locomotive Engine */}
              <div className="bg-rose-500 text-white px-3 py-2.5 rounded-2xl font-fun font-black text-xs flex items-center gap-1.5 shadow-md shrink-0 border-2 border-rose-300">
                <span className="text-xl">🚂</span>
                <span>ENGINE</span>
              </div>

              {/* Connected Train Carriages */}
              {Array.from({ length: targetLength }).map((_, slotIdx) => {
                const filledWord = sentenceWords[slotIdx];
                return (
                  <div key={slotIdx} className="flex items-center shrink-0">
                    <span className="text-indigo-400 text-xs px-0.5">🔗</span>
                    {filledWord ? (
                      <button
                        onClick={() => handleRemoveWord(slotIdx)}
                        className="px-3 py-2 bg-gradient-to-b from-indigo-50 to-indigo-100 hover:from-rose-50 hover:to-rose-100 text-indigo-950 hover:text-rose-900 border-2 border-indigo-300 hover:border-rose-400 rounded-xl font-fun font-black text-xs sm:text-sm shadow-md transition active:scale-90 flex items-center gap-1.5 group"
                        title="Tap to unhitch word"
                      >
                        <span>{filledWord}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-rose-600 font-bold">✕</span>
                      </button>
                    ) : (
                      <div className="w-16 sm:w-20 h-10 rounded-xl border-2 border-dashed border-indigo-400/60 bg-indigo-950/40 flex items-center justify-center text-[10px] font-fun font-bold text-indigo-300">
                        #{slotIdx + 1}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrambled Word Tile Bank */}
          <div className="w-full mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block font-fun">
              📦 Scrambled Station Words
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {currentSentence.jumbled.map((word, tileId) => {
                const isUsed = selectedWordTileIds.includes(tileId);
                return (
                  <button
                    key={tileId}
                    disabled={isUsed}
                    onClick={() => handleAddWord(word, tileId)}
                    className={`px-4 py-2.5 rounded-2xl font-fun font-black text-sm border-2 transition shadow-sm active:scale-95 ${
                      isUsed
                        ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed scale-95'
                        : 'bg-white hover:bg-indigo-50 text-indigo-950 border-indigo-300 hover:border-indigo-600 hover:shadow-md'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Control Bar: Reset all words */}
          {sentenceWords.length > 0 && (
            <button
              onClick={() => {
                soundEngine.playPop();
                setSentenceWords([]);
                setSelectedWordTileIds([]);
              }}
              className="text-xs text-slate-500 hover:text-rose-600 font-fun font-bold underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Carriages</span>
            </button>
          )}
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 20: SPELLING BEE MATCH (Honeycomb Letters with Repeat Audio)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_spelling_bee_match') {
      const words = [
        { word: 'BEE', letters: ['E', 'B', 'E'], hint: 'Busy honey maker', emoji: '🐝' },
        { word: 'FROG', letters: ['G', 'R', 'F', 'O'], hint: 'Pond jumping friend', emoji: '🐸' },
        { word: 'STAR', letters: ['A', 'S', 'R', 'T'], hint: 'Twinkling night light', emoji: '⭐' },
        { word: 'SUNNY', letters: ['N', 'S', 'U', 'Y', 'N'], hint: 'Warm bright morning', emoji: '☀️' },
        { word: 'TIGER', letters: ['E', 'T', 'G', 'I', 'R'], hint: 'Striped jungle cat', emoji: '🐯' }
      ];
      const target = words[(currentLevel - 1) % words.length];

      const speakTargetWord = () => {
        soundEngine.playLetterTone(target.word[0]);
        if ('speechSynthesis' in window && !soundEngine.getMuted()) {
          try {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(`${target.word}! ${target.hint}`);
            utt.rate = 0.85;
            window.speechSynthesis.speak(utt);
          } catch {}
        }
      };

      const handleAddLetter = (letter: string, tileIdx: number) => {
        soundEngine.playLetterTone(letter);
        const nextLetters = [...unscrambledLetters, letter];
        const nextIndices = [...spellingUsedIndices, tileIdx];
        setUnscrambledLetters(nextLetters);
        setSpellingUsedIndices(nextIndices);

        if (nextLetters.length === target.word.length) {
          if (nextLetters.join('') === target.word) {
            handleCorrect();
          } else {
            handleIncorrect('Letters are out of order, try again! Tap backspace or any letter to remove it.');
          }
        }
      };

      const handleRemoveLetter = (slotIdx: number) => {
        soundEngine.playPop();
        const nextLetters = unscrambledLetters.filter((_, idx) => idx !== slotIdx);
        const nextIndices = spellingUsedIndices.filter((_, idx) => idx !== slotIdx);
        setUnscrambledLetters(nextLetters);
        setSpellingUsedIndices(nextIndices);
      };

      const handleBackspace = () => {
        if (unscrambledLetters.length === 0) return;
        soundEngine.playPop();
        setUnscrambledLetters(prev => prev.slice(0, -1));
        setSpellingUsedIndices(prev => prev.slice(0, -1));
      };

      return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 h-full text-center max-w-lg mx-auto">
          {/* Top Honeycomb Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '2s' }}>🐝</span>
            <div>
              <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
                Spelling Bee: {target.emoji} {target.hint}
              </h3>
            </div>
          </div>

          {/* Repeat Audio Button (Prominently requested by user) */}
          <button
            onClick={speakTargetWord}
            className="mb-3 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-fun font-black text-xs sm:text-sm rounded-full shadow-md flex items-center gap-2 active:scale-95 transition border-2 border-white"
            title="Hear word pronunciation again"
          >
            <Volume2 className="w-4 h-4 text-amber-900" />
            <span>🔊 Repeat Audio ("{target.word}")</span>
          </button>

          {/* Honey Jar Slots where assembled letters sit */}
          <div className="bg-amber-100/80 p-3 rounded-2xl border-2 border-amber-300 shadow-inner flex items-center justify-center gap-2 mb-4 min-w-[240px]">
            {Array.from({ length: target.word.length }).map((_, slotIdx) => {
              const letter = unscrambledLetters[slotIdx];
              return letter ? (
                <button
                  key={slotIdx}
                  onClick={() => handleRemoveLetter(slotIdx)}
                  className="w-11 h-12 bg-white rounded-xl shadow-md border-2 border-amber-400 flex flex-col items-center justify-center font-fun font-black text-xl text-amber-950 hover:bg-rose-50 hover:border-rose-300 transition active:scale-95 group"
                  title="Tap to remove letter"
                >
                  <span>{letter}</span>
                  <span className="text-[9px] text-slate-400 group-hover:text-rose-500 font-bold -mt-1">✕</span>
                </button>
              ) : (
                <div
                  key={slotIdx}
                  className="w-11 h-12 rounded-xl border-2 border-dashed border-amber-400/60 bg-amber-50/50 flex items-center justify-center text-xs font-fun font-bold text-amber-400"
                >
                  #{slotIdx + 1}
                </div>
              );
            })}
          </div>

          {/* Honeycomb Letter Tiles */}
          <div className="w-full mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block font-fun">
              🍯 Tap Honeycomb Letters
            </span>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {target.letters.map((lettr, tileIdx) => {
                const isUsed = spellingUsedIndices.includes(tileIdx);
                return (
                  <button
                    key={tileIdx}
                    disabled={isUsed}
                    onClick={() => handleAddLetter(lettr, tileIdx)}
                    className={`w-12 h-13 rounded-2xl font-fun font-black text-2xl shadow-md border-2 transition active:scale-90 flex items-center justify-center ${
                      isUsed
                        ? 'bg-amber-100/50 text-amber-300 border-amber-200 cursor-not-allowed scale-95'
                        : 'bg-amber-400 hover:bg-amber-300 text-amber-950 border-amber-500 hover:scale-105'
                    }`}
                  >
                    {lettr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Backspace & Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBackspace}
              disabled={unscrambledLetters.length === 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-fun font-bold flex items-center gap-1 border transition ${
                unscrambledLetters.length === 0
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-sm active:scale-95'
              }`}
            >
              <span>⌫ Backspace</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                setUnscrambledLetters([]);
                setSpellingUsedIndices([]);
              }}
              disabled={unscrambledLetters.length === 0}
              className="text-xs text-slate-500 hover:text-slate-800 font-fun font-bold underline"
            >
              Reset All
            </button>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 22: FLAG RUNNER
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_flag_runner') {
      const flags = [
        { country: 'Japan 🇯🇵', flag: '🇯🇵', options: ['Japan', 'France', 'Brazil'] },
        { country: 'France 🇫🇷', flag: '🇫🇷', options: ['France', 'USA', 'Italy'] },
        { country: 'Brazil 🇧🇷', flag: '🇧🇷', options: ['Brazil', 'Canada', 'India'] },
        { country: 'Canada 🇨🇦', flag: '🇨🇦', options: ['Canada', 'Australia', 'Egypt'] },
        { country: 'India 🇮🇳', flag: '🇮🇳', options: ['India', 'Japan', 'Mexico'] }
      ];
      const item = flags[(currentLevel - 1) % flags.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-6xl mb-2">{item.flag}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-4">
            Which country does this flag belong to?
          </h3>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {item.options.map((country, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.country.includes(country)) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look at the colors and symbols on the flag!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-slate-200 hover:border-amber-500 font-fun font-bold text-slate-800 shadow-sm active:scale-95 transition"
              >
                {country}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 23: LANDMARK BUILDER
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_landmark_builder') {
      const landmarks = [
        { name: 'Pyramids of Giza', icon: '🏛️', location: 'Egypt (Africa)', options: ['Egypt (Africa)', 'France', 'Australia'] },
        { name: 'Eiffel Tower', icon: '🗼', location: 'France (Europe)', options: ['France (Europe)', 'Brazil', 'Japan'] },
        { name: 'Taj Mahal', icon: '🕌', location: 'India (Asia)', options: ['India (Asia)', 'Canada', 'Egypt'] },
        { name: 'Statue of Liberty', icon: '🗽', location: 'USA (North America)', options: ['USA (North America)', 'India', 'France'] },
        { name: 'Colosseum', icon: '🏟️', location: 'Italy (Europe)', options: ['Italy (Europe)', 'China', 'Brazil'] }
      ];
      const cur = landmarks[(currentLevel - 1) % landmarks.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{cur.icon}</span>
          <h3 className="text-base sm:text-xl font-black font-fun text-slate-800 mb-1">
            {cur.name}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Where in the world is this famous landmark located?</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {cur.options.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (loc === cur.location) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Try recalling which continent it belongs to!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-amber-200 hover:border-amber-500 font-fun font-bold text-amber-950 shadow-sm active:scale-95 transition"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 24: CAPITAL CITY QUIZ
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_capital_city_quiz') {
      const capitals = [
        { country: 'Japan 🇯🇵', capital: 'Tokyo', options: ['Tokyo', 'Kyoto', 'Seoul'] },
        { country: 'France 🇫🇷', capital: 'Paris', options: ['Paris', 'Lyon', 'Madrid'] },
        { country: 'Egypt 🇪🇬', capital: 'Cairo', options: ['Cairo', 'Alexandria', 'Nairobi'] },
        { country: 'Australia 🇦🇺', capital: 'Canberra', options: ['Canberra', 'Sydney', 'Melbourne'] },
        { country: 'USA 🇺🇸', capital: 'Washington, D.C.', options: ['Washington, D.C.', 'New York', 'Los Angeles'] }
      ];
      const cur = capitals[(currentLevel - 1) % capitals.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">📍</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            What is the capital of {cur.country}?
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Tap the capital city pin:</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {cur.options.map((cap, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (cap === cur.capital) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Check which city is the official capital!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-orange-200 hover:border-orange-500 font-fun font-bold text-slate-800 shadow-sm active:scale-95 transition"
              >
                📍 {cap}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 25: ANIMAL HABITAT MAP
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_animal_habitat_map') {
      const habitats = [
        { animal: 'Kangaroo 🦘', home: 'Australia', options: ['Australia', 'Africa', 'Europe'] },
        { animal: 'Giant Panda 🐼', home: 'Asia', options: ['Asia', 'North America', 'Antarctica'] },
        { animal: 'Penguin 🐧', home: 'Antarctica', options: ['Antarctica', 'South America', 'Asia'] },
        { animal: 'Toucan 🦜', home: 'South America', options: ['South America', 'Europe', 'Australia'] },
        { animal: 'African Lion 🦁', home: 'Africa', options: ['Africa', 'North America', 'Antarctica'] }
      ];
      const cur = habitats[(currentLevel - 1) % habitats.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{cur.animal.split(' ')[1]}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Where is the natural home of the {cur.animal.split(' ')[0]}?
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Match creature to its home continent:</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {cur.options.map((continent, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (continent === cur.home) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Think about where this animal lives in the wild!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-amber-200 hover:border-amber-500 font-fun font-bold text-slate-800 shadow-sm active:scale-95 transition"
              >
                🌍 {continent}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 26: OCEAN DEPTH EXPLORER
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_ocean_depth_explorer') {
      const creatures = [
        { name: 'Dolphin 🐬', zone: 'Sunlight Zone (Top 200m)' },
        { name: 'Sea Turtle 🐢', zone: 'Sunlight Zone (Top 200m)' },
        { name: 'Giant Octopus 🐙', zone: 'Twilight Zone (200m - 1000m)' },
        { name: 'Anglerfish 🐡', zone: 'Midnight Abyss (>1000m deep)' },
        { name: 'Giant Squid 🦑', zone: 'Midnight Abyss (>1000m deep)' }
      ];
      const cur = creatures[(currentLevel - 1) % creatures.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{cur.name.split(' ')[1]}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Ocean Depth: {cur.name.split(' ')[0]}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Which ocean layer does this creature swim in?</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {['Sunlight Zone (Top 200m)', 'Twilight Zone (200m - 1000m)', 'Midnight Abyss (>1000m deep)'].map((zone, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (zone === cur.zone) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Check how deep and dark the water is!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-cyan-200 hover:border-cyan-500 font-fun font-bold text-slate-800 text-xs shadow-sm active:scale-95 transition"
              >
                🌊 {zone}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 27: GLOBE SPINNER
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_globe_spinner') {
      const questions = [
        { target: 'Equator', desc: 'The invisible line dividing Northern & Southern halves', options: ['Equator', 'North Pole', 'Prime Meridian'] },
        { target: 'North Pole', desc: 'The frozen northernmost tip where polar bears roam', options: ['North Pole', 'South Pole', 'Equator'] },
        { target: 'Southern Hemisphere', desc: 'The half of Earth south of the Equator', options: ['Southern Hemisphere', 'Northern Hemisphere', 'Eastern Orbit'] },
        { target: 'South Pole', desc: 'The icy continent at the bottom of the globe', options: ['South Pole', 'North Pole', 'Greenland'] },
        { target: 'Northern Hemisphere', desc: 'The half of Earth where Europe and North America sit', options: ['Northern Hemisphere', 'Southern Hemisphere', 'Equator'] }
      ];
      const cur = questions[(currentLevel - 1) % questions.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">🌐</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Globe Spotter: {cur.target}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">{cur.desc}</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {cur.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === cur.target) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look at the position on the globe!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-blue-200 hover:border-blue-500 font-fun font-bold text-slate-800 shadow-sm active:scale-95 transition"
              >
                🌐 {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 28: CLIMATE & DRESS-UP
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_climate_dress_up') {
      const climates = [
        { climate: 'Polar Tundra ❄️', outfit: 'Heavy Parka & Snow Boots 🧥', options: ['Heavy Parka & Snow Boots 🧥', 'Swimsuit & Flip Flops 🩱', 'T-Shirt & Shorts 👕'] },
        { climate: 'Sahara Desert 🏜️', outfit: 'Light Cotton Clothes & Sunhat 👒', options: ['Light Cotton Clothes & Sunhat 👒', 'Snowsuit & Fur Hat ❄️', 'Raincoat & Umbrella ☔'] },
        { climate: 'Tropical Rainforest 🌴', outfit: 'Breathable Rain Jacket & Boots 🥾', options: ['Breathable Rain Jacket & Boots 🥾', 'Heavy Wool Coat 🧣', 'Ski Goggles 🥽'] },
        { climate: 'Sunny Beach 🏖️', outfit: 'Swimwear & Sunglasses 🕶️', options: ['Swimwear & Sunglasses 🕶️', 'Winter Mittens 🧤', 'Heavy Boots 🥾'] },
        { climate: 'Autumn Woods 🍂', outfit: 'Warm Sweater & Scarf 🧣', options: ['Warm Sweater & Scarf 🧣', 'Swim Trunks 🩳', 'Sun Visor 🧢'] }
      ];
      const cur = climates[(currentLevel - 1) % climates.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🧥</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Dress for: {cur.climate}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Pick the best clothing for this weather:</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {cur.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === cur.outfit) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Check whether it is freezing or scorching hot!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-amber-200 hover:border-amber-500 font-fun font-bold text-slate-800 text-xs shadow-sm active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 29: WORLD MUSIC TAP
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_world_music_tap') {
      const instruments = [
        { name: 'Didgeridoo 🪈', region: 'Australia', options: ['Australia', 'Europe', 'South America'] },
        { name: 'Sitar 🪕', region: 'India (Asia)', options: ['India (Asia)', 'Africa', 'North America'] },
        { name: 'Djembe Drum 🪘', region: 'Africa', options: ['Africa', 'Australia', 'Europe'] },
        { name: 'Bagpipes 🎵', region: 'Scotland (Europe)', options: ['Scotland (Europe)', 'Asia', 'South America'] },
        { name: 'Maracas 🪇', region: 'Latin America', options: ['Latin America', 'Asia', 'Africa'] }
      ];
      const cur = instruments[(currentLevel - 1) % instruments.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{cur.name.split(' ')[1]}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            {cur.name.split(' ')[0]}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Where in the world was this traditional instrument born?</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {cur.options.map((reg, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (reg === cur.region) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Think about folk music around the world!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-indigo-200 hover:border-indigo-500 font-fun font-bold text-slate-800 shadow-sm active:scale-95 transition"
              >
                🌍 {reg}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // GEOGRAPHY 30: COMPASS NAVIGATOR
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_compass_navigator') {
      const quests = [
        { direction: 'North (⬆️)', hint: 'Steer toward the polar star!', target: 'N' },
        { direction: 'East (➡️)', hint: 'Steer toward where the sun rises!', target: 'E' },
        { direction: 'South (⬇️)', hint: 'Steer toward warm tropical waters!', target: 'S' },
        { direction: 'West (⬅️)', hint: 'Steer toward where the sun sets!', target: 'W' },
        { direction: 'North-East (↗️)', hint: 'Sail between North and East!', target: 'NE' }
      ];
      const cur = quests[(currentLevel - 1) % quests.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">🧭</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Steer the Ship: {cur.direction}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">{cur.hint}</p>

          <div className="grid grid-cols-3 gap-2 max-w-[200px]">
            <div />
            <button
              onClick={() => (cur.target === 'N' ? handleCorrect() : handleIncorrect('Check the compass rose!'))}
              className="p-3 bg-indigo-600 text-white font-fun font-black rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              N ⬆️
            </button>
            <div />

            <button
              onClick={() => (cur.target === 'W' ? handleCorrect() : handleIncorrect('West is to the left!'))}
              className="p-3 bg-indigo-600 text-white font-fun font-black rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              ⬅️ W
            </button>
            <div className="flex items-center justify-center text-2xl">⛵</div>
            <button
              onClick={() => (cur.target === 'E' ? handleCorrect() : handleIncorrect('East is to the right!'))}
              className="p-3 bg-indigo-600 text-white font-fun font-black rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              E ➡️
            </button>

            <div />
            <button
              onClick={() => (cur.target === 'S' ? handleCorrect() : handleIncorrect('South points downwards!'))}
              className="p-3 bg-indigo-600 text-white font-fun font-black rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95"
            >
              S ⬇️
            </button>
            <div />
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 32: FOOD CHAIN SORTING (Herbivore, Carnivore, Omnivore)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_food_chain_sorting') {
      const creatures = [
        { name: 'Cow 🐄', diet: 'Herbivore (Plants)' },
        { name: 'Lion 🦁', diet: 'Carnivore (Meat)' },
        { name: 'Bear 🐻', diet: 'Omnivore (Both)' },
        { name: 'Rabbit 🐇', diet: 'Herbivore (Plants)' },
        { name: 'Shark 🦈', diet: 'Carnivore (Meat)' }
      ];
      const critter = creatures[(currentLevel - 1) % creatures.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="text-5xl mb-2">{critter.name.split(' ')[1]}</div>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            What kind of eater is the {critter.name.split(' ')[0]}?
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Sort into the correct diet category:</p>

          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            {['Herbivore (Plants)', 'Carnivore (Meat)', 'Omnivore (Both)'].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (cat === critter.diet) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Think about what this animal eats!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-emerald-200 hover:border-emerald-500 font-fun font-bold text-slate-800 shadow-sm active:scale-95 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 33: FOOTPRINT DETECTIVE
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_footprint_detective') {
      return (
        <FootprintDetectiveGame
          currentLevel={currentLevel}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 34: MAMA & BABY MATCH
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_mama_baby_match') {
      const pairs = [
        { mama: 'Cow 🐄', baby: 'Calf', options: ['Calf', 'Puppy', 'Chick'] },
        { mama: 'Kangaroo 🦘', baby: 'Joey', options: ['Joey', 'Cub', 'Lamb'] },
        { mama: 'Duck 🦆', baby: 'Duckling', options: ['Duckling', 'Kitten', 'Calf'] },
        { mama: 'Sheep 🐑', baby: 'Lamb', options: ['Lamb', 'Joey', 'Bunny'] },
        { mama: 'Dog 🐕', baby: 'Puppy', options: ['Puppy', 'Cub', 'Foal'] }
      ];
      const pair = pairs[(currentLevel - 1) % pairs.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{pair.mama.split(' ')[1]}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            What is a baby {pair.mama.split(' ')[0]} called?
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Match the mama to her little one!</p>

          <div className="flex gap-3">
            {pair.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (opt === pair.baby) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Think about baby animal names!');
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-white border-2 border-pink-200 hover:border-pink-500 text-pink-950 font-fun font-bold text-lg shadow-sm active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 35: CAMOUFLAGE SEEK (Rich Nature Biomes & Animal Hide-and-Seek)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_camouflage_seek') {
      const camouflageBiomes = [
        {
          biome: 'Lush Rainforest Canopy',
          targetName: 'Emerald Chameleon',
          targetEmoji: '🦎',
          scienceFact: 'Chameleons adjust their skin pigment cells (chromatophores) to blend with leaves and regulate body temperature!',
          bgGradient: 'from-emerald-900 via-green-800 to-teal-950',
          borderColor: 'border-emerald-400',
          scenery: [
            { id: 1, emoji: '🌿', label: 'Broad Fern Leaf' },
            { id: 2, emoji: '🍃', label: 'Fluttering Leaf' },
            { id: 3, emoji: '🌱', label: 'Tender Sprout' },
            { id: 4, emoji: '🦎', label: 'Emerald Chameleon', isTarget: true },
            { id: 5, emoji: '🪴', label: 'Mossy Branch' },
            { id: 6, emoji: '🌿', label: 'Jungle Vine' },
            { id: 7, emoji: '🍃', label: 'Canopy Foliage' },
            { id: 8, emoji: '🌴', label: 'Palm Frond' },
            { id: 9, emoji: '🌱', label: 'Bamboo Shoot' }
          ]
        },
        {
          biome: 'Polar Arctic Tundra',
          targetName: 'Snowy Arctic Owl',
          targetEmoji: '🦉',
          scienceFact: 'Snowy owls have thick white plumage that blends seamlessly into polar snowdrifts, keeping them hidden from predators!',
          bgGradient: 'from-slate-100 via-sky-100 to-indigo-100 text-slate-900',
          borderColor: 'border-sky-300',
          scenery: [
            { id: 1, emoji: '❄️', label: 'Fluffy Snowdrift' },
            { id: 2, emoji: '☁️', label: 'Arctic Mist' },
            { id: 3, emoji: '🧊', label: 'Glacier Ice' },
            { id: 4, emoji: '❄️', label: 'Frost Crystal' },
            { id: 5, emoji: '🦉', label: 'Snowy Owl', isTarget: true },
            { id: 6, emoji: '☁️', label: 'Snow Cloud' },
            { id: 7, emoji: '🧊', label: 'Frozen Lake' },
            { id: 8, emoji: '❄️', label: 'Snow Bank' },
            { id: 9, emoji: '🏔️', label: 'Icy Ridge' }
          ]
        },
        {
          biome: 'Autumn Oak Woodland',
          targetName: 'Walking Stick Bug',
          targetEmoji: '🦗',
          scienceFact: 'Stick insects mimic twigs and dry tree branches with remarkable detail, even rocking gently like leaves in the breeze!',
          bgGradient: 'from-amber-950 via-stone-800 to-yellow-950',
          borderColor: 'border-amber-400',
          scenery: [
            { id: 1, emoji: '🪵', label: 'Oak Tree Bark' },
            { id: 2, emoji: '🍂', label: 'Dry Fallen Leaf' },
            { id: 3, emoji: '🪵', label: 'Wood Knot' },
            { id: 4, emoji: '🦗', label: 'Walking Stick Bug', isTarget: true },
            { id: 5, emoji: '🍁', label: 'Maple Leaf' },
            { id: 6, emoji: '🪵', label: 'Hollow Log' },
            { id: 7, emoji: '🍂', label: 'Autumn Foliage' },
            { id: 8, emoji: '🪵', label: 'Weathered Branch' },
            { id: 9, emoji: '🌰', label: 'Acorn Nut' }
          ]
        },
        {
          biome: 'Tropical Coral Reef',
          targetName: 'Mimic Octopus',
          targetEmoji: '🐙',
          scienceFact: 'The mimic octopus can shift both its skin color and texture in seconds to look like sea anemones, corals, or rocks!',
          bgGradient: 'from-cyan-900 via-blue-900 to-indigo-950',
          borderColor: 'border-cyan-400',
          scenery: [
            { id: 1, emoji: '🪸', label: 'Brain Coral' },
            { id: 2, emoji: '🌊', label: 'Tidal Wave' },
            { id: 3, emoji: '🪸', label: 'Sea Fan Coral' },
            { id: 4, emoji: '🐚', label: 'Reef Shell' },
            { id: 5, emoji: '🐙', label: 'Mimic Octopus', isTarget: true },
            { id: 6, emoji: '🪸', label: 'Tube Sponge' },
            { id: 7, emoji: '🌊', label: 'Ocean Current' },
            { id: 8, emoji: '🫧', label: 'Coral Bubbles' },
            { id: 9, emoji: '🪸', label: 'Anemone Bush' }
          ]
        },
        {
          biome: 'Sunlit Sandy Desert',
          targetName: 'Horned Sand Gecko',
          targetEmoji: '🦎',
          scienceFact: 'Desert geckos have speckled tan scales that mimic desert sand grains, helping them hide in plain sight among the dunes!',
          bgGradient: 'from-amber-600 via-yellow-600 to-orange-700',
          borderColor: 'border-amber-300',
          scenery: [
            { id: 1, emoji: '🏜️', label: 'Desert Sand Dune' },
            { id: 2, emoji: '🌵', label: 'Saguaro Cactus' },
            { id: 3, emoji: '🪨', label: 'Desert Sandstone' },
            { id: 4, emoji: '🏜️', label: 'Rippled Sand' },
            { id: 5, emoji: '🦎', label: 'Horned Sand Gecko', isTarget: true },
            { id: 6, emoji: '🌵', label: 'Prickly Pear' },
            { id: 7, emoji: '🪨', label: 'Sunbaked Rock' },
            { id: 8, emoji: '🏜️', label: 'Golden Dunes' },
            { id: 9, emoji: '☀️', label: 'Desert Sun' }
          ]
        }
      ];

      const curBiome = camouflageBiomes[(currentLevel - 1) % camouflageBiomes.length];

      return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 h-full text-center max-w-xl mx-auto">
          {/* Biome Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🔍</span>
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Camouflage Seek: {curBiome.biome}
            </h3>
          </div>

          <div className="bg-amber-50 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-fun font-bold text-amber-900 mb-3 shadow-sm flex items-center gap-2">
            <span>Mission: Find the hidden <strong>{curBiome.targetName} {curBiome.targetEmoji}</strong>!</span>
          </div>

          <p className="text-[11px] text-slate-500 mb-3 font-semibold">
            It blends into the scenery using natural camouflage! Tap items to inspect them with your magnifying lens.
          </p>

          {/* Scenic Illustrated Biome Grid */}
          <div className={`grid grid-cols-3 gap-3 p-4 sm:p-5 rounded-3xl border-4 ${curBiome.borderColor} bg-gradient-to-b ${curBiome.bgGradient} shadow-2xl w-full max-w-md relative overflow-hidden`}>
            {curBiome.scenery.map((item) => {
              const isFound = camouflageFound && item.isTarget;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveMagnifierItem(item.label);
                    if (item.isTarget) {
                      setCamouflageFound(true);
                      handleCorrect(150);
                    } else {
                      handleIncorrect(`That is just a ${item.label}! Look closely for the hidden ${curBiome.targetName}.`);
                    }
                  }}
                  className={`relative h-20 sm:h-22 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 active:scale-90 group ${
                    isFound
                      ? 'bg-amber-400 text-amber-950 scale-110 shadow-2xl ring-4 ring-white animate-bounce z-20'
                      : 'bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 text-white shadow-sm'
                  }`}
                  title={item.label}
                >
                  <span className={`text-3xl sm:text-4xl transition-transform ${isFound ? 'scale-125' : 'group-hover:scale-110'}`}>
                    {item.emoji}
                  </span>
                  <span className="text-[9px] font-fun font-bold mt-1 text-white/90 drop-shadow truncate max-w-[85px] px-1">
                    {item.label}
                  </span>
                  {isFound && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Nature Inspector Info */}
          {activeMagnifierItem && (
            <div className="mt-3 text-xs font-fun font-bold text-slate-700 bg-white/90 px-3 py-1 rounded-xl shadow-sm border border-slate-200">
              🔍 Inspected: {activeMagnifierItem}
            </div>
          )}

          {/* Educational Science Card */}
          <p className="text-[11px] text-slate-500 mt-2 font-fun font-medium max-w-md">
            💡 <em>{curBiome.scienceFact}</em>
          </p>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 36: LIFE CYCLE WHEEL
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_life_cycle_wheel') {
      const cycles = [
        {
          name: 'Butterfly Metamorphosis 🦋',
          steps: ['Egg 🥚', 'Caterpillar 🐛', 'Chrysalis 🪆', 'Butterfly 🦋']
        },
        {
          name: 'Frog Metamorphosis 🐸',
          steps: ['Frogspawn 🫧', 'Tadpole 🐟', 'Froglet 🐸', 'Adult Frog 🐸']
        },
        {
          name: 'Sunflower Growth 🌻',
          steps: ['Seed 🌱', 'Sprout 🌿', 'Young Plant 🪴', 'Golden Flower 🌻']
        },
        {
          name: 'Chicken Life Cycle 🐔',
          steps: ['Egg 🥚', 'Hatching 🐣', 'Yellow Chick 🐥', 'Hen 🐔']
        },
        {
          name: 'Apple Tree Cycle 🍎',
          steps: ['Apple Seed 🌰', 'Sapling 🪴', 'Blossom Tree 🌸', 'Red Apples 🍎']
        }
      ];
      const cur = cycles[(currentLevel - 1) % cycles.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🔄</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            {cur.name}
          </h3>
          <p className="text-xs text-slate-500 mb-3 font-semibold">Tap the steps in life cycle sequence (1 to 4):</p>

          <div className="flex gap-2 mb-4">
            {cur.steps.map((st, idx) => {
              const isSelected = selectedItems.includes(st);
              return (
                <div
                  key={idx}
                  className={`px-2.5 py-1.5 rounded-xl border-2 text-xs font-fun font-bold flex flex-col items-center ${
                    isSelected ? 'bg-emerald-100 border-emerald-400 text-emerald-900' : 'bg-slate-100 border-slate-300 text-slate-400'
                  }`}
                >
                  <span className="text-lg">{st.split(' ')[1]}</span>
                  <span>{st.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 justify-center max-w-xs">
            {cur.steps.map((st, idx) => (
              <button
                key={idx}
                disabled={selectedItems.includes(st)}
                onClick={() => {
                  soundEngine.playPop();
                  const expectedNext = cur.steps[selectedItems.length];
                  if (st === expectedNext) {
                    const next = [...selectedItems, st];
                    setSelectedItems(next);
                    if (next.length === cur.steps.length) {
                      handleCorrect();
                    }
                  } else {
                    handleIncorrect('Check what happens next in the life cycle!');
                  }
                }}
                className={`py-2.5 px-3.5 rounded-xl font-fun font-bold text-xs border-2 shadow-sm transition active:scale-95 ${
                  selectedItems.includes(st)
                    ? 'bg-slate-200 border-slate-300 text-slate-400'
                    : 'bg-white border-pink-300 hover:border-pink-500 text-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 37: BIRD BEAK & FOOD MATCH (Fixed Level 5 Blocker & Added Educational Cards)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_bird_beak_match') {
      const beaks = [
        {
          bird: 'Pelican 🦤',
          beakType: 'Deep Elastic Throat Pouch',
          food: 'Fish in the water 🐟',
          funFact: 'Pelican pouches can scoop up to 3 gallons of water to catch swimming fish!'
        },
        {
          bird: 'Hummingbird 🐦',
          beakType: 'Long Slender Straw-Like Beak',
          food: 'Flower nectar 🌸',
          funFact: 'Their needle-like beak probes deep into trumpet flowers to sip sweet nectar!'
        },
        {
          bird: 'Golden Eagle 🦅',
          beakType: 'Sharp Curved Tearing Hook',
          food: 'Prey & meat 🥩',
          funFact: 'The razor-sharp hook allows raptors to grip and tear prey efficiently in the wild!'
        },
        {
          bird: 'Woodpecker 🪵',
          beakType: 'Strong Shock-Absorbing Chisel',
          food: 'Tree bark insects 🐛',
          funFact: 'Woodpeckers peck tree trunks 20 times per second without getting dizzy to dig for grubs!'
        },
        {
          bird: 'Song Sparrow 🌾',
          beakType: 'Short Sturdy Cone Beak',
          food: 'Seeds & grains 🌾',
          funFact: 'Their short, strong triangular cone beak can crack open tough seed shells with ease!'
        }
      ];
      const cur = beaks[(currentLevel - 1) % beaks.length];

      // Dynamically guaranteed options containing cur.food + 3 distinct distractors
      const allDietOptions = [
        'Fish in the water 🐟',
        'Flower nectar 🌸',
        'Prey & meat 🥩',
        'Tree bark insects 🐛',
        'Seeds & grains 🌾'
      ];
      const otherFoods = allDietOptions.filter(f => f !== cur.food);
      const guaranteedOptions = stableShuffle([cur.food, ...otherFoods], currentLevel * 19);

      return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 h-full text-center max-w-lg mx-auto">
          {/* Bird Header & Avatar */}
          <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 p-4 rounded-3xl border-2 border-indigo-200 shadow-sm w-full mb-3 flex flex-col items-center">
            <span className="text-5xl mb-1 animate-pulse">{cur.bird.split(' ')[1]}</span>
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Adaptation: {cur.bird.split(' ')[0]}
            </h3>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-full mt-1">
              Beak Type: {cur.beakType}
            </span>
            <p className="text-[11px] text-slate-500 mt-2 font-medium">
              💡 <em>{cur.funFact}</em>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-indigo-950 font-fun font-bold mb-3">
            What is this beak specially adapted to eat?
          </p>

          {/* Guaranteed Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {guaranteedOptions.map((food, idx) => {
              const isMatch = food === cur.food;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isMatch) {
                      soundEngine.playPop();
                      handleCorrect(120);
                    } else {
                      handleIncorrect(`Examine the ${cur.beakType}! What food does that shape match best?`);
                    }
                  }}
                  className="py-3 px-4 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50/50 font-fun font-black text-slate-800 text-xs sm:text-sm shadow-sm active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>{food}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 38: DOMAIN CLASSIFIER (Land, Air, Water)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_domain_classifier') {
      const animals = [
        { name: 'Dolphin 🐬', domain: 'Water 🌊' },
        { name: 'Eagle 🦅', domain: 'Air ☁️' },
        { name: 'Cheetah 🐆', domain: 'Land 🌳' },
        { name: 'Bat 🦇', domain: 'Air ☁️' },
        { name: 'Sea Turtle 🐢', domain: 'Water 🌊' }
      ];
      const cur = animals[(currentLevel - 1) % animals.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{cur.name.split(' ')[1]}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Domain of {cur.name.split(' ')[0]}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Does this creature primarily belong to Land, Air, or Water?</p>

          <div className="flex gap-3">
            {['Land 🌳', 'Air ☁️', 'Water 🌊'].map((d, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (d === cur.domain) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Think where this animal moves best!');
                  }
                }}
                className="p-3 w-24 rounded-2xl bg-white border-2 border-emerald-200 hover:border-emerald-500 font-fun font-bold text-slate-800 text-sm shadow-sm active:scale-95 transition flex flex-col items-center"
              >
                <span className="text-2xl mb-1">{d.split(' ')[1]}</span>
                <span>{d.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 39: NOCTURNAL VS DIURNAL (Day vs Night)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_nocturnal_diurnal') {
      const creatures = [
        { name: 'Barn Owl 🦉', isNight: true },
        { name: 'Golden Retriever 🐕', isNight: false },
        { name: 'Fruit Bat 🦇', isNight: true },
        { name: 'Squirrel 🐿️', isNight: false },
        { name: 'Firefly ✨', isNight: true }
      ];
      const cur = creatures[(currentLevel - 1) % creatures.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">{cur.name.split(' ')[1]}</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            {cur.name.split(' ')[0]}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">Is this animal active during the Day (Diurnal) or Night (Nocturnal)?</p>

          <div className="flex gap-4">
            <button
              onClick={() => {
                if (!cur.isNight) {
                  handleCorrect();
                } else {
                  handleIncorrect('This animal comes out when the stars shine!');
                }
              }}
              className="p-4 w-36 rounded-2xl bg-amber-50 border-2 border-amber-300 hover:border-amber-500 shadow-sm flex flex-col items-center active:scale-95 transition"
            >
              <span className="text-4xl mb-1">☀️</span>
              <span className="font-fun font-black text-amber-900 text-sm">Daytime (Diurnal)</span>
            </button>

            <button
              onClick={() => {
                if (cur.isNight) {
                  handleCorrect();
                } else {
                  handleIncorrect('This animal sleeps during the day!');
                }
              }}
              className="p-4 w-36 rounded-2xl bg-indigo-50 border-2 border-indigo-300 hover:border-indigo-500 shadow-sm flex flex-col items-center active:scale-95 transition"
            >
              <span className="text-4xl mb-1">🌙</span>
              <span className="font-fun font-black text-indigo-900 text-sm">Nighttime (Nocturnal)</span>
            </button>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // SCIENCE 40: PET CARE CLINIC (Interactive Vet Examination & Medical Tools)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_pet_care_clinic') {
      const clinicPatients = [
        {
          name: 'Barnaby the Puppy',
          emoji: '🐶',
          issue: 'Barnaby stepped on a garden thorn and has a tender paw!',
          tasks: [
            { tool: 'stethoscope', name: 'Stethoscope 🩺', prompt: 'Listen to healthy heartbeat' },
            { tool: 'bandage', name: 'Magic Bandage 🩹', prompt: 'Clean & wrap sore paw' },
            { tool: 'food', name: 'Kibble & Water 🥣', prompt: 'Nutritious recovery bowl' }
          ]
        },
        {
          name: 'Whiskers the Kitten',
          emoji: '🐱',
          issue: 'Whiskers has a warm forehead and feels very sleepy.',
          tasks: [
            { tool: 'thermometer', name: 'Thermometer 🌡️', prompt: 'Check gentle temperature' },
            { tool: 'brush', name: 'Soft Fur Brush 🪮', prompt: 'Comfort with gentle grooming' },
            { tool: 'food', name: 'Kitten Milk Bowl 🥣', prompt: 'Serve warm nourishing milk' }
          ]
        },
        {
          name: 'Pip the Bunny',
          emoji: '🐰',
          issue: 'Pip ran through clover fields and has tickly messy fur!',
          tasks: [
            { tool: 'stethoscope', name: 'Stethoscope 🩺', prompt: 'Check rapid bunny pulse' },
            { tool: 'brush', name: 'Soft Fur Brush 🪮', prompt: 'Comb soft lop ears' },
            { tool: 'food', name: 'Crisp Carrot Snack 🥕', prompt: 'Feed crunchy carrot treat' }
          ]
        },
        {
          name: 'Kiwi the Parrot',
          emoji: '🦜',
          issue: 'Kiwi ruffled feathers in a gust of wind and needs care.',
          tasks: [
            { tool: 'bandage', name: 'Feather Balm 🩹', prompt: 'Soothe wing feathers' },
            { tool: 'brush', name: 'Soft Feather Brush 🪮', prompt: 'Groom colorful plumage' },
            { tool: 'food', name: 'Sweet Mango Slice 🥭', prompt: 'Reward with fresh tropical fruit' }
          ]
        },
        {
          name: 'Toby the Pond Turtle',
          emoji: '🐢',
          issue: 'Toby\'s shell has moss from the pond and needs a spa checkup!',
          tasks: [
            { tool: 'thermometer', name: 'Water Temp Check 🌡️', prompt: 'Measure comfortable basking warmth' },
            { tool: 'brush', name: 'Shell Sponge & Brush 🪮', prompt: 'Polish smooth shell clean' },
            { tool: 'food', name: 'Crisp Water Greens 🥬', prompt: 'Feed delicious leafy salad' }
          ]
        }
      ];

      const patient = clinicPatients[(currentLevel - 1) % clinicPatients.length];
      const currentTaskIndex = clinicStep;
      const targetTask = patient.tasks[currentTaskIndex] || patient.tasks[0];
      const isRecovered = clinicStep >= patient.tasks.length;

      const availableTools = [
        { id: 'stethoscope', name: 'Stethoscope', icon: '🩺', desc: 'Heart Check' },
        { id: 'bandage', name: 'Bandage', icon: '🩹', desc: 'Heal Scrapes' },
        { id: 'thermometer', name: 'Thermometer', icon: '🌡️', desc: 'Check Temp' },
        { id: 'brush', name: 'Soft Brush', icon: '🪮', desc: 'Groom & Soothe' },
        { id: 'food', name: 'Healthy Treat', icon: '🥣', desc: 'Food & Water' }
      ];

      const handleApplyTool = (toolId: string) => {
        if (toolId === targetTask.tool) {
          soundEngine.playPop();
          const nextStep = clinicStep + 1;
          setClinicStep(nextStep);
          setPetExamHistory(prev => [...prev, targetTask.name]);

          if (nextStep >= patient.tasks.length) {
            handleCorrect(150);
          }
        } else {
          handleIncorrect(`Try using the ${targetTask.name.split(' ')[0]} to ${targetTask.prompt.toLowerCase()}!`);
        }
      };

      const healthPercent = Math.min(100, Math.round(((clinicStep) / patient.tasks.length) * 100));

      return (
        <div className="flex flex-col items-center justify-center p-3 sm:p-5 h-full text-center max-w-lg mx-auto">
          {/* Clinic Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🏥</span>
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Pet Clinic: {patient.name} {patient.emoji}
            </h3>
          </div>

          {/* Patient Card & Health Bar */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 p-4 rounded-3xl border-2 border-emerald-300 shadow-sm w-full mb-3 flex flex-col items-center">
            <span className={`text-5xl mb-1 transition-transform ${isRecovered ? 'scale-125 animate-bounce' : 'scale-100'}`}>
              {patient.emoji}
            </span>
            <p className="text-xs font-bold text-slate-700 mb-2">
              {isRecovered ? '🎉 Fully healed and purring with happiness!' : patient.issue}
            </p>

            {/* Health Meter */}
            <div className="w-full max-w-xs bg-slate-200 rounded-full h-3.5 p-0.5 shadow-inner mb-1">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(25, healthPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between w-full max-w-xs text-[10px] font-black uppercase text-slate-400 font-fun">
              <span>Care Step {Math.min(clinicStep + 1, patient.tasks.length)} of {patient.tasks.length}</span>
              <span>{healthPercent}% Healthy</span>
            </div>
          </div>

          {!isRecovered && (
            <div className="bg-amber-100 text-amber-950 px-3.5 py-1.5 rounded-2xl text-xs font-fun font-black mb-3 border border-amber-300 shadow-sm flex items-center gap-1.5">
              <span>👉 Current Care Goal:</span>
              <span className="underline">{targetTask.prompt}</span>
            </div>
          )}

          {/* Interactive Medical Tools Tray */}
          <div className="w-full">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 block font-fun">
              🧰 Tap Veterinary Tool to Apply
            </span>
            <div className="grid grid-cols-5 gap-2 w-full">
              {availableTools.map((t) => {
                const isGoal = !isRecovered && t.id === targetTask.tool;
                return (
                  <button
                    key={t.id}
                    disabled={isRecovered}
                    onClick={() => handleApplyTool(t.id)}
                    className={`p-2 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 border-2 shadow-sm ${
                      isGoal
                        ? 'bg-emerald-100 border-emerald-500 ring-2 ring-emerald-300 scale-105'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-0.5">{t.icon}</span>
                    <span className="text-[9px] font-fun font-black text-slate-800 leading-tight">
                      {t.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // LOGIC 42: CONNECT THE DOTS & DOT-TO-DOT CONSTELLATION
    // -----------------------------------------------------------------------
    if (['game_connect_the_dots', 'game_dot_to_dot_constellation', 'game_phonics_alphabet_connect'].includes(gameMeta.id)) {
      const dotCount = Math.min(8, currentLevel + 3); // 4 to 8 dots
      const ALL_DOTS = [
        { id: 1, x: 50, y: 15 },
        { id: 2, x: 20, y: 35 },
        { id: 3, x: 80, y: 35 },
        { id: 4, x: 72, y: 72 },
        { id: 5, x: 28, y: 72 },
        { id: 6, x: 50, y: 88 },
        { id: 7, x: 12, y: 52 },
        { id: 8, x: 88, y: 52 }
      ];
      const dots = ALL_DOTS.slice(0, dotCount);
      const nextExpected = connectedDots.length + 1;
      const isComplete = connectedDots.length === dotCount;

      // Build SVG line paths for connected dots
      const svgLinePoints = connectedDots.map(id => {
        const d = dots.find(pt => pt.id === id);
        return d ? `${d.x},${d.y}` : null;
      }).filter(Boolean).join(' ');

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1 animate-bounce" style={{ animationDuration: '3s' }}>✨</span>
          <h3 className="text-lg sm:text-xl font-black font-fun text-slate-800 mb-0.5">
            Connect Dots in Order (1 → {dotCount})!
          </h3>
          <p className="text-xs font-bold text-indigo-700 mb-3 font-fun bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            {isComplete ? '🎉 Constellation Complete!' : `👉 Tap Dot #${nextExpected} next!`}
          </p>

          <div className="relative w-80 h-72 sm:w-96 sm:h-80 bg-slate-950 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden mb-2">
            {/* Ambient Starfield Background */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
              <div className="absolute top-4 left-6 text-xs text-yellow-200">✦</div>
              <div className="absolute top-12 right-10 text-xs text-white">★</div>
              <div className="absolute bottom-8 left-12 text-xs text-cyan-200">✦</div>
              <div className="absolute bottom-16 right-16 text-xs text-pink-200">★</div>
            </div>

            {/* Glowing Connecting SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Completed lines */}
              {connectedDots.map((id, index) => {
                if (index === 0) return null;
                const prev = dots.find(p => p.id === connectedDots[index - 1]);
                const curr = dots.find(p => p.id === id);
                if (!prev || !curr) return null;
                return (
                  <line
                    key={`line_${prev.id}_${curr.id}`}
                    x1={prev.x}
                    y1={prev.y}
                    x2={curr.x}
                    y2={curr.y}
                    stroke="#F59E0B"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  />
                );
              })}

              {/* Loop closing line on completion */}
              {isComplete && dots.length > 2 && (
                <line
                  x1={dots[dots.length - 1].x}
                  y1={dots[dots.length - 1].y}
                  x2={dots[0].x}
                  y2={dots[0].y}
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeDasharray="4 2"
                  className="animate-pulse drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]"
                />
              )}
            </svg>

            {/* Secret Revealed Artwork Emblem on Completion */}
            {isComplete && (
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-indigo-950/70 backdrop-blur-sm z-20 text-white font-fun"
              >
                <span className="text-7xl mb-2 drop-shadow-lg animate-bounce">
                  {currentLevel === 1 ? '⭐' : currentLevel === 2 ? '🚀' : currentLevel === 3 ? '🦖' : currentLevel === 4 ? '🏰' : '👑'}
                </span>
                <span className="text-lg font-black text-amber-300 drop-shadow">
                  Magic Constellation Unlocked!
                </span>
              </motion.div>
            )}

            {/* Interactive Number Dots */}
            {dots.map(d => {
              const isTapped = connectedDots.includes(d.id);
              const isTarget = d.id === nextExpected;

              return (
                <motion.button
                  key={d.id}
                  style={{ left: `${d.x}%`, top: `${d.y}%` }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (d.id === nextExpected) {
                      soundEngine.playCoin();
                      const next = [...connectedDots, d.id];
                      setConnectedDots(next);
                      if (next.length === dotCount) {
                        handleCorrect(150);
                      }
                    } else if (isTapped) {
                      soundEngine.playPop();
                    } else {
                      handleIncorrect(`Tap dot #${nextExpected} next!`);
                    }
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full font-fun font-black text-sm sm:text-base flex items-center justify-center transition-all z-10 cursor-pointer ${
                    isTapped
                      ? 'bg-gradient-to-tr from-emerald-400 to-green-300 text-slate-950 scale-110 shadow-lg shadow-emerald-400/60 ring-4 ring-white'
                      : isTarget
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 scale-125 ring-4 ring-amber-300 animate-pulse shadow-xl shadow-amber-400/80'
                      : 'bg-white hover:bg-slate-100 text-indigo-950 border-2 border-indigo-300'
                  }`}
                >
                  {isTapped ? '⭐' : d.id}
                </motion.button>
              );
            })}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // LOGIC 43: PIXEL ART COLORING
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_pixel_art_coloring') {
      return (
        <PixelArtColoringGame
          currentLevel={currentLevel}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      );
    }

    // -----------------------------------------------------------------------
    // LOGIC 44: KIDS MAZE RUNNER
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_kids_maze_runner') {
      return (
        <BunnyMazeRunnerGame
          currentLevel={currentLevel}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      );
    }

    // -----------------------------------------------------------------------
    // LOGIC 45: MEMORY CARD FLIP
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_memory_card_flip') {
      return (
        <MemoryCardFlipGame
          currentLevel={currentLevel}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      );
    }

    // Safety fallback
    return null;
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] bg-gradient-to-b ${worldMeta.bgGradient} rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-white shadow-2xl font-body`}>
      {/* Top Header Bar with 1-Tap Home Button */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {!isDemoMode && onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-200 to-amber-300 hover:from-amber-100 hover:to-amber-200 text-amber-950 font-fun font-black text-xs sm:text-sm shadow-xs border-2 border-amber-400 border-b-3 border-b-amber-600 transition active:translate-y-0.5 active:border-b-1 cursor-pointer"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-amber-900 stroke-[2.5]" />
              <span>Levels</span>
            </button>
          )}

          {!isDemoMode && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onHome();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-white to-slate-100 hover:bg-white text-indigo-950 font-fun font-black text-xs sm:text-sm shadow-xs border-2 border-white/90 border-b-3 border-b-slate-300 transition active:translate-y-0.5 active:border-b-1 cursor-pointer"
              title="Return to World Map"
            >
              <Home className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">World Map</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl animate-bounce" style={{ animationDuration: '3s' }}>{gameMeta.icon}</span>
            <div>
              <h2 className="text-sm sm:text-lg font-black text-white font-fun drop-shadow">
                {gameMeta.title}
              </h2>
              <span className="text-[10px] sm:text-xs text-white/90 font-bold block">
                Level {currentLevel} of 5 • {worldMeta.title}
              </span>
            </div>
          </div>
        </div>

        {/* Top Right Controls: Score & Pause */}
        <div className="flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-xs border-2 border-amber-300 border-b-3 border-b-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-black text-slate-800 font-fun">{score} pts</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPauseOpen(true);
            }}
            className="p-2 rounded-xl bg-gradient-to-b from-white to-slate-100 text-slate-700 shadow-xs border-2 border-white/90 border-b-3 border-b-slate-300 active:translate-y-0.5 active:border-b-1 transition cursor-pointer"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Playing Canvas */}
      <div className="relative z-10 my-2 sm:my-3 flex-1 bg-white/95 rounded-2xl border-2 border-white shadow-xl overflow-hidden flex flex-col justify-center">
        {feedbackMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full font-fun font-bold text-xs sm:text-sm shadow-lg ${
              feedbackMsg.positive
                ? 'bg-emerald-500 text-white'
                : 'bg-rose-500 text-white'
            }`}
          >
            {feedbackMsg.text}
          </motion.div>
        )}

        {renderGameContent()}
      </div>

      {/* Bottom Level Indicator Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs text-white font-fun font-bold">
        <div className="flex items-center gap-1">
          <span>Levels:</span>
          {[1, 2, 3, 4, 5].map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                soundEngine.playPop();
                setCurrentLevel(lvl as 1 | 2 | 3 | 4 | 5);
                resetGameState(lvl as 1 | 2 | 3 | 4 | 5);
              }}
              className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
                currentLevel === lvl
                  ? 'bg-white text-indigo-700 shadow'
                  : 'bg-white/30 text-white hover:bg-white/50'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-white/90">
          Ages 3–10 Adaptive Suite
        </div>
      </div>

      {/* Win Modal */}
      <WinModal
        isOpen={gameState === 'LEVEL_COMPLETE'}
        stars={stars}
        score={score}
        timeSpentSeconds={Math.max(1, Math.round((Date.now() - startTime) / 1000))}
        stickerEarned={earnedSticker}
        currentLevel={currentLevel}
        gameTitle={`${gameMeta.icon} ${gameMeta.title}`}
        worldName={worldMeta.title}
        onRestart={() => resetGameState(currentLevel)}
        onNextLevel={handleNextLevel}
        onHome={onHome}
        onBackToWorld={onBackToWorld}
      />

      {/* Pause Modal */}
      <PauseModal
        isOpen={isPauseOpen}
        isMuted={soundEngine.getMuted()}
        onToggleMute={() => soundEngine.setMuted(!soundEngine.getMuted())}
        onResume={() => setIsPauseOpen(false)}
        onRestart={() => {
          setIsPauseOpen(false);
          resetGameState(currentLevel);
        }}
        onHome={() => {
          setIsPauseOpen(false);
          onHome();
        }}
        onBackToWorld={onBackToWorld ? () => {
          setIsPauseOpen(false);
          onBackToWorld();
        } : undefined}
      />
    </div>
  );
};
