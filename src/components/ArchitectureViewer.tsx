/**
 * Architecture & Technical Blueprint Modal
 * Interactive inspector for Principal Mobile Game Architect & Senior Flutter/Unity Engineer.
 * Details the Folder Structure, Flame Engine bridge, Clean Architecture layers,
 * Dynamic Difficulty Engine, and Bundle Optimization (<180 MB).
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layers, Smartphone, Database, ShieldCheck, Sparkles, Code2, Cpu } from 'lucide-react';
import { ARCHITECTURE_BLUEPRINT } from '../services/architectureBlueprint';
import { soundEngine } from '../services/soundEngine';

interface ArchitectureViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'structure' | 'difficulty' | 'optimization'>('blueprint');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md select-none overflow-y-auto font-body">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-4xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border-4 border-slate-700 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-fun text-white">
                  Cross-Platform Architecture & Technical Blueprint
                </h2>
                <p className="text-xs text-indigo-400">
                  Senior Mobile Game Architect Specification • Flutter/Flame & Unity Ready
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900 px-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'blueprint' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Clean Architecture Layers</span>
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'structure' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Folder Structure (STEP 1)</span>
            </button>
            <button
              onClick={() => setActiveTab('difficulty')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'difficulty' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Dynamic Difficulty Engine (STEP 2)</span>
            </button>
            <button
              onClick={() => setActiveTab('optimization')}
              className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
                activeTab === 'optimization' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Bundle & Aspect Ratios</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
            {activeTab === 'blueprint' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <h3 className="text-base font-bold text-white mb-2 font-fun">
                    4-Tier Clean Architecture with Zero Network Policy
                  </h3>
                  <p className="text-slate-300 text-xs mb-4">
                    The game suite operates with strict offline boundary guarantees. No network permissions are granted in AndroidManifest.xml or Info.plist.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ARCHITECTURE_BLUEPRINT.cleanArchitectureLayers.map((l, idx) => (
                      <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-700">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                          Layer {idx + 1}: {l.layer}
                        </span>
                        <p className="text-slate-300 text-xs">{l.responsibility}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <h4 className="text-sm font-bold text-emerald-400 mb-2 font-fun">
                    BaseMiniGame Controller Life-Cycle
                  </h4>
                  <div className="p-3 bg-slate-950 font-mono text-xs rounded-xl text-emerald-300 overflow-x-auto">
                    <code>
                      INITIALIZING ➔ PLAYING (Timer started, hint cooldown running)<br/>
                      &nbsp;&nbsp;↕ PAUSED (Audio muted, touch suspended)<br/>
                      &nbsp;&nbsp;➔ VALID_DROP: playSnap() (Distance &lt;= 35px, +20dp toddler padding)<br/>
                      &nbsp;&nbsp;➔ INVALID_DROP: playOops() (Non-punitive ascending wobble cue)<br/>
                      &nbsp;&nbsp;➔ LEVEL_COMPLETE: Confetti burst, 1-3 Stars calculation, SQLite commit!
                    </code>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'structure' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-fun">Flutter/Flame Production Tree</h3>
                  <span className="text-xs bg-indigo-900/60 text-indigo-300 px-3 py-1 rounded-full border border-indigo-700">
                    Clean Architecture Modular Package
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {ARCHITECTURE_BLUEPRINT.folderStructureFlutter}
                </div>
              </div>
            )}

            {activeTab === 'difficulty' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <h3 className="text-base font-bold text-white mb-2 font-fun">
                    Adaptive Early-Childhood Difficulty Matrix
                  </h3>
                  <p className="text-slate-300 text-xs mb-4">
                    Dynamically tunes touch targets, hints, item density, and equations to fit childhood developmental stages.
                  </p>

                  <div className="space-y-3">
                    <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                        Preschool (Ages 3–4) • EASY
                      </span>
                      <p className="text-xs text-slate-200 mt-1">
                        • 3–4 items maximum on screen.<br/>
                        • Snap threshold expanded with +20dp finger hit-padding (effective &le; 55px).<br/>
                        • Explicit ghost outlines, pulsing visual guides, and immediate letter sounds.<br/>
                        • Untimed; guaranteed positive reinforcement on completion.
                      </p>
                    </div>

                    <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-800">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                        Primary Explorers (Ages 5–7) • MEDIUM
                      </span>
                      <p className="text-xs text-slate-200 mt-1">
                        • 5–7 items, phonics blends (4-letter words), double-digit sums &le; 15.<br/>
                        • Snap threshold at strict &le; 35px.<br/>
                        • Star score logic: 3 stars for zero mistakes, 2 stars for 1-2 mistakes.<br/>
                        • Optional star bonus timer.
                      </p>
                    </div>

                    <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block">
                        Junior Masters (Ages 8–10) • HARD
                      </span>
                      <p className="text-xs text-slate-200 mt-1">
                        • 7+ items, missing addends (e.g., 8 + ? = 15), complex vocabulary, multi-step jigsaw.<br/>
                        • Minimal hints, timed star decay, precision drag-and-drop.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'optimization' && (
              <div className="space-y-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <h3 className="text-base font-bold text-white mb-2 font-fun">
                    Bundle Size &lt; 180 MB Optimization Strategy
                  </h3>
                  <div className="space-y-2">
                    {ARCHITECTURE_BLUEPRINT.bundleOptimizationStrategies.map((strat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{strat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                  <h3 className="text-base font-bold text-white mb-2 font-fun">
                    Multi-Device Aspect Ratio Scaling (16:9 & 4:3)
                  </h3>
                  <p className="text-xs text-slate-300 mb-3">
                    Both iPad (4:3) and Android Tablet (16:10) and Smartphone (16:9) viewports are handled with responsive letterboxing and dynamic canvas reflow. You can test device modes using the switcher in the top right!
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                      <span className="block font-bold text-indigo-400">iPad</span>
                      <span className="text-slate-400">4:3 Ratio</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                      <span className="block font-bold text-indigo-400">Android Tablet</span>
                      <span className="text-slate-400">16:10 Ratio</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                      <span className="block font-bold text-indigo-400">Phone</span>
                      <span className="text-slate-400">16:9 Ratio</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700">
                      <span className="block font-bold text-indigo-400">Responsive</span>
                      <span className="text-slate-400">Adaptive</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
