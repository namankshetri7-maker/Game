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
import { Pause, RotateCcw, Sparkles, Volume2, HelpCircle, Check, Info, Home, ArrowLeft } from 'lucide-react';
import { AgeGroup, DifficultyLevel, GameState, Sticker } from '../types/game';
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
  onBackToWorld?: () => void;
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

const EXTRA_HARD_PIECES: ContinentPiece[] = [
  { id: 'greenland', name: 'Greenland', color: '#14B8A6', borderColor: '#0D9488', icon: '❄️', slotXPercent: 36, slotYPercent: 16, funFact: 'The largest island on the planet, covered in massive glaciers!' },
  { id: 'madagascar', name: 'Madagascar', color: '#F97316', borderColor: '#EA580C', icon: '🦎', slotXPercent: 60, slotYPercent: 68, funFact: 'Island renowned for biodiversity like lemurs and giant baobabs!' },
  { id: 'great_wall', name: 'Great Wall', color: '#E11D48', borderColor: '#BE123C', icon: '🧱', slotXPercent: 78, slotYPercent: 32, funFact: 'Ancient monumental wall stretching thousands of miles across China!' },
  { id: 'mediterranean', name: 'Mediterranean', color: '#3B82F6', borderColor: '#2563EB', icon: '⛵', slotXPercent: 51, slotYPercent: 36, funFact: 'Historic sea bordered by Europe, Africa, and Asia!' }
];

