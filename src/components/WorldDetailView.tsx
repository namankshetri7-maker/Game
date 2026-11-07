/**
 * World Detail & Level Hub View
 * Interactive island level-track where kids can:
 * 1. View the unique games native to this specific world
 * 2. Select any level (Level 1 to 5) with star ratings
 * 3. Quickly return to the World Map with 1 tap
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Home, Star, Play, Sparkles, Lock, CheckCircle2 } from 'lucide-react';
import { WORLDS, MINI_GAMES_MATRIX } from '../data/gameMatrix';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';
import { isGameAllowedInDemo, isLevelAllowedInDemo } from '../data/demoConfig';

interface WorldDetailViewProps {
  worldId: string;
  activeProfileId: string;
  onBackToMap: () => void;
  onLaunchGameLevel: (gameId: string, levelNumber: number) => void;
  isDemoMode?: boolean;
  onShowDemoLimit?: () => void;
}

export const WorldDetailView: React.FC<WorldDetailViewProps> = ({
  worldId,
  activeProfileId,
  onBackToMap,
  onLaunchGameLevel,
  isDemoMode = false,
  onShowDemoLimit
}) => {
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  const gamesInWorld = MINI_GAMES_MATRIX.filter(g => g.worldId === worldId);

  // Selected game inside this world
  const [selectedGameId, setSelectedGameId] = useState<string>(() => {
    const firstPlayable = gamesInWorld.find(g => isDemoMode ? isGameAllowedInDemo(g.id) : g.playable);
    return firstPlayable?.id || gamesInWorld[0]?.id || 'game_dino_addition';
  });

  const selectedGame = gamesInWorld.find(g => g.id === selectedGameId) || gamesInWorld[0];
  const progressList = storageService.getProgressList(activeProfileId);
  const gameProgress = progressList.find(p => p.gameId === selectedGameId);
  const stats = storageService.getAggregatedStats(activeProfileId);

  // 5 progressive levels definition for each game
  const LEVELS = [
    { level: 1, title: 'Level 1: Beginner Spark', subtitle: 'Guided introduction with visual helpers', badge: '🌱 Easy' },
    { level: 2, title: 'Level 2: Skill Builder', subtitle: 'Expanding items & sound feedback', badge: '⭐ Standard' },
    { level: 3, title: 'Level 3: Explorer Challenge', subtitle: 'Faster challenges with bonus stars', badge: '🔥 Challenge' },
    { level: 4, title: 'Level 4: Master Puzzler', subtitle: 'Advanced thinking & concentration', badge: '💎 Master' },
    { level: 5, title: 'Level 5: Wonder Champion', subtitle: 'Ultimate level for star trophy', badge: '👑 Champion' }
  ];

  const isSelectedGameDemoAllowed = !isDemoMode || isGameAllowedInDemo(selectedGame.id);

  return (
    <div className={`relative w-full h-full min-h-[500px] bg-gradient-to-b ${world.bgGradient} rounded-3xl p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none border-4 border-white shadow-2xl font-body`}>
      {/* Top Header Bar with Home Button */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Home Map Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onBackToMap();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-white/80 transition cursor-pointer"
            title="Return to World Map"
          >
            <Home className="w-4 h-4 text-indigo-600" />
            <span>World Map</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{world.icon}</span>
              <h2 className="text-lg sm:text-2xl font-black text-white font-fun drop-shadow-md">
                {world.title}
              </h2>
            </div>
            <p className="text-[11px] sm:text-xs text-white/90 font-bold hidden sm:block">
              {world.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white shadow-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="text-xs sm:text-sm font-black text-slate-800 font-fun">
            {gameProgress?.stars || 0} Stars in {selectedGame.title}
          </span>
        </div>
      </div>

      {/* Main Island Area: Unique Games Drawer + Level Path */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 my-2 sm:my-3 flex-1 overflow-y-auto">
        {/* Left Column: Unique Games in this World */}
        <div className="bg-white/95 rounded-2xl p-3 sm:p-4 border-2 border-white shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-fun">
              Games ({gamesInWorld.length})
            </h3>
            {isDemoMode && (
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                2 Demo Free / World
              </span>
            )}
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[300px]">
            {gamesInWorld.map(g => {
              const isSelected = g.id === selectedGameId;
              const isAllowed = !isDemoMode || isGameAllowedInDemo(g.id);

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    soundEngine.playPop();
                    if (isDemoMode && !isAllowed) {
                      onShowDemoLimit?.();
                    } else {
                      setSelectedGameId(g.id);
                    }
                  }}
                  className={`w-full p-2.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                      : isAllowed
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-slate-100/90 border-slate-300 text-slate-400 opacity-90'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-slate-100 rounded-lg">{g.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 font-fun leading-tight">{g.title}</h4>
                      <span className="text-[10px] text-slate-500 block">{g.ageRecommendation}</span>
                    </div>
                  </div>
                  
                  {isDemoMode && (
                    isAllowed ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                        Demo Free
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 shrink-0 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> $9
                      </span>
                    )
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Columns: Level Track for Selected Game */}
        <div className="md:col-span-2 bg-white/95 rounded-2xl p-4 sm:p-5 border-2 border-white shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedGame.icon}</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-fun">
                    {selectedGame.title}
                  </h3>
                  <div className="text-xs text-indigo-700 font-semibold mt-0.5">
                    {selectedGame.skills.join(' · ')}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  if (isDemoMode && !isSelectedGameDemoAllowed) {
                    onShowDemoLimit?.();
                  } else {
                    onLaunchGameLevel(selectedGame.id, 1);
                  }
                }}
                className={`px-4 py-2 rounded-xl font-fun font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                  isSelectedGameDemoAllowed
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 text-white'
                    : 'bg-amber-400 hover:bg-amber-300 text-amber-950 border border-amber-500'
                }`}
              >
                {isSelectedGameDemoAllowed ? (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Level 1</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Unlock ($9)</span>
                  </>
                )}
              </button>
            </div>

            {/* Level Road / Track Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 my-3">
              {LEVELS.map((lvl) => {
                const LEVEL_COLORS = [
                  { bg: 'from-emerald-50 to-green-100', border: 'border-emerald-300 hover:border-emerald-500', numBg: 'bg-emerald-600', text: 'text-emerald-950' },
                  { bg: 'from-sky-50 to-blue-100', border: 'border-sky-300 hover:border-sky-500', numBg: 'bg-sky-600', text: 'text-sky-950' },
                  { bg: 'from-amber-50 to-orange-100', border: 'border-amber-300 hover:border-amber-500', numBg: 'bg-amber-600', text: 'text-amber-950' },
                  { bg: 'from-purple-50 to-indigo-100', border: 'border-purple-300 hover:border-purple-500', numBg: 'bg-purple-600', text: 'text-purple-950' },
                  { bg: 'from-pink-50 to-rose-100', border: 'border-pink-300 hover:border-pink-500', numBg: 'bg-rose-600', text: 'text-rose-950' }
                ];
                const theme = LEVEL_COLORS[(lvl.level - 1) % LEVEL_COLORS.length];
                const isLevelUnlockedInDemo = !isDemoMode || (isSelectedGameDemoAllowed && isLevelAllowedInDemo(lvl.level));

                return (
                  <motion.div
                    key={lvl.level}
                    whileHover={{ scale: 1.06, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      soundEngine.playPop();
                      if (isDemoMode && !isLevelUnlockedInDemo) {
                        onShowDemoLimit?.();
                      } else {
                        onLaunchGameLevel(selectedGame.id, lvl.level);
                      }
                    }}
                    className={`p-3 rounded-2xl border-3 text-center transition cursor-pointer flex flex-col justify-between bg-gradient-to-b ${theme.bg} ${theme.border} shadow-md group ${
                      !isLevelUnlockedInDemo ? 'opacity-75 grayscale-20' : ''
                    }`}
                  >
                    <div>
                      <div className={`w-10 h-10 rounded-2xl ${theme.numBg} text-white font-black font-fun text-base flex items-center justify-center mx-auto mb-1.5 shadow-md border-2 border-white group-hover:scale-110 transition`}>
                        {isLevelUnlockedInDemo ? lvl.level : <Lock className="w-4 h-4" />}
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider block font-fun ${theme.text}`}>
                        {lvl.badge}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-black/10">
                      <div className="flex justify-center text-amber-500 text-xs drop-shadow-sm">
                        ⭐⭐⭐
                      </div>
                      <span className={`text-[10px] font-black font-fun block mt-0.5 uppercase py-0.5 rounded-lg border ${
                        isLevelUnlockedInDemo
                          ? 'bg-white/80 text-indigo-900 border-white'
                          : 'bg-amber-400 text-amber-950 border-amber-500'
                      }`}>
                        {isLevelUnlockedInDemo ? 'Play' : 'Unlock'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom helper tip */}
          <div className="p-3 bg-amber-50/90 rounded-2xl border-2 border-amber-200 text-xs text-amber-950 font-bold font-body flex items-center gap-2 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 fill-amber-400" />
            <span>
              {isDemoMode
                ? 'Free Demo Mode: 2 games per world are playable for Levels 1 & 2. Unlock all 45 games for $9!'
                : `Adaptive Level Engine automatically matches child age (${stats.profile.age} yrs) with guided hints, custom counters, and offline sound!`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

