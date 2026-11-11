/**
 * Wonder World Kids Website - My Purchased Games Page
 * Allows customers to retrieve their purchase using local storage entitlement or license key.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { CheckCircle2, Search, Play, Download, ShoppingBag, Loader2, KeyRound } from 'lucide-react';
import { licenseService } from '../../services/licenseService';

interface MyPurchasedGamesPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

export const MyPurchasedGamesPage: React.FC<MyPurchasedGamesPageProps> = ({ onNavigate, onEnterGame }) => {
  const [licenseInput, setLicenseInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchVerified, setSearchVerified] = useState<boolean | null>(null);

  const stored = licenseService.getStoredLicense();
  const isPurchased = stored.isUnlocked;
  const licenseKey = stored.licenseKey || 'WWK-LIFETIME-PASS';

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-400 font-fun">Customer Portal</span>
          <h1 className="text-3xl sm:text-4xl font-black font-fun text-white mt-1 mb-3">
            My Purchased Games
          </h1>
          <p className="text-sm text-slate-300">
            Verify your lifetime license or install the game for 100% offline access.
          </p>
        </div>

        {isPurchased || searchVerified === true ? (
          <div className="bg-slate-800 rounded-3xl border-3 border-emerald-400 p-8 shadow-2xl mb-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <h2 className="text-lg font-black font-fun text-white">Active Lifetime License Verified</h2>
                <p className="text-xs text-slate-400">License Key: <span className="font-mono text-amber-300 font-bold">{licenseKey}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => { soundEngine.playPop(); onEnterGame(); }}
                className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Web Game</span>
              </button>

              <button
                onClick={handleInstallOffline}
                className="p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Install Offline App</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl mb-8">
            <h2 className="text-lg font-bold font-fun text-white mb-2">Retrieve Your Purchase</h2>
            <p className="text-xs text-slate-400 mb-6">
              If you purchased Wonder World Kids on Gumroad, enter the unique license key from your receipt below to permanently unlock this device:
            </p>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Gumroad License Key (e.g. 8F7A2B1C-4D5E6F-7G8H9I)"
                value={licenseInput}
                disabled={isLoading}
                onChange={e => setLicenseInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 font-mono uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={isLoading || !licenseInput.trim()}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-amber-950 font-fun font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
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
              <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-300">
                <p className="font-bold mb-1">Verification Unsuccessful</p>
                <p>{errorMessage || 'License key not recognized for Wonder World Kids.'}</p>
                <div className="mt-2 text-[11px] text-slate-400">
                  Don't have a license key yet?{' '}
                  <button onClick={() => onNavigate('pricing')} className="text-amber-400 underline font-bold">
                    Buy Lifetime Access for $9
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-slate-400">
          Didn't receive your confirmation email? Contact our support team at <span className="text-amber-300 font-bold">wonderworldkidslearning@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
