import React, { useState } from 'react';
import { Sparkles, ShoppingBag, ArrowLeft, Lock, Star, CheckCircle2, X, Eye, Shield, Smartphone } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { WORLDS, MINI_GAMES_MATRIX } from '../data/gameMatrix';

interface DemoLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockFull: () => void;
  onReturnToWebsite: () => void;
}

export const DemoLimitModal: React.FC<DemoLimitModalProps> = ({
  isOpen,
  onClose,
  onUnlockFull,
  onReturnToWebsite
}) => {
  const [activeWorldId, setActiveWorldId] = useState<string>('world_math');

  if (!isOpen) return null;

  const activeWorld = WORLDS.find(w => w.id === activeWorldId) || WORLDS[0];
  const activeWorldGames = MINI_GAMES_MATRIX.filter(g => g.worldId === activeWorldId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none overflow-y-auto">
      <div className="bg-white rounded-3xl border-4 border-amber-400 shadow-2xl max-w-2xl w-full p-5 sm:p-7 text-center relative overflow-hidden my-auto max-h-[92vh] flex flex-col justify-between">
        
        {/* Close Button Top Right */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition active:scale-95 cursor-pointer z-20 border border-slate-300"
          title="Close Simulator Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient decorative highlights */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-300/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-300/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          {/* Header Pill */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black font-fun mb-2 border border-amber-300 shadow-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Interactive Simulator • Full Access Preview</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-fun text-slate-900 mb-1 leading-tight">
            Explore What&apos;s Inside the Full Game! 🚀
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-lg mb-4 leading-relaxed font-body">
            You&apos;ve experienced the free demo! Preview all 5 magical islands and 45 educational mini-games below:
          </p>

          {/* Interactive World Switcher Tabs for Simulator Preview */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4 overflow-x-auto w-full pb-1">
            {WORLDS.map((world) => {
              const isActive = world.id === activeWorldId;
              return (
                <button
                  key={world.id}
                  onClick={() => {
                    soundEngine.playPop();
                    setActiveWorldId(world.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-fun font-bold text-xs transition cursor-pointer flex items-center gap-1 shrink-0 border-2 ${
                    isActive
                      ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md scale-105'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-sm">{world.icon}</span>
                  <span className="hidden sm:inline">{world.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Visual Simulator Preview Box for Active World */}
          <div className="w-full bg-gradient-to-b from-slate-900 to-indigo-950 rounded-2xl p-4 border-2 border-indigo-400/50 shadow-inner text-left mb-4 relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-3 border-b border-indigo-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{activeWorld.icon}</span>
                <div>
                  <h3 className="text-sm font-black font-fun text-white flex items-center gap-2">
                    <span>{activeWorld.title}</span>
                    <span className="text-[10px] bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full font-bold">
                      10 Games • 50 Levels
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">{activeWorld.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-black font-fun border border-amber-400/40">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulator Peek</span>
              </div>
            </div>

            {/* Grid Preview of Games in Selected World */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 max-h-36 overflow-y-auto pr-1">
              {activeWorldGames.slice(0, 8).map((game, idx) => {
                const isDemoAllowed = idx < 2; // First 2 are demo allowed
                return (
                  <div
                    key={game.id}
                    className={`p-2 rounded-xl border text-left flex flex-col justify-between relative overflow-hidden transition ${
                      isDemoAllowed
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-xl">{game.icon}</span>
                      {isDemoAllowed ? (
                        <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.2 rounded-md uppercase font-fun">
                          Demo Free
                        </span>
                      ) : (
                        <span className="text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-md uppercase font-fun flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> $9
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold font-fun leading-tight text-white line-clamp-1">
                        {game.title}
                      </div>
                      <div className="text-[9px] text-slate-300 line-clamp-1 mt-0.5">
                        {game.skills[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-indigo-200 font-semibold flex items-center justify-between pt-1 border-t border-indigo-900/60">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Levels 3, 4 & 5 + Champion Star Trophies</span>
              </span>
              <span className="text-amber-300 font-bold font-fun">Included in $9 License</span>
            </div>
          </div>

          {/* Parental Value Checklist */}
          <div className="w-full bg-amber-50/90 rounded-2xl p-3 sm:p-4 border border-amber-200 mb-4 text-left">
            <div className="font-fun font-black text-xs text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Parent Safety & Family Pass Guarantee:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-amber-950">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>One-Time $9 USD (No Subscriptions)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Offline PWA App (All Devices)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-amber-200 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>0 Ads & COPPA Parent Controls</span>
              </div>
            </div>
          </div>

          {/* Friendly Non-Intrusive Calls to Action */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            {/* Primary Action */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onUnlockFull();
              }}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-amber-950 font-fun font-black text-sm sm:text-base shadow-xl border-2 border-white active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer ring-2 ring-amber-300/60"
            >
              <ShoppingBag className="w-5 h-5 text-amber-950" />
              <span>Unlock All 45 Games ($9)</span>
            </button>

            {/* Secondary Action */}
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-fun font-bold text-xs sm:text-sm border border-slate-300 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Continue Free Demo</span>
            </button>
          </div>

          <button
            onClick={() => {
              soundEngine.playPop();
              onReturnToWebsite();
            }}
            className="mt-2.5 text-xs text-slate-500 hover:text-slate-800 font-bold font-fun underline transition cursor-pointer"
          >
            Return to Website Homepage
          </button>
        </div>
      </div>
    </div>
  );
};
