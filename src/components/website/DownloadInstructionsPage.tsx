/**
 * Wonder World Kids Website - Offline App Installation Guide Page
 * Clear 3-step setup: 1. Pay $9 on Gumroad -> 2. Get License Key -> 3. Enter Key & Install Offline PWA.
 * Strictly no code downloads or raw ZIP files — 100% PWA home screen install.
 * Play link is enabled after entering verified license key.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import {
  Laptop,
  CheckCircle2,
  Play,
  Share2,
  PlusSquare,
  Download,
  KeyRound,
  ShoppingBag,
  Lock,
  ChevronRight,
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

export const DownloadInstructionsPage: React.FC<DownloadInstructionsPageProps> = ({
  onNavigate,
  onEnterGame,
}) => {
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

  const handleLicenseSuccess = () => {
    setIsUnlocked(true);
    setIsLicenseModalOpen(false);
    soundEngine.playVictory();
  };

  const handleLink = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-16 select-none">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">Install Offline App</span>
          </nav>
          <span className="font-semibold text-emerald-700">Mac · Windows · iPhone · iPad · Android</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 font-fun mb-2">
            100% Offline App · Progressive Web App (PWA)
          </p>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-[#0F294A] mb-3 tracking-tight">
            Install Wonder World Kids
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            Play 100% offline with zero internet required across iPad, iPhone, Android, Mac &amp; Windows PC.
          </p>
        </div>

        {/* Hero Play Link Status & Gating Card */}
        <div
          className={`rounded-3xl p-6 sm:p-8 shadow-md mb-10 border-2 transition-all ${
            isUnlocked
              ? 'bg-gradient-to-r from-emerald-50 via-white to-sky-50 border-emerald-400'
              : 'bg-gradient-to-r from-amber-50 via-white to-sky-50 border-amber-300'
          }`}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left flex-1">
              {isUnlocked ? (
                <>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black font-fun text-emerald-700 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lifetime Family License Active &amp; Verified</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-fun text-[#0F294A] mb-1.5">
                    Full Game Unlocked &amp; Ready!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
                    All 45 educational games and 5 worlds are active. Launch the full game in your browser or install to your home screen for instant offline play without Wi-Fi.
                  </p>
                  {storedLicense.licenseKey && (
                    <div className="mt-2 text-xs font-mono text-sky-800 font-bold">
                      Active Key: {storedLicense.licenseKey}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 text-xs font-black font-fun text-amber-800 mb-2">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Lifetime License Required for Full 45 Games</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-fun text-[#0F294A] mb-1.5">
                    Follow 3 Easy Steps to Unlock &amp; Install
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-xl leading-relaxed">
                    Purchase your one-time lifetime pass or click Enter Activation Key to unlock all 45 games and install the offline app onto any phone, tablet, or computer.
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2.5 w-full lg:w-auto shrink-0">
              {isUnlocked ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playVictory();
                      onEnterGame();
                    }}
                    className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-fun font-black text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Full 45 Games</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-black text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40 transition whitespace-nowrap"
                  >
                    <Download className="w-4 h-4 text-amber-950" />
                    <span>Install Offline App</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setIsLicenseModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-fun font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition whitespace-nowrap"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Enter Activation Key</span>
                    </button>

                    <a
                      href={GUMROAD_CHECKOUT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => soundEngine.playPop()}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-amber-950 font-fun font-black text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40 transition whitespace-nowrap"
                    >
                      <ShoppingBag className="w-4 h-4 text-amber-950" />
                      <span>Buy on Gumroad ($9)</span>
                    </a>
                  </div>

                  <a
                    href={getRoutePath('demo')}
                    onClick={(e) => handleLink(e, 'demo')}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white hover:bg-sky-50 text-[#0F294A] font-fun font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-sky-200 transition"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-current" />
                    <span>Try Free Demo</span>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3 Proper Steps to Download & Play Wonder World Kids */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-black uppercase tracking-wider text-sky-700 font-fun">
              How to Play &amp; Install
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-fun text-[#0F294A] mt-1">
              3 Simple Steps to Full Offline Access
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-amber-400 text-amber-950 font-black font-fun text-lg flex items-center justify-center mb-4 shadow-xs">
                  1
                </div>
                <h3 className="text-base font-black font-fun text-[#0F294A] mb-2">
                  One-Time $9 Payment
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Complete your one-time lifetime family checkout on Gumroad ($9 USD). No subscriptions, no ads, lifetime updates included.
                </p>
              </div>

              <a
                href={GUMROAD_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundEngine.playPop()}
                className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Checkout on Gumroad ($9)</span>
              </a>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-xs flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white font-black font-fun text-lg flex items-center justify-center mb-4 shadow-xs">
                  2
                </div>
                <h3 className="text-base font-black font-fun text-[#0F294A] mb-2">
                  Get Your License Key
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Receive your instant lifetime activation key upon purchase and click below to permanently unlock all 45 games.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  setIsLicenseModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Enter Activation Key</span>
              </button>
            </div>

            {/* Step 3 */}
            <div
              className={`bg-white rounded-3xl p-6 border-2 shadow-xs flex flex-col justify-between relative overflow-hidden ${
                isUnlocked ? 'border-emerald-400' : 'border-emerald-200'
              }`}
            >
              <div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black font-fun text-lg flex items-center justify-center mb-4 shadow-xs">
                  3
                </div>
                <h3 className="text-base font-black font-fun text-[#0F294A] mb-2">
                  Play & Install Offline (PWA)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Once unlocked, all 45 games stay unlocked! Tap Install Offline App to add Wonder World Kids to your home screen for zero-Wi-Fi play.
                </p>
              </div>

              <button
                type="button"
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install Offline App (PWA)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Device-Specific Step-by-Step PWA Guides */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-black font-fun text-[#0F294A] flex items-center gap-2">
                <span>Device Setup Guides (PWA Installation)</span>
              </h3>
              <p className="text-xs text-slate-600">
                Follow your device instructions below to add Wonder World Kids to your home screen for 100% offline play:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* iOS Safari (iPhone & iPad) */}
            <div className="bg-white rounded-2xl p-6 border-2 border-sky-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                  🍎
                </div>
                <div>
                  <h4 className="text-sm font-black font-fun text-[#0F294A]">
                    Apple iPad &amp; iPhone (Safari)
                  </h4>
                  <span className="text-xs text-sky-700 font-semibold">iOS / iPadOS 15.4+</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Open <strong>Safari</strong> and visit{' '}
                  <strong className="text-sky-800">wonderworldkidslearning.space</strong>.
                </li>
                <li>
                  Tap the <strong>Share</strong> button (
                  <Share2 className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> in toolbar).
                </li>
                <li>
                  Scroll down and tap{' '}
                  <strong className="text-emerald-700 font-bold">&quot;Add to Home Screen&quot;</strong> (
                  <PlusSquare className="w-3.5 h-3.5 inline text-emerald-600 mx-0.5" />).
                </li>
                <li>
                  Tap <strong>Add</strong>. Launch from your home screen for full-screen offline fun!
                </li>
              </ol>
            </div>

            {/* Android Chrome (Phones & Tablets) */}
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  🤖
                </div>
                <div>
                  <h4 className="text-sm font-black font-fun text-[#0F294A]">
                    Android Phone &amp; Tablet (Chrome / Edge)
                  </h4>
                  <span className="text-xs text-emerald-700 font-semibold">1-Tap Fast Install</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Open <strong>Chrome</strong> and navigate to{' '}
                  <strong className="text-sky-800">wonderworldkidslearning.space</strong>.
                </li>
                <li>
                  Tap the Chrome menu (<strong>three dots ⋮</strong> in top right).
                </li>
                <li>
                  Select <strong className="text-emerald-700 font-bold">&quot;Install app&quot;</strong> or{' '}
                  <strong className="text-emerald-700 font-bold">&quot;Add to Home screen&quot;</strong>.
                </li>
                <li>Launch directly from your app drawer with zero internet needed!</li>
              </ol>
            </div>

            {/* Windows PC */}
            <div className="bg-white rounded-2xl p-6 border-2 border-amber-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <Laptop className="w-6 h-6 text-amber-600" />
                <div>
                  <h4 className="text-sm font-black font-fun text-[#0F294A]">
                    Windows PC (Chrome / Edge)
                  </h4>
                  <span className="text-xs text-amber-800 font-semibold">Standalone desktop app window</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  Open <strong className="text-sky-800">wonderworldkidslearning.space</strong> in Google Chrome or Microsoft Edge.
                </li>
                <li>
                  Click the <strong>Install icon</strong> (monitor with down arrow) in the address bar.
                </li>
                <li>
                  Click <strong>Install</strong> to create a desktop and Start Menu shortcut.
                </li>
              </ol>
            </div>

            {/* macOS */}
            <div className="bg-white rounded-2xl p-6 border-2 border-violet-200 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <Laptop className="w-6 h-6 text-violet-600" />
                <div>
                  <h4 className="text-sm font-black font-fun text-[#0F294A]">
                    Apple Mac (Chrome / Safari)
                  </h4>
                  <span className="text-xs text-violet-700 font-semibold">macOS Sonoma+ or Chrome</span>
                </div>
              </div>
              <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                <li>
                  In Safari, click <strong>File &gt; Add to Dock</strong>.
                </li>
                <li>
                  In Chrome, click the <strong>Install icon</strong> in the address bar.
                </li>
                <li>Launch anytime from your Mac Dock offline!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Support Help Box */}
        <div className="text-center p-5 bg-white rounded-2xl border border-sky-200 text-xs text-slate-600 shadow-xs">
          Need help activating your license or installing on your child&apos;s tablet? Reach out anytime at{' '}
          <a
            href="mailto:wonderworldkidslearning@gmail.com"
            className="text-sky-700 font-bold hover:underline"
          >
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
        isUnlocked={isUnlocked}
        onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
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
