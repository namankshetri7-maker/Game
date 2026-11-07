import React from 'react';
import { Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface DemoHeaderBarProps {
  onReturnToWebsite: () => void;
  onUnlockFull: () => void;
  isAppOnly?: boolean;
}

export const DemoHeaderBar: React.FC<DemoHeaderBarProps> = ({
  onReturnToWebsite,
  onUnlockFull,
  isAppOnly = false
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 px-4 py-2 flex items-center justify-between shadow-md border-b-2 border-amber-300 z-50">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-900 animate-ping" />
        <span className="font-fun font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-900" />
          <span>FREE DEMO MODE (Levels 1 & 2 Preview)</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!isAppOnly && (
          <button
            onClick={() => {
              soundEngine.playPop();
              onReturnToWebsite();
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-fun font-bold text-xs shadow-xs border border-slate-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Website</span>
          </button>
        )}

        <button
          onClick={() => {
            soundEngine.playPop();
            onUnlockFull();
          }}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-fun font-black text-xs shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Unlock Full ($9)</span>
        </button>
      </div>
    </div>
  );
};
