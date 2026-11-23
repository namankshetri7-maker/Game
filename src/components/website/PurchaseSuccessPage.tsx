/**
 * Wonder World Kids Website - Purchase Success Page (/success)
 * Displayed after successful verification with instant download & full game launch.
 */

import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { CheckCircle2, Download, Play } from 'lucide-react';

interface PurchaseSuccessPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

export const PurchaseSuccessPage: React.FC<PurchaseSuccessPageProps> = ({
  onNavigate,
  onEnterGame,
}) => {
  const licenseKey =
    (typeof localStorage !== 'undefined' && localStorage.getItem('wwk_license')) ||
    'Check your purchase receipt email';

  const handleInstallApp = () => {
    soundEngine.playVictory();
    onNavigate('downloads');
  };

  return (
    <div className="min-h-screen bg-[#F6FBFF] text-[#0F294A] font-body py-12 px-4 sm:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl border-2 border-emerald-400 p-8 sm:p-10 shadow-md text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 text-emerald-600">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-emerald-700 font-fun">
          Activation Successful
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-fun text-[#0F294A] mt-1 mb-3">
          Welcome to Wonder World Kids!
        </h1>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          Your lifetime family license has been verified and all 45 offline learning games across 5 worlds are unlocked.
        </p>

        <div className="bg-[#F8FCFF] p-4 rounded-2xl border border-sky-200 mb-8 max-w-md mx-auto">
          <div className="text-[11px] text-slate-500 uppercase font-bold mb-1">Your License Key</div>
          <div className="text-sm font-mono font-bold text-sky-800 tracking-wider">{licenseKey}</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              soundEngine.playPop();
              onEnterGame();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Full Game Now</span>
          </button>

          <button
            type="button"
            onClick={handleInstallApp}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-500/40 transition"
          >
            <Download className="w-4 h-4" />
            <span>Install Offline App</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-sky-100 text-xs text-slate-600">
          Need help installing? Check our{' '}
          <button
            type="button"
            onClick={() => onNavigate('downloads')}
            className="text-sky-700 underline font-bold cursor-pointer"
          >
            Offline Installation Guide
          </button>
          .
        </div>
      </div>
    </div>
  );
};
