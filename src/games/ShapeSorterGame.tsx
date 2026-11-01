/**
 * Mini-Game 4: Shape Sorter Express (World 1: Math Magic Valley)
 * Geometry & 2D/3D Shape Sorting with an animated choo-choo train.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Sparkles, HelpCircle, Check, Home, ArrowLeft } from 'lucide-react';
import { AgeGroup, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface ShapeSorterGameProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  onHome: () => void;
  onBackToWorld?: () => void;
  onNextGame: () => void;
}

interface ShapeItem {
  id: string;
  name: string;
  color: string;
  icon: string;
}

const LEVEL_SHAPES: Record<number, ShapeItem[]> = {
  1: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺' },
  ],
  2: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺' },
    { id: 'star', name: 'Star', color: '#F59E0B', icon: '⭐' },
  ],
  3: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺' },
    { id: 'star', name: 'Star', color: '#F59E0B', icon: '⭐' },
    { id: 'heart', name: 'Heart', color: '#EC4899', icon: '💖' },
  ],
  4: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺' },
    { id: 'star', name: 'Star', color: '#F59E0B', icon: '⭐' },
    { id: 'heart', name: 'Heart', color: '#EC4899', icon: '💖' },
    { id: 'diamond', name: 'Diamond', color: '#06B6D4', icon: '💎' },
  ],
  5: [
    { id: 'cube', name: 'Cube', color: '#6366F1', icon: '🧊' },
    { id: 'sphere', name: 'Sphere', color: '#A855F7', icon: '🔮' },
    { id: 'cylinder', name: 'Cylinder', color: '#EC4899', icon: '🛢️' },
    { id: 'cone', name: 'Cone', color: '#F59E0B', icon: '🍦' },
    { id: 'pyramid', name: 'Pyramid', color: '#EF4444', icon: '🔺' },
    { id: 'ring', name: 'Torus/Ring', color: '#10B981', icon: '💍' },
  ]
};

export const ShapeSorterGame: React.FC<ShapeSorterGameProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onBackToWorld,
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

  const targetShapes = LEVEL_SHAPES[currentLevel] || LEVEL_SHAPES[1];
  const [placedShapeIds, setPlacedShapeIds] = useState<string[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const handleCartClick = (shape: ShapeItem) => {
    if (placedShapeIds.includes(shape.id)) return;
    if (!selectedShapeId) {
      soundEngine.playPop();
      setSelectedShapeId(shape.id);
      return;
    }

    if (selectedShapeId === shape.id) {
      soundEngine.playSnap();
      const updated = [...placedShapeIds, shape.id];
      setPlacedShapeIds(updated);
      setSelectedShapeId(null);
      setScore(prev => prev + 100);

      if (updated.length === targetShapes.length) {
        setTimeout(() => {
          let calculatedStars = 3;
          if (mistakes === 1) calculatedStars = 2;
          else if (mistakes > 1) calculatedStars = 1;

          setStars(calculatedStars);
          setGameState('LEVEL_COMPLETE');
          soundEngine.playVictory();

          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}

          const timeSec = Math.max(1, Math.round((Date.now() - startTime) / 1000));
          storageService.recordGameResult(
            activeProfileId,
            'game_shape_sorter_express',
            'world_math',
            calculatedStars,
            score + 150,
            timeSec,
            true
          );
        }, 700);
      }
    } else {
      soundEngine.playOops();
      setMistakes(prev => prev + 1);
    }
  };

  const unplacedShapes = targetShapes.filter(s => !placedShapeIds.includes(s.id));

  return (
    <div className="relative w-full h-full min-h-[520px] bg-gradient-to-b from-sky-400 via-indigo-300 to-purple-600 rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none border-4 border-indigo-300 shadow-2xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-indigo-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-indigo-200 active:scale-95 transition flex items-center gap-1.5"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
              <span className="hidden sm:inline">Levels</span>
            </button>
          )}

          {/* Direct Home Map Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-indigo-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-indigo-200 active:scale-95 transition flex items-center gap-1.5"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPaused(true);
              setGameState('PAUSED');
            }}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-indigo-950 rounded-2xl shadow-md border-2 border-indigo-200"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full shadow-sm">
                Level {currentLevel} of 5
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-white bg-black/20 px-2 py-0.5 rounded-full">
                Shapes: {placedShapeIds.length} / {targetShapes.length}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-fun drop-shadow-md">
              Shape Sorter Express 🚂
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-2xl border-2 border-indigo-200 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-lg font-black text-slate-800 font-fun">{score} pts</span>
        </div>
      </div>

      {/* Main Train Carts Stage */}
      <div className="flex-1 flex flex-col items-center justify-center my-2 sm:my-3 z-10">
        <div className="w-full max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-indigo-300 flex flex-col items-center relative overflow-hidden">
          {/* Header guidance */}
          <div className="text-xs sm:text-sm font-black text-indigo-950 mb-3 font-fun text-center bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
            {selectedShapeId
              ? '👉 Great! Now tap the matching train car to load your shape!'
              : '🚂 Select a colorful shape from the station below to load into the train:'}
          </div>

          {/* Train Tracks Stage */}
          <div className="relative w-full py-4 bg-gradient-to-r from-sky-100 via-indigo-50 to-pink-100 rounded-2xl border-2 border-indigo-200 shadow-inner px-3 overflow-x-auto flex flex-col items-center">
            {/* Steam Clouds from Locomotive */}
            <div className="absolute top-1 left-8 flex gap-1 animate-pulse">
              <span className="text-xs">💨</span>
              <span className="text-sm">💨</span>
              <span className="text-base">💨</span>
            </div>

            {/* Train Engine + Carts Row */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 py-2 min-w-max">
              {/* Locomotive Engine */}
              <div className="p-3 bg-gradient-to-b from-rose-500 to-red-600 text-white rounded-2xl flex flex-col items-center shadow-lg border-3 border-red-800 min-w-20 relative shrink-0">
                <span className="text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🚂</span>
                <span className="text-[10px] font-black uppercase font-fun mt-1 bg-red-900/60 px-2 py-0.5 rounded-md">
                  Express
                </span>
                {/* Wheels */}
                <div className="flex justify-between w-full -mb-5 px-1">
                  <span className="text-base animate-spin" style={{ animationDuration: '4s' }}>⚙️</span>
                  <span className="text-base animate-spin" style={{ animationDuration: '4s' }}>⚙️</span>
                </div>
              </div>

              {/* Connecting Coupling Hook */}
              <span className="text-indigo-400 font-black text-lg mb-4">🔗</span>

              {/* Shape Cargo Cars */}
              {targetShapes.map((shape, idx) => {
                const isPlaced = placedShapeIds.includes(shape.id);
                const isTargeted = selectedShapeId === shape.id;

                const CART_STYLES = [
                  { bg: 'from-amber-100 to-amber-200', border: 'border-amber-500', header: 'bg-amber-600' },
                  { bg: 'from-emerald-100 to-emerald-200', border: 'border-emerald-500', header: 'bg-emerald-600' },
                  { bg: 'from-sky-100 to-sky-200', border: 'border-sky-500', header: 'bg-sky-600' },
                  { bg: 'from-purple-100 to-purple-200', border: 'border-purple-500', header: 'bg-purple-600' },
                  { bg: 'from-pink-100 to-pink-200', border: 'border-pink-500', header: 'bg-pink-600' },
                  { bg: 'from-cyan-100 to-cyan-200', border: 'border-cyan-500', header: 'bg-cyan-600' }
                ];
                const cartStyle = CART_STYLES[idx % CART_STYLES.length];

                return (
                  <React.Fragment key={shape.id}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCartClick(shape)}
                      className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center min-w-22 sm:min-w-28 transition-all shadow-md cursor-pointer relative bg-gradient-to-b ${
                        isPlaced
                          ? 'from-emerald-200 to-green-300 border-emerald-600 scale-105 shadow-emerald-300/50'
                          : isTargeted
                          ? 'from-yellow-100 to-amber-200 border-dashed border-amber-500 ring-4 ring-amber-400 animate-pulse scale-105'
                          : `${cartStyle.bg} ${cartStyle.border} hover:brightness-105`
                      }`}
                    >
                      <span className="text-xs font-black uppercase font-fun text-slate-700 mb-1">
                        Car #{idx + 1}
                      </span>

                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/90 border-2 border-white flex items-center justify-center text-3xl sm:text-4xl shadow-inner my-1">
                        {isPlaced ? shape.icon : (
                          <span className="opacity-35 hover:opacity-70 transition font-fun text-2xl sm:text-3xl">
                            {shape.icon}
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-black text-slate-800 font-fun">
                        {shape.name}
                      </span>

                      {isPlaced && (
                        <span className="text-[10px] text-emerald-950 font-black font-fun uppercase bg-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500 flex items-center gap-0.5 mt-1 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" /> Loaded
                        </span>
                      )}

                      {/* Train Wheels */}
                      <div className="flex justify-between w-full -mb-6 px-1">
                        <span className="text-sm">⚙️</span>
                        <span className="text-sm">⚙️</span>
                      </div>
                    </motion.button>
                    {idx < targetShapes.length - 1 && (
                      <span className="text-indigo-400 font-black text-sm mb-4">🔗</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Railway Track Line */}
            <div className="w-full h-3 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-full mt-3 flex items-center justify-around border border-amber-950">
              <span className="text-[8px] text-amber-200 font-mono">||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||</span>
            </div>
          </div>
        </div>

        {/* Shape Station Platform */}
        <div className="mt-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border-2 border-indigo-200 shadow-xl flex items-center justify-center gap-3 flex-wrap">
          <span className="text-xs font-black uppercase text-indigo-900 font-fun w-full text-center">
            🚉 Shape Cargo Station:
          </span>
          {unplacedShapes.map(shape => {
            const isSelected = selectedShapeId === shape.id;
            return (
              <motion.button
                key={shape.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedShapeId(shape.id);
                }}
                className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center min-w-20 shadow-md transition cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 bg-amber-100 border-amber-500 scale-110 shadow-lg'
                    : 'bg-white border-slate-300 hover:border-indigo-400'
                }`}
              >
                <span className="text-4xl drop-shadow">{shape.icon}</span>
                <span className="text-xs font-black font-fun text-slate-800 mt-1">{shape.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Universal Win Modal */}
      <WinModal
        isOpen={gameState === 'LEVEL_COMPLETE'}
        stars={stars}
        score={score}
        timeSpentSeconds={Math.max(1, Math.round((Date.now() - startTime) / 1000))}
        stickerEarned={earnedSticker}
        currentLevel={currentLevel}
        gameTitle="Shape Sorter Express 🚂"
        worldName="Math Valley"
        onRestart={() => {
          setGameState('PLAYING');
          setPlacedShapeIds([]);
          setSelectedShapeId(null);
          setScore(0);
          setMistakes(0);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => (prev + 1) as 1 | 2 | 3 | 4 | 5);
            setGameState('PLAYING');
            setPlacedShapeIds([]);
            setSelectedShapeId(null);
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
          setPlacedShapeIds([]);
          setSelectedShapeId(null);
          setScore(0);
          setMistakes(0);
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
