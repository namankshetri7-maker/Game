/**
 * Mini-Game 4: Shape Sorter Express (World 1: Math Magic Valley)
 * Geometry & 2D/3D Shape Sorting with an animated choo-choo train.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Pause,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Check,
  Home,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Volume2
} from 'lucide-react';
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
  hint: string;
}

const LEVEL_SHAPES: Record<number, ShapeItem[]> = {
  1: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴', hint: 'Round like a coin or clock!' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦', hint: '4 equal sides and 4 corners!' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺', hint: '3 straight sides and 3 sharp points!' },
  ],
  2: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴', hint: 'Round and smooth!' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦', hint: '4 equal sides!' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺', hint: '3 sides!' },
    { id: 'star', name: 'Star', color: '#F59E0B', icon: '⭐', hint: '5 twinkling points in the sky!' },
  ],
  3: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴', hint: 'Round like the sun!' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦', hint: 'Box with 4 equal sides!' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺', hint: '3 corners!' },
    { id: 'star', name: 'Star', color: '#F59E0B', icon: '⭐', hint: 'Twinkling golden star!' },
    { id: 'heart', name: 'Heart', color: '#EC4899', icon: '💖', hint: 'Lovely heart with two curves!' },
  ],
  4: [
    { id: 'circle', name: 'Circle', color: '#EF4444', icon: '🔴', hint: 'Round curve with no corners!' },
    { id: 'square', name: 'Square', color: '#3B82F6', icon: '🟦', hint: 'Square building block!' },
    { id: 'triangle', name: 'Triangle', color: '#10B981', icon: '🔺', hint: 'Roof of a house!' },
    { id: 'star', name: 'Star', color: '#F59E0B', icon: '⭐', hint: 'Twinkle twinkle little star!' },
    { id: 'heart', name: 'Heart', color: '#EC4899', icon: '💖', hint: 'Sweet pink heart!' },
    { id: 'diamond', name: 'Diamond', color: '#06B6D4', icon: '💎', hint: 'Sparkling tilted rhombus gem!' },
  ],
  5: [
    { id: 'cube', name: '3D Cube', color: '#6366F1', icon: '🧊', hint: '6 square faces like a playing die!' },
    { id: 'sphere', name: '3D Sphere', color: '#A855F7', icon: '🔮', hint: 'Round 3D ball that rolls anywhere!' },
    { id: 'cylinder', name: 'Cylinder', color: '#EC4899', icon: '🛢️', hint: 'Round top and bottom like a soda can!' },
    { id: 'cone', name: 'Cone', color: '#F59E0B', icon: '🍦', hint: 'Pointed top like an ice cream cone!' },
    { id: 'pyramid', name: 'Pyramid', color: '#EF4444', icon: '🔺', hint: 'Ancient Egyptian wonder with triangular sides!' },
    { id: 'ring', name: 'Torus/Ring', color: '#10B981', icon: '🍩', hint: 'Yummy donut shape with a hole in the middle!' },
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
  const [isDeparting, setIsDeparting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Train track horizontal scroll reference
  const trackScrollRef = useRef<HTMLDivElement>(null);

  // Cleanly reset level state whenever currentLevel changes (Level 1 -> Level 2 -> Level 3, etc.)
  useEffect(() => {
    setPlacedShapeIds([]);
    setSelectedShapeId(null);
    setIsDeparting(false);
    setStatusMessage(null);
    if (trackScrollRef.current) {
      trackScrollRef.current.scrollLeft = 0;
    }
  }, [currentLevel]);

  const scrollTrack = (direction: 'left' | 'right') => {
    soundEngine.playPop();
    if (trackScrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      trackScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const speakShapeName = (name: string) => {
    if ('speechSynthesis' in window && !soundEngine.getMuted()) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(name);
        utterance.rate = 1.0;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  const handleLoadShape = (shape: ShapeItem) => {
    if (placedShapeIds.includes(shape.id) || isDeparting) return;

    soundEngine.playSnap();
    speakShapeName(shape.name);

    const updated = [...placedShapeIds, shape.id];
    setPlacedShapeIds(updated);
    setSelectedShapeId(null);
    setScore(prev => prev + 100);
    setStatusMessage(`Loaded ${shape.name}! ${shape.hint}`);

    // Check if all train cars are fully loaded!
    if (updated.length === targetShapes.length) {
      setIsDeparting(true);
      setStatusMessage('🚂 All aboard! The Shape Express is rolling out!');
      soundEngine.playCelebration();

      setTimeout(() => {
        let calculatedStars = 3;
        if (mistakes === 1) calculatedStars = 2;
        else if (mistakes > 1) calculatedStars = 1;

        setStars(calculatedStars);
        setGameState('LEVEL_COMPLETE');
        soundEngine.playVictory();

        try {
          confetti({ particleCount: 85, spread: 70, origin: { y: 0.6 } });
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
      }, 1600);
    }
  };

  // Direct Click on Train Car
  const handleCartClick = (shape: ShapeItem) => {
    if (placedShapeIds.includes(shape.id) || isDeparting) {
      soundEngine.playPop();
      speakShapeName(shape.name);
      return;
    }

    // If matching shape or no shape currently selected: 1-Tap Load!
    if (!selectedShapeId || selectedShapeId === shape.id) {
      handleLoadShape(shape);
    } else {
      // Selected another shape, check match
      const selectedItem = targetShapes.find(s => s.id === selectedShapeId);
      if (selectedItem && selectedItem.id === shape.id) {
        handleLoadShape(shape);
      } else {
        soundEngine.playOops();
        setMistakes(prev => prev + 1);
        setStatusMessage(`That car needs a ${shape.name}! Check your selected shape.`);
      }
    }
  };

  // Click on Shape Station Item
  const handleStationShapeClick = (shape: ShapeItem) => {
    if (isDeparting) return;
    soundEngine.playPop();
    speakShapeName(shape.name);

    if (selectedShapeId === shape.id) {
      // Direct load if already selected!
      handleLoadShape(shape);
    } else {
      setSelectedShapeId(shape.id);
      setStatusMessage(`Selected ${shape.name}! Tap its matching train car above.`);
    }
  };

  const unplacedShapes = targetShapes.filter(s => !placedShapeIds.includes(s.id));

  return (
    <div className="relative w-full h-full min-h-[560px] max-h-[92vh] overflow-y-auto bg-gradient-to-b from-sky-400 via-indigo-300 to-purple-600 rounded-3xl p-3 sm:p-5 flex flex-col justify-between select-none border-4 border-indigo-300 shadow-2xl font-body">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-10 flex-wrap gap-2 mb-2 bg-white/90 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border-2 border-indigo-200 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-fun font-bold text-xs sm:text-sm rounded-xl shadow-sm border border-indigo-200 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
              <span className="hidden sm:inline">Levels</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-fun font-bold text-xs sm:text-sm rounded-xl shadow-sm border border-indigo-200 active:scale-95 transition flex items-center gap-1.5 cursor-pointer"
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
            className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 rounded-xl shadow-sm border border-indigo-200 cursor-pointer"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full shadow-sm">
                Level {currentLevel} of 5
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-indigo-900 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Cars Loaded: {placedShapeIds.length} / {targetShapes.length}
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-slate-900 font-fun leading-tight flex items-center gap-1.5 mt-0.5">
              <span>Shape Sorter Express</span>
              <span>🚂</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-sm sm:text-base font-black text-amber-950 font-fun">{score} pts</span>
        </div>
      </div>

      {/* Main Train Depot Stage */}
      <div className="flex-1 flex flex-col justify-between gap-3 my-1 z-10">
        
        {/* Train Track Card Container */}
        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-3 sm:p-5 shadow-2xl border-4 border-indigo-300 flex flex-col items-center relative overflow-hidden">
          
          {/* Train Departure Track Header & Direction Indicator */}
          <div className="w-full flex items-center justify-between flex-wrap gap-2 mb-2 pb-2 border-b border-indigo-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm font-fun flex items-center gap-1">
                <span>🛤️ Track 1</span>
                <span className="animate-pulse">➔</span>
                <span>Eastbound to Wonder Star</span>
              </span>
            </div>

            {/* Scroll Navigation Buttons for Train Track */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollTrack('left')}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-fun font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                title="Scroll Train Left"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Left</span>
              </button>
              <button
                onClick={() => scrollTrack('right')}
                className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-fun font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition cursor-pointer"
                title="Scroll Train Right"
              >
                <span className="hidden sm:inline">Right</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Instruction Toast */}
          <div className="text-xs sm:text-sm font-black text-indigo-950 mb-2 font-fun text-center bg-indigo-50/90 px-4 py-1.5 rounded-full border border-indigo-200 shadow-sm max-w-xl">
            {statusMessage || (
              selectedShapeId
                ? '👉 Tap the matching train car on the track to load your shape!'
                : '🚂 Tap any train car or select from the station below to load cargo!'
            )}
          </div>

          {/* Horizontally Scrollable Train Stage */}
          <div
            ref={trackScrollRef}
            className="relative w-full py-3 bg-gradient-to-r from-sky-100 via-indigo-50 to-pink-100 rounded-2xl border-2 border-indigo-200 shadow-inner px-4 overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-300 flex-none min-h-[160px]"
          >
            {/* Animated Train Moving Container */}
            <motion.div
              animate={isDeparting ? { x: [0, 50, 900], opacity: [1, 1, 0] } : { x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="flex items-end justify-start sm:justify-center gap-2 sm:gap-3 py-2 min-w-max mx-auto"
            >
              {/* Locomotive Engine with Choo-Choo Smoke */}
              <div className="p-3 bg-gradient-to-b from-rose-500 via-red-600 to-rose-700 text-white rounded-2xl flex flex-col items-center shadow-xl border-3 border-red-900 min-w-24 sm:min-w-28 relative shrink-0">
                {/* Steam Clouds Billowing Backwards */}
                <div className="absolute -top-6 -left-2 flex gap-1 animate-pulse pointer-events-none">
                  <span className="text-sm animate-bounce" style={{ animationDelay: '0s' }}>💨</span>
                  <span className="text-base animate-bounce" style={{ animationDelay: '0.2s' }}>💨</span>
                  <span className="text-lg animate-bounce" style={{ animationDelay: '0.4s' }}>💨</span>
                </div>

                <span className="text-4xl sm:text-5xl animate-bounce" style={{ animationDuration: '2.5s' }}>
                  🚂
                </span>
                <span className="text-[10px] font-black uppercase font-fun mt-1 bg-red-950/70 text-amber-300 px-2 py-0.5 rounded-md border border-amber-400/40">
                  Express ➔
                </span>
                
                {/* Engine Wheels */}
                <div className="flex justify-between w-full -mb-5 px-1 mt-1">
                  <span className={`text-lg ${isDeparting ? 'animate-spin' : ''}`}>⚙️</span>
                  <span className={`text-lg ${isDeparting ? 'animate-spin' : ''}`}>⚙️</span>
                </div>
              </div>

              {/* Connecting Hook */}
              <span className="text-indigo-400 font-black text-xl mb-4 shrink-0">🔗</span>

              {/* Train Cargo Cars */}
              {targetShapes.map((shape, idx) => {
                const isPlaced = placedShapeIds.includes(shape.id);
                const isTargeted = selectedShapeId === shape.id;

                const CART_COLORS = [
                  { bg: 'from-amber-100 to-amber-200', border: 'border-amber-500', roof: 'bg-amber-600' },
                  { bg: 'from-emerald-100 to-emerald-200', border: 'border-emerald-500', roof: 'bg-emerald-600' },
                  { bg: 'from-sky-100 to-sky-200', border: 'border-sky-500', roof: 'bg-sky-600' },
                  { bg: 'from-purple-100 to-purple-200', border: 'border-purple-500', roof: 'bg-purple-600' },
                  { bg: 'from-pink-100 to-pink-200', border: 'border-pink-500', roof: 'bg-pink-600' },
                  { bg: 'from-cyan-100 to-cyan-200', border: 'border-cyan-500', roof: 'bg-cyan-600' }
                ];
                const cartColor = CART_COLORS[idx % CART_COLORS.length];

                return (
                  <React.Fragment key={shape.id}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCartClick(shape)}
                      className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center min-w-24 sm:min-w-28 transition-all shadow-lg cursor-pointer relative bg-gradient-to-b shrink-0 ${
                        isPlaced
                          ? 'from-emerald-100 via-green-200 to-emerald-300 border-emerald-600 scale-105 ring-4 ring-emerald-300 shadow-emerald-400/30'
                          : isTargeted
                          ? 'from-yellow-100 via-amber-200 to-yellow-300 border-amber-500 ring-4 ring-yellow-400 animate-bounce scale-105'
                          : `${cartColor.bg} ${cartColor.border} hover:brightness-105`
                      }`}
                    >
                      {/* Car Number Label */}
                      <span className="text-[10px] font-black uppercase font-fun text-slate-700 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm mb-1">
                        Car #{idx + 1}
                      </span>

                      {/* Shape Slot Cradle */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white/95 border-2 border-white flex items-center justify-center text-3xl sm:text-4xl shadow-inner my-1 relative">
                        {isPlaced ? (
                          <motion.span
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="drop-shadow-md select-none"
                          >
                            {shape.icon}
                          </motion.span>
                        ) : isTargeted ? (
                          <div className="flex flex-col items-center">
                            <span className="text-3xl animate-pulse">{shape.icon}</span>
                            <span className="text-[8px] font-black text-amber-800 uppercase font-fun leading-none mt-0.5">
                              TAP!
                            </span>
                          </div>
                        ) : (
                          <span className="opacity-30 hover:opacity-60 transition text-2xl sm:text-3xl font-fun">
                            {shape.icon}
                          </span>
                        )}

                        {isPlaced && (
                          <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow-md border border-white">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      {/* Shape Name Badge */}
                      <span className="text-xs font-black text-slate-800 font-fun mt-0.5">
                        {shape.name}
                      </span>

                      {isPlaced && (
                        <span className="text-[9px] text-emerald-950 font-black font-fun uppercase bg-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500 mt-1 shadow-sm">
                          Loaded ✅
                        </span>
                      )}

                      {/* Train Car Wheels */}
                      <div className="flex justify-between w-full -mb-5 px-1 mt-1">
                        <span className={`text-base ${isDeparting ? 'animate-spin' : ''}`}>⚙️</span>
                        <span className={`text-base ${isDeparting ? 'animate-spin' : ''}`}>⚙️</span>
                      </div>
                    </motion.button>

                    {idx < targetShapes.length - 1 && (
                      <span className="text-indigo-400 font-black text-lg mb-4 shrink-0">🔗</span>
                    )}
                  </React.Fragment>
                );
              })}
            </motion.div>

            {/* Railway Steel Track Line */}
            <div className="w-full h-3.5 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-full mt-3 flex items-center justify-around border border-amber-950 shadow-inner min-w-max">
              <span className="text-[8px] text-amber-200 font-mono tracking-widest select-none">
                ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
              </span>
            </div>
          </div>
        </div>

        {/* Shape Cargo Station Platform */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-indigo-200 shadow-xl flex flex-col items-center gap-2">
          <div className="flex items-center justify-between w-full flex-wrap gap-1 px-1">
            <span className="text-xs font-black uppercase text-indigo-900 font-fun flex items-center gap-1.5">
              <span>🚉 Cargo Loading Platform</span>
              <span className="text-[11px] font-bold text-slate-500">
                ({unplacedShapes.length} shapes waiting to board)
              </span>
            </span>

            <span className="text-[11px] text-indigo-700 font-bold font-fun">
              👉 Tap any shape below to load it into its train car!
            </span>
          </div>

          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap w-full py-1">
            {unplacedShapes.map(shape => {
              const isSelected = selectedShapeId === shape.id;
              return (
                <motion.button
                  key={shape.id}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handleStationShapeClick(shape)}
                  className={`p-3 sm:p-4 rounded-2xl border-3 flex flex-col items-center justify-center min-w-20 sm:min-w-24 shadow-md transition cursor-pointer ${
                    isSelected
                      ? 'ring-4 ring-yellow-400 bg-amber-100 border-amber-500 scale-105 shadow-xl shadow-amber-400/30'
                      : 'bg-white border-slate-300 hover:border-indigo-400 hover:shadow-lg'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl drop-shadow select-none">{shape.icon}</span>
                  <span className="text-xs font-black font-fun text-slate-800 mt-1">{shape.name}</span>
                </motion.button>
              );
            })}

            {unplacedShapes.length === 0 && (
              <div className="py-2 px-4 rounded-2xl bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-fun font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm">
                <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />
                <span>All cargo loaded! Express departing on schedule!</span>
              </div>
            )}
          </div>
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
          setIsDeparting(false);
          setStatusMessage(null);
          setScore(0);
          setMistakes(0);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => (prev + 1) as 1 | 2 | 3 | 4 | 5);
            setGameState('PLAYING');
            setPlacedShapeIds([]);
            setSelectedShapeId(null);
            setIsDeparting(false);
            setStatusMessage(null);
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
          setIsDeparting(false);
          setStatusMessage(null);
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
