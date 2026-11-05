/**
 * Universal Responsive App Container & Kid-Friendly Theme Wrapper
 * Automatically adapts seamlessly across Android (phones & tablets), iOS (iPads & iPhones),
 * macOS, and Windows screens without artificial device frames or fixed aspect ratios.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Volume2,
  VolumeX,
  Shield,
  Smartphone,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Sparkles,
  Download,
  Menu,
  X,
  Laptop
} from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-world-gradient text-slate-800 flex flex-col font-body selection:bg-pink-400 selection:text-white transition-all duration-700 relative overflow-x-hidden">
      {/* Playful Ambient Background Stars & Clouds */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 select-none overflow-hidden">
        <div className="absolute top-12 left-10 text-4xl animate-bounce" style={{ animationDuration: '4s' }}>🎈</div>
        <div className="absolute top-24 right-12 text-3xl animate-pulse">⭐</div>
        <div className="absolute bottom-16 left-8 text-4xl animate-bounce" style={{ animationDuration: '6s' }}>🌈</div>
        <div className="absolute bottom-20 right-16 text-3xl">✨</div>
      </div>

      {/* Top Bright Kid-Friendly App Header Bar - Perfectly Aligned for iPhone, Android, iPad, Tablet, Mac & Windows */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-indigo-100/90 z-50 shadow-xs transition-all">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* Left Zone: Brand Logo + Child Explorer Badge + Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            {/* Clickable Brand Logo & Name */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setIsMobileMenuOpen(false);
                onNavigateHome?.();
              }}
              className="flex items-center cursor-pointer group text-left shrink-0 active:scale-95 transition"
              title="Return to WonderWorld Home Map"
            >
              <BrandLogo size="header" showText={true} />
            </button>

            {/* Child Profile Explorer Card (Visible on iPad/Tablet/Desktop when space permits) */}
            <div className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 px-2 py-1 rounded-2xl border border-amber-200/90 shadow-2xs shrink-0">
              <span className="text-sm bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-2xs border border-amber-200">{childAvatar}</span>
              <div className="flex flex-col leading-tight">
                <span className="font-fun font-bold text-xs text-slate-800">{childName}</span>
                <span className="text-[9px] text-amber-700 font-semibold font-fun">{childAge} yrs</span>
              </div>
            </div>

            {/* Contextual Navigation Buttons */}
            {currentView === 'game' && (
              <div className="flex items-center gap-1 shrink-0 ml-0.5 sm:ml-1">
                {onNavigateWorld && (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      onNavigateWorld();
                    }}
                    className="h-8 sm:h-9 px-2.5 rounded-xl bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-fun font-bold text-xs shadow-xs border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                    title="Return to Island Levels"
                  >
                    <ArrowLeft className="w-3 h-3 text-slate-600" />
                    <span className="hidden sm:inline">Levels</span>
                  </button>
                )}
                {onNavigateHome && (
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      onNavigateHome();
                    }}
                    className="h-8 sm:h-9 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-fun font-bold text-xs shadow-xs border border-white transition flex items-center gap-1 cursor-pointer"
                    title="Return to World Map"
                  >
                    <span>🗺️</span>
                    <span className="hidden sm:inline">Map</span>
                  </button>
                )}
              </div>
            )}

            {(currentView === 'world_detail') && onNavigateHome && (
              <button
                onClick={() => {
                  soundEngine.playPop();
                  onNavigateHome();
                }}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-fun font-bold text-xs shadow-xs border border-white transition flex items-center gap-1 shrink-0 ml-0.5 sm:ml-1 cursor-pointer"
                title="Return to World Map"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">World Map</span>
                <span className="sm:hidden">Map</span>
              </button>
            )}
          </div>

          {/* Right Zone for Large Tablets, iPads & Desktop (lg:flex) - Fully Visible Controls */}
          <div className="hidden lg:flex items-center gap-2 shrink-0 ml-auto">


            {/* 2. Offline Guide & Download Files Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenInstallModal();
              }}
              className="h-9 xl:h-10 flex items-center gap-1.5 px-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 hover:bg-amber-100 text-amber-950 text-xs font-fun font-black shadow-xs border-2 border-amber-300/80 transition active:scale-95 cursor-pointer shrink-0"
              title="Download 100% Offline Package (.ZIP) & View Device Setup Guides"
            >
              <Download className="w-3.5 h-3.5 text-amber-600" />
              <span>Offline Guide & Files</span>
              {isStandalone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </button>

            {/* 3. Sound Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onToggleMute();
              }}
              className={`h-9 xl:h-10 px-2.5 rounded-2xl border transition active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isMuted
                  ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
              title={isMuted ? 'Sound is Muted (Click to Unmute)' : 'Sound is Active (Click to Mute)'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              <span className="text-xs font-fun font-bold">{isMuted ? 'Muted' : 'Sound'}</span>
            </button>

            {/* 4. Dynamic Theme Switcher */}
            <WorldThemeSwitcherPill compact={true} />

            {/* 5. Parent Control Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenParentGate();
              }}
              className="h-9 xl:h-10 flex items-center gap-1.5 px-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 active:scale-95 text-white text-xs font-fun font-bold shadow-md border-2 border-indigo-400/50 transition cursor-pointer shrink-0 ring-2 ring-indigo-200/50"
              title="Parent Dashboard, Screen Time & Profiles"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
              <span>Parent Control</span>
              <Lock className="w-2.5 h-2.5 text-indigo-300" />
            </button>
          </div>

          {/* Right Zone for Mobile Phones & Small Tablets (< lg) - Compact Sound, Parents & Fold Menu Button */}
          <div className="flex lg:hidden items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
            {/* Quick Sound Toggle on Mobile */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onToggleMute();
              }}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center transition active:scale-95 ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Sound"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Quick Parent Control on Mobile */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onOpenParentGate();
              }}
              className="h-8 sm:h-9 px-2 rounded-xl bg-slate-900 text-amber-300 border border-slate-700 shadow-xs flex items-center gap-1 text-xs font-fun font-bold active:scale-95"
              title="Open Parent Control"
              aria-label="Parent Control"
            >
              <Shield className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
              <span className="text-[11px] hidden sm:inline">Parents</span>
            </button>

            {/* Mobile & Tablet Fold Toggle Button */}
            <button
              onClick={() => {
                soundEngine.playPop();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`h-8 sm:h-9 px-2.5 rounded-xl border font-fun font-black text-xs flex items-center gap-1 transition active:scale-95 ${
                isMobileMenuOpen
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300 shadow-xs'
              }`}
              title="Open Offline Guides & Tools Menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle Navigation and Offline Guides"
            >
              {isMobileMenuOpen ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-3.5 h-3.5" />
                  <span>Menu</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Foldable Drawer / Accordion Panel (Visible when unfolded on smaller screens) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="lg:hidden border-t-2 border-indigo-100 bg-gradient-to-b from-indigo-50/98 via-white to-amber-50/98 px-3 py-3 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col gap-2.5">
                {/* 1. Offline Guide & Files Download Card */}
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setIsMobileMenuOpen(false);
                    onOpenInstallModal();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 shadow-sm flex items-center justify-between gap-3 active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs shrink-0">
                      📦
                    </div>
                    <div>
                      <div className="font-fun font-black text-sm text-amber-950 flex items-center gap-1.5">
                        <span>Offline Guide & Download ZIP</span>
                        <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-md uppercase font-black">19 MB</span>
                      </div>
                      <p className="text-[11px] text-amber-800 font-semibold font-body leading-tight mt-0.5">
                        Installation steps for iPhone, iPad, Android, Mac & Windows PC
                      </p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-amber-700 shrink-0" />
                </button>

                {/* 2. Parent Control Card */}
                <button
                  onClick={() => {
                    soundEngine.playPop();
                    setIsMobileMenuOpen(false);
                    onOpenParentGate();
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-slate-900 border-2 border-indigo-400/60 shadow-sm flex items-center justify-between gap-3 text-white active:scale-[0.98] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                      🛡️
                    </div>
                    <div>
                      <div className="font-fun font-black text-sm text-white flex items-center gap-1.5">
                        <span>Parent Control & Safety Dashboard</span>
                        <Lock className="w-3 h-3 text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium font-body leading-tight mt-0.5">
                        Screen time, child profiles, PIN gate & learning progress
                      </p>
                    </div>
                  </div>
                  <span className="text-xs bg-indigo-700 text-amber-300 px-2 py-1 rounded-xl font-bold font-fun">
                    Open
                  </span>
                </button>



                {/* 4. Controls Row: Sound Toggle & Theme Switcher */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-indigo-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 font-fun">Theme:</span>
                    <WorldThemeSwitcherPill compact={false} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>100% Offline</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
