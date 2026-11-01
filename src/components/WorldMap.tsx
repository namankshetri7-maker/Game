/**
 * 2D Interactive World Map
 * Connects the 5 thematic worlds with animated paths, level stars,
 * and quick access to the mini-games catalog in a bright, colorful, kid-friendly theme.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Star, Play, Sparkles, Award, Compass } from 'lucide-react';
import { WORLDS } from '../data/gameMatrix';
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

  const ISLAND_THEMES = [
    { border: 'border-emerald-300', bg: 'bg-emerald-50/80 hover:bg-emerald-100/90', text: 'text-emerald-950', ring: 'ring-emerald-400' },
    { border: 'border-amber-300', bg: 'bg-amber-50/80 hover:bg-amber-100/90', text: 'text-amber-950', ring: 'ring-amber-400' },
    { border: 'border-sky-300', bg: 'bg-sky-50/80 hover:bg-sky-100/90', text: 'text-sky-950', ring: 'ring-sky-400' },
    { border: 'border-pink-300', bg: 'bg-pink-50/80 hover:bg-pink-100/90', text: 'text-pink-950', ring: 'ring-pink-400' },
    { border: 'border-purple-300', bg: 'bg-purple-50/80 hover:bg-purple-100/90', text: 'text-purple-950', ring: 'ring-purple-400' }
  ];

  return (
    <div className="relative w-full h-full min-h-[580px] bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-500 rounded-3xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none border-4 border-white shadow-2xl">
      {/* Whimsical background clouds, sun & stars */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-4 left-6 text-5xl animate-kid-bounce">☀️</div>
        <div className="absolute top-6 left-28 text-4xl animate-kid-bounce" style={{ animationDelay: '0.5s' }}>☁️</div>
        <div className="absolute top-12 right-20 text-5xl animate-kid-bounce" style={{ animationDelay: '1.2s' }}>☁️</div>
        <div className="absolute top-28 left-1/3 text-4xl animate-kid-bounce" style={{ animationDelay: '1.8s' }}>🌈</div>
        <div className="absolute bottom-20 right-1/4 text-3xl">✨</div>
        <div className="absolute bottom-24 left-14 text-3xl">✨</div>

        {/* Winding Connecting Trail SVG across islands */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <path d="M 100 300 Q 300 200, 500 300 T 900 300" stroke="#FFFFFF" strokeWidth="8" strokeDasharray="16 12" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* Top Banner */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-400 border-2 border-white shadow-md flex items-center justify-center text-2xl">
            🗺️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-fun drop-shadow-md">
                WonderWorld Map! 🌟
              </h1>
              <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-white/95 text-indigo-900 shadow-sm font-fun flex items-center gap-1 border border-white">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                5 Magical Islands · 45 Games
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/95 font-bold font-body drop-shadow-sm mt-0.5">
              Tap any island to enter games and earn golden stars! ⭐
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sticker Book button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenStickerBook();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-white transition active:scale-95 cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-900" />
            <span>Stickers ({stats.unlockedStickersCount})</span>
          </button>

          {/* 45 Games Matrix button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenDirectory();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white hover:bg-indigo-50 text-indigo-900 font-fun font-bold text-xs sm:text-sm shadow-md border-2 border-indigo-200 transition active:scale-95 cursor-pointer"
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
          const theme = ISLAND_THEMES[idx % ISLAND_THEMES.length];

          return (
            <motion.div
              key={world.id}
              whileHover={{ scale: 1.06, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                soundEngine.playPop();
                onSelectWorld(world.id);
              }}
              className={`relative ${theme.bg} rounded-3xl p-4 sm:p-5 shadow-2xl border-4 ${theme.border} cursor-pointer flex flex-col justify-between group transition-all`}
            >
              {/* Floating Island Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 font-fun bg-white/90 px-2 py-0.5 rounded-full border border-indigo-200 shadow-sm">
                  Island {idx + 1}
                </span>
                <div className="flex items-center gap-1 text-amber-900 text-xs font-black font-fun bg-amber-300 px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                  <span>{worldStars}</span>
                </div>
              </div>

              {/* Island Icon Emblem */}
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-3xl bg-white shadow-md border-3 border-white flex items-center justify-center text-4xl sm:text-5xl my-2 mx-auto group-hover:rotate-6 group-hover:scale-110 transition duration-300">
                {world.icon}
              </div>

              {/* Title & Subtitle */}
              <div className="text-center my-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-fun leading-tight mb-0.5">
                  {world.title}
                </h3>
                <p className="text-[11px] font-bold text-slate-600 font-body line-clamp-2">
                  {world.subtitle}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                <div
                  className={`w-full py-2.5 rounded-2xl font-fun font-black text-xs text-white flex items-center justify-center gap-1.5 shadow-md bg-gradient-to-r ${world.bgGradient} group-hover:brightness-110 border-2 border-white transition`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Enter · {world.gameCount} Games</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl px-5 py-3 border-2 border-white shadow-lg flex items-center justify-between flex-wrap gap-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{stats.profile.avatar}</span>
          <span className="text-slate-900 font-black font-fun text-sm sm:text-base">
            {stats.profile.name} (Age {stats.profile.age})
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-indigo-700 font-extrabold font-fun bg-indigo-100 px-2.5 py-0.5 rounded-lg border border-indigo-200">
            {stats.profile.ageGroup === '3-4' ? 'Preschool Explorer' : stats.profile.ageGroup === '5-7' ? 'Primary Adventurer' : 'Junior Master'}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-amber-900 font-black font-fun text-sm bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
            <Sparkles className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>Total Stars: {stats.totalStars} ⭐</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <div className="text-emerald-800 font-extrabold font-fun bg-emerald-100 px-3 py-1 rounded-xl border border-emerald-300 hidden sm:block">
            Accuracy: {stats.accuracyPercent}%
          </div>
        </div>
      </div>
    </div>
  );
};
