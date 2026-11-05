/**
 * Wonder World Kids - Commercial Website & Storefront Landing Page
 * Commercial Model: $9 USD One-Time Purchase • No Ads • No Subscriptions • 100% Offline
 * 
 * Features:
 * - Professional EdTech SaaS Hero with Value Proposition
 * - Direct download buttons for the Offline ZIP package (/WonderWorldKids_Offline_Package.zip)
 * - "Play Instant Web Game" CTA
 * - 45 Mini-Game Curriculum & 5 Thematic Worlds Showcase
 * - Parent Security, COPPA Compliance & Offline Guarantee
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Download,
  Play,
  Shield,
  Star,
  CheckCircle2,
  Award,
  Heart,
  Compass,
  Laptop,
  Smartphone,
  Lock
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { soundEngine } from '../services/soundEngine';

interface LandingPageProps {
  onEnterGame: () => void;
  onOpenParentGate: () => void;
  onOpenInstallModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterGame,
  onOpenParentGate,
  onOpenInstallModal
}) => {
  const handleDownloadZip = () => {
    soundEngine.playVictory();
    const link = document.createElement('a');
    link.href = '/WonderWorldKids_Offline_Package.zip';
    link.download = 'WonderWorldKids_Offline_Package.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-400 via-indigo-600 to-slate-900 text-slate-100 font-body select-none overflow-x-hidden">
      
      {/* 1. Header / Navigation Bar */}
      <header className="sticky top-0 bg-slate-900/90 backdrop-blur-md border-b border-white/10 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size="header" showText={true} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenParentGate();
            }}
            className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-fun font-bold text-xs sm:text-sm flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
          >
            <Shield className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Parent Portal</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              onEnterGame();
            }}
            className="px-4 sm:px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition active:scale-95 cursor-pointer border border-emerald-400"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Online Now</span>
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col items-center text-center z-10">
        
        {/* Glowing badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-amber-300 mb-6 shadow-md">
          <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>Award-Winning Educational Game Suite • Ages 3–10</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-fun tracking-tight max-w-4xl leading-tight mb-6 text-white drop-shadow-md">
          Spark a Lifetime of Learning with <span className="text-amber-300">Wonder World Kids</span>
        </h1>

        <p className="text-base sm:text-xl text-indigo-100 max-w-2xl font-medium mb-8 leading-relaxed">
          45 immersive mini-games across 5 magical worlds. 100% offline-ready, zero ads, zero subscriptions, and strictly COPPA compliant.
        </p>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mb-12">
          <button
            onClick={() => {
              soundEngine.playPop();
              onEnterGame();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-fun font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2.5 transition border-2 border-emerald-300 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Web Game</span>
          </button>

          <button
            onClick={handleDownloadZip}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-105 active:scale-95 text-amber-950 font-fun font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2.5 transition border-2 border-amber-300 cursor-pointer"
          >
            <Download className="w-5 h-5 text-amber-950" />
            <span>Download Offline ZIP ($9)</span>
          </button>
        </div>

        {/* Value Prop Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-center">
            <span className="text-2xl mb-1">🚫</span>
            <span className="font-fun font-bold text-sm text-amber-300">Zero Ads</span>
            <span className="text-xs text-indigo-200">100% Safe for Kids</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-center">
            <span className="text-2xl mb-1">💳</span>
            <span className="font-fun font-bold text-sm text-amber-300">One-Time $9</span>
            <span className="text-xs text-indigo-200">No Subscriptions</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-center">
            <span className="text-2xl mb-1">📶</span>
            <span className="font-fun font-bold text-sm text-amber-300">100% Offline</span>
            <span className="text-xs text-indigo-200">Play Anywhere</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-center">
            <span className="text-2xl mb-1">🛡️</span>
            <span className="font-fun font-bold text-sm text-amber-300">Parent Gate</span>
            <span className="text-xs text-indigo-200">Secure Controls</span>
          </div>
        </div>
      </section>

      {/* 3. The 5 Learning Worlds Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-black font-fun tracking-tight text-white mb-3">
            5 Magical Worlds • 45 Curriculum Games
          </h2>
          <p className="text-sm sm:text-base text-indigo-200">
            Designed by educational experts to foster math, reading, science, geography, and critical thinking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: 'Math Magic Valley', icon: '🔢', count: '10 Games', color: 'bg-blue-600', desc: 'Counting, addition, shapes & fractions.' },
            { title: 'English Phonics Jungle', icon: '🦁', count: '10 Games', color: 'bg-emerald-600', desc: 'Letters, sounds, sight words & spelling.' },
            { title: 'World Geography', icon: '🌍', count: '10 Games', color: 'bg-amber-600', desc: 'Continents, oceans, flags & landmarks.' },
            { title: 'Animal Science', icon: '🐾', count: '10 Games', color: 'bg-rose-600', desc: 'Habitats, life cycles & natural wonders.' },
            { title: 'Logic & Brain Gym', icon: '🧩', count: '5 Games', color: 'bg-purple-600', desc: 'Mazes, memory grids & shadow matching.' }
          ].map((world, idx) => (
            <div key={idx} className={`${world.color} rounded-3xl p-5 shadow-xl border-2 border-white/30 flex flex-col justify-between`}>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl mb-3 shadow-sm">
                  {world.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/30 text-white">
                  {world.count}
                </span>
                <h3 className="text-lg font-black font-fun text-white mt-2 mb-1">
                  {world.title}
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  {world.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Download & Offline Guarantee Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 rounded-3xl border-3 border-indigo-400/50 p-6 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold mb-3 border border-amber-400/30">
              <Laptop className="w-3.5 h-3.5" />
              <span>Windows, Mac, Android & iOS Ready</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-fun text-white mb-3">
              Get the Complete Offline Package for $9 USD
            </h2>
            <p className="text-sm text-indigo-200 leading-relaxed mb-4">
              Download the standalone ZIP package. Includes one-click launchers for Windows (`.bat`) and Mac (`.command`), local WOFF2 fonts, zero network dependencies, and full lifetime access.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-emerald-400">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Instant ZIP download</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> No Wi-Fi required after install</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={handleDownloadZip}
              className="px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-base shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-2 border-amber-500"
            >
              <Download className="w-5 h-5 text-amber-950" />
              <span>Download ZIP (19 MB)</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playPop();
                onEnterGame();
              }}
              className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-fun font-bold text-sm transition text-center cursor-pointer border border-white/20"
            >
              Or Play Instantly in Browser
            </button>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-8 py-8 border-t border-white/10 text-center text-xs text-indigo-300 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          © 2026 Wonder World Kids Learning Suite. All rights reserved. 100% Offline-First.
        </div>
        <div className="flex items-center gap-4 text-indigo-200">
          <button onClick={onOpenParentGate} className="hover:text-white transition cursor-pointer">
            Parent Portal
          </button>
          <span>•</span>
          <button onClick={onOpenInstallModal} className="hover:text-white transition cursor-pointer">
            PWA & Offline Instructions
          </button>
        </div>
      </footer>
    </div>
  );
};
