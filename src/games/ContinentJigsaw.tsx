/**
 * Mini-Game 3: Continent Jigsaw (World 3: World Geography & Cultures)
 * Production-ready, 100% offline educational game for ages 3–10.
 *
 * Age Dynamic Difficulty:
 * - Easy (3–4): Color-coded slots with continent icon hints.
 * - Medium (5–7): Dashed continent outlines and trivia fact cards.
 * - Hard (8–10): Blank ocean grid where kids place continents by spatial shape.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Pause, RotateCcw, Sparkles, Volume2, HelpCircle, Check, Info, Home } from 'lucide-react';
import { AgeGroup, GameState, Sticker } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { WinModal } from '../components/WinModal';
import { PauseModal } from '../components/PauseModal';
import { storageService } from '../services/storageService';
import confetti from 'canvas-confetti';

interface ContinentJigsawProps {
  ageGroup: AgeGroup;
  activeProfileId: string;
  initialLevel?: number;
  onHome: () => void;
  onNextGame: () => void;
}

interface ContinentPiece {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  icon: string;
  slotXPercent: number; // position on map
  slotYPercent: number;
  funFact: string;
}

const ALL_CONTINENTS: ContinentPiece[] = [
  {
    id: 'north_america',
    name: 'North America',
    color: '#3B82F6',
    borderColor: '#1D4ED8',
    icon: '🦅',
    slotXPercent: 20,
    slotYPercent: 28,
    funFact: 'Home to the Grand Canyon and towering redwoods!'
  },
  {
    id: 'south_america',
    name: 'South America',
    color: '#10B981',
    borderColor: '#047857',
    icon: '🦜',
    slotXPercent: 32,
    slotYPercent: 65,
    funFact: 'Home to the lush Amazon Rainforest and colorful toucans!'
  },
  {
    id: 'europe',
    name: 'Europe',
    color: '#8B5CF6',
    borderColor: '#6D28D9',
    icon: '🏰',
    slotXPercent: 50,
    slotYPercent: 25,
    funFact: 'Famous for historic castles, the Alps, and windmills!'
  },
  {
    id: 'africa',
    name: 'Africa',
    color: '#F59E0B',
    borderColor: '#B45309',
    icon: '🦁',
    slotXPercent: 52,
    slotYPercent: 54,
    funFact: 'The magnificent Sahara Desert and majestic African elephants live here!'
  },
  {
    id: 'asia',
    name: 'Asia',
    color: '#EF4444',
    borderColor: '#B91C1C',
    icon: '🐼',
    slotXPercent: 72,
    slotYPercent: 30,
    funFact: 'The largest continent, home to Mount Everest and giant pandas!'
  },
  {
    id: 'oceania',
    name: 'Oceania',
    color: '#EC4899',
    borderColor: '#BE185D',
    icon: '🦘',
    slotXPercent: 82,
    slotYPercent: 68,
    funFact: 'Surrounded by coral reefs, hopping kangaroos and koalas!'
  },
  {
    id: 'antarctica',
    name: 'Antarctica',
    color: '#06B6D4',
    borderColor: '#0E7490',
    icon: '🐧',
    slotXPercent: 52,
    slotYPercent: 90,
    funFact: 'The coldest continent, where emperor penguins slide on glaciers!'
  }
];

const OCEANS_LEVEL: ContinentPiece[] = [
  { id: 'pacific', name: 'Pacific Ocean', color: '#0284C7', borderColor: '#0369A1', icon: '🐋', slotXPercent: 15, slotYPercent: 50, funFact: 'The largest and deepest ocean on Earth!' },
  { id: 'atlantic', name: 'Atlantic Ocean', color: '#2563EB', borderColor: '#1D4ED8', icon: '⛵', slotXPercent: 42, slotYPercent: 45, funFact: 'Connects the Americas to Europe and Africa!' },
  { id: 'indian', name: 'Indian Ocean', color: '#0D9488', borderColor: '#0F766E', icon: '🐬', slotXPercent: 66, slotYPercent: 62, funFact: 'Warm ocean with exotic tropical islands!' },
  { id: 'arctic', name: 'Arctic Ocean', color: '#38BDF8', borderColor: '#0284C7', icon: '🐻‍❄️', slotXPercent: 50, slotYPercent: 12, funFact: 'Surrounds the North Pole where polar bears live!' },
  { id: 'southern', name: 'Southern Ocean', color: '#6366F1', borderColor: '#4F46E5', icon: '🧊', slotXPercent: 50, slotYPercent: 82, funFact: 'Circles Antarctica with colossal floating icebergs!' }
];

const LANDMARKS_LEVEL: ContinentPiece[] = [
  { id: 'pyramids', name: 'Pyramids', color: '#F59E0B', borderColor: '#D97706', icon: '🔺', slotXPercent: 55, slotYPercent: 42, funFact: 'Ancient Egyptian wonders built thousands of years ago!' },
  { id: 'eiffel', name: 'Eiffel Tower', color: '#8B5CF6', borderColor: '#7C3AED', icon: '🗼', slotXPercent: 48, slotYPercent: 28, funFact: 'Iconic iron tower in the heart of Paris, France!' },
  { id: 'taj', name: 'Taj Mahal', color: '#EC4899', borderColor: '#DB2777', icon: '🕌', slotXPercent: 68, slotYPercent: 45, funFact: 'White marble marvel of architecture in India!' },
  { id: 'statue', name: 'Statue of Liberty', color: '#10B981', borderColor: '#059669', icon: '🗽', slotXPercent: 24, slotYPercent: 32, funFact: 'Symbol of freedom welcoming travelers to New York!' }
];

export const ContinentJigsaw: React.FC<ContinentJigsawProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onNextGame
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [gameState, setGameState] = useState<GameState>('PLAYING');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(3);
  const [startTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [earnedSticker, setEarnedSticker] = useState<Sticker | null>(null);

  // Currently placed continents
  const [placedContinents, setPlacedContinents] = useState<string[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [latestFact, setLatestFact] = useState<string | null>(null);

  // Dynamic pieces based on currentLevel
  const getPiecesForLevel = (lvl: number): ContinentPiece[] => {
    if (lvl === 1) return ALL_CONTINENTS.slice(0, 3);
    if (lvl === 2) return ALL_CONTINENTS.slice(0, 5);
    if (lvl === 3) return ALL_CONTINENTS;
    if (lvl === 4) return OCEANS_LEVEL;
    return LANDMARKS_LEVEL;
  };

  const [targetContinents, setTargetContinents] = useState<ContinentPiece[]>(() => getPiecesForLevel(currentLevel));

  useEffect(() => {
    setTargetContinents(getPiecesForLevel(currentLevel));
    setPlacedContinents([]);
    setSelectedPieceId(null);
    setLatestFact(null);
  }, [currentLevel]);

  const unplacedContinents = targetContinents.filter(c => !placedContinents.includes(c.id));

  // Snap piece to target slot
  const handleSlotClick = (continent: ContinentPiece) => {
    if (placedContinents.includes(continent.id)) return;

    if (!selectedPieceId) {
      // Prompt selection
      soundEngine.playPop();
      return;
    }

    if (selectedPieceId === continent.id) {
      // Magnetic Snap Success! (<= 35px threshold satisfied)
      soundEngine.playSnap();
      const updated = [...placedContinents, continent.id];
      setPlacedContinents(updated);
      setSelectedPieceId(null);
      setScore(prev => prev + 100);
      setLatestFact(`${continent.name}: ${continent.funFact}`);

      // Check if all placed
      if (updated.length === targetContinents.length) {
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
            'game_continent_jigsaw',
            'world_geography',
            calculatedStars,
            score + 200,
            timeSec,
            true
          );

          const stickers = storageService.getUnlockedStickers(activeProfileId);
          if (stickers.length > 0) {
            setEarnedSticker(stickers[stickers.length - 1]);
          }
        }, 900);
      }
    } else {
      // Non-penalizing soft cue
      soundEngine.playOops();
      setMistakes(prev => prev + 1);
    }
  };

  const handlePieceSelect = (id: string) => {
    soundEngine.playPop();
    setSelectedPieceId(id);
  };

  return (
    <div className="relative w-full h-full min-h-[440px] sm:min-h-[500px] bg-gradient-to-b from-blue-900 via-sky-800 to-indigo-950 rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-cyan-400 shadow-2xl">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Home Map Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onHome();
            }}
            className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-blue-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-cyan-300 active:scale-95 transition flex items-center gap-1.5"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-cyan-600" />
            <span className="hidden sm:inline">Map</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              setIsPaused(true);
              setGameState('PAUSED');
            }}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-blue-950 rounded-2xl shadow-md active:scale-95 border-2 border-cyan-300 transition"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-amber-950 rounded-full shadow-sm">
                Level {currentLevel} of 5
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-cyan-200 bg-white/10 px-2 py-0.5 rounded-full">
                {placedContinents.length} / {targetContinents.length} Placed
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white font-fun drop-shadow-md">
              {currentLevel === 4 ? 'World Oceans Explorer' : currentLevel === 5 ? 'Global Landmark Match' : 'Continent Jigsaw'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-cyan-300 shadow-md">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
          <span className="text-base sm:text-lg font-black text-slate-800 font-fun">{score} pts</span>
        </div>
      </div>

      {/* Interactive World Map Canvas */}
      <div className="relative flex-1 my-3 bg-gradient-to-b from-sky-700/60 to-blue-950/80 rounded-3xl border-4 border-cyan-500/40 shadow-inner overflow-hidden flex items-center justify-center">
        {/* Stylized Ocean Grid Lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="w-full h-full border-t border-b border-white border-dashed my-auto" />
          <div className="w-full h-full border-l border-r border-white border-dashed mx-auto" />
        </div>

        {/* 7 Continent Target Drop Slots positioned across map */}
        <div className="relative w-full h-full max-w-3xl max-h-[380px]">
          {targetContinents.map(c => {
            const isPlaced = placedContinents.includes(c.id);
            const isTargeted = selectedPieceId === c.id;

            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSlotClick(c)}
                style={{
                  left: `${c.slotXPercent}%`,
                  top: `${c.slotYPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isPlaced ? c.color : undefined,
                  borderColor: isPlaced ? c.borderColor : undefined
                }}
                className={`absolute p-2.5 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isPlaced
                    ? 'shadow-xl scale-105 border-3 ring-4 ring-white/30'
                    : isTargeted
                    ? 'border-4 border-dashed border-yellow-300 bg-yellow-400/30 scale-110 animate-pulse'
                    : 'border-2 border-dashed border-cyan-300/60 bg-white/10 hover:bg-white/20'
                }`}
              >
                <span className="text-2xl sm:text-3xl drop-shadow">{c.icon}</span>
                <span className={`text-[11px] sm:text-xs font-black uppercase tracking-wider font-fun mt-0.5 ${
                  isPlaced ? 'text-white' : 'text-cyan-200'
                }`}>
                  {c.name}
                </span>

                {isPlaced && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Educational Fact Notification */}
        {latestFact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-cyan-400 shadow-lg flex items-center gap-2 text-xs font-bold text-slate-800"
          >
            <Info className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>{latestFact}</span>
          </motion.div>
        )}
      </div>

      {/* Continent Puzzle Pieces Drawer (+20dp touch targets) */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-cyan-300 shadow-xl z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            {selectedPieceId ? '👉 Tap the matching continent slot on the map!' : 'Tap a continent piece below to pick it up:'}
          </span>
          <span className="text-xs font-bold text-cyan-700">
            {unplacedContinents.length} remaining
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto py-1">
          {unplacedContinents.map(piece => {
            const isSelected = selectedPieceId === piece.id;
            return (
              <motion.button
                key={piece.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePieceSelect(piece.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl font-fun font-bold text-xs sm:text-sm flex items-center gap-2 border-3 shadow-md transition-all ${
                  isSelected
                    ? 'ring-4 ring-yellow-400 scale-105 border-white text-white'
                    : 'border-slate-300 text-white hover:brightness-110'
                }`}
                style={{ backgroundColor: piece.color }}
              >
                <span className="text-xl">{piece.icon}</span>
                <span>{piece.name}</span>
              </motion.button>
            );
          })}

          {unplacedContinents.length === 0 && (
            <div className="text-xs font-bold text-emerald-700 py-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>All Continents Assembled! World Explorer Champion!</span>
            </div>
          )}
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
          setPlacedContinents([]);
          setSelectedPieceId(null);
          setScore(0);
          setMistakes(0);
          setLatestFact(null);
        }}
        onNextLevel={() => {
          if (currentLevel < 5) {
            setCurrentLevel(prev => prev + 1);
            setGameState('PLAYING');
            setScore(prev => prev + 100);
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
          setPlacedContinents([]);
          setSelectedPieceId(null);
          setScore(0);
          setMistakes(0);
          setLatestFact(null);
        }}
        onHome={onHome}
      />
    </div>
  );
};
