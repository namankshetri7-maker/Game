/**
 * Offline Setup Guide Overlay for Parents
 * Triggered from the Parent Dashboard.
 * Shows clear, animated, step-by-step instructions on how to 'Add to Home Screen'
 * for Android and iOS specifically for 100% offline usage.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Smartphone,
  Share2,
  PlusSquare,
  MoreVertical,
  CheckCircle2,
  Plane,
  WifiOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Download,
  Laptop,
  Check,
  ChevronRight,
  Play
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface OfflineSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  canNativeInstall?: boolean;
  isStandalone?: boolean;
}

export const OfflineSetupGuideModal: React.FC<OfflineSetupGuideModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  canNativeInstall = false,
  isStandalone = false
}) => {
  // Detect current platform for default tab
  const isAppleDevice = typeof window !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  const [platform, setPlatform] = useState<'ios' | 'android'>(isAppleDevice ? 'ios' : 'android');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isAirplaneSimulated, setIsAirplaneSimulated] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto select-none font-body">
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          className="relative w-full max-w-3xl bg-slate-900 border-2 sm:border-3 border-amber-400 rounded-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[94vh]"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center text-xl shrink-0">
                📲
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 font-fun flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Parent Setup Guide</span>
                </span>
                <h2 className="text-base sm:text-xl font-black font-fun text-white flex items-center gap-2">
                  <span>Offline App Setup Guide</span>
                  <span className="text-[10px] bg-emerald-500 text-white font-fun font-bold px-2 py-0.5 rounded-full">
                    100% Offline
                  </span>
                </h2>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Segmented Switcher Tabs */}
          <div className="px-4 sm:px-6 pt-3 pb-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 shrink-0">
            <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-2xl border border-slate-700">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setPlatform('ios');
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-fun font-bold transition active:scale-95 cursor-pointer ${
                  platform === 'ios'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🍎 Apple (iPhone & iPad)</span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playPop();
                  setPlatform('android');
                }}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-fun font-bold transition active:scale-95 cursor-pointer ${
                  platform === 'android'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🤖 Android (Phone & Tablet)</span>
              </button>
            </div>

            {/* Quick 1-Tap Install Button if Browser Supports it */}
            {canNativeInstall && onNativeInstall && (
              <button
                onClick={() => {
                  soundEngine.playVictory();
                  onNativeInstall();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-fun font-bold text-xs shadow-md border border-emerald-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>1-Tap Install to Device</span>
              </button>
            )}
          </div>

          {/* Modal Body / Scrollable Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Value Proposition Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-800/90 via-indigo-950/40 to-slate-800/90 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-fun font-bold text-white text-xs sm:text-sm">Why "Add to Home Screen"?</h3>
                  <p className="text-[11px] text-slate-300">
                    Removes the browser URL bar, blocks accidental browsing, and caches all 45 games for airplane & road trip play!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/40 shrink-0">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Zero Wi-Fi Needed</span>
              </div>
            </div>

            {/* Step Navigation Pill Indicator */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {[
                { step: 1, title: '1. Open in Browser' },
                { step: 2, title: '2. Add to Home Screen' },
                { step: 3, title: '3. Airplane Mode Test' }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    soundEngine.playPop();
                    setCurrentStep(s.step as 1 | 2 | 3);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-fun font-bold transition active:scale-95 cursor-pointer ${
                    currentStep === s.step
                      ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-white/50'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                    {s.step}
                  </span>
                  <span className="hidden sm:inline">{s.title.slice(3)}</span>
                </button>
              ))}
            </div>

            {/* STEP 1: OPEN IN BROWSER */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-fun uppercase tracking-wider text-amber-400">Step 1 of 3</span>
                    <span className="text-xs text-slate-400">Pre-Cache Game Files</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black font-fun text-white">
                    Open in {platform === 'ios' ? 'Safari on your iPhone or iPad' : 'Google Chrome or Edge on Android'}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Make sure your device is connected to Wi-Fi for <strong>just 10 seconds</strong> while opening Wonder World Kids Learning. The service worker automatically downloads and saves all audio, images, and games to device storage.
                  </p>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono text-amber-300">
                    <span>https://wonderworldkidslearning.space</span>
                    <span className="text-[11px] text-emerald-400 font-fun font-bold">✓ Cached Locally</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setCurrentStep(2);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <span>Next: Add to Home Screen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ANIMATED ADD TO HOME SCREEN */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {platform === 'ios' ? (
                  /* iOS Safari Animated Walkthrough */
                  <div className="bg-slate-800/90 rounded-2xl p-5 border-2 border-purple-500/60 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-fun uppercase tracking-wider text-purple-400">
                        Step 2 (Apple iOS Safari)
                      </span>
                      <span className="text-[11px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-lg border border-purple-700">
                        iPhone & iPad
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black font-fun text-white">
                      Tap Share &gt; "Add to Home Screen"
                    </h4>

                    {/* Animated Visual Simulator for iOS */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden">
                      <div className="space-y-3">
                        {/* Sub-step 1 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center text-xl shrink-0 border border-purple-400/50">
                              <Share2 className="w-5 h-5 text-purple-300" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-400 animate-ping" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-fun flex items-center gap-1.5">
                              <span>1. Tap the Share Button in Safari</span>
                              <span className="text-[10px] text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded">Bottom or Top Bar</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Look for the blue square icon with an arrow pointing up [↑].
                            </p>
                          </div>
                        </div>

                        {/* Sub-step 2 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl shrink-0 border border-amber-400/50">
                              <PlusSquare className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-fun">
                              2. Scroll Down and tap "Add to Home Screen"
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Tap the option with the plus icon [+] in the Safari actions list.
                            </p>
                          </div>
                        </div>

                        {/* Sub-step 3 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-xl shrink-0 border border-emerald-400/50">
                            <Check className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-fun">
                              3. Tap "Add" in the Top Right Corner
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Wonder World Kids appears on your iPad/iPhone home screen!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Android Animated Walkthrough */
                  <div className="bg-slate-800/90 rounded-2xl p-5 border-2 border-emerald-500/60 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black font-fun uppercase tracking-wider text-emerald-400">
                        Step 2 (Android Chrome & Edge)
                      </span>
                      <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-700">
                        Phones & Tablets
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black font-fun text-white">
                      Tap Menu (⋮) &gt; "Install app" or "Add to Home screen"
                    </h4>

                    {/* Animated Visual Simulator for Android */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden">
                      <div className="space-y-3">
                        {/* Sub-step 1 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-xl shrink-0 border border-emerald-400/50">
                              <MoreVertical className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-fun flex items-center gap-1.5">
                              <span>1. Tap the Three-Dot Menu (⋮)</span>
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">Top Right</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              In Chrome or Edge, tap the 3 vertical dots at the top right of the screen.
                            </p>
                          </div>
                        </div>

                        {/* Sub-step 2 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl shrink-0 border border-amber-400/50">
                              <Download className="w-5 h-5 text-amber-400" />
                            </div>
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-fun">
                              2. Select "Install app" or "Add to Home screen"
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Select install from the menu list.
                            </p>
                          </div>
                        </div>

                        {/* Sub-step 3 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-700">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center text-xl shrink-0 border border-indigo-400/50">
                            <Check className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white font-fun">
                              3. Tap "Install" to Confirm
                            </div>
                            <p className="text-[11px] text-slate-400">
                              The app installs to your app drawer and home screen.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setCurrentStep(1);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Step 1
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setCurrentStep(3);
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <span>Next: Airplane Mode Test</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: AIRPLANE MODE OFFLINE VERIFICATION TEST */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="bg-slate-800/90 rounded-2xl p-5 border-2 border-emerald-400/80 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-fun uppercase tracking-wider text-emerald-400">
                      Step 3: Verification
                    </span>
                    <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-700">
                      Flight & Travel Ready
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black font-fun text-white flex items-center gap-2">
                    <Plane className="w-5 h-5 text-amber-400" />
                    <span>Test Your Offline Setup in 3 Simple Steps</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-bold">
                        1
                      </div>
                      <h5 className="font-bold font-fun text-white">Enable Airplane Mode ✈️</h5>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Swipe down your phone's control center and turn on Airplane Mode.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-bold">
                        2
                      </div>
                      <h5 className="font-bold font-fun text-white">Tap App Icon 🦁</h5>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Tap the Wonder World icon on your home screen.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-700 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-bold">
                        3
                      </div>
                      <h5 className="font-bold font-fun text-white">Instant Offline Play! 🎮</h5>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        All 45 games and sound effects launch without any internet warning.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Airplane Mode Simulator for Parents */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <WifiOff className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold font-fun text-white">Interactive Cache Diagnostic</span>
                      </div>
                      <button
                        onClick={() => {
                          soundEngine.playPop();
                          setIsAirplaneSimulated(!isAirplaneSimulated);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-fun font-bold transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                          isAirplaneSimulated
                            ? 'bg-amber-400 text-amber-950 font-black'
                            : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                        }`}
                      >
                        <Plane className="w-3.5 h-3.5" />
                        <span>{isAirplaneSimulated ? 'Simulating Flight Mode (Active)' : 'Test Flight Simulator'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Audio Synth:</span>
                        <span className="text-emerald-400 font-bold">✓ Offline Procedural</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Game Storage:</span>
                        <span className="text-emerald-400 font-bold">✓ Local Storage</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">Images/Fonts:</span>
                        <span className="text-emerald-400 font-bold">✓ Service Worker</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">App Display:</span>
                        <span className="text-emerald-400 font-bold">✓ Standalone Window</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      soundEngine.playPop();
                      setCurrentStep(2);
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Back to Step 2
                  </button>

                  <button
                    onClick={() => {
                      soundEngine.playVictory();
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-fun font-bold text-xs shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Done! Ready for Offline Play</span>
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {/* Persistent Footer Bar */}
          <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
            <span className="hidden sm:inline">Wonder World Kids Learning • COPPA & GDPR-K Compliant</span>
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-fun font-bold text-xs transition cursor-pointer ml-auto"
            >
              Close Setup Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
