/**
 * Mini-Game: Color & Shadow Match (World 5: Logic, Brain & Creativity - Game #41)
 * Match colorful objects to their exact silhouette shadows.
 *
 * Age Dynamic Difficulty:
 * - Easy (3–4): 3 shapes, prominent ghost outlines, extra snap padding.
 * - Medium (5–7): 4 shapes, subtle shadow rotation.
 * - Hard (8–10): 5 complex shapes, fast visual discrimination challenge.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Sparkles, HelpCircle, Check, Home } from 'lucide-react';
import { AgeGroup, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface ColorShadowMatchProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  onHome: () => void;
  onNextGame: () => void;
}

interface ShadowItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const LEVEL_SHADOW_ITEMS: Record<number, ShadowItem[]> = {
  1: [
    { id: 'rocket', name: 'Rocket', icon: '🚀', color: '#EF4444' },
    { id: 'butterfly', name: 'Butterfly', icon: '🦋', color: '#8B5CF6' },
    { id: 'boat', name: 'Sailboat', icon: '⛵', color: '#3B82F6' },
  ],
  2: [
    { id: 'rocket', name: 'Rocket', icon: '🚀', color: '#EF4444' },
    { id: 'butterfly', name: 'Butterfly', icon: '🦋', color: '#8B5CF6' },
    { id: 'guitar', name: 'Guitar', icon: '🎸', color: '#F59E0B' },
    { id: 'boat', name: 'Sailboat', icon: '⛵', color: '#3B82F6' },
  ],
  3: [
    { id: 'rocket', name: 'Rocket', icon: '🚀', color: '#EF4444' },
    { id: 'butterfly', name: 'Butterfly', icon: '🦋', color: '#8B5CF6' },
    { id: 'guitar', name: 'Guitar', icon: '🎸', color: '#F59E0B' },
    { id: 'boat', name: 'Sailboat', icon: '⛵', color: '#3B82F6' },
    { id: 'crown', name: 'Royal Crown', icon: '👑', color: '#EAB308' },
  ],
  4: [
    { id: 'rocket', name: 'Rocket', icon: '🚀', color: '#EF4444' },
    { id: 'guitar', name: 'Guitar', icon: '🎸', color: '#F59E0B' },
    { id: 'crown', name: 'Royal Crown', icon: '👑', color: '#EAB308' },
    { id: 'bicycle', name: 'Bicycle', icon: '🚲', color: '#10B981' },
    { id: 'airplane', name: 'Airplane', icon: '✈️', color: '#6366F1' },
    { id: 'flower', name: 'Flower', icon: '🌸', color: '#EC4899' },
  ],
  5: [
    { id: 'astronaut', name: 'Astronaut', icon: '🧑‍🚀', color: '#3B82F6' },
    { id: 'volcano', name: 'Volcano', icon: '🌋', color: '#EF4444' },
    { id: 'trophy', name: 'Trophy', icon: '🏆', color: '#F59E0B' },
    { id: 'rainbow', name: 'Rainbow', icon: '🌈', color: '#8B5CF6' },
    { id: 'robot', name: 'Robot', icon: '🤖', color: '#10B981' },
    { id: 'castle', name: 'Castle', icon: '🏰', color: '#D946EF' },
  ]
};

export const ColorShadowMatch: React.FC<ColorShadowMatchProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onNextGame
}) => {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | 4 | 5>(initialLevel);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);

  const targetItems = LEVEL_SHADOW_ITEMS[currentLevel] || LEVEL_SHADOW_ITEMS[1];

  const [placedItemIds, setPlacedItemIds] = useState<string[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const unplacedItems = targetItems.filter(item => !placedItemIds.includes(item.id));

  const handleShadowSlotClick = (item: ShadowItem) => {
    if (placedItemIds.includes(item.id)) return;
    if (!selectedItemId) return;

    if (selectedItemId === item.id) {
      soundEngine.playSnap();
      const updated = [...placedItemIds, item.id];
      setPlacedItemIds(updated);
      setSelectedItemId(null);
      setScore(prev => prev + 100);

      if (updated.length === targetItems.length) {
        setTimeout(() => {
          let calculatedStars = 3;
          if (mistakes === 1) calculatedStars = 2;
          else if (mistakes > 1) calculatedStars = 1;

          setStars(calculatedStars);
          setGameState('LEVEL_COMPLETE');
          soundEngine.playVictory();

          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {}

          const timeSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
          storageService.recordGameResult(
            activeProfileId,
            'game_color_shadow_match',
            'world_logic',
            calculatedStars,
            score + 150,
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
      setMistakes(prev => prev + 1);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] bg-gradient-to-b from-purple-800 via-indigo-700 to-fuchsia-900 rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-purple-400 shadow-2xl">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Home Map Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-purple-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-purple-300 active:scale-95 transition flex items-center gap-1.5"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-purple-600" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPaused(true);
              setGameState('PAUSED');
            }}
            className="p-2 sm:p-3 bg-white/90 hover:bg-white text-purple-950 rounded-2xl shadow-md active:scale-95 border-2 border-purple-300 transition"
          >
            <Pause className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full shadow-sm">
                Level {currentLevel} of 5
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-white bg-black/20 px-2 py-0.5 rounded-full">
                Matched: {placedItemIds.length} / {targetItems.length}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-fun drop-shadow-md">
              Color & Shadow Match
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-purple-300 shadow-md">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span className="text-base sm:text-lg font-black text-slate-800 font-fun">{score} pts</span>
        </div>
      </div>

      {/* Main Shadow Matching Canvas */}
      <div className="flex-1 flex flex-col items-center justify-center my-2 sm:my-3 z-10">
        <div className="text-xs sm:text-sm font-bold text-white/90 mb-3 font-fun text-center drop-shadow">
          {selectedItemId
            ? '👉 Now tap the black shadow silhouette that matches your item!'
            : 'Tap a colorful item below, then match it to its silhouette!'}
        </div>

        {/* Silhouette Shadow Target Cards */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap max-w-xl">
          {targetItems.map(item => {
            const isPlaced = placedItemIds.includes(item.id);
            const isTargeted = selectedItemId === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleShadowSlotClick(item)}
                className={`w-20 h-24 sm:w-24 sm:h-28 rounded-3xl border-3 flex flex-col items-center justify-center p-2 transition-all shadow-xl cursor-pointer ${
                  isPlaced
                    ? 'bg-white/95 border-emerald-400 scale-105 shadow-emerald-400/30'
                    : isTargeted
                    ? 'border-dashed border-amber-300 bg-amber-400/20 scale-110 animate-pulse'
                    : 'bg-black/60 border-dashed border-purple-300/60 hover:bg-black/80'
                }`}
              >
                {isPlaced ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl drop-shadow">{item.icon}</span>
                    <span className="text-[10px] font-black font-fun text-slate-800 mt-1">{item.name}</span>
                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Matched
                    </span>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Dark silhouette using CSS brightness-0 */}
                    <span className="text-4xl sm:text-5xl filter brightness-0 opacity-80">
                      {item.icon}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-purple-200/60 font-fun mt-1">
                      Shadow
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Drawer of Colorful Items */}
        <div className="mt-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 border-2 border-purple-300 shadow-xl flex items-center justify-center gap-3 flex-wrap">
          {unplacedItems.map(item => {
            const isSelected = selectedItemId === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedItemId(item.id);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border-3 flex flex-col items-center justify-center min-w-16 shadow-md transition cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 bg-amber-100 border-amber-500 scale-105'
                    : 'bg-white border-slate-300 hover:border-purple-400'
                }`}
              >
                <span className="text-3xl sm:text-4xl drop-shadow">{item.icon}</span>
                <span className="text-[10px] font-black font-fun text-slate-800 mt-0.5">{item.name}</span>
              </motion.button>
            );
          })}

          {unplacedItems.length === 0 && (
            <div className="text-xs font-bold text-emerald-700 py-1 flex items-center gap-1.5 font-fun">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>All Shadows Solved! Great Spatial Logic!</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between text-white text-xs font-bold z-10 px-2">
        <span className="bg-black/20 px-3 py-1 rounded-full">
          Mistakes: {mistakes}
        </span>
        <span className="bg-white/20 px-3 py-1 rounded-full">
          Spatial & Visual Discrimination
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
          setPlacedItemIds([]);
          setSelectedItemId(null);
          setScore(0);
          setMistakes(0);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => (prev + 1) as 1 | 2 | 3 | 4 | 5);
            setGameState('PLAYING');
            setPlacedItemIds([]);
            setSelectedItemId(null);
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
          setPlacedItemIds([]);
          setSelectedItemId(null);
          setScore(0);
          setMistakes(0);
        }}
        onHome={onHome}
      />
    </div>
  );
};
