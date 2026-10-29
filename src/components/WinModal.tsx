/**
 * Universal Win Modal
 * Displays 1 to 3 stars with bouncy animations, earned stickers,
 * celebration audio, and large touch-friendly Next Level, Restart, and Home buttons.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, RotateCcw, ArrowRight, Home, Award } from 'lucide-react';
import { Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface WinModalProps {
  isOpen: boolean;
  stars: number; // 1 to 3
  score: number;
  timeSpentSeconds: number;
  stickerEarned?: Sticker | null;
  onRestart: () => void;
  onNextLevel: () => void;
  onHome: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  stars,
  score,
  timeSpentSeconds,
  stickerEarned,
  onRestart,
  onNextLevel,
  onHome
}) => {
  useEffect(() => {
    if (isOpen) {
      // Play sequential star sound effects
      const timers: NodeJS.Timeout[] = [];
      for (let i = 0; i < stars; i++) {
        timers.push(
          setTimeout(() => {
            soundEngine.playStar(i);
          }, 350 + i * 280)
        );
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, stars]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 260 }}
          className="relative w-full max-w-md bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center select-none"
        >
          {/* Header Badge */}
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full text-amber-950 font-bold text-lg sm:text-xl shadow-md -mt-10 mb-4 border-2 border-white">
            🎉 FANTASTIC JOB! 🎉
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-900 tracking-wide mb-1 font-fun">
            {stars === 3 ? 'SUPER STAR CHAMPION!' : stars === 2 ? 'GREAT WORK!' : 'GOOD EFFORT!'}
          </h2>
          <p className="text-amber-800/80 font-medium text-sm sm:text-base mb-6 font-body">
            You solved the challenge with flying colors!
          </p>

          {/* Stars Display (1 to 3 Animated Stars) */}
          <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6">
            {[1, 2, 3].map((starNumber, index) => {
              const isEarned = index < stars;
              return (
                <motion.div
                  key={starNumber}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{
                    scale: isEarned ? 1 : 0.85,
                    rotate: isEarned ? 0 : 0
                  }}
                  transition={{
                    delay: 0.3 + index * 0.25,
                    type: 'spring',
                    stiffness: 400,
                    damping: 12
                  }}
                  className="relative"
                >
                  <div
                    className={`p-3 sm:p-4 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                      isEarned
                        ? 'bg-gradient-to-tr from-yellow-400 to-amber-300 text-white ring-4 ring-yellow-200 shadow-yellow-400/50'
                        : 'bg-amber-200/50 text-amber-300'
                    }`}
                  >
                    <Star
                      className={`w-10 h-10 sm:w-14 sm:h-14 ${
                        isEarned ? 'fill-yellow-300 drop-shadow-md text-amber-600' : 'fill-amber-200 text-amber-300'
                      }`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* New Sticker Earned Banner */}
          {stickerEarned && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-6 p-3 bg-white/90 rounded-2xl border-2 border-amber-300 flex items-center justify-center gap-3 shadow-sm"
            >
              <span className="text-3xl animate-kid-bounce">{stickerEarned.icon}</span>
              <div className="text-left">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">New Sticker Unlocked!</span>
                <span className="text-sm font-extrabold text-amber-950">{stickerEarned.name}</span>
              </div>
            </motion.div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-white/60 p-3 rounded-2xl border border-amber-200 text-xs sm:text-sm font-semibold text-amber-900">
            <div>Score: <span className="text-amber-600 font-bold">{score} pts</span></div>
            <div>Time: <span className="text-amber-600 font-bold">{timeSpentSeconds}s</span></div>
          </div>

          {/* Action Buttons: Home, Restart, Next Level */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => {
                soundEngine.playPop();
                onHome();
              }}
              title="Home Map"
              className="p-3 sm:p-4 rounded-2xl bg-white text-slate-700 hover:bg-slate-100 active:scale-95 border-2 border-amber-200 shadow-md font-bold transition flex items-center justify-center"
            >
              <Home className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700" />
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onRestart();
              }}
              title="Play Again"
              className="p-3 sm:p-4 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-900 border-2 border-amber-300 shadow-md font-bold transition flex items-center justify-center"
            >
              <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onNextLevel();
              }}
              className="flex-1 py-3 sm:py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 text-white font-fun font-bold text-base sm:text-lg border-2 border-emerald-300 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
            >
              <span>Next Game</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
