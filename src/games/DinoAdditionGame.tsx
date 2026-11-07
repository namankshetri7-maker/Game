/**
 * Mini-Game 1: Dino Addition (World 1: Math Magic Valley)
 * Production-ready, 100% offline educational game for ages 3–10.
 *
 * Age Dynamic Difficulty:
 * - Easy (3–4): 1-5 sum, explicit guide dots, large eggs, ghost nest hints.
 * - Medium (5–7): 1-12 sum, draggable math counters, timed bonus.
 * - Hard (8–10): Missing addends & mental math (e.g., 7 + ? = 15).
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Sparkles, Volume2, HelpCircle, Home, ArrowLeft } from 'lucide-react';
import { AgeGroup, DifficultyLevel, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface DinoAdditionGameProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: number;
  onHome: () => void;
  onBackToWorld?: () => void;
  onNextGame: () => void;
  isDemoMode?: boolean;
}

interface AdditionProblem {
  numA: number;
  numB: number;
  answer: number;
  isMissingAddend?: boolean;
  missingPosition?: 'A' | 'B' | 'result';
  options: number[];
}

export const DinoAdditionGame: React.FC<DinoAdditionGameProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onBackToWorld,
  onNextGame,
  isDemoMode = false
}) => {
  // Game & Level state
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    if (ageGroup === '3-4') return 'EASY';
    if (ageGroup === '5-7') return 'MEDIUM';
    return 'HARD';
  });
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [problemIndex, setProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);
  const [dinoEmotion, setDinoEmotion] = useState<'happy' | 'cheering' | 'thinking' | 'oops'>('thinking');

  // Interactive Drag & Drop state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(ageGroup === '3-4' || difficulty === 'EASY');

  const nestRef = useRef<HTMLDivElement>(null);

  // Generate 3 distinct difficulty tiers per game level (Levels 1 to 5)
  const getProblemsForLevelAndDifficulty = (lvl: number, diff: DifficultyLevel): AdditionProblem[] => {
    if (diff === 'EASY') {
      // EASY: Sums 1-5 (Levels 1-2) or 1-10 (Levels 3-5), 2 options, clear dots
      if (lvl === 1) {
        return [
          { numA: 1, numB: 2, answer: 3, options: [3, 2] },
          { numA: 2, numB: 1, answer: 3, options: [4, 3] },
          { numA: 2, numB: 2, answer: 4, options: [4, 5] }
        ];
      } else if (lvl === 2) {
        return [
          { numA: 3, numB: 1, answer: 4, options: [3, 4] },
          { numA: 2, numB: 3, answer: 5, options: [5, 4] },
          { numA: 1, numB: 4, answer: 5, options: [5, 6] }
        ];
      } else if (lvl === 3) {
        return [
          { numA: 3, numB: 3, answer: 6, options: [6, 5] },
          { numA: 4, numB: 2, answer: 6, options: [6, 7] },
          { numA: 5, numB: 2, answer: 7, options: [7, 8] }
        ];
      } else if (lvl === 4) {
        return [
          { numA: 4, numB: 4, answer: 8, options: [8, 7] },
          { numA: 5, numB: 3, answer: 8, options: [8, 9] },
          { numA: 6, numB: 2, answer: 8, options: [7, 8] }
        ];
      } else {
        // Level 5
        return [
          { numA: 5, numB: 5, answer: 10, options: [10, 9] },
          { numA: 6, numB: 4, answer: 10, options: [9, 10] },
          { numA: 7, numB: 3, answer: 10, options: [10, 11] }
        ];
      }
    } else if (diff === 'MEDIUM') {
      // MEDIUM: Sums 1-10 (Levels 1-2) or 1-20 (Levels 3-5), 3 options
      if (lvl === 1) {
        return [
          { numA: 3, numB: 2, answer: 5, options: [4, 5, 6] },
          { numA: 4, numB: 3, answer: 7, options: [6, 7, 8] },
          { numA: 2, numB: 5, answer: 7, options: [7, 8, 9] }
        ];
      } else if (lvl === 2) {
        return [
          { numA: 5, numB: 4, answer: 9, options: [8, 9, 10] },
          { numA: 6, numB: 3, answer: 9, options: [9, 10, 11] },
          { numA: 4, numB: 6, answer: 10, options: [9, 10, 11] },
          { numA: 7, numB: 4, answer: 11, options: [10, 11, 12] }
        ];
      } else if (lvl === 3) {
        return [
          { numA: 6, numB: 6, answer: 12, options: [11, 12, 13] },
          { numA: 7, numB: 6, answer: 13, options: [12, 13, 14] },
          { numA: 8, numB: 6, answer: 14, options: [13, 14, 15] },
          { numA: 9, numB: 5, answer: 14, options: [14, 15, 16] }
        ];
      } else if (lvl === 4) {
        return [
          { numA: 8, numB: 7, answer: 15, options: [14, 15, 16] },
          { numA: 9, numB: 7, answer: 16, options: [15, 16, 17] },
          { numA: 8, numB: 9, answer: 17, options: [16, 17, 18] },
          { numA: 9, numB: 9, answer: 18, options: [17, 18, 19] }
        ];
      } else {
        // Level 5
        return [
          { numA: 11, numB: 7, answer: 18, options: [17, 18, 19] },
          { numA: 12, numB: 7, answer: 19, options: [18, 19, 20] },
          { numA: 13, numB: 8, answer: 21, options: [20, 21, 22] },
          { numA: 15, numB: 7, answer: 22, options: [21, 22, 23] }
        ];
      }
    } else {
      // HARD: Missing addends, algebraic thinking, sums up to 35, 4 options, no visual aids
      if (lvl === 1) {
        return [
          { numA: 4, numB: 5, answer: 9, isMissingAddend: true, missingPosition: 'B', options: [4, 5, 6, 7] },
          { numA: 3, numB: 6, answer: 9, isMissingAddend: true, missingPosition: 'A', options: [2, 3, 4, 5] },
          { numA: 6, numB: 7, answer: 13, options: [11, 12, 13, 14] }
        ];
      } else if (lvl === 2) {
        return [
          { numA: 7, numB: 8, answer: 15, isMissingAddend: true, missingPosition: 'B', options: [6, 7, 8, 9] },
          { numA: 6, numB: 9, answer: 15, isMissingAddend: true, missingPosition: 'A', options: [5, 6, 7, 8] },
          { numA: 9, numB: 8, answer: 17, options: [15, 16, 17, 18] },
          { numA: 8, numB: 6, answer: 14, isMissingAddend: true, missingPosition: 'B', options: [5, 6, 7, 8] }
        ];
      } else if (lvl === 3) {
        return [
          { numA: 8, numB: 11, answer: 19, isMissingAddend: true, missingPosition: 'B', options: [9, 10, 11, 12] },
          { numA: 9, numB: 12, answer: 21, isMissingAddend: true, missingPosition: 'A', options: [8, 9, 10, 11] },
          { numA: 12, numB: 9, answer: 21, options: [19, 20, 21, 22] },
          { numA: 11, numB: 13, answer: 24, isMissingAddend: true, missingPosition: 'B', options: [11, 12, 13, 14] }
        ];
      } else if (lvl === 4) {
        return [
          { numA: 14, numB: 11, answer: 25, isMissingAddend: true, missingPosition: 'B', options: [9, 10, 11, 12] },
          { numA: 13, numB: 15, answer: 28, isMissingAddend: true, missingPosition: 'A', options: [12, 13, 14, 15] },
          { numA: 16, numB: 13, answer: 29, options: [27, 28, 29, 30] },
          { numA: 15, numB: 16, answer: 31, isMissingAddend: true, missingPosition: 'B', options: [14, 15, 16, 17] }
        ];
      } else {
        // Level 5
        return [
          { numA: 18, numB: 14, answer: 32, isMissingAddend: true, missingPosition: 'B', options: [12, 13, 14, 15] },
          { numA: 17, numB: 18, answer: 35, isMissingAddend: true, missingPosition: 'A', options: [15, 16, 17, 18] },
          { numA: 19, numB: 17, answer: 36, options: [34, 35, 36, 37] },
          { numA: 21, numB: 17, answer: 38, isMissingAddend: true, missingPosition: 'B', options: [15, 16, 17, 18] }
        ];
      }
    }
  };

  const [problems, setProblems] = useState<AdditionProblem[]>(() =>
    getProblemsForLevelAndDifficulty(currentLevel, difficulty)
  );

  useEffect(() => {
    setProblems(getProblemsForLevelAndDifficulty(currentLevel, difficulty));
    setProblemIndex(0);
    setSelectedAnswer(null);
  }, [currentLevel, difficulty]);

  const currentProblem = problems[problemIndex] || problems[0];

  // Check answer logic
  const handleAnswerSubmit = (candidate: number) => {
    const isCorrect = candidate === (currentProblem.isMissingAddend
      ? (currentProblem.missingPosition === 'B' ? currentProblem.numB : currentProblem.numA)
      : currentProblem.answer);

    if (isCorrect) {
      soundEngine.playSnap();
      setDinoEmotion('cheering');
      setScore(prev => prev + 100);

      // Advance or complete level
      if (problemIndex < problems.length - 1) {
        setTimeout(() => {
          setProblemIndex(prev => prev + 1);
          setDinoEmotion('thinking');
          setSelectedAnswer(null);
        }, 800);
      } else {
        // Round Complete!
        setTimeout(() => {
          const finalMistakes = mistakes;
          let calculatedStars = 3;
          if (finalMistakes === 1) calculatedStars = 2;
          else if (finalMistakes > 1) calculatedStars = 1;

          setStars(calculatedStars);
          setGameState('LEVEL_COMPLETE');
          soundEngine.playVictory();

          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}

          const timeSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
          storageService.recordGameResult(
            activeProfileId,
            'game_dino_addition',
            'world_math',
            calculatedStars,
            score + 100,
            timeSec,
            true
          );

          const stickers = storageService.getUnlockedStickers(activeProfileId);
          if (stickers.length > 0) {
            setEarnedSticker(stickers[stickers.length - 1]);
          }
        }, 700);
      }
    } else {
      soundEngine.playOops();
      setDinoEmotion('oops');
      setMistakes(prev => prev + 1);
      setTimeout(() => setDinoEmotion('thinking'), 1200);
    }
  };

  const handleEggDrop = (val: number) => {
    setSelectedAnswer(val);
    handleAnswerSubmit(val);
  };

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] bg-gradient-to-b from-sky-400 via-emerald-300 to-green-600 rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-emerald-400 shadow-2xl">
      {/* Top Header / Status Bar */}
      <div className="flex items-center justify-between z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {!isDemoMode && onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-emerald-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-emerald-300 active:scale-95 transition flex items-center gap-1.5"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
              <span className="hidden sm:inline">Levels</span>
            </button>
          )}

          {/* Direct Home Map Button */}
          {!isDemoMode && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onHome();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-emerald-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-emerald-300 active:scale-95 transition flex items-center gap-1.5"
              title="Return to World Map"
            >
              <Home className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Map</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPaused(true);
              setGameState('PAUSED');
            }}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-emerald-800 rounded-2xl shadow-md active:scale-95 border-2 border-emerald-200 transition"
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
                {ageGroup === '3-4' ? 'Counting 1-5' : ageGroup === '5-7' ? 'Sum Builder' : 'Equation Lab'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-fun drop-shadow-md">
              Dino Addition #{problemIndex + 1}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Difficulty Tier Selector (Easy / Medium / Hard) */}
          <div className="flex bg-black/20 p-1 rounded-2xl border border-white/20 backdrop-blur-sm">
            {(['EASY', 'MEDIUM', 'HARD'] as DifficultyLevel[]).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  soundEngine.playPop();
                  setDifficulty(tier);
                }}
                className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black font-fun transition active:scale-95 ${
                  difficulty === tier
                    ? tier === 'EASY'
                      ? 'bg-emerald-400 text-emerald-950 shadow-sm'
                      : tier === 'MEDIUM'
                      ? 'bg-amber-400 text-amber-950 shadow-sm'
                      : 'bg-rose-500 text-white shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {tier === 'EASY' ? '🌱 Easy' : tier === 'MEDIUM' ? '⚡ Med' : '🔥 Hard'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white/90 px-3 py-1.5 rounded-2xl border-2 border-emerald-200 shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-base sm:text-lg font-black text-slate-800 font-fun">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center my-2 sm:my-3 z-10">
        {/* Animated Cute Dinosaur Avatar */}
        <div className="relative mb-1 sm:mb-2 flex items-center justify-center">
          <motion.div
            animate={{
              y: dinoEmotion === 'cheering' ? [-8, 0, -8] : [0, -3, 0],
              rotate: dinoEmotion === 'oops' ? [-3, 3, -3] : 0
            }}
            transition={{ repeat: Infinity, duration: dinoEmotion === 'cheering' ? 0.4 : 2 }}
            className="w-24 h-24 sm:w-36 sm:h-36 relative"
          >
            {/* SVG Dinosaur illustration */}
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
              {/* Tail */}
              <path d="M 40 130 C 20 120 15 80 10 70 C 25 85 45 110 60 120 Z" fill="#10B981" />
              {/* Body */}
              <ellipse cx="100" cy="120" rx="55" ry="45" fill="#10B981" />
              {/* Belly patch */}
              <ellipse cx="110" cy="130" rx="35" ry="28" fill="#A7F3D0" />
              {/* Head */}
              <circle cx="145" cy="80" r="35" fill="#10B981" />
              {/* Snout */}
              <ellipse cx="170" cy="85" rx="20" ry="16" fill="#10B981" />
              {/* Cute Eyes */}
              <circle cx="150" cy="72" r="7" fill="white" />
              <circle cx="152" cy="72" r="4" fill="#1E293B" />
              <circle cx="154" cy="70" r="1.5" fill="white" />
              {/* Cheeks */}
              <ellipse cx="160" cy="88" rx="6" ry="4" fill="#F472B6" opacity="0.7" />
              {/* Mouth based on emotion */}
              {dinoEmotion === 'cheering' ? (
                <path d="M 160 92 Q 172 105 180 92" stroke="#064E3B" strokeWidth="3" fill="#DC2626" />
              ) : dinoEmotion === 'oops' ? (
                <path d="M 162 98 Q 172 90 178 98" stroke="#064E3B" strokeWidth="3" fill="none" />
              ) : (
                <path d="M 162 92 Q 172 100 180 92" stroke="#064E3B" strokeWidth="3" fill="none" />
              )}
              {/* Spikes on back */}
              <polygon points="75,80 85,65 95,80" fill="#F59E0B" />
              <polygon points="98,80 108,65 118,80" fill="#F59E0B" />
              <polygon points="120,80 130,68 140,82" fill="#F59E0B" />
              {/* Cute Feet */}
              <rect x="75" y="155" width="18" height="20" rx="8" fill="#059669" />
              <rect x="110" y="155" width="18" height="20" rx="8" fill="#059669" />
            </svg>

            {/* Speech bubble */}
            <div className="absolute -top-4 -right-16 bg-white px-3 py-1.5 rounded-2xl shadow-lg border-2 border-emerald-300 text-xs font-extrabold text-emerald-950 font-fun">
              {dinoEmotion === 'cheering' ? 'Yummy! Nom nom! 😋' : dinoEmotion === 'oops' ? 'Try again, friend!' : 'Feed me the sum! 🥚'}
            </div>
          </motion.div>
        </div>

        {/* The Equation Visual Card */}
        <div className="w-full max-w-xl bg-white/95 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-300 flex flex-col items-center">
          {/* Equation Header */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 text-2xl sm:text-4xl font-black text-slate-800 font-fun mb-3">
            {/* Num A */}
            <div className="flex flex-col items-center">
              <span className="p-3 bg-blue-100 border-2 border-blue-300 rounded-2xl shadow-inner text-blue-900 min-w-12 text-center">
                {currentProblem.isMissingAddend && currentProblem.missingPosition === 'A' ? '?' : currentProblem.numA}
              </span>
              {/* Visual Counting dots for Easy & Medium */}
              {difficulty !== 'HARD' && (
                <div className="flex gap-1 mt-1.5 flex-wrap justify-center max-w-28">
                  {Array.from({ length: currentProblem.numA }).map((_, i) => (
                    <span key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 shadow-sm inline-block" />
                  ))}
                </div>
              )}
            </div>

            <span className="text-amber-600 font-black">+</span>

            {/* Num B */}
            <div className="flex flex-col items-center">
              <span className="p-3 bg-emerald-100 border-2 border-emerald-300 rounded-2xl shadow-inner text-emerald-900 min-w-12 text-center">
                {currentProblem.isMissingAddend && currentProblem.missingPosition === 'B' ? '?' : currentProblem.numB}
              </span>
              {difficulty !== 'HARD' && (
                <div className="flex gap-1 mt-1.5 flex-wrap justify-center max-w-28">
                  {Array.from({ length: currentProblem.numB }).map((_, i) => (
                    <span key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shadow-sm inline-block" />
                  ))}
                </div>
              )}
            </div>

            <span className="text-amber-600 font-black">=</span>

            {/* Target Drop Nest / Slot */}
            <div
              ref={nestRef}
              className={`p-3 min-w-16 h-16 rounded-2xl border-4 border-dashed flex items-center justify-center transition-all ${
                selectedAnswer !== null
                  ? 'bg-amber-300 border-amber-500 text-amber-950 scale-105'
                  : 'bg-amber-50 border-amber-400 text-amber-600 animate-pulse'
              }`}
            >
              {selectedAnswer !== null ? selectedAnswer : (
                <span className="text-xs uppercase font-bold text-amber-600">
                  {difficulty === 'EASY' && showHint ? `Drop ${currentProblem.answer}` : 'Drop Egg'}
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 font-bold mb-4 font-body">
            {difficulty === 'EASY'
              ? 'Count the colorful dots and tap the correct dino egg!'
              : currentProblem.isMissingAddend
              ? 'Algebraic challenge! Find the missing number to solve the equation!'
              : 'Add the two numbers together and tap or drag the egg!'}
          </p>

          {/* Draggable/Selectable Dino Egg Options (+20dp touch padding) */}
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {currentProblem.options.map((val) => (
              <motion.button
                key={val}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  soundEngine.playPop();
                  handleEggDrop(val);
                }}
                className="relative group p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-amber-100 to-yellow-200 border-4 border-amber-400 shadow-lg active:shadow-sm cursor-pointer flex flex-col items-center justify-center min-w-16 sm:min-w-20 transition"
              >
                {/* Dino Egg graphic */}
                <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-[50%/60%_60%_40%_40%] bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-amber-500 flex items-center justify-center shadow-md relative overflow-hidden">
                  {/* Egg speckles */}
                  <div className="absolute top-2 left-3 w-2 h-2 rounded-full bg-amber-600/40" />
                  <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-amber-600/40" />
                  <span className="text-2xl sm:text-3xl font-black font-fun text-amber-950 drop-shadow">
                    {val}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-900 mt-1 uppercase tracking-wider">Tap / Feed</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Hint & Info Bar */}
      <div className="flex items-center justify-between text-white/90 text-xs font-bold z-10 px-2">
        <button
          onClick={() => {
            soundEngine.playPop();
            setShowHint(prev => !prev);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
        </button>

        {showHint && (
          <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full animate-kid-wiggle shadow-sm font-fun">
            💡 Hint: Count all the dots starting from 1!
          </span>
        )}

        <span>Progress: {problemIndex + 1} / {problems.length}</span>
      </div>

      {/* Universal Win Modal */}
      <WinModal
        isOpen={gameState === 'LEVEL_COMPLETE'}
        stars={stars}
        score={score}
        timeSpentSeconds={Math.max(1, Math.round((Date.now() - startTime) / 1000))}
        stickerEarned={earnedSticker}
        currentLevel={currentLevel}
        gameTitle="Dino Addition 🦖"
        worldName="Math Valley"
        onRestart={() => {
          setGameState('PLAYING');
          setProblemIndex(0);
          setScore(0);
          setMistakes(0);
          setSelectedAnswer(null);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setGameState('PLAYING');
            setScore(prev => prev + 100);
            setMistakes(0);
          } else {
            onNextGame();
          }
        }}
        onHome={onHome}
        onBackToWorld={onBackToWorld}
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
          setProblemIndex(0);
          setScore(0);
          setMistakes(0);
          setSelectedAnswer(null);
        }}
        onHome={onHome}
        onBackToWorld={onBackToWorld ? () => {
          setIsPaused(false);
          onBackToWorld();
        } : undefined}
      />
    </div>
  );
};
