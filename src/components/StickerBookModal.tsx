/**
 * Sticker Book & Reward Trophy Room
 * 100% offline sticker canvas where kids can admire and position their earned stickers.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Award, Sparkles, RotateCcw } from 'lucide-react';
import { storageService, INITIAL_STICKERS } from '../services/storageService';
import { soundEngine } from '../services/soundEngine';
import { Sticker } from '../types/game';

interface StickerBookModalProps {
  isOpen: boolean;
  activeProfileId: string;
  onClose: () => void;
}

interface PlacedSticker {
  id: string;
  sticker: Sticker;
  xPercent: number;
  yPercent: number;
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  activeProfileId,
  onClose
}) => {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [placedStickers, setPlacedStickers] = useState<PlacedSticker[]>([]);

  if (!isOpen) return null;

  const unlocked = storageService.getUnlockedStickers(activeProfileId);
  const profile = storageService.getActiveProfile() || {
    id: activeProfileId,
    name: 'Explorer',
    age: 5,
    ageGroup: '5-7' as const,
    avatar: '🦁',
    createdAt: Date.now(),
    dailyTimeLimitMinutes: 45,
    todayPlayTimeSeconds: 0,
    totalPlayTimeSeconds: 0
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    soundEngine.playSnap();
    setPlacedStickers(prev => [
      ...prev,
      {
        id: `placed_${Date.now()}_${Math.random()}`,
        sticker: selectedSticker,
        xPercent: Math.max(5, Math.min(92, x)),
        yPercent: Math.max(5, Math.min(88, y))
      }
    ]);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md select-none overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-amber-400 text-amber-950 px-6 py-4 flex items-center justify-between border-b-2 border-amber-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📒</span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black font-fun">
                  {profile.name}'s Adventure Sticker Album
                </h2>
                <p className="text-xs font-bold text-amber-900 font-body">
                  {unlocked.length} of {INITIAL_STICKERS.length} Stickers Collected • Tap album to stick!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="p-2 rounded-xl bg-amber-300 hover:bg-amber-200 text-amber-950 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Interactive Scrapbook Canvas */}
          <div
            onClick={handleCanvasClick}
            className="relative flex-1 min-h-[340px] m-4 bg-gradient-to-tr from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border-4 border-dashed border-amber-300 shadow-inner overflow-hidden cursor-crosshair flex flex-col justify-between p-4"
          >
            {/* Scrapbook Header Stamp */}
            <div className="flex justify-between items-start pointer-events-none">
              <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-amber-200 shadow-sm">
                <span className="text-xs font-black font-fun text-amber-900 block">✨ WONDER WORLD EXPLORER</span>
                <span className="text-[10px] text-amber-700 font-bold">Player Badge: {profile.avatar} {profile.name}</span>
              </div>
              <span className="text-2xl opacity-60">🌈</span>
            </div>

            {/* Placed Stickers on Canvas */}
            {placedStickers.map(p => (
              <motion.div
                key={p.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  left: `${p.xPercent}%`,
                  top: `${p.yPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute text-5xl sm:text-6xl filter drop-shadow-lg cursor-grab pointer-events-none"
              >
                {p.sticker.icon}
              </motion.div>
            ))}

            {placedStickers.length === 0 && (
              <div className="my-auto text-center pointer-events-none opacity-60">
                <p className="text-sm font-bold text-amber-900 font-fun">
                  {selectedSticker
                    ? `Click anywhere on the paper to stick "${selectedSticker.name}"!`
                    : 'Select a sticker below, then tap here to stick it!'}
                </p>
              </div>
            )}

            <div className="text-right text-[10px] text-amber-700 font-bold pointer-events-none">
              Tap anywhere with a selected sticker to place
            </div>
          </div>

          {/* Sticker Tray Drawer */}
          <div className="bg-slate-100 p-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Unlocked Stickers Collection:
              </span>
              {placedStickers.length > 0 && (
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setPlacedStickers([]);
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Canvas</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {INITIAL_STICKERS.map(sticker => {
                const isUnlocked = unlocked.some(u => u.id === sticker.id);
                const isSelected = selectedSticker?.id === sticker.id;

                return (
                  <motion.button
                    key={sticker.id}
                    disabled={!isUnlocked}
                    whileHover={isUnlocked ? { scale: 1.08 } : {}}
                    whileTap={isUnlocked ? { scale: 0.94 } : {}}
                    onClick={() => {
                      if (!isUnlocked) return;
                      soundEngine.playPop();
                      setSelectedSticker(sticker);
                    }}
                    className={`flex-shrink-0 p-3 rounded-2xl flex flex-col items-center justify-center min-w-20 transition border-2 ${
                      !isUnlocked
                        ? 'bg-slate-200 border-slate-300 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 shadow-md'
                        : 'bg-white border-amber-200 hover:border-amber-400 shadow-sm'
                    }`}
                  >
                    <span className="text-3xl mb-1">{isUnlocked ? sticker.icon : '🔒'}</span>
                    <span className="text-[11px] font-black text-slate-800 font-fun truncate max-w-16">
                      {sticker.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
