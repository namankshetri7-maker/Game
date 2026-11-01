import React from 'react';
import { Download, X, Share2, PlusSquare, Smartphone, CheckCircle, WifiOff, Laptop, HelpCircle } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  canInstallNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onNativeInstall,
  canInstallNative,
  isIOS,
  isAndroid,
  isStandalone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border-4 border-amber-300 relative overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Playful background flare */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-amber-200 to-pink-200 rounded-bl-full -z-0 opacity-50" />

        {/* Close Button */}
        <button
          onClick={() => {
            soundEngine.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 transition z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-3xl shadow-md border-2 border-white">
              📱
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-fun text-slate-800">
                Play 100% Offline!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Install on Android, iOS (iPhone/iPad), Mac & PC
              </p>
            </div>
          </div>

          {/* Already installed banner */}
          {isStandalone ? (
            <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center gap-3 text-emerald-800">
              <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm font-fun">App is Installed & Ready!</p>
                <p className="text-xs text-emerald-700">
                  You are playing in standalone offline mode. All 45 mini-games, sounds, and badges are cached locally.
                </p>
              </div>
            </div>
          ) : null}

          {/* Offline benefit pills */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
              <WifiOff className="w-4 h-4 text-sky-600 shrink-0" />
              <span className="text-xs font-bold font-fun">Zero WiFi Needed</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-pink-50 border border-pink-200 text-pink-900">
              <Smartphone className="w-4 h-4 text-pink-600 shrink-0" />
              <span className="text-xs font-bold font-fun">Full Screen App</span>
            </div>
          </div>

          {/* Android / Desktop Quick Install Button */}
          {canInstallNative && !isStandalone && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
              <p className="text-xs font-bold text-indigo-900 mb-2">
                One-tap direct install available:
              </p>
              <button
                onClick={() => {
                  soundEngine.playVictory();
                  onNativeInstall?.();
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 active:scale-98 text-white font-fun font-black text-sm sm:text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 border-2 border-white transition"
              >
                <Download className="w-5 h-5" />
                <span>Install Wonder World Now</span>
              </button>
            </div>
          )}

          {/* Platform specific guides */}
          <div className="space-y-4">
            {/* iOS Guide (iPhone & iPad) */}
            <div className={`p-4 rounded-2xl border-2 transition ${isIOS ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[11px] font-black font-fun">
                  iOS / iPadOS
                </div>
                <h3 className="font-bold text-sm text-slate-800 font-fun">
                  Apple iPhone & iPad Safari Setup
                </h3>
              </div>
              <ol className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    In Apple Safari, tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> in the toolbar.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-800 mx-0.5" />.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Tap <strong>"Add"</strong> in the top-right corner. Launch it directly from your home screen for full-screen offline fun!
                  </span>
                </li>
              </ol>
            </div>

            {/* Android Guide */}
            <div className={`p-4 rounded-2xl border-2 transition ${isAndroid && !canInstallNative ? 'bg-indigo-50/70 border-indigo-300' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[11px] font-black font-fun">
                  Android
                </div>
                <h3 className="font-bold text-sm text-slate-800 font-fun">
                  Android Phones & Tablets
                </h3>
              </div>
              <ol className="text-xs text-slate-600 space-y-2 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>
                    Tap the Chrome browser menu (<strong>three dots ⋮</strong> in top right).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                    3
                  </span>
                  <span>
                    Enjoy an instant native app experience with offline sound and storage.
                  </span>
                </li>
              </ol>
            </div>

            {/* Mac / Windows / Chromebook */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <Laptop className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-xs text-slate-700 font-fun">
                  Mac, Windows PC & Chromebook
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Click the install icon in your address bar (right side of URL) to run Wonder World as a dedicated desktop window.
              </p>
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => {
                soundEngine.playPop();
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-fun font-bold text-sm transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
