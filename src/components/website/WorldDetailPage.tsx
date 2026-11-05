/**
 * Wonder World Kids Website - Individual World Detail Page
 * Shows world info, list of games, demo buttons, and unlock full game button.
 */

import React from 'react';
import { WORLDS, MINI_GAMES_MATRIX } from '../../data/gameMatrix';
import { soundEngine } from '../../services/soundEngine';
import { Play, ArrowLeft, Star, ShoppingBag, Download } from 'lucide-react';

interface WorldDetailPageProps {
  worldId: string;
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame: () => void;
}

export const WorldDetailPage: React.FC<WorldDetailPageProps> = ({ worldId, onNavigate, onEnterGame }) => {
  const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];
  const gamesInWorld = MINI_GAMES_MATRIX.filter(g => g.worldId === world.id);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Back button */}
        <button
          onClick={() => { soundEngine.playPop(); onNavigate('worlds'); }}
          className="flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Worlds</span>
        </button>

        {/* World Hero Card */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl border-3 border-amber-400 p-8 shadow-2xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <span className="text-5xl p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              {world.icon}
            </span>
            <div>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-fun">
                {world.subject.toUpperCase()} World
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-fun text-white mt-2 mb-1">
                {world.title}
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                {world.subtitle} • {gamesInWorld.length} Curriculum Mini-Games
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { soundEngine.playPop(); onNavigate('pricing'); }}
              className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer border-2 border-white"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Unlock All Games ($9)</span>
            </button>
          </div>
        </div>

        {/* Games Available in this World */}
        <h2 className="text-2xl font-black font-fun text-white mb-6">
          Games Included in {world.title} ({gamesInWorld.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gamesInWorld.map((game, idx) => (
            <div key={game.id} className="bg-slate-800/90 rounded-2xl p-5 border border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl p-2 bg-slate-900 rounded-xl border border-slate-700">{game.icon}</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-fun">{game.title}</h3>
                  <p className="text-[11px] text-slate-400">{game.ageRecommendation} • {game.skills.slice(0, 2).join(', ')}</p>
                </div>
              </div>

              <button
                onClick={() => { soundEngine.playPop(); onNavigate('pricing'); }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md transition shrink-0 cursor-pointer flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Unlock ($9)</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
