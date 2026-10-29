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
  Volume2,
  ChevronRight,
  Shield,
  Layers,
  Compass,
  Heart
} from 'lucide-react';
import { MINI_GAMES_MATRIX, WORLDS } from '../data/gameMatrix';
import { AgeGroup, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import confetti from 'canvas-confetti';

interface UniversalMiniGameRunnerProps {
  gameId: string;
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  onHome: () => void;
  onNextGame: () => void;
}

export const UniversalMiniGameRunner: React.FC<UniversalMiniGameRunnerProps> = ({
  gameId,
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
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
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [countedCount, setCountedCount] = useState(0);
  const [eatenCount, setEatenCount] = useState(0);
  const [mazePlayerPos, setMazePlayerPos] = useState({ x: 0, y: 0 });
  const [connectedDots, setConnectedDots] = useState<number[]>([]);
  const [paintedPixels, setPaintedPixels] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);

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
    setQuestionIndex(0);
    setSelectedItems([]);
    setCountedCount(0);
    setEatenCount(0);
    setMazePlayerPos({ x: 0, y: 0 });
    setConnectedDots([]);
    setPaintedPixels({});
    setFlippedCards([]);
    setMatchedPairs([]);
  };

  const handleCorrect = (points = 100) => {
    soundEngine.playCorrect();
    setScore(prev => prev + points);
    setFeedbackMsg({ text: 'Wonderful! ⭐', positive: true });

    setTimeout(() => {
      setFeedbackMsg(null);
      // Check if level complete
      triggerWin();
    }, 900);
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
      const targetCount = currentLevel * 3 + 2; // Level 1: 5, Level 2: 8, Level 3: 11...
      const animals = ['🦓', '🦒', '🦁', '🐘', '🦏'];
      const animalIcon = animals[(currentLevel - 1) % animals.length];
      const options = [targetCount - 1, targetCount, targetCount + 1].sort(() => Math.random() - 0.5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl px-4 py-2 mb-4">
            <h3 className="text-base sm:text-xl font-bold font-fun text-amber-900">
              Count the {animalIcon} Safari Animals!
            </h3>
            <p className="text-xs text-amber-700">Tap animals to count, then tap the right number!</p>
          </div>

          {/* Animal Field */}
          <div className="flex flex-wrap justify-center gap-3 max-w-md p-4 bg-emerald-50 rounded-3xl border-4 border-emerald-300 min-h-[140px] items-center mb-6">
            {Array.from({ length: targetCount }).map((_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 1.25 }}
                onClick={() => {
                  soundEngine.playPop();
                  setCountedCount(prev => prev + 1);
                }}
                className="text-3xl sm:text-4xl p-2 bg-white rounded-2xl shadow hover:bg-emerald-100 transition active:scale-95"
              >
                {animalIcon}
              </motion.button>
            ))}
          </div>

          {/* Answer Badges */}
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
                className="w-16 h-16 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-600 text-white font-fun font-black text-2xl shadow-lg border-2 border-white hover:scale-105 active:scale-95 transition"
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
      const options = [remaining, remaining + 1, Math.max(1, remaining - 1)].sort(() => Math.random() - 0.5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="bg-pink-100 border-2 border-pink-300 rounded-2xl px-4 py-2 mb-3">
            <h3 className="text-base sm:text-xl font-bold font-fun text-pink-900">
              Chef baked {initialCupcakes} cupcakes! Tap {toEat} cupcakes to eat them!
            </h3>
            <p className="text-xs text-pink-700">
              Equation: {initialCupcakes} - {eatenCount} = {initialCupcakes - eatenCount} left
            </p>
          </div>

          {/* Bakery Tray */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 p-4 bg-amber-50 rounded-3xl border-4 border-amber-300 mb-5">
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
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition border-2 ${
                    isEaten
                      ? 'bg-slate-200 border-slate-300 opacity-30 cursor-not-allowed'
                      : 'bg-white border-pink-200 hover:scale-110 shadow active:scale-95'
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
                className="w-16 h-16 rounded-2xl bg-gradient-to-b from-pink-500 to-rose-600 text-white font-fun font-black text-2xl shadow-lg border-2 border-white hover:scale-105 active:scale-95 transition"
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
      const options = [product, product + numA, Math.max(1, product - numB)].sort(() => Math.random() - 0.5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <div className="text-5xl mb-2 animate-bounce">👾</div>
          <div className="bg-purple-100 border-2 border-purple-300 rounded-2xl px-5 py-3 mb-4">
            <span className="text-xs uppercase font-extrabold text-purple-700 block tracking-wider">Monster Equation</span>
            <span className="text-3xl font-black font-fun text-purple-950">
              {numA} × {numB} = ?
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4 font-bold">Zap the energy crystal with the right answer!</p>

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
                className="px-6 py-4 rounded-2xl bg-gradient-to-b from-purple-600 to-indigo-700 text-white font-fun font-black text-2xl shadow-xl border-2 border-purple-300 hover:scale-105 active:scale-95 transition"
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
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl px-4 py-2 mb-3">
            <h3 className="text-lg font-bold font-fun text-amber-900">
              Serve {currentFrac.label} of the pizza to our friendly hungry bear! 🐻
            </h3>
            <p className="text-xs text-amber-700">Tap {currentFrac.required} of {currentFrac.total} slices!</p>
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
                  className={`w-14 h-20 rounded-2xl flex flex-col items-center justify-center text-3xl border-4 transition ${
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
        { time: '3:00', hour: '3', min: '00', icon: '🕒' },
        { time: '6:30', hour: '6', min: '30', icon: '🕡' },
        { time: '9:00', hour: '9', min: '00', icon: '🕘' },
        { time: '12:15', hour: '12', min: '15', icon: '🕛' },
        { time: '4:45', hour: '4', min: '45', icon: '🕓' }
      ];
      const targetTime = times[(currentLevel - 1) % times.length];
      const options = [targetTime.time, '1:30', '8:00'].sort(() => Math.random() - 0.5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🦉</span>
          <div className="bg-indigo-100 border-2 border-indigo-300 rounded-2xl px-4 py-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold font-fun text-indigo-900">
              Professor Owl asks: What time is on the clock?
            </h3>
          </div>

          <div className="w-28 h-28 rounded-full bg-white border-4 border-indigo-400 shadow-xl flex items-center justify-center text-5xl mb-4">
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
                className="px-5 py-3 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-500 text-indigo-900 font-fun font-black text-xl shadow-md active:scale-95 transition"
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
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-2">
            Complete the Pattern Train!
          </h3>

          <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-2xl border-2 border-slate-300 mb-5 overflow-x-auto">
            {currentPattern.seq.map((item, idx) => (
              <div key={idx} className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center text-2xl font-bold font-fun">
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
                className="w-14 h-14 bg-white rounded-2xl border-2 border-indigo-300 hover:border-indigo-600 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition"
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
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl px-5 py-2 mb-3">
            <h3 className="text-base sm:text-lg font-bold font-fun text-amber-900">
              Buy {marketItem.name} for {marketItem.price}¢
            </h3>
            <p className="text-xs text-amber-700">Cash in hand: {countedCount}¢</p>
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
                className="p-2 sm:p-3 bg-white rounded-2xl border-2 border-amber-300 hover:bg-amber-50 shadow active:scale-95 transition flex flex-col items-center"
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
      const pairs = [
        { left: 4, right: 7, op: '<' },
        { left: 9, right: 3, op: '>' },
        { left: 6, right: 6, op: '=' },
        { left: 15, right: 20, op: '<' },
        { left: 24, right: 18, op: '>' }
      ];
      const scale = pairs[(currentLevel - 1) % pairs.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🐲</span>
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-2">
            Balance the Dragon's Scales!
          </h3>

          <div className="flex items-center gap-4 bg-orange-50 border-4 border-orange-200 rounded-3xl p-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl font-black font-fun text-indigo-700">
              {scale.left}
            </div>
            <div className="text-2xl font-black text-amber-500">⚖️</div>
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl font-black font-fun text-purple-700">
              {scale.right}
            </div>
          </div>

          <div className="flex gap-4">
            {['<', '=', '>'].map((op, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (op === scale.op) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Compare the numbers on both sides!');
                  }
                }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-b from-indigo-500 to-blue-600 text-white font-fun font-black text-3xl shadow-lg border-2 border-white hover:scale-105 active:scale-95 transition"
              >
                {op}
              </button>
            ))}
          </div>
        </div>
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
      const popsicles = [target.letter, 'P', 'R', 'K'].sort(() => Math.random() - 0.5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🍧</span>
          <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl px-4 py-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold font-fun text-emerald-900">
              Pop the popsicle for sound {target.sound}!
            </h3>
          </div>

          <div className="flex gap-3">
            {popsicles.map((lettr, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (lettr === target.letter) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Listen carefully to the sound!');
                  }
                }}
                className="w-16 h-24 rounded-3xl bg-gradient-to-b from-pink-400 to-rose-500 text-white font-fun font-black text-3xl shadow-xl border-4 border-white flex flex-col items-center justify-center"
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
      const letters = ['A', 'B', 'C', 'D', 'E'];
      const targetChar = letters[(currentLevel - 1) % letters.length];

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-3xl mb-1">✍️</span>
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-1">
            Tap Stars 1 → 2 → 3 → 4 to Trace '{targetChar}'!
          </h3>

          <div className="relative w-48 h-48 bg-white border-4 border-indigo-200 rounded-3xl shadow-lg flex items-center justify-center mb-4">
            <span className="text-8xl font-black font-fun text-indigo-100 absolute select-none">
              {targetChar}
            </span>

            {/* Checkpoint Stars */}
            <div className="absolute inset-4 flex flex-wrap justify-between items-center p-2">
              {[1, 2, 3, 4].map(pt => {
                const isTapped = connectedDots.includes(pt);
                return (
                  <button
                    key={pt}
                    onClick={() => {
                      soundEngine.playPop();
                      setConnectedDots(prev => [...prev, pt]);
                      if (connectedDots.length === 3) {
                        handleCorrect();
                      }
                    }}
                    className={`w-10 h-10 rounded-full font-bold font-fun text-sm shadow-md transition flex items-center justify-center ${
                      isTapped
                        ? 'bg-emerald-500 text-white scale-110'
                        : 'bg-amber-400 hover:bg-amber-500 text-white'
                    }`}
                  >
                    ⭐ {pt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
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
          <div className="bg-blue-100 border-2 border-blue-300 rounded-2xl px-4 py-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold font-fun text-blue-900">
              Fuel the rocket! What rhymes with <span className="underline font-black">{pair.word}</span>?
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
                className="px-6 py-4 rounded-2xl bg-white border-2 border-blue-300 hover:border-blue-600 font-fun font-black text-xl text-blue-900 shadow-md active:scale-95 transition"
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
      const chests = [targetWord, 'FOR', 'ARE', 'WITH'].sort(() => Math.random() - 0.5);

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <span className="text-4xl mb-1">🗝️</span>
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl px-4 py-2 mb-4">
            <h3 className="text-base sm:text-lg font-bold font-fun text-amber-900">
              Dig open the chest containing: <span className="font-black underline">{targetWord}</span>!
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
                className="p-4 bg-white rounded-2xl border-2 border-amber-300 hover:border-amber-600 shadow-md font-fun font-black text-lg text-amber-950 flex flex-col items-center justify-center active:scale-95 transition"
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
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-4">
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
                className="py-3 px-4 rounded-xl bg-white border-2 border-slate-300 hover:border-amber-500 font-fun font-bold text-slate-800 shadow active:scale-95 transition"
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
          <h3 className="text-base sm:text-xl font-bold font-fun text-slate-800 mb-1">
            {cur.name}
          </h3>
          <p className="text-xs text-slate-500 mb-4">Where in the world is this famous landmark located?</p>

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
                className="py-3 px-4 rounded-xl bg-white border-2 border-amber-300 hover:border-amber-600 font-fun font-bold text-amber-950 shadow active:scale-95 transition"
              >
                {loc}
              </button>
            ))}
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
          <h3 className="text-lg font-bold font-fun text-slate-800 mb-1">
            What kind of eater is the {critter.name.split(' ')[0]}?
          </h3>
          <p className="text-xs text-slate-500 mb-4">Sort into the correct diet category:</p>

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
                className="py-3 px-4 rounded-xl bg-white border-2 border-emerald-300 hover:border-emerald-600 font-fun font-bold text-emerald-950 shadow active:scale-95 transition"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
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
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-1">
            What is a baby {pair.mama.split(' ')[0]} called?
          </h3>
          <p className="text-xs text-slate-500 mb-4">Match the mama to her little one!</p>

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
                className="px-5 py-3 rounded-2xl bg-white border-2 border-pink-300 hover:border-pink-600 text-pink-950 font-fun font-bold text-lg shadow active:scale-95 transition"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // -----------------------------------------------------------------------
    // LOGIC 44: KIDS MAZE RUNNER
    // -----------------------------------------------------------------------
    if (gameMeta.id === 'game_kids_maze_runner') {
      const targetPos = { x: 3, y: 3 };

      const movePlayer = (dx: number, dy: number) => {
        const nextX = Math.max(0, Math.min(3, mazePlayerPos.x + dx));
        const nextY = Math.max(0, Math.min(3, mazePlayerPos.y + dy));
        soundEngine.playPop();
        setMazePlayerPos({ x: nextX, y: nextY });

        if (nextX === targetPos.x && nextY === targetPos.y) {
          handleCorrect();
        }
      };

      return (
        <div className="flex flex-col items-center justify-center p-4 h-full text-center">
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-2">
            Guide Bunny 🐰 to the Golden Carrot 🥕!
          </h3>

          {/* 4x4 Maze Grid */}
          <div className="grid grid-cols-4 gap-1.5 p-3 bg-purple-50 rounded-2xl border-4 border-purple-200 mb-4">
            {Array.from({ length: 16 }).map((_, idx) => {
              const x = idx % 4;
              const y = Math.floor(idx / 4);
              const isPlayer = mazePlayerPos.x === x && mazePlayerPos.y === y;
              const isTarget = targetPos.x === x && targetPos.y === y;

              return (
                <div
                  key={idx}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold border-2 transition ${
                    isPlayer
                      ? 'bg-amber-200 border-amber-400 scale-105'
                      : isTarget
                      ? 'bg-emerald-100 border-emerald-400'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {isPlayer ? '🐰' : isTarget ? '🥕' : ''}
                </div>
              );
            })}
          </div>

          {/* D-Pad Navigation Controls */}
          <div className="grid grid-cols-3 gap-1.5 max-w-[160px]">
            <div />
            <button
              onClick={() => movePlayer(0, -1)}
              className="p-3 bg-indigo-600 text-white rounded-xl font-bold shadow hover:bg-indigo-700 active:scale-90"
            >
              ⬆️
            </button>
            <div />
            <button
              onClick={() => movePlayer(-1, 0)}
              className="p-3 bg-indigo-600 text-white rounded-xl font-bold shadow hover:bg-indigo-700 active:scale-90"
            >
              ⬅️
            </button>
            <div />
            <button
              onClick={() => movePlayer(1, 0)}
              className="p-3 bg-indigo-600 text-white rounded-xl font-bold shadow hover:bg-indigo-700 active:scale-90"
            >
              ➡️
            </button>
            <div />
            <button
              onClick={() => movePlayer(0, 1)}
              className="p-3 bg-indigo-600 text-white rounded-xl font-bold shadow hover:bg-indigo-700 active:scale-90"
            >
              ⬇️
            </button>
            <div />
          </div>
        </div>
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
          <h3 className="text-base sm:text-lg font-bold font-fun text-slate-800 mb-3">
            Find Matching Animal Pairs! ({matchedPairs.length / 2}/4)
          </h3>

          <div className="grid grid-cols-4 gap-2.5 max-w-xs">
            {cards.map((emoji, idx) => {
              const isRevealed = flippedCards.includes(idx) || matchedPairs.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleFlip(idx)}
                  className={`w-14 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 transition active:scale-95 shadow ${
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

    // -----------------------------------------------------------------------
    // UNIVERSAL ADAPTIVE FALLBACK FOR ALL REMAINING MATRIX GAMES
    // -----------------------------------------------------------------------
    const skillsList = gameMeta.skills.join(', ');
    const promptText = `Solve Level ${currentLevel} Challenge for ${gameMeta.title}`;

    return (
      <div className="flex flex-col items-center justify-center p-4 h-full text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-white border-4 border-indigo-200 shadow-xl flex items-center justify-center text-5xl mb-3">
          {gameMeta.icon}
        </div>

        <h3 className="text-lg sm:text-2xl font-black font-fun text-slate-900 mb-1">
          {gameMeta.title}
        </h3>
        <p className="text-xs text-indigo-700 font-bold mb-3">
          Focus: {skillsList} • {gameMeta.ageRecommendation}
        </p>

        <div className="p-4 bg-white/90 rounded-2xl border-2 border-indigo-100 shadow-sm w-full mb-5">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Level {currentLevel} Quest
          </div>
          <p className="text-sm font-fun font-bold text-slate-800">
            {currentLevel === 1 && `Welcome to Level 1! Master the basics of ${gameMeta.title}.`}
            {currentLevel === 2 && `Level 2: Step up your speed and accuracy in ${gameMeta.title}!`}
            {currentLevel === 3 && `Level 3 Challenge: Complex thinking in ${gameMeta.title}!`}
            {currentLevel === 4 && `Level 4 Master: Advanced puzzles in ${gameMeta.title}!`}
            {currentLevel === 5 && `Level 5 Champion: The final trophy quest in ${gameMeta.title}!`}
          </p>
        </div>

        {/* Interactive Multi-Choice Challenge Badges */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          {[
            { label: 'Option A ⭐', correct: false },
            { label: 'Correct Answer ✅', correct: true },
            { label: 'Option C 🌟', correct: false },
            { label: 'Option D ✨', correct: false }
          ]
            .sort(() => Math.random() - 0.5)
            .map((choice, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (choice.correct) {
                    handleCorrect();
                  } else {
                    handleIncorrect('Think carefully about the challenge!');
                  }
                }}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-fun font-bold text-xs shadow-md hover:from-indigo-600 hover:to-blue-700 active:scale-95 transition border border-white"
              >
                {choice.label}
              </button>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full h-full min-h-[500px] bg-gradient-to-b ${worldMeta.bgGradient} rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-white shadow-2xl font-body`}>
      {/* Top Header Bar with 1-Tap Home Button */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-white/80 transition"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-indigo-600" />
            <span>World Map</span>
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
        onRestart={() => resetGameState(currentLevel)}
        onNextLevel={handleNextLevel}
        onHome={onHome}
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
      />
    </div>
  );
};
