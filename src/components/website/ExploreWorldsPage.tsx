/**
 * Wonder World Kids Website - Explore Worlds Page (Bright Storybook Palette & Crisp Vector Emblems)
 */

import React from 'react';
import { ChevronRight, Check, Play } from 'lucide-react';
import { WORLDS, MINI_GAMES_MATRIX } from '../../data/gameMatrix';
import { WorldEmblem } from './WorldEmblem';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';

interface ExploreWorldsPageProps {
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame: () => void;
}

const WORLD_THEMES = [
  {
    card: 'bg-sky-50 border-sky-200',
    heading: 'text-sky-950',
    tag: 'text-sky-700',
    chip: 'bg-white border-sky-200 text-[#0F294A]',
    cta: 'bg-sky-600 hover:bg-sky-700 text-white',
  },
  {
    card: 'bg-emerald-50 border-emerald-200',
    heading: 'text-emerald-950',
    tag: 'text-emerald-700',
    chip: 'bg-white border-emerald-200 text-[#0F294A]',
    cta: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    card: 'bg-amber-50 border-amber-200',
    heading: 'text-amber-950',
    tag: 'text-amber-800',
    chip: 'bg-white border-amber-200 text-[#0F294A]',
    cta: 'bg-amber-500 hover:bg-amber-600 text-amber-950',
  },
  {
    card: 'bg-rose-50 border-rose-200',
    heading: 'text-rose-950',
    tag: 'text-rose-700',
    chip: 'bg-white border-rose-200 text-[#0F294A]',
    cta: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  {
    card: 'bg-violet-50 border-violet-200',
    heading: 'text-violet-950',
    tag: 'text-violet-700',
    chip: 'bg-white border-violet-200 text-[#0F294A]',
    cta: 'bg-violet-600 hover:bg-violet-700 text-white',
  },
];

export const ExploreWorldsPage: React.FC<ExploreWorldsPageProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent, route: string, worldId?: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route, worldId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-[#F8FCFF] to-white text-[#0F294A] font-body pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">5 Learning Worlds</span>
          </nav>
          <span className="font-semibold text-sky-700">45 Educational Mini-Games · Ages 3–8</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 font-fun mb-2">
            Early Learning Curriculum · Ages 3–8
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mb-4 tracking-tight text-balance">
            Explore All 5 Wonder Learning Worlds
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Discover 45 educational mini-games designed to build math, phonics, geography, animal science, and logic skills offline across Mac, iPhone, iPad, Windows, and Android.
          </p>
        </div>

        {/* Worlds Grid */}
        <div className="space-y-6">
          {WORLDS.map((world, idx) => {
            const worldGames = MINI_GAMES_MATRIX.filter((g) => g.worldId === world.id);
            const theme = WORLD_THEMES[idx % WORLD_THEMES.length];

            return (
              <div
                key={world.id}
                className={`${theme.card} rounded-3xl border-2 p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row items-stretch justify-between gap-6`}
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-3">
                      <WorldEmblem worldId={world.id} size="lg" />
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider font-fun tabular-nums block ${theme.tag}`}>
                          World {idx + 1} · {world.gameCount} Games
                        </span>
                        <h2 className={`text-2xl sm:text-3xl font-black font-fun ${theme.heading}`}>
                          {world.title}
                        </h2>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 font-medium leading-relaxed mb-5 max-w-2xl">
                      {world.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {worldGames.slice(0, 5).map((game) => (
                        <span
                          key={game.id}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border font-fun ${theme.chip}`}
                        >
                          {game.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={getRoutePath('world_detail', world.id)}
                      onClick={(e) => handleLink(e, 'world_detail', world.id)}
                      className={`px-5 py-3 rounded-xl font-fun font-black text-xs shadow-xs transition cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap ${theme.cta}`}
                    >
                      <span>View World Games</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                    <a
                      href={getRoutePath('demo')}
                      onClick={(e) => handleLink(e, 'demo')}
                      className="px-5 py-3 rounded-xl bg-white hover:bg-sky-50 text-[#0F294A] font-fun font-bold text-xs border border-sky-200 transition cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-emerald-600" />
                      <span>Try Free Demo</span>
                    </a>
                  </div>
                </div>

                <div className="w-full lg:w-80 bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xs text-[#0F294A] flex flex-col justify-center">
                  <h3 className="text-xs font-black uppercase tracking-wider text-sky-800 font-fun mb-3">
                    Learning Objectives
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Adaptive difficulty levels (1–5)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Gentle voice &amp; sound feedback</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Star &amp; sticker album rewards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>100% ad-free &amp; offline ready</span>
                    </li>
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
