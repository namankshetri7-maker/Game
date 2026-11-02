/**
 * Universal Responsive App Container & Kid-Friendly Theme Wrapper
 * Automatically adapts seamlessly across Android (phones & tablets), iOS (iPads & iPhones),
 * macOS, and Windows screens without artificial device frames or fixed aspect ratios.
 */

import React from 'react';
import { Volume2, VolumeX, Shield, Download, WifiOff, Smartphone, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { BrandLogo } from './BrandLogo';
import { WonderBunnyCompanion } from './WonderBunnyCompanion';
import { WorldThemeSwitcherPill } from './WorldThemeSwitcherPill';

interface DeviceFrameWrapperProps {
  children: React.ReactNode;
  currentView?: 'world_map' | 'world_detail' | 'game';
  onNavigateHome?: () => void;
  onNavigateWorld?: () => void;
  onOpenParentGate: () => void;
  onOpenDirectory: () => void;
  onOpenInstallModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  childAvatar: string;
  childName: string;
  childAge: number;
  isOnline: boolean;
  isStandalone: boolean;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  children,
  currentView = 'world_map',
  onNavigateHome,
  onNavigateWorld,
  onOpenParentGate,
  onOpenDirectory,
  isMuted,
  onToggleMute,
  childAvatar,
  childName,
  childAge,
  onOpenInstallModal,
  isOnline,
  isStandalone
}) => {
  return (
    <div className="min-h-screen w-full bg-world-gradient text-slate-800 flex flex-col font-body selection:bg-pink-400 selection:text-white transition-all duration-700 relative overflow-x-hidden">
      {/* Playful Ambient Background Stars & Clouds */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 select-none overflow-hidden">
        <div className="absolute top-12 left-10 text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🎈</div>
        <div className="absolute top-24 right-12 text-3xl animate-pulse">⭐</div>
        <div className="absolute bottom-16 left-8 text-4xl animate-bounce" style={{ animationDuration: '6s' }}>🌈</div>
        <div className="absolute bottom-20 right-16 text-3xl">✨</div>
      </div>

      {/* Top Bright Kid-Friendly App Header Bar */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between flex-wrap gap-2.5 z-30 shadow-sm">
        {/* App Branding & Navigation */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Professional Brand Logo button that returns home on tap */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onNavigateHome?.();
            }}
            className="flex items-center gap-2 cursor-pointer group text-left"
            title="WonderWorld Super Quest Home"
          >
            <BrandLogo size="md" showText={false} />
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-base sm:text-xl font-fun tracking-wide bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  WonderWorld
                </span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-white shadow-sm font-fun flex items-center gap-1">
                  <span>Pip's Quest</span>
                  <span className="text-xs">🦊</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mt-0.5">
                <span className="inline-flex items-center gap-1 bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded-lg border border-amber-300 text-[11px]">
                  <span>{childAvatar}</span>
                  <span>{childName} ({childAge} yrs)</span>
                </span>
              </div>
            </div>
          </button>

          {/* Contextual Navigation Buttons */}
          {currentView === 'game' && (
            <div className="flex items-center gap-1.5 ml-1">
              {onNavigateWorld && (
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    onNavigateWorld();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-fun font-bold text-xs shadow-sm border border-slate-200 transition"
                  title="Return to Island Levels"
                >
                  <span>←</span>
                  <span className="hidden sm:inline">Island Levels</span>
                </button>
              )}
              {onNavigateHome && (
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    onNavigateHome();
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-fun font-bold text-xs shadow-md border-2 border-white transition"
                  title="Return to World Map"
                >
                  <span>🗺️</span>
                  <span className="hidden md:inline">World Map</span>
                </button>
              )}
            </div>
          )}

          {currentView === 'world_detail' && onNavigateHome && (
            <button
              onClick={() => {
                soundEngine.playPop();
                onNavigateHome();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-fun font-bold text-xs shadow-md border-2 border-white transition ml-1"
              title="Return to World Map"
            >
              <span>←</span>
              <span>World Map</span>
            </button>
          )}
        </div>

        {/* Right Tools: Offline Status, Install Button, Sound Toggle, Parent Gate */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Reassuring Offline Status Badge */}
          {!isOnline && (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-fun font-bold px-2.5 py-1.5 rounded-xl border border-emerald-300 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">100% Offline Ready</span>
            </div>
          )}

          {/* Optional Install / Home Screen shortcut button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenInstallModal();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-2xl text-xs font-fun font-black shadow-sm border-2 transition active:scale-95 ${
              isStandalone
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:brightness-105 text-amber-950 border-white'
            }`}
            title="Install Wonder World on your Home Screen or Desktop"
          >
            {isStandalone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Installed</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install App</span>
              </>
            )}
          </button>

          {/* Dynamic World Theme Palette Switcher Pill */}
          <WorldThemeSwitcherPill />

          {/* Sound Toggle */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onToggleMute();
            }}
            className="p-2 rounded-2xl bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border-2 border-slate-200 shadow-sm transition"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Parent Gate Button */}
          <button
            onClick={() => {
              soundEngine.playPop();
              onOpenParentGate();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-105 active:scale-95 text-white text-xs font-fun font-bold shadow-md shadow-purple-500/20 border-2 border-white/60 transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Parent Gate</span>
          </button>
        </div>
      </header>

      {/* Main Fluid & Responsive Content Area - Automatically fits any screen */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto p-2 sm:p-4 md:p-6 flex flex-col justify-center items-stretch">
        <div className="w-full h-full flex flex-col">
          {children}
        </div>
      </main>

      {/* Persistent Wonder Bunny Companion Guide */}
      <WonderBunnyCompanion currentView={currentView} childName={childName} />
    </div>
  );
};