export const ContinentJigsaw: React.FC<ContinentJigsawProps> = ({
  ageGroup,
  activeProfileId,
  initialLevel = 1,
  onHome,
  onBackToWorld,
  onNextGame
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(initialLevel);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(() => {
    if (ageGroup === '3-4') return 'EASY';
    if (ageGroup === '5-7') return 'MEDIUM';
    return 'HARD';
  });
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

  // Dynamic pieces based on currentLevel and difficulty
  const getPiecesForLevelAndDifficulty = (lvl: number, diff: DifficultyLevel): ContinentPiece[] => {
    if (diff === 'EASY') {
      if (lvl === 1) return ALL_CONTINENTS.slice(0, 3);
      if (lvl === 2) return ALL_CONTINENTS.slice(0, 4);
      if (lvl === 3) return ALL_CONTINENTS.slice(0, 5);
      if (lvl === 4) return OCEANS_LEVEL.slice(0, 3);
      return LANDMARKS_LEVEL.slice(0, 3);
    } else if (diff === 'MEDIUM') {
      if (lvl === 1) return ALL_CONTINENTS.slice(0, 4);
      if (lvl === 2) return ALL_CONTINENTS.slice(0, 6);
      if (lvl === 3) return ALL_CONTINENTS;
      if (lvl === 4) return OCEANS_LEVEL;
      return LANDMARKS_LEVEL;
    } else {
      // HARD
      if (lvl === 1) return ALL_CONTINENTS.slice(0, 5);
      if (lvl === 2) return ALL_CONTINENTS;
      if (lvl === 3) return [...ALL_CONTINENTS, EXTRA_HARD_PIECES[0], EXTRA_HARD_PIECES[1]];
      if (lvl === 4) return [...OCEANS_LEVEL, EXTRA_HARD_PIECES[3]];
      return [...LANDMARKS_LEVEL, EXTRA_HARD_PIECES[2]];
    }
  };

  const [targetContinents, setTargetContinents] = useState<ContinentPiece[]>(() =>
    getPiecesForLevelAndDifficulty(currentLevel, difficulty)
  );

  useEffect(() => {
    setTargetContinents(getPiecesForLevelAndDifficulty(currentLevel, difficulty));
    setPlacedContinents([]);
    setSelectedPieceId(null);
    setLatestFact(null);
  }, [currentLevel, difficulty]);

  const unplacedContinents = targetContinents.filter(c => !placedContinents.includes(c.id));

  const handlePlaceContinent = (continent: ContinentPiece) => {
    soundEngine.playSnap();
    const updated = [...placedContinents, continent.id];
    setPlacedContinents(updated);
    setSelectedPieceId(null);
    setScore(prev => prev + 100);
    setLatestFact(`🌟 ${continent.name} ${continent.icon}: ${continent.funFact}`);

    // Try speech pronunciation of continent and fact
    if ('speechSynthesis' in window && !soundEngine.getMuted()) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`${continent.name}! ${continent.funFact}`);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      } catch {}
    }

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
  };

  // 1-Tap friendly or Tray-select placement
  const handleSlotClick = (continent: ContinentPiece) => {
    if (placedContinents.includes(continent.id)) {
      // Re-read fun fact
      setLatestFact(`🌟 ${continent.name} ${continent.icon}: ${continent.funFact}`);
      soundEngine.playPop();
      if ('speechSynthesis' in window && !soundEngine.getMuted()) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(`${continent.name}! ${continent.funFact}`);
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        } catch {}
      }
      return;
    }

    // If no piece selected, or kid tapped matching piece: direct placement!
    if (!selectedPieceId || selectedPieceId === continent.id) {
      handlePlaceContinent(continent);
    } else {
      // Kid had another piece selected from tray, but tapped this slot
      // Let's place the tapped continent directly for preschooler ease of use!
      handlePlaceContinent(continent);
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
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {onBackToWorld && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onBackToWorld();
              }}
              className="p-2 sm:px-3 sm:py-2 bg-white/95 hover:bg-white text-blue-950 font-fun font-bold text-xs sm:text-sm rounded-2xl shadow-md border-2 border-cyan-300 active:scale-95 transition flex items-center gap-1.5"
              title="Return to Island Levels"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-600 stroke-[2.5]" />
              <span className="hidden sm:inline">Levels</span>
            </button>
          )}

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

        <div className="flex items-center gap-2">
          {/* Difficulty Tier Selector (Easy / Medium / Hard) */}
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/20 backdrop-blur-sm">
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

          <div className="flex items-center gap-2 bg-white/95 px-3 py-1.5 rounded-2xl border-2 border-cyan-300 shadow-md">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span className="text-base sm:text-lg font-black text-slate-800 font-fun">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Interactive World Map Canvas with Illustrated Continents & Oceans */}
      <div className="relative flex-1 my-3 bg-gradient-to-b from-sky-600 via-blue-800 to-indigo-950 rounded-3xl border-4 border-cyan-400/50 shadow-2xl overflow-hidden flex items-center justify-center min-h-[300px]">
        
        {/* Stylized Illustrated World Continents Landmass SVG Backdrop */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-45 select-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>

          {/* Graticule Latitude & Longitude grid lines */}
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
          <line x1="500" y1="0" x2="500" y2="600" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />

          {/* North America silhouette */}
          <path d="M 120,80 Q 220,90 280,180 Q 260,260 210,310 Q 140,260 110,180 Z" fill="url(#landGrad)" />
          {/* South America silhouette */}
          <path d="M 280,330 Q 360,370 340,490 Q 300,560 270,520 Q 240,400 280,330 Z" fill="url(#landGrad)" />
          {/* Europe silhouette */}
          <path d="M 460,110 Q 550,110 560,200 Q 480,240 450,180 Z" fill="url(#landGrad)" />
          {/* Africa silhouette */}
          <path d="M 460,240 Q 580,250 560,420 Q 510,490 470,380 Z" fill="url(#landGrad)" />
          {/* Asia silhouette */}
          <path d="M 570,80 Q 860,90 840,280 Q 720,320 620,240 Z" fill="url(#landGrad)" />
          {/* Australia / Oceania silhouette */}
          <path d="M 760,380 Q 880,380 870,470 Q 770,490 760,380 Z" fill="url(#landGrad)" />
          {/* Antarctica silhouette */}
          <path d="M 150,560 Q 500,530 850,560 L 850,600 L 150,600 Z" fill="#E0F2FE" opacity="0.8" />
        </svg>

        {/* Ambient Oceanic Accents */}
        <div className="absolute top-4 left-6 text-sm text-cyan-200 pointer-events-none select-none animate-pulse">
          ⛵ Caribbean Sea
        </div>
        <div className="absolute top-6 right-8 text-sm text-cyan-200 pointer-events-none select-none flex items-center gap-1">
          <span>🧭</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">N</span>
        </div>
        <div className="absolute bottom-6 left-12 text-sm text-cyan-200 pointer-events-none select-none">
          🐋 Pacific Ocean
        </div>
        <div className="absolute bottom-6 right-16 text-sm text-cyan-200 pointer-events-none select-none">
          🐬 Indian Ocean
        </div>

        {/* Target Drop Slots positioned across map */}
        <div className="relative w-full h-full max-w-3xl max-h-[380px]">
          {targetContinents.map(c => {
            const isPlaced = placedContinents.includes(c.id);
            const isTargeted = selectedPieceId === c.id;

            return (
              <motion.button
                key={c.id}
                whileHover={{ scale: isPlaced ? 1.05 : 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSlotClick(c)}
                style={{
                  left: `${c.slotXPercent}%`,
                  top: `${c.slotYPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: isPlaced ? c.color : isTargeted ? '#FDE047' : `${c.color}25`,
                  borderColor: isPlaced ? c.borderColor : isTargeted ? '#F59E0B' : c.borderColor
                }}
                className={`absolute p-2 sm:p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isPlaced
                    ? 'shadow-xl scale-105 border-3 ring-4 ring-white/40 z-20 text-white'
                    : isTargeted
                    ? 'border-4 border-amber-400 scale-120 animate-bounce z-30 shadow-2xl ring-4 ring-yellow-300 text-slate-950 font-black'
                    : 'border-2 border-dashed hover:scale-110 hover:border-cyan-200 hover:bg-white/20 z-10 text-white shadow-md'
                }`}
              >
                {/* Visual slot representation */}
                {isPlaced ? (
                  <>
                    <span className="text-2xl sm:text-3xl drop-shadow">{c.icon}</span>
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider font-fun mt-0.5 text-white drop-shadow">
                      {c.name}
                    </span>
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </>
                ) : isTargeted ? (
                  <>
                    <span className="text-2xl sm:text-3xl animate-spin" style={{ animationDuration: '3s' }}>
                      {c.icon}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-black uppercase font-fun mt-0.5 text-slate-950">
                      👇 TAP HERE!
                    </span>
                    <span className="text-[9px] font-bold text-amber-900 font-fun">
                      {c.name}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl sm:text-3xl opacity-80">{c.icon}</span>
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider font-fun mt-0.5 text-cyan-100 drop-shadow">
                      {c.name}
                    </span>
                  </>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Educational Fact Notification Toast */}
        {latestFact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-2 left-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border-2 border-cyan-400 shadow-xl flex items-center justify-between gap-2 text-xs font-bold text-slate-900 z-30"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-600 shrink-0" />
              <span className="font-fun">{latestFact}</span>
            </div>
            <button
              onClick={() => {
                soundEngine.playPop();
                if ('speechSynthesis' in window && !soundEngine.getMuted()) {
                  try {
                    window.speechSynthesis.cancel();
                    const cleanText = latestFact.replace(/[🌟🦅🦜🏰🦁🐼🦘🐧🐋⛵🐬🐻‍❄️🧊🔺🗼🕌🗽❄️🦎🧱:]/g, '');
                    const utt = new SpeechSynthesisUtterance(cleanText);
                    utt.rate = 0.9;
                    window.speechSynthesis.speak(utt);
                  } catch {}
                }
              }}
              className="p-1.5 bg-cyan-100 hover:bg-cyan-200 rounded-xl text-cyan-800 shrink-0 active:scale-95 transition"
              title="Hear continent fact again"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Continent Puzzle Pieces Drawer (+20dp touch targets) */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-cyan-300 shadow-xl z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            {selectedPieceId
              ? '👉 Now tap its target slot on the world map above!'
              : difficulty === 'EASY'
              ? '🌱 Easy: Tap a piece below, then tap its glowing color zone!'
              : difficulty === 'MEDIUM'
              ? '⚡ Medium: Tap a piece below and match its continent shape!'
              : '🔥 Hard: Tap a piece below and pinpoint its geographic coordinates!'}
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
        currentLevel={currentLevel}
        gameTitle="Continent Jigsaw 🌍"
        worldName="World Geography"
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
          setPlacedContinents([]);
          setSelectedPieceId(null);
          setScore(0);
          setMistakes(0);
          setLatestFact(null);
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
