/**
 * Pause Modal for Mini-Games
 * Clean, safe pause dialog with sound toggles, restart, and return to map.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PauseModalProps {
  isOpen: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  isMuted,
  onToggleMute,
  onResume,
  onRestart,
  onHome
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border-4 border-indigo-200 text-center"
        >
          <div className="text-4xl mb-2">⏸️</div>
          <h2 className="text-2xl font-fun font-bold text-slate-800 mb-1">Game Paused</h2>
          <p className="text-sm font-body text-slate-500 mb-6">Take a quick breather!</p>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => {
                soundEngine.playPop();
                onResume();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-fun font-bold text-lg shadow-md hover:from-indigo-600 hover:to-blue-700 active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Resume Playing</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onRestart();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-amber-100 text-amber-900 font-fun font-semibold hover:bg-amber-200 active:scale-95 flex items-center justify-center gap-2 border border-amber-300"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Restart Level</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playPop();
                onHome();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 text-slate-700 font-fun font-semibold hover:bg-slate-200 active:scale-95 flex items-center justify-center gap-2 border border-slate-300"
            >
              <Home className="w-5 h-5" />
              <span>Back to World Map</span>
            </button>
          </div>

          {/* Quick Sound Toggles */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                soundEngine.playPop();
                onToggleMute();
              }}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                isMuted ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Sound Off' : 'Sound On'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
