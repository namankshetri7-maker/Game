/**
 * Mini-Game 4: Shape Sorter Express (World 1: Math Magic Valley)
 * Geometry & 2D/3D Shape Sorting with an animated choo-choo train.
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

interface ShapeSorterGameProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  onHome: () => void;
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
    if (!selectedShapeId) return;

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
        <div className="flex items-center gap-2 sm:gap-3">
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

      {/* Main Train Carts */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 z-10">
        <div className="w-full max-w-2xl bg-white/90 rounded-3xl p-6 shadow-xl border-4 border-indigo-300 flex flex-col items-center">
          <div className="text-sm font-bold text-slate-700 mb-4 font-fun">
            {selectedShapeId
              ? '👉 Now tap the train cart that matches your shape!'
              : 'Select a shape from the station below to load into the train:'}
          </div>

          {/* Train engine + Carts */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2 w-full">
            {/* Locomotive */}
            <div className="p-3 bg-red-500 text-white rounded-2xl flex flex-col items-center shadow-lg border-2 border-red-700 min-w-16">
              <span className="text-3xl">🚂</span>
              <span className="text-[10px] font-black uppercase mt-1">Engine</span>
            </div>

            {/* Shape Carts */}
            {targetShapes.map(shape => {
              const isPlaced = placedShapeIds.includes(shape.id);
              const isTargeted = selectedShapeId === shape.id;

              return (
                <motion.button
                  key={shape.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCartClick(shape)}
                  className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center min-w-18 sm:min-w-24 transition-all shadow-md ${
                    isPlaced
                      ? 'bg-emerald-100 border-emerald-500 scale-105'
                      : isTargeted
                      ? 'border-dashed border-amber-500 bg-amber-100 animate-pulse'
                      : 'bg-slate-100 border-dashed border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl drop-shadow">
                    {isPlaced ? shape.icon : '❓'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-fun mt-1">
                    {shape.name}
                  </span>
                  {isPlaced && (
                    <span className="text-[10px] text-emerald-700 font-extrabold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Loaded
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Shape Station Drawer */}
        <div className="mt-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 border-2 border-indigo-200 shadow-xl flex items-center justify-center gap-3 flex-wrap">
          {unplacedShapes.map(shape => {
            const isSelected = selectedShapeId === shape.id;
            return (
              <motion.button
                key={shape.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedShapeId(shape.id);
                }}
                className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center min-w-18 shadow-md transition cursor-pointer ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 bg-amber-100 border-amber-500 scale-105'
                    : 'bg-white border-slate-300 hover:border-indigo-400'
                }`}
              >
                <span className="text-4xl">{shape.icon}</span>
                <span className="text-xs font-bold font-fun text-slate-800 mt-1">{shape.name}</span>
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
      />
    </div>
  );
};
