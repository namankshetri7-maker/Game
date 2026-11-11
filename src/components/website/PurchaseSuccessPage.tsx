/**
 * Wonder World Kids Website - Purchase Success Page
 * Displayed after successful payment capture with instant download & full game launch.
 */

import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { CheckCircle2, Download, Play, Shield, ArrowRight } from 'lucide-react';

interface PurchaseSuccessPageProps {
  onNavigate: (route: string) => void;
  onEnterGame: () => void;
}

export const PurchaseSuccessPage: React.FC<PurchaseSuccessPageProps> = ({ onNavigate, onEnterGame }) => {
  const licenseKey = localStorage.getItem('wwk_license') || 'WWK-LIFETIME-PASS';

  const handleInstallApp = () => {
    soundEngine.playVictory();
    onNavigate('downloads');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800 rounded-3xl border-3 border-emerald-400 p-8 sm:p-10 shadow-2xl text-center">
        
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 text-emerald-400">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-fun">Payment Successful</span>
        <h1 className="text-3xl sm:text-4xl font-black font-fun text-white mt-1 mb-3">
          Welcome to Wonder World Kids! 🎉
        </h1>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Your $9 USD order has been verified and your lifetime family license has been activated.
        </p>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 mb-8 max-w-md mx-auto">
          <div className="text-[11px] text-slate-400 uppercase font-bold mb-1">Your License Key</div>
          <div className="text-sm font-mono font-bold text-amber-300 tracking-wider">{licenseKey}</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => { soundEngine.playPop(); onEnterGame(); }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-fun font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-emerald-400 transition"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Full Game Now</span>
          </button>

          <button
            onClick={handleInstallApp}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-amber-500 transition"
          >
            <Download className="w-4 h-4" />
            <span>Install Offline App</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700 text-xs text-slate-400">
          Need help installing? Check our <button onClick={() => onNavigate('downloads')} className="text-amber-300 underline font-bold">Offline Installation Guide</button>.
        </div>
      </div>
    </div>
  );
};
