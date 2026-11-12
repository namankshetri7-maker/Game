/**
 * Wonder World Kids Website - Pricing & Activation Page
 * Lifetime Family License with Activation Key.
 */

import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import { CheckCircle2, Lock, Sparkles, KeyRound } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: string) => void;
  onUnlockSuccess: () => void;
  onOpenLicenseModal?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate, onUnlockSuccess, onOpenLicenseModal }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-body py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold font-fun mb-3 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lifetime Family License</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-fun text-white mb-3">
            Unlock 45 Kids Learning Games
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            One-time purchase on Etsy. Play all 45 kids learning games offline forever with zero subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-800/90 rounded-3xl border-3 border-amber-400 p-8 sm:p-10 shadow-2xl">
          
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-2xl font-black font-fun text-white">What's Included in Your Lifetime License:</h2>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Full access to all 45 educational mini-games</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> All 5 magical world islands (Math, Phonics, Geo, Science, Logic)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> 100% Offline App (Installable on iOS, Android, Mac & PC)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> Up to 4 child profile progress trackers & sticker albums</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> COPPA-compliant parental gate & screen time limits</li>
            </ul>

            <div className="pt-4 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Secure lifetime activation via your unique Etsy key.</span>
            </div>
          </div>

          <div className="md:col-span-5 bg-slate-900 p-6 sm:p-8 rounded-2xl border-2 border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Lifetime Family Access</div>
              <div className="text-3xl font-black font-fun text-amber-300 mb-2">Etsy Purchase</div>
              <div className="text-[11px] text-emerald-400 font-bold mb-6">✓ Instant Activation Key on PDF Guide</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  soundEngine.playPop();
                  if (onOpenLicenseModal) onOpenLicenseModal();
                }}
                className="w-full py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-fun font-black text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer border-2 border-white"
              >
                <KeyRound className="w-4 h-4 text-amber-950" />
                <span>Enter Activation Key to Unlock 🔑</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
