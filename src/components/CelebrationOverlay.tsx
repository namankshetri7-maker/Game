/**
 * Clean & Fun Visual Celebration Overlay
 * Triggers when a child completes a mini-game or levels up.
 *
 * Designed to be rewarding, joyful, and clean without overwhelming emoji clutter.
 * Uses crisp vector stars, smooth CSS animations, and clear next-action controls.
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, RotateCcw, ArrowRight, Home, CheckCircle2, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';

export interface CelebrationOverlayProps {
  isOpen: boolean;
  stars: number; // 1 to 3
  score: number;
  timeSpentSeconds: number;
  stickerEarned?: Sticker | null;
  currentLevel?: number; // 1 to 5
  gameTitle?: string;
  worldName?: string;
  onRestart: () => void;
  onNextLevel: () => void;
  onHome: () => void;
  onBackToWorld?: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isOpen,
  stars,
  score,
  timeSpentSeconds,
  stickerEarned,
  currentLevel = 1,
  gameTitle,
  worldName,
  onRestart,
  onNextLevel,
  onHome,
  onBackToWorld
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [activeStarCount, setActiveStarCount] = useState(0);

  const isLevelUp = currentLevel < 5;
  const nextLevel = Math.min(5, currentLevel + 1);

  useEffect(() => {
    if (!isOpen) {
      setAnimatedScore(0);
      setActiveStarCount(0);
      return;
    }

    // Play celebratory audio chime
    soundEngine.playLevelUpFanfare();

    // Trigger one crisp, tasteful confetti burst
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#EC4899']
      });
    } catch {
      // Confetti fallback
    }

    // Sequential star reveal
    const starTimers: NodeJS.Timeout[] = [];
    for (let i = 0; i < stars; i++) {
      starTimers.push(
        setTimeout(() => {
          setActiveStarCount(i + 1);
          soundEngine.playStar(i);
        }, 350 + i * 280)
      );
    }

    // Score tally roll-up animation
    const scoreStartTime = 350 + stars * 280 + 100;
    const scoreTimer = setTimeout(() => {
      const duration = 600; // ms
      const steps = 15;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const tallyInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const currentVal = Math.round(score * (1 - Math.pow(1 - progress, 2)));
        setAnimatedScore(currentVal);
        soundEngine.playCountTick();

        if (currentStep >= steps) {
          clearInterval(tallyInterval);
          setAnimatedScore(score);
          soundEngine.playCoin();
        }
      }, stepDuration);
    }, scoreStartTime);

    return () => {
      starTimers.forEach(clearTimeout);
      clearTimeout(scoreTimer);
    };
  }, [isOpen, stars, score]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm select-none font-body">
        {/* Soft Ambient Radial Glow (Clean, not distracting) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-96 h-96 rounded-full bg-amber-400/20 blur-3xl" />

        {/* Main Celebration Dialog */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-3xl p-4 sm:p-7 shadow-2xl border-4 border-amber-300 text-center z-10"
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full text-amber-950 font-black font-fun text-sm sm:text-base shadow-sm -mt-3 mb-3 border-2 border-white">
            <CheckCircle2 className="w-4 h-4 text-amber-950" />
            <span>{isLevelUp ? `Level ${currentLevel} Complete!` : 'All Levels Complete!'}</span>
          </div>

          {/* Level Transition Indicator */}
          {isLevelUp && (
            <div className="flex items-center justify-center gap-2 mb-2 text-xs font-fun font-bold">
              <span className="text-slate-500">Level {currentLevel}</span>
              <span className="text-amber-500">→</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Level {nextLevel} Unlocked
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-fun tracking-wide mb-1">
            {stars === 3
              ? 'Super Star Champion!'
              : stars === 2
              ? 'Great Work!'
              : 'Good Effort!'}
          </h2>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm mb-5">
            {gameTitle || 'Challenge Solved!'}
          </p>

          {/* Clean Vector Stars Display */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-5 py-2">
            {[1, 2, 3].map((starNum) => {
              const isEarned = starNum <= activeStarCount;
              return (
                <motion.div
                  key={starNum}
                  initial={{ scale: 0 }}
                  animate={{ scale: isEarned ? 1 : 0.85 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 14 }}
                  className="relative"
                >
                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl flex items-center justify-center transition-all ${
                      isEarned
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-white ring-4 ring-yellow-200 shadow-md shadow-yellow-400/40'
                        : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    <Star
                      className={`w-9 h-9 sm:w-11 sm:h-11 ${
                        isEarned
                          ? 'fill-white text-white drop-shadow-sm'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Unlocked Sticker (clean showcase if earned) */}
          {stickerEarned && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center gap-2.5 text-xs font-bold text-amber-900"
            >
              <span className="text-2xl">{stickerEarned.icon}</span>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">Sticker Unlocked</span>
                <span>{stickerEarned.name}</span>
              </div>
            </motion.div>
          )}

          {/* Clean Stats Bar */}
          <div className="grid grid-cols-2 gap-2 mb-5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-600">
            <div>
              Score: <span className="text-indigo-600 font-bold font-fun text-sm">{animatedScore} pts</span>
            </div>
            <div>
              Time: <span className="text-slate-800 font-bold font-fun text-sm">{timeSpentSeconds}s</span>
            </div>
          </div>

          {/* Action Buttons: Clean, Touch-Friendly, Accessible */}
          <div className="flex items-center justify-center gap-2.5">
            {/* Return to Level Hub / Island */}
            <button
              onClick={() => {
                soundEngine.playPop();
                if (onBackToWorld) {
                  onBackToWorld();
                } else {
                  onHome();
                }
              }}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-fun font-bold text-xs transition flex items-center justify-center gap-1 border border-slate-200 shrink-0"
              title="Return to Island Level Hub"
            >
              <Home className="w-5 h-5 text-slate-600" />
              <span className="hidden sm:inline">Levels</span>
            </button>

            {/* Replay */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onRestart();
              }}
              className="p-3 rounded-2xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-fun font-bold text-xs transition flex items-center justify-center gap-1 border border-amber-200 shrink-0"
              title="Play level again"
            >
              <RotateCcw className="w-5 h-5 text-amber-800" />
              <span className="hidden sm:inline">Replay</span>
            </button>

            {/* Next Level / Next Game */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onNextLevel();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 text-white font-fun font-bold text-sm sm:text-base shadow-md shadow-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center gap-2 transition"
            >
              <span>{isLevelUp ? `Play Level ${nextLevel}` : 'Next Game'}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
