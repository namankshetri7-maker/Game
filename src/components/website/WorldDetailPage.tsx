/**
 * Wonder World Kids Website - Individual World Detail Page
 * Uses crisp WorldEmblem icons and daytime storybook palette.
 */

import React from 'react';
import { WORLDS, MINI_GAMES_MATRIX } from '../../data/gameMatrix';
import { WorldEmblem } from './WorldEmblem';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { ArrowLeft, ShoppingBag, Play } from 'lucide-react';

interface WorldDetailPageProps {
  worldId: string;
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame: () => void;
}

export const WorldDetailPage: React.FC<WorldDetailPageProps> = ({ worldId, onNavigate }) => {
  const world = WORLDS.find((w) => w.id === worldId) || WORLDS[0];
  const gamesInWorld = MINI_GAMES_MATRIX.filter((g) => g.worldId === world.id);

  const handleLink = (e: React.MouseEvent, route: string, wId?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, wId);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#0F294A] font-body py-10 sm:py-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <a
          href={getRoutePath('worlds')}
          onClick={(e) => handleLink(e, 'worlds')}
          className="inline-flex items-center gap-2 text-xs font-bold font-fun text-sky-700 hover:text-sky-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Worlds</span>
        </a>

        {/* World Hero Banner */}
        <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-sm mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <WorldEmblem worldId={world.id} size="lg" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun block">
                {world.subject} World · {gamesInWorld.length} Mini-Games
              </span>
              <h1 className="text-2xl sm:text-4xl font-black font-fun text-[#0F294A] mt-0.5 mb-1">
                {world.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">{world.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={getRoutePath('demo')}
              onClick={(e) => handleLink(e, 'demo')}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-black text-xs shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Try Free Demo</span>
            </a>
            <a
              href={getRoutePath('pricing')}
              onClick={(e) => handleLink(e, 'pricing')}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Unlock All Games</span>
            </a>
          </div>
        </div>

        {/* Games List */}
        <h2 className="text-xl sm:text-2xl font-black font-fun text-[#0F294A] mb-5">
          Games Included in {world.title} ({gamesInWorld.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {gamesInWorld.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-200 shadow-xs flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <WorldEmblem worldId={world.id} size="sm" />
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F294A] font-fun truncate">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate">
                    {game.ageRecommendation} · {game.skills.slice(0, 2).join(', ')}
                  </p>
                </div>
              </div>

              <a
                href={getRoutePath('pricing')}
                onClick={(e) => handleLink(e, 'pricing')}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs transition shrink-0 cursor-pointer inline-flex items-center gap-1 whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Unlock</span>
              </a>
            </div>
          ))}
        </div>

        {/* Cross-linking other worlds */}
        <div className="pt-7 border-t border-sky-200">
          <h3 className="text-xs font-black font-fun text-slate-600 mb-3 uppercase tracking-wider">
            Explore Other Worlds
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {WORLDS.filter((w) => w.id !== world.id).map((other) => (
              <a
                key={other.id}
                href={getRoutePath('world_detail', other.id)}
                onClick={(e) => handleLink(e, 'world_detail', other.id)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-sky-50 text-[#0F294A] text-xs font-fun font-bold border border-sky-200 transition inline-flex items-center gap-2"
              >
                <WorldEmblem worldId={other.id} size="sm" className="w-6 h-6 rounded-lg" />
                <span>{other.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
