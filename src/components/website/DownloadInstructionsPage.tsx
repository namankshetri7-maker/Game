/**
 * Wonder World Kids Website - Offline App Installation Guide Page
 * Clear 3-step setup: 1. Pay $9 on Gumroad -> 2. Get License Key -> 3. Enter Key & Install Offline PWA.
 * Strictly no code downloads or raw ZIP files — 100% PWA home screen install.
 * Play link is enabled after entering verified $9 license key.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import {
  Laptop,
  Smartphone,
  CheckCircle2,
  Play,
  Share2,
  PlusSquare,
  ArrowRight,
  Download,
  KeyRound,
  ShoppingBag,
  Lock,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { PWAInstallModal } from '../PWAInstallModal';
import { LicenseVerificationModal } from '../LicenseVerificationModal';
import { usePWA } from '../../hooks/usePWA';
import { licenseService } from '../../services/licenseService';

interface DownloadInstructionsPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

const GUMROAD_CHECKOUT_URL = 'https://namank3.gumroad.com/l/wvpisb';

export const DownloadInstructionsPage: React.FC<DownloadInstructionsPageProps> = ({ onNavigate, onEnterGame }) => {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => licenseService.isUnlocked());
  const storedLicense = licenseService.getStoredLicense();

  const { canInstallPrompt, promptInstall, isIOS, isAndroid, isStandalone } = usePWA();

  const handleInstallClick = () => {
    soundEngine.playVictory();
    if (canInstallPrompt) {
      promptInstall();
    } else {
      setIsInstallModalOpen(true);
    }
  };

  const handleOpenGumroad = () => {
    soundEngine.playPop();
    window.open(GUMROAD_CHECKOUT_URL, '_blank', 'noopener,noreferrer');
  };

  const handleLicenseSuccess = () => {
    setIsUnlocked(true);
    setIsLicenseModalOpen(false);
    soundEngine.playVictory();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-10 px-4 sm:px-8 select-none">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black font-fun mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Offline App • Progressive Web App (PWA)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mt-1 mb-3">
            Install Wonder World Kids
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Play 100% offline with zero internet required across iPad, iPhone, Android, Mac & Windows PC.
          </p>
        </div>

        {/* Hero Play Link Status & Gating Card */}
        <div className={`rounded-3xl p-6 sm:p-8 shadow-2xl mb-10 border-3 transition-all ${
          isUnlocked
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-emerald-400'
            : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-amber-400/90'
        }`}>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left flex-1">
              {isUnlocked ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-fun mb-2 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Lifetime Family License Active & Verified</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-fun text-white mb-1.5">
                    Full Game Unlocked & Ready! 🎉
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    All 45 educational games and 5 worlds are active. Launch the full game in your browser or install to your home screen for instant offline play without Wi-Fi.
                  </p>
                  {storedLicense.licenseKey && (
                    <div className="mt-2 text-[11px] font-mono text-amber-300">
                      Active Key: {storedLicense.licenseKey}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-fun mb-2 border border-amber-400/30">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full Game Gated — $9 Lifetime License Required</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-fun text-white mb-1.5">
                    Follow 3 Easy Steps to Unlock & Install
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    The full play link for all 45 games is enabled right after completing the one-time $9 family purchase and entering your license key.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              {isUnlocked ? (
                <>
                  <button
                    onClick={() => { soundEngine.playVictory(); onEnterGame(); }}
                    className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-emerald-400 transition"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Full 45 Games 🚀</span>
                  </button>

                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-white transition"
                  >
                    <Download className="w-4 h-4 text-amber-950" />
                    <span>Install Offline App</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleOpenGumroad}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border-2 border-white transition"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-950" />
                    <span>Buy $9 License (Gumroad)</span>
                  </button>

                  <button
                    onClick={() => { soundEngine.playPop(); setIsLicenseModalOpen(true); }}
                    className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-fun font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer border border-indigo-400 transition"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>Enter License Key</span>
                  </button>

                  <button
                    onClick={() => { soundEngine.playPop(); onNavigate('demo'); }}
                    className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-fun font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/20 transition"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Try Free Demo</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3 Proper Steps to Download & Play Wonder World Kids */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-fun">How to Play & Install</span>
            <h2 className="text-2xl sm:text-3xl font-black font-fun text-white mt-1">
              3 Simple Steps to Full Offline Access
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Step 1 */}
            <div className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 font-black font-fun text-xl flex items-center justify-center mb-4 shadow-md">
                  1
                </div>
                <h3 className="text-base font-black font-fun text-white mb-2">
                  One-Time $9 Payment
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Visit our official Gumroad store and complete the one-time $9 USD family purchase. No subscriptions, no ads, lifetime updates included.
                </p>
              </div>

              <button
                onClick={handleOpenGumroad}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pay $9 on Gumroad →</span>
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800 rounded-3xl p-6 border-2 border-slate-700 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white font-black font-fun text-xl flex items-center justify-center mb-4 shadow-md">
                  2
                </div>
                <h3 className="text-base font-black font-fun text-white mb-2">
                  Get Your License Key
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Check your email for your Gumroad receipt. Your unique License Key (e.g. <span className="font-mono text-amber-300 font-bold">8F7A2B1C-4D5E-7G8H</span>) is delivered immediately.
                </p>
              </div>

              <button
                onClick={() => { soundEngine.playPop(); setIsLicenseModalOpen(true); }}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-fun font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Enter License Key 🔑</span>
              </button>
            </div>

            {/* Step 3 */}
            <div className={`rounded-3xl p-6 border-2 shadow-xl flex flex-col justify-between relative overflow-hidden ${
              isUnlocked ? 'bg-emerald-950/40 border-emerald-400' : 'bg-slate-800 border-slate-700'
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white font-black font-fun text-xl flex items-center justify-center mb-4 shadow-md">
                  3
                </div>
                <h3 className="text-base font-black font-fun text-white mb-2">
                  Play & Install Offline (PWA)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Once your key is entered, all 45 games are unlocked! Install the PWA to your home screen or desktop for 1-tap full-screen play with zero internet needed.
                </p>
              </div>

              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install PWA to Home Screen</span>
              </button>
            </div>

          </div>
        </div>

        {/* Device-Specific Step-by-Step PWA Guides */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-black font-fun text-white flex items-center gap-2">
                <span>Device Setup Guides (PWA Installation)</span>
                <span className="text-[10px] bg-emerald-500 text-white font-black px-2 py-0.5 rounded-md uppercase">100% Offline</span>
              </h3>
              <p className="text-xs text-slate-400">
                Follow your device instructions below to add Wonder World Kids to your home screen:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            
            {/* iOS Safari (iPhone & iPad) */}
            <div className="bg-slate-800 rounded-2xl p-5 border-2 border-indigo-500/40 shadow-lg">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-base">
                  🍎
                </div>
                <div>
                  <h4 className="text-sm font-bold font-fun text-white">Apple iPad & iPhone (Safari)</h4>
                  <span className="text-[10px] text-indigo-300 font-semibold">iOS / iPadOS 15.4+</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Open <strong className="text-white">Safari</strong> and visit <strong className="text-amber-300">wonderworldkidslearning.space</strong>.
                </li>
                <li>
                  Tap the <strong className="text-white">Share</strong> button (<Share2 className="w-3.5 h-3.5 inline text-sky-400 mx-0.5" /> in toolbar).
                </li>
                <li>
                  Scroll down and tap <strong className="text-emerald-400 font-bold">"Add to Home Screen"</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-emerald-400 mx-0.5" />).
                </li>
                <li>
                  Tap <strong className="text-white">Add</strong>. Launch from your home screen for full-screen offline fun!
                </li>
              </ol>
            </div>

            {/* Android Chrome (Phones & Tablets) */}
            <div className="bg-slate-800 rounded-2xl p-5 border-2 border-emerald-500/40 shadow-lg">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                  🤖
                </div>
                <div>
                  <h4 className="text-sm font-bold font-fun text-white">Android Phone & Tablet (Chrome / Edge)</h4>
                  <span className="text-[10px] text-emerald-300 font-semibold">1-Tap Fast Install</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                <li>
                  Open <strong className="text-white">Chrome</strong> and navigate to <strong className="text-amber-300">wonderworldkidslearning.space</strong>.
                </li>
                <li>
                  Tap the Chrome menu (<strong>three dots ⋮</strong> in top right).
                </li>
                <li>
                  Select <strong className="text-emerald-400 font-bold">"Install app"</strong> or <strong className="text-emerald-400 font-bold">"Add to Home screen"</strong>.
                </li>
                <li>
                  Launch directly from your app drawer with zero internet needed!
                </li>
              </ol>
            </div>

            {/* Windows PC */}
            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md">
              <div className="flex items-center gap-2.5 mb-3">
                <Laptop className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold font-fun text-white">Windows PC (Chrome / Edge)</h4>
                  <span className="text-[10px] text-amber-300 font-semibold">Standalone desktop app window</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                <li>Open <strong className="text-amber-300">wonderworldkidslearning.space</strong> in Google Chrome or Microsoft Edge.</li>
                <li>Click the <strong className="text-white">Install icon</strong> (monitor with down arrow) in the address bar.</li>
                <li>Click <strong className="text-white">Install</strong> to create a desktop and Start Menu shortcut.</li>
              </ol>
            </div>

            {/* macOS */}
            <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-md">
              <div className="flex items-center gap-2.5 mb-3">
                <Laptop className="w-5 h-5 text-sky-400" />
                <div>
                  <h4 className="text-sm font-bold font-fun text-white">Apple Mac (Chrome / Safari)</h4>
                  <span className="text-[10px] text-sky-300 font-semibold">macOS Sonoma+ or Chrome</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                <li>In Safari, click <strong className="text-white">File &gt; Add to Dock</strong>.</li>
                <li>In Chrome, click the <strong className="text-white">Install icon</strong> in the address bar.</li>
                <li>Launch anytime from your Mac Dock offline!</li>
              </ol>
            </div>

          </div>
        </div>

        {/* Support Help Box */}
        <div className="text-center p-5 bg-slate-800/60 rounded-2xl border border-slate-700 text-xs text-slate-400">
          Need help activating your license or installing on your child's tablet? Reach out anytime at{' '}
          <a href="mailto:wonderworldkidslearning@gmail.com" className="text-amber-300 font-bold hover:underline">
            wonderworldkidslearning@gmail.com
          </a>
        </div>

      </div>

      {/* PWA Device Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        canInstallNative={canInstallPrompt}
        onNativeInstall={promptInstall}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isStandalone={isStandalone}
      />

      {/* License Key Verification Modal */}
      <LicenseVerificationModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
        onSuccess={handleLicenseSuccess}
      />
    </div>
  );
};
