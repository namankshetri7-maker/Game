import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageCircle, Volume2, X, ChevronUp, Star, Heart } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface WonderBunnyCompanionProps {
  currentView?: 'world_map' | 'world_detail' | 'game';
  childName?: string;
  gameTitle?: string;
}

// Contextual encouraging messages tailored for kids
const MESSAGES_BY_VIEW: Record<string, string[]> = {
  world_map: [
    "Hi there! Tap any colorful island to start our learning adventure! 🏝️",
    "You're doing super great! Which island should we visit today? 🚀",
    "Collect stars across all 5 magical worlds! ⭐",
    "Tap the Parent Gate top-right anytime for progress reports! 🛡️"
  ],
  world_detail: [
    "Pick Level 1 for a guided start, or try Level 5 for Champion stars! 👑",
    "Each level earns you stickers for your Sticker Book! 📕✨",
    "Tap the Home Map button anytime to switch islands! 🗺️"
  ],
  game: [
    "You've got this! Take your time and look closely! ⭐",
    "Awesome effort! Every try makes your brain stronger! 🧠💪",
    "Need a clue? Check the hint button or tap me! 💡",
    "Super job! Keep up the amazing work! 🎉"
  ]
};

export const WonderBunnyCompanion: React.FC<WonderBunnyCompanionProps> = ({
  currentView = 'world_map',
  childName = 'Explorer',
  gameTitle
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isHopping, setIsHopping] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const messages = MESSAGES_BY_VIEW[currentView] || MESSAGES_BY_VIEW.world_map;
  const currentMessage = messages[messageIndex % messages.length];

  // Rotate message periodically or when view changes
  useEffect(() => {
    setMessageIndex(0);
  }, [currentView, gameTitle]);

  const handleBunnyClick = () => {
    soundEngine.playPop();
    setIsHopping(true);
    setShowHeart(true);
    setMessageIndex(prev => prev + 1);

    // Play a friendly synthesized pitch sequence
    soundEngine.playStar(1);

    setTimeout(() => setIsHopping(false), 500);
    setTimeout(() => setShowHeart(false), 1200);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end select-none pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end gap-1 max-w-[260px] sm:max-w-xs">
        
        {/* Animated Speech Bubble */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              key={`${currentView}_${messageIndex}`}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="relative p-3 rounded-2xl bg-white/95 backdrop-blur-md border-3 border-amber-300 shadow-2xl text-slate-900 text-xs sm:text-sm font-bold font-fun flex flex-col gap-1 ring-4 ring-pink-400/20"
            >
              {/* Close / Minimize speech bubble */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playPop();
                  setIsOpen(false);
                }}
                className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-rose-600 transition shadow-md"
                title="Minimize speech bubble"
              >
                <X className="w-3 h-3 stroke-[3]" />
              </button>

              <div className="flex items-center gap-1.5 text-pink-600 font-black text-[11px] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                <span>Wonder Bunny Guide</span>
              </div>

              <p className="text-slate-800 leading-snug">
                {currentMessage.replace('Explorer', childName)}
              </p>

              {/* Speech Bubble Arrow pointing down-right to Bunny */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r-3 border-b-3 border-amber-300 transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Heart Particle Effect */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -40, scale: 1.4 }}
              exit={{ opacity: 0 }}
              className="absolute -top-8 right-6 text-2xl text-pink-500 pointer-events-none drop-shadow-md"
            >
              💖
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wonder Bunny Mascot Button */}
        <motion.button
          onClick={handleBunnyClick}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          animate={isHopping ? { y: [-8, 0, -5, 0] } : { y: [0, -4, 0] }}
          transition={isHopping ? { duration: 0.4 } : { repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-yellow-300 p-0.5 shadow-2xl ring-4 ring-white/80 cursor-pointer group flex items-center justify-center active:scale-95 transition-transform"
          title="Tap Wonder Bunny for encouragement & tips!"
        >
          {/* Bunny Inner Badge */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-100 to-pink-100 flex items-center justify-center relative overflow-hidden border-2 border-white shadow-inner">
            
            {/* Vector SVG Wonder Bunny Character */}
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 overflow-visible drop-shadow-md">
              {/* Bunny Ears */}
              <path d="M 32,38 C 22,12 30,2 40,18 C 42,28 38,38 34,44 Z" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />
              <path d="M 34,32 C 28,15 32,8 38,20 Z" fill="#FCE7F3" />

              <path d="M 68,38 C 78,12 70,2 60,18 C 58,28 62,38 66,44 Z" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />
              <path d="M 66,32 C 72,15 68,8 62,20 Z" fill="#FCE7F3" />

              {/* Head Base */}
              <circle cx="50" cy="55" r="32" fill="#FFFFFF" stroke="#F472B6" strokeWidth="3" />

              {/* Rosy Cheeks */}
              <circle cx="32" cy="62" r="5" fill="#F472B6" opacity="0.6" />
              <circle cx="68" cy="62" r="5" fill="#F472B6" opacity="0.6" />

              {/* Eyes with Star Sparkles */}
              <circle cx="38" cy="52" r="4.5" fill="#1E293B" />
              <circle cx="40" cy="50" r="1.8" fill="#FFFFFF" />

              <circle cx="62" cy="52" r="4.5" fill="#1E293B" />
              <circle cx="64" cy="50" r="1.8" fill="#FFFFFF" />

              {/* Cute Nose & Mouth */}
              <polygon points="50,58 46,62 54,62" fill="#F472B6" />
              <path d="M 46,65 Q 50,68 54,65" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />

              {/* Golden Bow Tie */}
              <path d="M 42,82 L 50,86 L 42,90 Z" fill="#F59E0B" />
              <path d="M 58,82 L 50,86 L 58,90 Z" fill="#F59E0B" />
              <circle cx="50" cy="86" r="3" fill="#FDE047" />
            </svg>

            {/* Tap Me Hint Ping Indicator */}
            {!isOpen && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-pink-500 rounded-full border-2 border-white animate-ping" />
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
};
