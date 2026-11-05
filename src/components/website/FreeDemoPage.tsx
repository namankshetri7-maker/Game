/**
 * Wonder World Kids Website - Interactive Demo Simulator
 * Allows visitors to preview 2-3 games in a simulated interactive sandbox before unlocking the full game.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { Play, Sparkles, CheckCircle2, ShoppingBag, ArrowRight, RefreshCw, Star } from 'lucide-react';

interface FreeDemoPageProps {
  onEnterGame: () => void;
  onLaunchDemoGame?: (gameId: string) => void;
  onNavigate: (route: string) => void;
}

export const FreeDemoPage: React.FC<FreeDemoPageProps> = ({ onEnterGame, onLaunchDemoGame, onNavigate }) => {
  const [activeSimulatorGame, setActiveSimulatorGame] = useState<'dino' | 'shapes' | 'phonics'>('dino');
  
  // Dino Addition Simulator State
  const [dinoCount1, setDinoCount1] = useState(2);
  const [dinoCount2, setDinoCount2] = useState(3);
  const [dinoUserAnswer, setDinoUserAnswer] = useState<number | null>(null);
  const [dinoFeedback, setDinoFeedback] = useState<string | null>(null);

  // Shape Sorter Simulator State
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [shapeLoaded, setShapeLoaded] = useState(false);

  const handleCheckDino = (ans: number) => {
    soundEngine.playPop();
    setDinoUserAnswer(ans);
    if (ans === dinoCount1 + dinoCount2) {
      soundEngine.playVictory();
      setDinoFeedback('🎉 Correct! Amazing math skills!');
    } else {
      soundEngine.playSnap();
      setDinoFeedback('❌ Try again! Count the dinos carefully.');
    }
  };

  const handleResetDino = () => {
    soundEngine.playPop();
    setDinoCount1(Math.floor(Math.random() * 4) + 1);
    setDinoCount2(Math.floor(Math.random() * 4) + 1);
    setDinoUserAnswer(null);
    setDinoFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-600 text-slate-800 font-body py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-indigo-900 text-xs font-black font-fun mb-3 shadow-sm border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Interactive Demo & Sandbox</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mb-3 drop-shadow-sm">
            Wonder World Kids Learning Demo! 🎮
          </h1>

          <p className="text-sm text-white font-bold drop-shadow-xs">
            Play our free sample levels directly inside the demo mode, or test the interactive web simulator below!
          </p>
        </div>

        {/* 2 Demo Games per World (10 Games Total Across 5 Worlds) */}
        <div className="bg-white/95 rounded-3xl p-6 border-4 border-white shadow-xl mb-8">
          <div className="text-center max-w-md mx-auto mb-5">
            <h2 className="text-xl font-black font-fun text-indigo-950 mb-1">
              Play Free Demo Games (2 Games Per World) 🏝️
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Test Levels 1 & 2 for free on any island below. Unlock all 45 games for $9 USD!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {/* World 1: Math */}
            <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-blue-900 font-fun mb-2 block">🔢 Math Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_dino_addition'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-blue-100 border border-blue-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🦖 Dino Addition</span>
                  <Play className="w-3 h-3 text-blue-600 fill-current" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_shape_sorter_express'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-blue-100 border border-blue-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🚂 Shape Express</span>
                  <Play className="w-3 h-3 text-blue-600 fill-current" />
                </button>
              </div>
            </div>

            {/* World 2: Phonics */}
            <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-900 font-fun mb-2 block">🔤 Phonics Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_word_builder_bee'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🐝 Word Builder Bee</span>
                  <Play className="w-3 h-3 text-emerald-600 fill-current" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_abc_phonics_pop'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🎈 ABC Phonics Pop</span>
                  <Play className="w-3 h-3 text-emerald-600 fill-current" />
                </button>
              </div>
            </div>

            {/* World 3: Geography */}
            <div className="bg-amber-50 border-2 border-amber-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-amber-900 font-fun mb-2 block">🌍 Geography Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_continent_jigsaw'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🧩 Continent Jigsaw</span>
                  <Play className="w-3 h-3 text-amber-600 fill-current" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_flag_match_explorer'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🚩 Flag Explorer</span>
                  <Play className="w-3 h-3 text-amber-600 fill-current" />
                </button>
              </div>
            </div>

            {/* World 4: Science */}
            <div className="bg-rose-50 border-2 border-rose-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-rose-900 font-fun mb-2 block">🐾 Science Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_animal_sound_memory'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🐶 Animal Memory</span>
                  <Play className="w-3 h-3 text-rose-600 fill-current" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_color_shadow_match'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🎨 Shadow Match</span>
                  <Play className="w-3 h-3 text-rose-600 fill-current" />
                </button>
              </div>
            </div>

            {/* World 5: Logic */}
            <div className="bg-purple-50 border-2 border-purple-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-purple-900 font-fun mb-2 block">🧠 Logic Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_pattern_block_builder'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🧱 Pattern Builder</span>
                  <Play className="w-3 h-3 text-purple-600 fill-current" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_memory_match_matrix'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>✨ Memory Matrix</span>
                  <Play className="w-3 h-3 text-purple-600 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simulator Game Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => { soundEngine.playPop(); setActiveSimulatorGame('dino'); }}
            className={`px-4 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm transition cursor-pointer border-2 ${
              activeSimulatorGame === 'dino' ? 'bg-amber-400 text-amber-950 border-white shadow-md scale-105' : 'bg-white/80 text-slate-700 border-transparent'
            }`}
          >
            🦕 Dino Addition (Level 1)
          </button>
          <button
            onClick={() => { soundEngine.playPop(); setActiveSimulatorGame('shapes'); }}
            className={`px-4 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm transition cursor-pointer border-2 ${
              activeSimulatorGame === 'shapes' ? 'bg-amber-400 text-amber-950 border-white shadow-md scale-105' : 'bg-white/80 text-slate-700 border-transparent'
            }`}
          >
            🚂 Shape Sorter Express
          </button>
        </div>

        {/* Simulator Sandbox Card */}
        <div className="bg-white rounded-3xl border-4 border-white shadow-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
          
          {activeSimulatorGame === 'dino' ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-black uppercase font-fun bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  Math Magic Valley • Level 1 Beginner
                </span>
                <button onClick={handleResetDino} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /> New Problem
                </button>
              </div>

              <div className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-6">
                How many dinosaurs are playing together? 🦖
              </div>

              <div className="flex items-center justify-center gap-4 text-4xl sm:text-5xl mb-6 bg-sky-50 p-6 rounded-2xl border-2 border-sky-200 w-full">
                <span>{Array(dinoCount1).fill('🦖').join(' ')}</span>
                <span className="text-indigo-600 font-bold">+</span>
                <span>{Array(dinoCount2).fill('🦖').join(' ')}</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {[dinoCount1 + dinoCount2 - 1, dinoCount1 + dinoCount2, dinoCount1 + dinoCount2 + 1, dinoCount1 + dinoCount2 + 2].sort(() => Math.random() - 0.5).map((num, i) => (
                  <button
                    key={i}
                    onClick={() => handleCheckDino(num)}
                    className={`w-14 h-14 rounded-2xl font-fun font-black text-xl shadow-md border-2 transition cursor-pointer ${
                      dinoUserAnswer === num
                        ? num === dinoCount1 + dinoCount2
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-rose-500 text-white border-rose-600'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {dinoFeedback && (
                <div className="text-sm font-bold font-fun text-slate-800 bg-amber-100 border border-amber-300 px-4 py-2 rounded-xl animate-bounce">
                  {dinoFeedback}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-black uppercase font-fun bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full mb-3">
                Math Magic Valley • Shape Sorter Express
              </span>
              <h2 className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-4">
                Tap the correct shape to load the train car! 🚂
              </h2>

              <div className="flex items-center justify-center gap-3 p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 mb-6 w-full">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 text-3xl">
                  {shapeLoaded ? '✅ Loaded!' : '🟦 Square Slot'}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {['🔴 Circle', '🟦 Square', '🔺 Triangle', '⭐ Star'].map((sh, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      soundEngine.playSnap();
                      setSelectedShape(sh);
                      setShapeLoaded(true);
                    }}
                    className={`px-4 py-3 rounded-2xl font-fun font-bold text-xs sm:text-sm border-2 transition cursor-pointer ${
                      selectedShape === sh ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>

              {shapeLoaded && (
                <div className="text-xs font-black font-fun text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300">
                  Choo-choo! Shape loaded onto the Express train! 🚂✨
                </div>
              )}
            </div>
          )}

          {/* Upgrade Banner inside Simulator */}
          <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
            <div>
              <div className="font-fun font-black text-sm text-indigo-950">Want all 45 games across 5 worlds?</div>
              <div className="text-xs text-indigo-700">Unlock the full version for $9 USD or install the PWA app!</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { soundEngine.playPop(); onNavigate('pricing'); }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-sm border border-amber-500 cursor-pointer"
              >
                Unlock Full ($9)
              </button>
              <button
                onClick={() => { soundEngine.playPop(); onEnterGame(); }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-sm cursor-pointer"
              >
                Explore Demo Map
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
