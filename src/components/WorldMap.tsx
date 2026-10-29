/**
 * 2D Interactive World Map
 * Connects the 5 thematic worlds with animated paths, level stars,
 * and quick access to the mini-games catalog.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, Play, Lock, Sparkles, MapPin, Award, Compass } from 'lucide-react';
import { WORLDS } from '../data/gameMatrix';
import { WorldMeta } from '../types/game';
import { soundEngine } from '../services/soundEngine';
import { storageService } from '../services/storageService';

interface WorldMapProps {
  activeProfileId: string;
  onSelectWorld: (worldId: string) => void;
  onOpenDirectory: () => void;
  onOpenStickerBook: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  activeProfileId,
  onSelectWorld,
  onOpenDirectory,
  onOpenStickerBook
}) => {
  const stats = storageService.getAggregatedStats(activeProfileId);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-gradient-to-b from-sky-400 via-indigo-400 to-indigo-900 rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none border-4 border-indigo-200 shadow-2xl">
      {/* Whimsical background clouds & stars */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-6 left-10 text-4xl animate-kid-bounce">☁️</div>
        <div className="absolute top-16 right-16 text-5xl animate-kid-bounce" style={{ animationDelay: '1s' }}>☁️</div>
        <div className="absolute top-36 left-1/3 text-3xl animate-kid-bounce" style={{ animationDelay: '1.5s' }}>☁️</div>
        <div className="absolute bottom-16 right-1/4 text-2xl">✨</div>
        <div className="absolute bottom-28 left-16 text-2xl">✨</div>
      </div>

      {/* Top Banner */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 border-2 border-white shadow-md flex items-center justify-center text-2xl">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-fun drop-shadow-md">
                Wonder World Map
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-bold border border-emerald-400/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                100% Offline
              </span>
            </div>
            <p className="text-xs text-white/90 font-bold font-body">
              Choose an adventure island to play & explore!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sticker Book button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenStickerBook();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md border-2 border-white transition active:scale-95"
          >
            <Award className="w-4 h-4" />
            <span>Sticker Book ({stats.unlockedStickersCount})</span>
          </button>

          {/* 45 Games Matrix button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenDirectory();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-indigo-900 font-fun font-bold text-xs shadow-md border-2 border-indigo-200 transition active:scale-95"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>All 45 Games</span>
          </button>
        </div>
      </div>

      {/* The 5 Thematic World Islands */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 my-auto py-4">
        {WORLDS.map((world, idx) => {
          const worldStars = stats.subjectStats[world.subject]?.stars || 0;
          return (
            <motion.div
              key={world.id}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundEngine.playPop();
                onSelectWorld(world.id);
              }}
              className="relative bg-white/95 rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-white cursor-pointer flex flex-col justify-between group transition-all"
            >
              {/* Island Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-fun">
                    World {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>{worldStars}</span>
                  </div>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-100 to-white border-2 border-slate-200 shadow-inner flex items-center justify-center text-4xl mb-3 mx-auto group-hover:scale-110 transition">
                  {world.icon}
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-800 font-fun text-center leading-tight mb-1">
                  {world.title}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 font-body text-center line-clamp-2">
                  {world.subtitle}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                <div
                  className={`w-full py-2.5 rounded-xl font-fun font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md bg-gradient-to-r ${world.bgGradient} group-hover:brightness-110`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter Island ({world.gameCount} Games)</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 border-2 border-white shadow-lg flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-lg">{stats.profile.avatar}</span>
          <span className="text-slate-900 font-black font-fun text-sm">
            Playing as: {stats.profile.name} (Age {stats.profile.age})
          </span>
          <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
            {stats.profile.ageGroup === '3-4' ? 'Preschool / Early' : stats.profile.ageGroup === '5-7' ? 'Primary Explorer' : 'Junior Master'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-600 font-black font-fun text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Total Stars: {stats.totalStars} ⭐</span>
          </div>
          <div className="text-emerald-700 font-bold">
            Accuracy: {stats.accuracyPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};
