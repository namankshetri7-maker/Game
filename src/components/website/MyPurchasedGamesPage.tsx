/**
 * Wonder World Kids Website - My Purchased Games Page (/my-games)
 * Allows customers to retrieve their purchase using local storage entitlement or license key.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { getRoutePath } from '../../services/seoManager';
import { CheckCircle2, Play, Download, Loader2, KeyRound, ChevronRight } from 'lucide-react';
import { licenseService } from '../../services/licenseService';

interface MyPurchasedGamesPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
  onUnlockSuccess?: () => void;
}

export const MyPurchasedGamesPage: React.FC<MyPurchasedGamesPageProps> = ({
  onNavigate,
  onEnterGame,
  onUnlockSuccess,
}) => {
  const [licenseInput, setLicenseInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchVerified, setSearchVerified] = useState<boolean | null>(null);

  const stored = licenseService.getStoredLicense();
  const isPurchased = stored.isUnlocked;
  const licenseKey = stored.licenseKey || 'Active Lifetime License';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseInput.trim() || isLoading) return;

    soundEngine.playPop();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await licenseService.verifyGumroadLicense(licenseInput);
      if (res.success) {
        setSearchVerified(true);
        onUnlockSuccess?.();
        soundEngine.playVictory();
      } else {
        setSearchVerified(false);
        setErrorMessage(res.message || 'License key not recognized for Wonder World Kids.');
      }
    } catch {
      setSearchVerified(false);
      setErrorMessage('Could not connect to Gumroad license verification server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstallOffline = () => {
    soundEngine.playVictory();
    onNavigate('downloads');
  };

  const handleLink = (e: React.MouseEvent, route: string) => {
    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      soundEngine.playPop();
      onNavigate(route);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sky-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-medium">
            <a
              href={getRoutePath('home')}
              onClick={(e) => handleLink(e, 'home')}
              className="hover:text-[#0F294A] transition-colors"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0F294A] font-bold">My Purchased Games</span>
          </nav>
          <span className="font-semibold text-sky-700">Customer Activation Portal</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-8 pt-10 sm:pt-12">
        <div className="text-center mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-sky-700 font-fun">
            Customer Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-fun text-[#0F294A] mt-1 mb-3">
            My Purchased Games
          </h1>
          <p className="text-sm sm:text-base text-slate-700 font-medium">
            Verify your lifetime license or install the game for 100% offline access on any device.
          </p>
        </div>

        {isPurchased || searchVerified === true ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-400 p-8 shadow-md mb-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-emerald-100">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              <div>
                <h2 className="text-lg font-black font-fun text-[#0F294A]">
                  Active Lifetime License Verified
                </h2>
                <p className="text-xs text-slate-600">
                  License Key:{' '}
                  <span className="font-mono text-sky-800 font-bold">{licenseKey}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onEnterGame();
                }}
                className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Web Game</span>
              </button>

              <button
                type="button"
                onClick={handleInstallOffline}
                className="p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-95 border border-amber-500/40"
              >
                <Download className="w-4 h-4" />
                <span>Install Offline PWA App</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-xs mb-8">
            <h2 className="text-lg font-black font-fun text-[#0F294A] mb-2">
              Retrieve Your Purchase
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Enter your lifetime activation key from your purchase receipt or PDF guide below to permanently unlock this device:
            </p>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter your activation key (XXXX-XXXX-XXXX-XXXX)"
                value={licenseInput}
                disabled={isLoading}
                onChange={(e) => setLicenseInput(e.target.value)}
                className="flex-1 bg-[#F8FCFF] border border-sky-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#0F294A] focus:outline-none focus:border-sky-500 font-mono tracking-wider"
              />
              <button
                type="submit"
                disabled={isLoading || !licenseInput.trim()}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-amber-950 font-fun font-black text-xs shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-500/40 whitespace-nowrap"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify License</span>
                  </>
                )}
              </button>
            </form>

            {searchVerified === false && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                <p className="font-bold mb-1">Verification Unsuccessful</p>
                <p>{errorMessage || 'License key not recognized for Wonder World Kids.'}</p>
                <div className="mt-2 text-xs text-slate-600 flex flex-wrap items-center gap-2">
                  <span>Don&apos;t have a license key yet?</span>
                  <a
                    href="https://namank3.gumroad.com/l/wvpisb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 underline font-bold"
                  >
                    Buy on Gumroad ($9)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-slate-600">
          Didn&apos;t receive your confirmation email? Contact our support team at{' '}
          <a
            href="mailto:wonderworldkidslearning@gmail.com"
            className="text-sky-700 font-bold hover:underline"
          >
            wonderworldkidslearning@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};
