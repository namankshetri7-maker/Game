/**
 * Wonder World Kids Website - Kid-Friendly Homepage
 * Bright, colorful, joyful 3D cartoon gaming universe with floating islands and bouncing mascots.
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Sparkles,
  Compass,
  Shield,
  ChevronRight,
  Lock,
  Globe
} from 'lucide-react';
import { WORLDS } from '../../data/gameMatrix';
import { soundEngine } from '../../services/soundEngine';

interface HomePageProps {
  onNavigate: (route: string, worldId?: string) => void;
  onEnterGame: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onEnterGame }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-indigo-600 text-slate-800 font-body selection:bg-amber-400 selection:text-amber-950 relative overflow-hidden">
      
      {/* Whimsical background clouds, sun & stars matching the game map */}
      <div className="absolute inset-0 pointer-events-none opacity-70 overflow-hidden">
        <div className="absolute top-6 left-10 text-6xl animate-bounce" style={{ animationDuration: '4s' }}>☀️</div>
        <div className="absolute top-10 left-32 text-4xl animate-bounce" style={{ animationDuration: '5s' }}>☁️</div>
        <div className="absolute top-20 right-24 text-5xl animate-bounce" style={{ animationDuration: '6s' }}>☁️</div>
        <div className="absolute top-36 left-1/3 text-4xl animate-bounce" style={{ animationDuration: '7s' }}>🌈</div>
        <div className="absolute bottom-32 right-1/4 text-3xl">✨</div>
        <div className="absolute bottom-40 left-20 text-3xl">🎈</div>
      </div>

      {/* 1. Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-indigo-900 text-xs sm:text-sm font-black font-fun mb-6 shadow-md border-2 border-indigo-200">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Educational Game Suite • Ages 3–8</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-fun tracking-tight text-white mb-6 drop-shadow-md leading-tight">
          A Whole World of <span className="text-amber-300 drop-shadow">Fun & Learning!</span> 🚀
        </h1>

        <p className="text-base sm:text-xl text-white max-w-2xl font-bold mb-10 leading-relaxed drop-shadow-sm">
          Explore magical islands, play 45 exciting mini-games, and collect golden stars with Wonder World Kids!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center mb-12">
          <button
            onClick={() => { soundEngine.playPop(); onNavigate('worlds'); }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-base shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-3 border-white"
          >
            <Compass className="w-5 h-5 text-amber-900" />
            <span>Explore Worlds 🗺️</span>
          </button>
          <button
            onClick={() => { soundEngine.playPop(); onNavigate('demo'); }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-black text-base shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-3 border-white animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Try Free Demo ✨</span>
          </button>
        </div>
      </section>

      {/* 2. Featured Worlds Section */}
      <section id="worlds" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-black font-fun text-white mt-2 drop-shadow-sm">
            Choose Your Adventure Island! 🏝️
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORLDS.map((world, idx) => {
            const ISLAND_BG = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
            return (
              <motion.div
                key={world.id}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => { soundEngine.playPop(); onNavigate('world_detail', world.id); }}
                className={`rounded-3xl p-6 shadow-2xl border-4 border-white cursor-pointer flex flex-col group transition-all ${ISLAND_BG[idx % ISLAND_BG.length]} text-white`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl p-3 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white">{world.icon}</span>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white text-slate-900 font-fun shadow-sm">
                    {world.gameCount} Games
                  </span>
                </div>
                <h3 className="text-xl font-black font-fun mb-2">{world.title}</h3>
                <p className="text-xs text-white/95 font-medium mb-6 flex-1">{world.description}</p>
                <div className="flex items-center justify-between text-xs font-black font-fun border-t border-white/20 pt-4">
                  <span>Enter Island</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. About & Passion Section */}
      <section id="about" className="relative z-10 py-16 px-4 bg-slate-900/10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-slate-100">
          <h2 className="text-3xl font-black font-fun text-indigo-950 mb-6">Wonder World: Passion for Kids Learning</h2>
          <p className="text-base text-slate-700 mb-8 leading-relaxed">
            Wonder World Kids Learning was created with a simple mission: to make learning a joyful adventure. We believe children thrive when education is immersive, interactive, and completely under their control. By combining 45 fun, age-appropriate mini-games with a safe digital environment, we help children build core skills in Math, Reading, and Logic without the distraction of ads or the concern of data tracking. It is a one-time investment for a lifetime of curiosity and skill-building.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-bold text-slate-800">
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="font-fun text-xl text-indigo-950 mb-3">For Your Child</h3>
              <p className="text-sm font-medium leading-relaxed">Boost confidence through immersive worlds, engaging challenges, and positive reinforcement as they master foundational skills.</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="font-fun text-xl text-amber-950 mb-3">For Parents</h3>
              <p className="text-sm font-medium leading-relaxed">Enjoy total peace of mind: 100% offline gameplay, absolutely no data storage, no internet required, and a simple one-time payment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Parents & Trust */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-center">
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Shield className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
            <h3 className="font-fun font-black mb-1">Total Safety</h3>
            <p className="text-xs">No ads, no data tracking, 100% kid-safe environment.</p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Globe className="w-10 h-10 mx-auto mb-3 text-sky-400" />
            <h3 className="font-fun font-black mb-1">Offline Anytime</h3>
            <p className="text-xs">Perfect for travel—no internet required after installation.</p>
          </div>
          <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Lock className="w-10 h-10 mx-auto mb-3 text-amber-400" />
            <h3 className="font-fun font-black mb-1">Simple Payment</h3>
            <p className="text-xs">Single $9 lifetime payment. No hidden subscriptions.</p>
          </div>
        </div>
      </section>

      {/* 5. Pricing Section */}
      <section id="pricing" className="relative z-10 bg-amber-400 py-16 px-4 border-y-4 border-white text-amber-950">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-10 shadow-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-black font-fun mb-4">Unlock All 45 Games for $9!</h2>
          <p className="text-sm font-bold mb-8">Lifetime access, all worlds, all levels, sticker books, and offline packages.</p>
          <button
            onClick={() => { soundEngine.playPop(); onNavigate('pricing'); }}
            className="px-10 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-fun font-black text-base shadow-xl transition active:scale-95 cursor-pointer border-2 border-amber-600"
          >
            Unlock Full Access ($9) 🚀
          </button>
        </div>
      </section>
    </div>
  );
};
