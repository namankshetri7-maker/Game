/**
 * Wonder World Kids Website - Interactive Demo Simulator
 * Allows visitors to preview games across all 5 worlds (including the Logic world & last game)
 * in a simulated interactive sandbox before unlocking the full 45-game suite.
 */

import React, { useMemo, useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { Play, RefreshCw, Check, ShoppingBag, KeyRound, ChevronRight } from 'lucide-react';

interface FreeDemoPageProps {
  onEnterGame: () => void;
  onLaunchDemoGame?: (gameId: string) => void;
  onNavigate: (route: string) => void;
  onOpenLicenseModal?: () => void;
}

type SimulatorTabId = 'dino' | 'shapes' | 'phonics' | 'flags' | 'footprints' | 'logic';

interface MemoryCardSample {
  id: number;
  emoji: string;
  label: string;
}

const MEMORY_SAMPLE_DECK: MemoryCardSample[] = [
  { id: 0, emoji: '🦊', label: 'Fox' },
  { id: 1, emoji: '🦉', label: 'Owl' },
  { id: 2, emoji: '🦊', label: 'Fox' },
  { id: 3, emoji: '🦉', label: 'Owl' },
];

export const FreeDemoPage: React.FC<FreeDemoPageProps> = ({ onEnterGame, onLaunchDemoGame, onNavigate, onOpenLicenseModal }) => {
  const [activeSimulatorGame, setActiveSimulatorGame] = useState<SimulatorTabId>('dino');

  // World 1 (Math): Dino Addition Simulator State
  const [dinoCount1, setDinoCount1] = useState(2);
  const [dinoCount2, setDinoCount2] = useState(3);
  const [dinoUserAnswer, setDinoUserAnswer] = useState<number | null>(null);
  const [dinoFeedback, setDinoFeedback] = useState<string | null>(null);

  // World 1 (Math): Shape Sorter Simulator State
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [shapeLoaded, setShapeLoaded] = useState(false);

  // World 2 (Phonics): Word Builder Bee Simulator State
  const [wordLetters, setWordLetters] = useState<string[]>([]);
  const [wordSolved, setWordSolved] = useState(false);

  // World 3 (Geography): Flag Runner Simulator State
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null);
  const [flagFeedback, setFlagFeedback] = useState<string | null>(null);

  // World 4 (Science): Footprint Detective Simulator State
  const [selectedTrackAnimal, setSelectedTrackAnimal] = useState<string | null>(null);
  const [trackFeedback, setTrackFeedback] = useState<string | null>(null);

  // World 5 (Logic - Last World & Last Game): Memory Card Flip Simulator State
  const [flippedLogicCards, setFlippedLogicCards] = useState<number[]>([]);
  const [matchedLogicEmojis, setMatchedLogicEmojis] = useState<string[]>([]);

  // Stable options for Dino Addition so buttons never reshuffle on click
  const dinoOptions = useMemo(() => {
    const sum = dinoCount1 + dinoCount2;
    const raw = [Math.max(1, sum - 1), sum, sum + 1, sum + 2];
    const seed = dinoCount1 * 7 + dinoCount2 * 3;
    const result = [...raw];
    for (let i = result.length - 1; i > 0; i--) {
      const j = (seed + i * 5) % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, [dinoCount1, dinoCount2]);

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

  const handleSelectPhonicsLetter = (char: string) => {
    soundEngine.playLetterTone(char);
    if (wordSolved) return;
    const target = 'SUN';
    const nextIdx = wordLetters.length;
    if (char === target[nextIdx]) {
      const updated = [...wordLetters, char];
      setWordLetters(updated);
      soundEngine.playSnap();
      if (updated.length === target.length) {
        setWordSolved(true);
        soundEngine.playVictory();
      }
    } else {
      soundEngine.playOops();
    }
  };

  const handleLogicCardTap = (idx: number) => {
    const card = MEMORY_SAMPLE_DECK[idx];
    if (!card || matchedLogicEmojis.includes(card.emoji) || flippedLogicCards.includes(idx)) return;
    if (flippedLogicCards.length >= 2) return;

    soundEngine.playPop();
    const nextFlipped = [...flippedLogicCards, idx];
    setFlippedLogicCards(nextFlipped);

    if (nextFlipped.length === 2) {
      const first = MEMORY_SAMPLE_DECK[nextFlipped[0]];
      const second = MEMORY_SAMPLE_DECK[nextFlipped[1]];
      if (first.emoji === second.emoji) {
        soundEngine.playSnap();
        const updatedMatched = [...matchedLogicEmojis, first.emoji];
        setMatchedLogicEmojis(updatedMatched);
        setFlippedLogicCards([]);
        if (updatedMatched.length === 2) {
          soundEngine.playVictory();
        }
      } else {
        soundEngine.playOops();
        setTimeout(() => setFlippedLogicCards([]), 700);
      }
    }
  };

  const simulatorTabs: Array<{ id: SimulatorTabId; label: string; worldTag: string }> = [
    { id: 'dino', label: '🦕 Dino Addition', worldTag: 'Math' },
    { id: 'shapes', label: '🚂 Shape Express', worldTag: 'Math' },
    { id: 'phonics', label: '🐝 Word Bee', worldTag: 'Phonics' },
    { id: 'flags', label: '🏁 Flag Runner', worldTag: 'Geo' },
    { id: 'footprints', label: '🐾 Footprints', worldTag: 'Science' },
    { id: 'logic', label: '🃏 Memory Flip', worldTag: 'Logic' }
  ];

  const handleLink = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-[#F8FCFF] to-emerald-50 text-[#0F294A] font-body pb-14">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">Free Interactive Demo</span>
          </nav>
          <span className="font-semibold text-emerald-700">10 Free Mini-Games · Zero Sign-Up</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10">

        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-fun mb-2">
            Interactive Sandbox · Try Free Demo
          </p>

          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mb-3 tracking-tight text-balance">
            Play Sample Learning Games Across All 5 Worlds!
          </h1>

          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Test Levels 1 &amp; 2 inside our free game mode or try instant mini-activities below—no login, no ads, 100% kid-safe.
          </p>
        </div>

        {/* 2 Demo Games per World (10 Valid Games Across All 5 Worlds) */}
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm mb-8">
          <div className="text-center max-w-md mx-auto mb-5">
            <h2 className="text-xl font-black font-fun text-indigo-950 mb-1">
              Play Free Demo Games (2 Games Per World) 🏝️
            </h2>
            <p className="text-xs text-slate-600 font-bold">
              Test Levels 1 &amp; 2 for free on any of our 5 islands below. Unlock all 45 games for life!
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
                  <span>🦕 Dino Addition</span>
                  <Play className="w-3 h-3 text-blue-600 fill-current shrink-0" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_shape_sorter_express'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-blue-100 border border-blue-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🚂 Shape Express</span>
                  <Play className="w-3 h-3 text-blue-600 fill-current shrink-0" />
                </button>
              </div>
            </div>

            {/* World 2: Phonics */}
            <div className="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-emerald-900 font-fun mb-2 block">🦁 Phonics Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_word_builder_bee'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🐝 Word Builder Bee</span>
                  <Play className="w-3 h-3 text-emerald-600 fill-current shrink-0" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_phonics_popsicle'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🍧 Phonics Popsicle</span>
                  <Play className="w-3 h-3 text-emerald-600 fill-current shrink-0" />
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
                  <span>🗺️ Continent Jigsaw</span>
                  <Play className="w-3 h-3 text-amber-600 fill-current shrink-0" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_flag_runner'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🏁 Flag Runner</span>
                  <Play className="w-3 h-3 text-amber-600 fill-current shrink-0" />
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
                  <span>🐮 Animal Memory</span>
                  <Play className="w-3 h-3 text-rose-600 fill-current shrink-0" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_footprint_detective'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-rose-100 border border-rose-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🐾 Footprint Clue</span>
                  <Play className="w-3 h-3 text-rose-600 fill-current shrink-0" />
                </button>
              </div>
            </div>

            {/* World 5: Logic (Last World) */}
            <div className="bg-purple-50 border-2 border-purple-200 p-3 rounded-2xl flex flex-col justify-between">
              <span className="text-[11px] font-black uppercase text-purple-900 font-fun mb-2 block">🧩 Logic Island</span>
              <div className="space-y-2">
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_color_shadow_match'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>👤 Shadow Match</span>
                  <Play className="w-3 h-3 text-purple-600 fill-current shrink-0" />
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); onLaunchDemoGame?.('game_memory_card_flip'); }}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-purple-100 border border-purple-200 text-xs font-bold text-slate-800 transition cursor-pointer flex items-center justify-between"
                >
                  <span>🃏 Memory Card Flip</span>
                  <Play className="w-3 h-3 text-purple-600 fill-current shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Simulator Game Selector Tabs Across All 5 Worlds */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {simulatorTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { soundEngine.playPop(); setActiveSimulatorGame(tab.id); }}
              className={`px-3.5 py-2 rounded-2xl font-fun font-bold text-xs sm:text-sm transition cursor-pointer border-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeSimulatorGame === tab.id
                  ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-sm'
                  : 'bg-white text-slate-700 border-sky-200 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-80 font-black uppercase">
                · {tab.worldTag}
              </span>
            </button>
          ))}
        </div>

        {/* Simulator Sandbox Card */}
        <div className="bg-white rounded-3xl border-2 border-sky-200 shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">

          {activeSimulatorGame === 'dino' && (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-black uppercase font-fun bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                  Math Magic Valley • Dino Addition
                </span>
                <button onClick={handleResetDino} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" /> New Problem
                </button>
              </div>

              <div className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-6">
                How many dinosaurs are playing together? 🦕
              </div>

              <div className="flex items-center justify-center gap-4 text-3xl sm:text-5xl mb-6 bg-sky-50 p-6 rounded-2xl border-2 border-sky-200 w-full flex-wrap">
                <span>{Array(dinoCount1).fill('🦖').join(' ')}</span>
                <span className="text-indigo-600 font-bold">+</span>
                <span>{Array(dinoCount2).fill('🦖').join(' ')}</span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {dinoOptions.map((num, i) => (
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
                <div className="text-sm font-bold font-fun text-slate-800 bg-amber-100 border border-amber-300 px-4 py-2 rounded-xl">
                  {dinoFeedback}
                </div>
              )}
            </div>
          )}

          {activeSimulatorGame === 'shapes' && (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-black uppercase font-fun bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  Math Magic Valley • Shape Sorter Express
                </span>
                <button
                  onClick={() => { soundEngine.playPop(); setSelectedShape(null); setShapeLoaded(false); }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-4">
                Tap the Square shape to load the train car! 🚂
              </h2>

              <div className="flex items-center justify-center gap-3 p-4 bg-sky-50 rounded-2xl border-2 border-sky-200 mb-6 w-full">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-200 text-2xl sm:text-3xl font-fun font-black">
                  {shapeLoaded ? '✅ Square Car Loaded!' : '🟦 Waiting for Square'}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                {['🔴 Circle', '🟦 Square', '🔺 Triangle', '⭐ Star'].map((sh, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedShape(sh);
                      if (sh.includes('Square')) {
                        soundEngine.playVictory();
                        setShapeLoaded(true);
                      } else {
                        soundEngine.playOops();
                        setShapeLoaded(false);
                      }
                    }}
                    className={`px-4 py-3 rounded-2xl font-fun font-bold text-xs sm:text-sm border-2 transition cursor-pointer ${
                      selectedShape === sh
                        ? sh.includes('Square')
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-rose-500 text-white border-rose-600'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {sh}
                  </button>
                ))}
              </div>

              {shapeLoaded && (
                <div className="text-xs font-black font-fun text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300">
                  Choo-choo! Square loaded onto the Express train! 🚂✨
                </div>
              )}
            </div>
          )}

          {activeSimulatorGame === 'phonics' && (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-black uppercase font-fun bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  English &amp; Phonics Jungle • Word Builder Bee
                </span>
                <button
                  onClick={() => { soundEngine.playPop(); setWordLetters([]); setWordSolved(false); }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
              <div className="text-5xl mb-2">☀️</div>
              <h2 className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-4">
                Spell the glowing sky star: <strong>SUN</strong> 🐝
              </h2>

              <div className="flex items-center justify-center gap-3 mb-5">
                {[0, 1, 2].map((slot) => (
                  <div
                    key={slot}
                    className={`w-14 h-16 rounded-2xl border-3 flex items-center justify-center font-fun font-black text-2xl ${
                      wordLetters[slot]
                        ? 'bg-amber-300 border-amber-500 text-amber-950'
                        : 'bg-amber-50 border-dashed border-amber-400 text-amber-300'
                    }`}
                  >
                    {wordLetters[slot] || '?'}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                {['N', 'S', 'U', 'B'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => handleSelectPhonicsLetter(ch)}
                    className="w-12 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-fun font-black text-xl shadow-md cursor-pointer active:scale-95 transition"
                  >
                    {ch}
                  </button>
                ))}
              </div>

              {wordSolved && (
                <div className="text-xs font-black font-fun text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300">
                  🌟 Yay! You spelled SUN! Launch Word Builder Bee for all 5 levels!
                </div>
              )}
            </div>
          )}

          {activeSimulatorGame === 'flags' && (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-black uppercase font-fun bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  World Geography &amp; Cultures • Flag Runner
                </span>
                <button
                  onClick={() => { soundEngine.playPop(); setSelectedFlag(null); setFlagFeedback(null); }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
              <h2 className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-4">
                Which flag belongs to <strong>Japan</strong>? 🗾
              </h2>

              <div className="grid grid-cols-3 gap-3 max-w-md w-full mb-5">
                {[
                  { country: 'India', flag: '🇮🇳' },
                  { country: 'Japan', flag: '🇯🇵' },
                  { country: 'UAE', flag: '🇦🇪' }
                ].map((opt) => (
                  <button
                    key={opt.country}
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedFlag(opt.country);
                      if (opt.country === 'Japan') {
                        soundEngine.playVictory();
                        setFlagFeedback('🎌 Correct! The red sun circle belongs to Japan!');
                      } else {
                        soundEngine.playOops();
                        setFlagFeedback(`That is ${opt.country}! Look for the white flag with a red circle.`);
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 font-fun font-black flex flex-col items-center cursor-pointer transition ${
                      selectedFlag === opt.country
                        ? opt.country === 'Japan'
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-rose-500 text-white border-rose-600'
                        : 'bg-amber-50 hover:bg-amber-100 text-slate-900 border-amber-200'
                    }`}
                  >
                    <span className="text-4xl mb-1">{opt.flag}</span>
                    <span className="text-xs">{opt.country}</span>
                  </button>
                ))}
              </div>

              {flagFeedback && (
                <div className="text-xs font-bold font-fun text-slate-800 bg-amber-100 border border-amber-300 px-4 py-2 rounded-xl">
                  {flagFeedback}
                </div>
              )}
            </div>
          )}

          {activeSimulatorGame === 'footprints' && (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4">
                <span className="text-xs font-black uppercase font-fun bg-rose-100 text-rose-900 px-3 py-1 rounded-full">
                  Animal Kingdom &amp; Science • Footprint Detective
                </span>
                <button
                  onClick={() => { soundEngine.playPop(); setSelectedTrackAnimal(null); setTrackFeedback(null); }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
              <div className="p-4 bg-rose-50 border-2 border-rose-200 rounded-2xl mb-4 max-w-md w-full">
                <div className="text-4xl mb-2">🐾</div>
                <p className="text-xs font-bold text-slate-700">
                  Clue: 3 forward-facing toes joined by thin swimming webbing near a pond!
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 max-w-md w-full mb-4">
                {[
                  { name: 'Grizzly Bear', emoji: '🐻' },
                  { name: 'Mallard Duck', emoji: '🦆' },
                  { name: 'Wild Horse', emoji: '🐎' }
                ].map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedTrackAnimal(opt.name);
                      if (opt.name === 'Mallard Duck') {
                        soundEngine.playVictory();
                        setTrackFeedback('🔍 Case Solved! Ducks have webbed toes for swimming!');
                      } else {
                        soundEngine.playOops();
                        setTrackFeedback('Check the webbed toes clue — which animal swims in ponds?');
                      }
                    }}
                    className={`p-3 rounded-2xl border-2 font-fun font-bold text-xs flex flex-col items-center cursor-pointer transition ${
                      selectedTrackAnimal === opt.name
                        ? opt.name === 'Mallard Duck'
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : 'bg-rose-500 text-white border-rose-600'
                        : 'bg-slate-100 hover:bg-rose-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-3xl mb-1">{opt.emoji}</span>
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>

              {trackFeedback && (
                <div className="text-xs font-bold font-fun text-slate-800 bg-rose-100 border border-rose-300 px-4 py-2 rounded-xl">
                  {trackFeedback}
                </div>
              )}
            </div>
          )}

          {activeSimulatorGame === 'logic' && (
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-between w-full mb-4 flex-wrap gap-2">
                <span className="text-xs font-black uppercase font-fun bg-purple-100 text-purple-900 px-3 py-1 rounded-full">
                  Logic, Brain &amp; Creativity • Game #45 Memory Card Flip
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLaunchDemoGame?.('game_memory_card_flip')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-fun font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" /> Open Fullscreen
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setFlippedLogicCards([]);
                      setMatchedLogicEmojis([]);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-black font-fun text-slate-900 mb-4">
                Flip 2 matching cards to solve the Logic Island challenge! 🧩
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md w-full mb-5">
                {MEMORY_SAMPLE_DECK.map((card, idx) => {
                  const isMatched = matchedLogicEmojis.includes(card.emoji);
                  const isFlipped = isMatched || flippedLogicCards.includes(idx);
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleLogicCardTap(idx)}
                      className={`h-24 rounded-2xl border-3 flex flex-col items-center justify-center font-fun font-black transition cursor-pointer shadow-md ${
                        isMatched
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                          : isFlipped
                          ? 'bg-purple-100 border-purple-400 text-purple-950'
                          : 'bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-300 text-white hover:brightness-110'
                      }`}
                    >
                      {isFlipped ? (
                        <>
                          <span className="text-3xl">{card.emoji}</span>
                          <span className="text-[11px] mt-1 flex items-center gap-0.5">
                            {isMatched && <Check className="w-3 h-3 text-emerald-600" />}
                            {card.label}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">🃏</span>
                          <span className="text-[10px] uppercase mt-1 text-purple-100">Tap Flip</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {matchedLogicEmojis.length === 2 && (
                <div className="text-xs font-black font-fun text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-300">
                  🎉 Logic Island Champion! Play both levels of Shadow Match or Memory Card Flip fullscreen!
                </div>
              )}
            </div>
          )}

          {!['dino', 'shapes', 'phonics', 'flags', 'footprints', 'logic'].includes(activeSimulatorGame) && (
            <div className="flex flex-col items-center justify-center text-center py-8 px-4 bg-gradient-to-b from-indigo-50 to-amber-50 rounded-2xl border-2 border-dashed border-indigo-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-md mb-3">
                🎮
              </div>
              <h3 className="text-lg font-black font-fun text-indigo-950 mb-1">
                Ready for the Full 45-Game Adventure?
              </h3>
              <p className="text-xs text-slate-600 font-semibold max-w-md mb-4">
                Select any sample tab above to test interactive challenges across all 5 islands, or unlock the full offline app right away.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={() => { soundEngine.playPop(); onNavigate('pricing'); }}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-sm border border-amber-500 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Get Full Version</span>
                </button>
                <button
                  onClick={() => { soundEngine.playPop(); setActiveSimulatorGame('dino'); }}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-bold text-xs shadow-sm cursor-pointer"
                >
                  Load Dino Simulator
                </button>
              </div>
            </div>
          )}

          {/* Upgrade Banner inside Simulator */}
          <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
            <div>
              <div className="font-fun font-black text-sm text-indigo-950">Want all 45 games across all 5 worlds?</div>
              <div className="text-xs text-indigo-700">Get your lifetime family license ($9 on Gumroad) or enter your activation key to install the offline PWA app!</div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => { soundEngine.playPop(); onNavigate('pricing'); }}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-xs shadow-sm border border-amber-500 flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Get Full Version</span>
              </button>
              {onOpenLicenseModal && (
                <button
                  onClick={() => { soundEngine.playPop(); onOpenLicenseModal(); }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-fun font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Enter Key</span>
                </button>
              )}
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
