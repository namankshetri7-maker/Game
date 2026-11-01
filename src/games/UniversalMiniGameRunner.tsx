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
import confetti from 'canvas-confetti';

interface UniversalMiniGameRunnerProps {
  gameId: string;
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  onHome: () => void;
  onBackToWorld?: () => void;
  onNextGame: () => void;
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
  onNextGame
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
  const [unscrambledLetters, setUnscrambledLetters] = useState<string[]>([]);
  const [clinicStep, setClinicStep] = useState(0);
  const [camouflageFound, setCamouflageFound] = useState(false);

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
    setUnscrambledLetters([]);
    setClinicStep(0);
    setCamouflageFound(false);
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
    if (gameMeta.id === 'game_clockwork_owl') {
      const times = [
        { time: '3:00', icon: '🕒' },
        { time: '6:30', icon: '🕡' },
        { time: '9:00', icon: '🕘' },
        { time: '12:15', icon: '🕛' },
        { time: '4:45', icon: '🕓' }
      ];
      const targetTime = times[(currentLevel - 1) % times.length];
      const options = stableShuffle([targetTime.time, '1:30', '8:00'], currentLevel * 11);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🦉</span>
          <div className="mb-3">
            <h3 className="text-base sm:text-lg font-black font-fun text-slate-800">
              Professor Owl asks: What time is on the clock?
            </h3>
          </div>

          <div className="w-28 h-28 rounded-full bg-white border-4 border-indigo-400 shadow-md flex items-center justify-center text-5xl mb-5">
            {targetTime.icon}
          </div>

          <div className="flex gap-3">
            {options.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (t === targetTime.time) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look at the hour and minute hands!');
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-500 text-indigo-900 font-fun font-black text-xl shadow-sm active:scale-95 transition"
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
    // PHONICS 17: GRAMMAR SAFARI (Nouns, Verbs, Adjectives)
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_grammar_safari') {
      const words = [
        { word: 'ELEPHANT 🐘', type: 'Noun' },
        { word: 'RUN 🏃', type: 'Verb' },
        { word: 'SUNNY ☀️', type: 'Adjective' },
        { word: 'SWIM 🏊', type: 'Verb' },
        { word: 'GIGANTIC 🦕', type: 'Adjective' }
      ];
      const curWord = words[(currentLevel - 1) % words.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🍃</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Grammar Leaf: <span className="text-emerald-700 underline">{curWord.word}</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">What part of speech is this word?</p>

          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            {['Noun (Person, Place, Thing)', 'Verb (Action word)', 'Adjective (Describing word)'].map((choice, idx) => {
              const baseName = choice.split(' ')[0];
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (baseName === curWord.type) {
                      handleCorrect();
                    } else {
                      handleIncorrect(`Think about what ${curWord.word} does!`);
                    }
                  }}
                  className="py-3 px-4 rounded-xl bg-white border-2 border-emerald-200 hover:border-emerald-500 font-fun font-bold text-slate-800 text-sm shadow-sm active:scale-95 transition"
                >
                  {choice}
                </button>
              );
            })}
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
    // PHONICS 19: SENTENCE BUILDER EXPRESS
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_sentence_builder_express') {
      const sentences = [
        { words: ['The', 'lion', 'can', 'roar'], correct: 'The lion can roar' },
        { words: ['Birds', 'fly', 'in', 'sky'], correct: 'Birds fly in sky' },
        { words: ['I', 'love', 'sweet', 'apples'], correct: 'I love sweet apples' },
        { words: ['Frogs', 'jump', 'very', 'high'], correct: 'Frogs jump very high' },
        { words: ['Stars', 'shine', 'at', 'night'], correct: 'Stars shine at night' }
      ];
      const sentence = sentences[(currentLevel - 1) % sentences.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🧩</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-2">
            Assemble the Sentence Carriages!
          </h3>

          <div className="min-h-[50px] p-3 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex items-center justify-center gap-2 mb-4 w-full max-w-sm">
            {sentenceWords.length === 0 ? (
              <span className="text-xs text-indigo-400 font-bold">Tap word blocks below in order!</span>
            ) : (
              sentenceWords.map((w, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-lg font-fun font-bold text-xs text-indigo-900 shadow-sm border border-indigo-200">
                  {w}
                </span>
              ))
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {sentence.words.map((w, idx) => (
              <button
                key={idx}
                disabled={sentenceWords.includes(w)}
                onClick={() => {
                  soundEngine.playPop();
                  const nextWords = [...sentenceWords, w];
                  setSentenceWords(nextWords);
                  if (nextWords.length === sentence.words.length) {
                    if (nextWords.join(' ') === sentence.correct) {
                      handleCorrect();
                    } else {
                      handleIncorrect('Reset and check word order!');
                    }
                  }
                }}
                className={`px-4 py-2 rounded-xl font-fun font-bold text-sm border-2 transition ${
                  sentenceWords.includes(w)
                    ? 'bg-slate-100 text-slate-400 border-slate-200'
                    : 'bg-white text-slate-800 border-indigo-300 hover:border-indigo-600 shadow-sm active:scale-95'
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <button
            onClick={() => setSentenceWords([])}
            className="text-xs text-slate-500 font-bold underline hover:text-slate-700"
          >
            Clear / Reset
          </button>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // PHONICS 20: SPELLING BEE MATCH
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_spelling_bee_match') {
      const words = [
        { word: 'BEE', letters: ['E', 'B', 'E'], hint: 'Busy pollinator 🐝' },
        { word: 'FROG', letters: ['G', 'R', 'F', 'O'], hint: 'Pond hopper 🐸' },
        { word: 'STAR', letters: ['A', 'S', 'R', 'T'], hint: 'Night sky light ⭐' },
        { word: 'BEAR', letters: ['R', 'E', 'B', 'A'], hint: 'Honey loving friend 🐻' },
        { word: 'TIGER', letters: ['E', 'T', 'G', 'I', 'R'], hint: 'Striped jungle cat 🐯' }
      ];
      const target = words[(currentLevel - 1) % words.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🍯</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Spell: {target.hint}
          </h3>
          <p className="text-xs text-slate-500 mb-3 font-semibold">Unscramble the honeycomb letters:</p>

          <div className="h-14 px-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-center gap-2 mb-4 min-w-[200px]">
            {unscrambledLetters.map((l, idx) => (
              <span key={idx} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-fun font-black text-xl text-amber-950 border border-amber-200">
                {l}
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            {target.letters.map((lettr, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEngine.playPop();
                  const next = [...unscrambledLetters, lettr];
                  setUnscrambledLetters(next);
                  if (next.length === target.word.length) {
                    if (next.join('') === target.word) {
                      handleCorrect();
                    } else {
                      handleIncorrect('Letters are out of order, try again!');
                    }
                  }
                }}
                className="w-12 h-12 rounded-xl bg-amber-400 hover:bg-amber-300 font-fun font-black text-2xl text-amber-950 shadow-sm border border-white active:scale-95 transition"
              >
                {lettr}
              </button>
            ))}
          </div>

          <button
            onClick={() => setUnscrambledLetters([])}
            className="text-xs text-slate-500 font-bold underline"
          >
            Reset Letters
          </button>
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
    // SCIENCE 35: CAMOUFLAGE SEEK
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_camouflage_seek') {
      const critters = [
        { name: 'Chameleon 🦎', bg: 'bg-emerald-200', deco: ['🍃', '🌿', '🌱', '🍃', '🦎', '🌿'] },
        { name: 'Stick Bug 🦗', bg: 'bg-amber-200', deco: ['🪵', '🍂', '🪵', '🦗', '🪵', '🍂'] },
        { name: 'Snowy Owl 🦉', bg: 'bg-slate-100', deco: ['❄️', '☁️', '❄️', '🦉', '❄️', '☁️'] },
        { name: 'Desert Lizard 🦎', bg: 'bg-yellow-100', deco: ['🌵', '🏜️', '🌵', '🦎', '🏜️', '🌵'] },
        { name: 'Octopus 🐙', bg: 'bg-cyan-200', deco: ['🪸', '🌊', '🪸', '🐙', '🌊', '🪸'] }
      ];
      const cur = critters[(currentLevel - 1) % critters.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🔍</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Camouflage Seek: Find the {cur.name}!
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">It blends right into its environment!</p>

          <div className={`grid grid-cols-3 gap-3 p-4 rounded-3xl border-2 border-slate-300 ${cur.bg} max-w-xs shadow-inner`}>
            {cur.deco.map((item, idx) => {
              const isTarget = item === cur.name.split(' ')[1];
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isTarget) {
                      soundEngine.playPop();
                      setCamouflageFound(true);
                      handleCorrect();
                    } else {
                      handleIncorrect('Keep looking! That is just part of the scenery.');
                    }
                  }}
                  className="w-16 h-16 rounded-2xl bg-white/40 hover:bg-white/70 flex items-center justify-center text-3xl transition active:scale-90"
                >
                  {item}
                </button>
              );
            })}
          </div>
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
    // SCIENCE 37: BIRD BEAK & FOOD MATCH
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_bird_beak_match') {
      const beaks = [
        { bird: 'Pelican 🦤', beakType: 'Large pouch beak', food: 'Fish in the water 🐟' },
        { bird: 'Hummingbird 🐦', beakType: 'Long slender straw', food: 'Flower nectar 🌸' },
        { bird: 'Eagle 🦅', beakType: 'Sharp curved hook', food: 'Prey & meat 🥩' },
        { bird: 'Woodpecker 🪵', beakType: 'Strong chisel beak', food: 'Tree bark insects 🐛' },
        { bird: 'Sparrow 🌾', beakType: 'Short cone beak', food: 'Seeds & grains 🌾' }
      ];
      const cur = beaks[(currentLevel - 1) % beaks.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🦜</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Bird Adaptation: {cur.bird}
          </h3>
          <p className="text-xs text-slate-500 mb-1 font-semibold">Beak: {cur.beakType}</p>
          <p className="text-xs text-indigo-600 mb-4 font-bold">What is this beak specially shaped to eat?</p>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            {['Fish in the water 🐟', 'Flower nectar 🌸', 'Prey & meat 🥩', 'Tree bark insects 🐛'].map((food, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (food === cur.food) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Look at the shape of the beak!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-white border-2 border-slate-200 hover:border-indigo-500 font-fun font-bold text-slate-800 text-xs shadow-sm active:scale-95 transition"
              >
                {food}
              </button>
            ))}
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
    // SCIENCE 40: PET CARE CLINIC
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_pet_care_clinic') {
      const steps = [
        { task: 'Check Puppy Temperature 🌡️', icon: '🌡️', hint: 'Take friendly vitals!' },
        { task: 'Clean & Bandage Little Paw 🩹', icon: '🩹', hint: 'Wrap with care!' },
        { task: 'Provide Fresh Cool Water 🥛', icon: '🥛', hint: 'Hydration time!' },
        { task: 'Feed Nutritious Kibble 🥣', icon: '🥣', hint: 'Healthy energy food!' },
        { task: 'Gentle Fur Brush & Petting 🪮', icon: '🪮', hint: 'Happy and healthy puppy!' }
      ];
      const curStep = steps[clinicStep % steps.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-5xl mb-1">🐶</span>
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-1">
            Pet Care Step {clinicStep + 1} of 3: {curStep.task}
          </h3>
          <p className="text-xs text-slate-500 mb-4 font-semibold">{curStep.hint}</p>

          <button
            onClick={() => {
              soundEngine.playPop();
              const nextStep = clinicStep + 1;
              setClinicStep(nextStep);
              if (nextStep >= 3) {
                handleCorrect();
              }
            }}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-fun font-black text-lg shadow-md active:scale-95 transition flex items-center gap-2"
          >
            <span className="text-2xl">{curStep.icon}</span>
            <span>Apply Care Action</span>
          </button>
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
      const cards = ['🐶', '🐱', '🐼', '🦊', '🐶', '🐱', '🐼', '🦊'];

      const handleFlip = (idx: number) => {
        if (flippedCards.length === 2 || flippedCards.includes(idx) || matchedPairs.includes(idx)) return;
        soundEngine.playPop();
        const newFlipped = [...flippedCards, idx];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
          const [first, second] = newFlipped;
          if (cards[first] === cards[second]) {
            soundEngine.playCorrect();
            setMatchedPairs(prev => [...prev, first, second]);
            setFlippedCards([]);
            if (matchedPairs.length + 2 === cards.length) {
              handleCorrect();
            }
          } else {
            setTimeout(() => setFlippedCards([]), 900);
          }
        }
      };

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <h3 className="text-base sm:text-lg font-black font-fun text-slate-800 mb-3">
            Find Matching Animal Pairs! ({matchedPairs.length / 2}/4)
          </h3>

          <div className="grid grid-cols-4 gap-2.5 max-w-xs">
            {cards.map((emoji, idx) => {
              const isRevealed = flippedCards.includes(idx) || matchedPairs.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleFlip(idx)}
                  className={`w-14 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 transition active:scale-95 shadow-sm ${
                    isRevealed
                      ? 'bg-white border-purple-400 rotate-0'
                      : 'bg-gradient-to-b from-purple-500 to-indigo-600 border-white text-transparent'
                  }`}
                >
                  {isRevealed ? emoji : '❓'}
                </button>
              );
            })}
          </div>
        </div>
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
          {onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-white/80 transition"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
              <span>Levels</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-white/80 transition"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">World Map</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{gameMeta.icon}</span>
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
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm border border-white">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span className="text-xs sm:text-sm font-black text-slate-800 font-fun">{score} pts</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPauseOpen(true);
            }}
            className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 shadow-md border-2 border-white/80 active:scale-95 transition"
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
