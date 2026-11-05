/**
 * Wonder World Kids Website - Explore Worlds Page (Kid-Friendly & Colorful)
 */

import React from 'react';
import { motion } from 'motion/react';
import { WORLDS, MINI_GAMES_MATRIX } from '../../data/gameMatrix';
import { soundEngine } from '../../services/soundEngine';
import { ChevronRight, Play, Star, Sparkles } from 'lucide-react';

interface ExploreWorldsPageProps {
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame: () => void;
}

export const ExploreWorldsPage: React.FC<ExploreWorldsPageProps> = ({ onNavigate, onEnterGame }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-600 text-slate-800 font-body py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-indigo-900 text-xs font-black font-fun mb-2 shadow-sm border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Curriculum Islands</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mb-4 drop-shadow-sm">
            Explore All 5 Learning Worlds! 🏝️
          </h1>
          <p className="text-sm sm:text-base text-white font-bold drop-shadow-xs">
            Each island features 10 fun educational mini-games designed to build math, reading, geography, science, and logic skills.
          </p>
        </div>

        {/* Worlds Grid */}
        <div className="space-y-6">
          {WORLDS.map((world, idx) => {
            const worldGames = MINI_GAMES_MATRIX.filter(g => g.worldId === world.id);
            const CARD_STYLES = [
              'bg-blue-500 border-blue-300',
              'bg-emerald-500 border-emerald-300',
              'bg-amber-500 border-amber-300',
              'bg-rose-500 border-rose-300',
              'bg-purple-500 border-purple-300'
            ];

            return (
              <div
                key={world.id}
                className={`${CARD_STYLES[idx % CARD_STYLES.length]} rounded-3xl border-4 p-6 sm:p-8 shadow-2xl text-white flex flex-col lg:flex-row items-center justify-between gap-8`}
              >
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-5xl p-2 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white">{world.icon}</span>
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white text-slate-900 font-fun shadow-sm">
                      Island {idx + 1} • {world.gameCount} Games
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-fun text-white mb-2 drop-shadow-xs">
                    {world.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/95 font-medium leading-relaxed mb-6">
                    {world.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {worldGames.slice(0, 5).map((game, gIdx) => (
                      <span key={gIdx} className="text-xs bg-white/20 backdrop-blur-md text-white font-bold px-3 py-1 rounded-xl border border-white/30 font-fun">
                        {game.icon} {game.title}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => {
                        soundEngine.playPop();
                        onNavigate('world_detail', world.id);
                      }}
                      className="px-6 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-fun font-black text-xs shadow-lg transition cursor-pointer border-2 border-white"
                    >
                      View Island Details ⭐
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.playPop();
                        onNavigate('pricing');
                      }}
                      className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-lg transition cursor-pointer border-2 border-amber-500 flex items-center gap-1.5"
                    >
                      <span>Unlock World ($9)</span>
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-96 bg-white/90 backdrop-blur-md rounded-2xl p-5 border-2 border-white shadow-lg text-slate-800">
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 font-fun mb-3">
                    ⭐ Learning Objectives
                  </h3>
                  <ul className="space-y-2 text-xs font-bold text-slate-700 font-fun">
                    <li className="flex items-center gap-2">🌱 Adaptive difficulty levels (1–5)</li>
                    <li className="flex items-center gap-2">⭐ Positive voice & sound feedback</li>
                    <li className="flex items-center gap-2">🏆 Golden stars & sticker rewards</li>
                    <li className="flex items-center gap-2">📶 100% offline ready</li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
