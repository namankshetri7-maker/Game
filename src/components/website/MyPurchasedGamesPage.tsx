/**
 * Wonder World Kids Website - My Purchased Games Page
 * Allows customers to retrieve their purchase using local storage entitlement or license key.
 */

import React, { useState } from 'react';
import { soundEngine } from '../../services/soundEngine';
import { CheckCircle2, Search, Play, Download, ShoppingBag } from 'lucide-react';

interface MyPurchasedGamesPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

export const MyPurchasedGamesPage: React.FC<MyPurchasedGamesPageProps> = ({ onNavigate, onEnterGame }) => {
  const [licenseInput, setLicenseInput] = useState('');
  const [searchVerified, setSearchVerified] = useState<boolean | null>(null);

  const isPurchased = localStorage.getItem('wwk_purchased') === 'true';
  const licenseKey = localStorage.getItem('wwk_license') || 'WWK-LIFETIME-PASS';

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playPop();
    if (licenseInput.trim().toUpperCase().startsWith('WWK') || isPurchased) {
      setSearchVerified(true);
      localStorage.setItem('wwk_purchased', 'true');
    } else {
      setSearchVerified(false);
    }
  };

  const handleDownloadZip = () => {
    soundEngine.playVictory();
    const link = document.createElement('a');
    link.href = '/WonderWorldKids_Offline_Package.zip';
    link.download = 'WonderWorldKids_Offline_Package.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Verify your lifetime license or retrieve offline download packages.
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
                className="p-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Launch Web Game</span>
              </button>

              <button
                onClick={handleDownloadZip}
                className="p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Offline ZIP</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-xl mb-8">
            <h2 className="text-lg font-bold font-fun text-white mb-2">Retrieve Your Purchase</h2>
            <p className="text-xs text-slate-400 mb-6">
              If you purchased Wonder World Kids on this browser, your license is saved automatically. Otherwise, enter your email or license key below:
            </p>

            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter License Key (e.g. WWK-XXXX)"
                value={licenseInput}
                onChange={e => setLicenseInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-md transition cursor-pointer"
              >
                Verify License
              </button>
            </form>

            {searchVerified === false && (
              <p className="text-xs text-rose-400 mt-3 font-semibold">License key not recognized. Want to purchase? <button onClick={() => onNavigate('pricing')} className="underline">Get lifetime access for $9</button></p>
            )}
          </div>
        )}

        <div className="text-center text-xs text-slate-400">
          Didn't receive your confirmation email? Contact our support team at <span className="text-amber-300 font-bold">support@wonderworldkidslearning.space</span>
        </div>
      </div>
    </div>
  );
};
