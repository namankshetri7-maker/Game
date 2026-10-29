/**
 * World Detail & Level Hub View
 * Interactive island level-track where kids can:
 * 1. View the unique games native to this specific world
 * 2. Select any level (Level 1 to 5) with star ratings
 * 3. Quickly return to the World Map with 1 tap
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home, Star, Play, Sparkles, Award, Lock, CheckCircle2 } from 'lucide-react';
import { WORLDS, MINI_GAMES_MATRIX } from '../data/gameMatrix';
import { WorldMeta, MiniGameMeta } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';

interface WorldDetailViewProps {
  worldId: string;
  activeProfileId: string;
  onBackToMap: () => void;
  onLaunchGameLevel: (gameId: string, levelNumber: number) => void;
}

export const WorldDetailView: React.FC<WorldDetailViewProps> = ({
  worldId,
  activeProfileId,
  onBackToMap,
  onLaunchGameLevel
}) => {
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  const gamesInWorld = MINI_GAMES_MATRIX.filter(g => g.worldId === worldId);

  // Selected game inside this world
  const [selectedGameId, setSelectedGameId] = useState<string>(() => {
    const firstPlayable = gamesInWorld.find(g => g.playable);
    return firstPlayable?.id || gamesInWorld[0]?.id || 'game_dino_addition';
  });

  const selectedGame = gamesInWorld.find(g => g.id === selectedGameId) || gamesInWorld[0];
  const progressList = storageService.getProgressList(activeProfileId);
  const gameProgress = progressList.find(p => p.gameId === selectedGameId);

  // 5 progressive levels definition for each game
  const LEVELS = [
    { level: 1, title: 'Level 1: Beginner Spark', subtitle: 'Guided introduction with visual helpers', badge: '🌱 Easy' },
    { level: 2, title: 'Level 2: Skill Builder', subtitle: 'Expanding items & sound feedback', badge: '⭐ Standard' },
    { level: 3, title: 'Level 3: Explorer Challenge', subtitle: 'Faster challenges with bonus stars', badge: '🔥 Challenge' },
    { level: 4, title: 'Level 4: Master Puzzler', subtitle: 'Advanced thinking & concentration', badge: '💎 Master' },
    { level: 5, title: 'Level 5: Wonder Champion', subtitle: 'Ultimate level for star trophy', badge: '👑 Champion' }
  ];

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
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-800 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-white/80 transition"
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
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-fun mb-2">
            Games in this World ({gamesInWorld.length})
          </h3>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[300px]">
            {gamesInWorld.map(g => {
              const isSelected = g.id === selectedGameId;
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    soundEngine.playPop();
                    setSelectedGameId(g.id);
                  }}
                  className={`w-full p-2.5 rounded-xl border-2 text-left transition flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1 bg-slate-100 rounded-lg">{g.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 font-fun leading-tight">{g.title}</h4>
                      <span className="text-[10px] text-slate-500 block">{g.ageRecommendation}</span>
                    </div>
                  </div>
                  {g.playable ? (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Play
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400">Soon</span>
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
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedGame.icon}</span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800 font-fun">
                    {selectedGame.title} - Select Level
                  </h3>
                  <div className="flex gap-1.5 mt-0.5">
                    {selectedGame.skills.map((s, idx) => (
                      <span key={idx} className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedGame.playable && (
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    onLaunchGameLevel(selectedGame.id, 1);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-fun font-bold text-xs shadow-md flex items-center gap-1.5 transition active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Level 1</span>
                </button>
              )}
            </div>

            {/* Level Road / Track Nodes */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 my-3">
              {LEVELS.map(lvl => {
                const isPlayable = selectedGame.playable;
                return (
                  <motion.div
                    key={lvl.level}
                    whileHover={isPlayable ? { scale: 1.05 } : {}}
                    whileTap={isPlayable ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (!isPlayable) return;
                      soundEngine.playPop();
                      onLaunchGameLevel(selectedGame.id, lvl.level);
                    }}
                    className={`p-3 rounded-2xl border-2 text-center transition cursor-pointer flex flex-col justify-between ${
                      isPlayable
                        ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-200 hover:border-indigo-400 shadow-sm'
                        : 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-black font-fun text-sm flex items-center justify-center mx-auto mb-1.5 shadow">
                        {lvl.level}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider block text-indigo-800">
                        {lvl.badge}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-center text-amber-400 text-xs">
                        {isPlayable ? '⭐⭐⭐' : '🔒'}
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 block mt-0.5">
                        {isPlayable ? 'Tap to Play' : 'Locked'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Bottom helper tip */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Each level introduces richer equations, vocabulary, and puzzle mechanics adapting to child age!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
